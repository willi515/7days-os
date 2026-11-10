-- ==============================================================================
-- 7Days OS Sales & Marketing Platform - Initial Database Migration
-- Version: 001_initial_schema.sql
-- Approved Documentation Reference: docs/03_Data_Dictionary_And_Validations.md
-- ==============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TENANTS & MULTI-TENANCY CORE
-- ==============================================================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    subdomain VARCHAR(63) NOT NULL UNIQUE,
    custom_domain VARCHAR(255) UNIQUE,
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#0F172A',
    contact_phone VARCHAR(20) NOT NULL,
    plan_type VARCHAR(20) DEFAULT 'starter' CHECK (plan_type IN ('starter', 'pro', 'enterprise', 'custom')),
    subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'trial', 'suspended', 'cancelled')),
    return_approval_threshold DECIMAL(18, 2) DEFAULT 500.00 CHECK (return_approval_threshold >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_tenants_subdomain ON tenants(subdomain);

-- ==============================================================================
-- 3. USERS & ROLES
-- ==============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE RESTRICT,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    user_role VARCHAR(30) NOT NULL CHECK (user_role IN ('super_admin', 'tenant_admin', 'sales_rep', 'warehouse_worker', 'driver', 'salon_owner')),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_phone ON users(phone_number);

-- ==============================================================================
-- 4. PRICE TIERS & CUSTOMERS (SALONS)
-- ==============================================================================
CREATE TABLE price_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0.00 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    is_default BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_price_tiers_tenant ON price_tiers(tenant_id);

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    customer_code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    phone_primary VARCHAR(20) NOT NULL,
    phone_secondary VARCHAR(20),
    governorate VARCHAR(50) NOT NULL,
    city_area VARCHAR(100) NOT NULL,
    delivery_address TEXT NOT NULL,
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),
    price_tier_id UUID NOT NULL REFERENCES price_tiers(id) ON DELETE RESTRICT,
    credit_limit DECIMAL(18, 2) DEFAULT 5000.00 NOT NULL CHECK (credit_limit >= 0),
    current_balance DECIMAL(18, 2) DEFAULT 0.00 NOT NULL,
    assigned_rep_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_tenant_customer_code UNIQUE (tenant_id, customer_code)
);

CREATE INDEX idx_customers_tenant ON customers(tenant_id);
CREATE INDEX idx_customers_rep ON customers(assigned_rep_id);

-- ==============================================================================
-- 5. PRODUCTS & DUAL-TRACK INVENTORY (COSMETICS & EQUIPMENT)
-- ==============================================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    sku_code VARCHAR(60) NOT NULL,
    name VARCHAR(200) NOT NULL,
    product_type VARCHAR(20) NOT NULL CHECK (product_type IN ('cosmetic', 'equipment')),
    category VARCHAR(100) NOT NULL,
    base_cost DECIMAL(18, 2) NOT NULL CHECK (base_cost >= 0),
    consumer_retail_price DECIMAL(18, 2) NOT NULL CHECK (consumer_retail_price >= 0),
    reorder_point INTEGER DEFAULT 10 NOT NULL CHECK (reorder_point >= 0),
    warranty_months INTEGER DEFAULT 0 NOT NULL CHECK (warranty_months >= 0),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_tenant_sku UNIQUE (tenant_id, sku_code)
);

CREATE INDEX idx_products_tenant ON products(tenant_id);

-- Batches for Cosmetics (FEFO Tracking)
CREATE TABLE inventory_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    batch_number VARCHAR(80) NOT NULL,
    manufacture_date DATE,
    expiry_date DATE NOT NULL,
    quantity_available INTEGER NOT NULL CHECK (quantity_available >= 0),
    quantity_reserved INTEGER DEFAULT 0 NOT NULL CHECK (quantity_reserved >= 0),
    warehouse_location VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT check_valid_expiry CHECK (expiry_date > manufacture_date)
);

CREATE INDEX idx_batches_fefo ON inventory_batches(tenant_id, product_id, expiry_date);

-- Serial Numbers for Equipment & Warranty
CREATE TABLE equipment_serials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    serial_number VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'assigned_to_order', 'sold', 'under_maintenance', 'quarantined')),
    sold_to_customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    warranty_start_date DATE,
    warranty_end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_tenant_serial UNIQUE (tenant_id, serial_number)
);

CREATE INDEX idx_equipment_serials_tenant ON equipment_serials(tenant_id);

-- ==============================================================================
-- 6. ORDERS, ORDER ITEMS & PAYMENTS
-- ==============================================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    order_number VARCHAR(40) NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    sales_rep_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_source VARCHAR(20) NOT NULL CHECK (order_source IN ('rep_app', 'b2b_portal', 'b2c_store')),
    subtotal_amount DECIMAL(18, 2) NOT NULL CHECK (subtotal_amount >= 0),
    discount_amount DECIMAL(18, 2) DEFAULT 0.00 NOT NULL CHECK (discount_amount >= 0),
    total_amount DECIMAL(18, 2) NOT NULL CHECK (total_amount >= 0),
    order_status VARCHAR(30) DEFAULT 'new' CHECK (order_status IN ('new', 'assigned', 'picking', 'ready', 'loaded', 'delivered', 'partially_delivered', 'cancelled')),
    payment_method_agreed VARCHAR(20) NOT NULL CHECK (payment_method_agreed IN ('cash_on_delivery', 'credit_terms', 'e_wallet')),
    proof_of_delivery_photo_url TEXT,
    customer_signature_data TEXT,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_tenant_order_number UNIQUE (tenant_id, order_number)
);

CREATE INDEX idx_orders_tenant ON orders(tenant_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(order_status);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    batch_id UUID REFERENCES inventory_batches(id) ON DELETE RESTRICT,
    serial_id UUID REFERENCES equipment_serials(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(18, 2) NOT NULL CHECK (unit_price >= 0),
    total_line_amount DECIMAL(18, 2) NOT NULL CHECK (total_line_amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    receipt_number VARCHAR(40) NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    collected_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount DECIMAL(18, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'vodafone_cash', 'instapay', 'bank_transfer')),
    transaction_reference VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_tenant_receipt UNIQUE (tenant_id, receipt_number)
);

CREATE INDEX idx_payments_tenant ON payments(tenant_id);
CREATE INDEX idx_payments_customer ON payments(customer_id);

-- ==============================================================================
-- 7. RETURNS & QUARANTINE INVENTORY
-- ==============================================================================
CREATE TABLE returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    return_number VARCHAR(40) NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    sales_rep_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    has_invoice_link BOOLEAN NOT NULL,
    original_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    total_refund_amount DECIMAL(18, 2) NOT NULL CHECK (total_refund_amount >= 0),
    needs_admin_approval BOOLEAN DEFAULT false NOT NULL,
    approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    approved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_tenant_return UNIQUE (tenant_id, return_number)
);

CREATE INDEX idx_returns_tenant ON returns(tenant_id);

CREATE TABLE quarantine_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    batch_id UUID REFERENCES inventory_batches(id) ON DELETE SET NULL,
    serial_id UUID REFERENCES equipment_serials(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    reason_code VARCHAR(50) NOT NULL CHECK (reason_code IN ('expired', 'damaged_transport', 'customer_defect')),
    disposition_status VARCHAR(30) DEFAULT 'in_quarantine' CHECK (disposition_status IN ('in_quarantine', 'returned_to_vendor', 'destroyed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_quarantine_tenant ON quarantine_inventory(tenant_id);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) FOR MULTI-TENANT ISOLATION
-- ==============================================================================
ALTER TABLE price_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_serials ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarantine_inventory ENABLE ROW LEVEL SECURITY;

-- Helper RLS Policy Template based on PostgreSQL session variable: app.current_tenant_id
CREATE POLICY tenant_isolation_policy_price_tiers ON price_tiers
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY tenant_isolation_policy_customers ON customers
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY tenant_isolation_policy_products ON products
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY tenant_isolation_policy_batches ON inventory_batches
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY tenant_isolation_policy_serials ON equipment_serials
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY tenant_isolation_policy_orders ON orders
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY tenant_isolation_policy_order_items ON order_items
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY tenant_isolation_policy_payments ON payments
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY tenant_isolation_policy_returns ON returns
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

CREATE POLICY tenant_isolation_policy_quarantine ON quarantine_inventory
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
