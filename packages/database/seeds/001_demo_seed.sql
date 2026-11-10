-- ==============================================================================
-- 7Days OS Seed Data (Testing Multi-Tenant Isolation & Cairo/Egypt Business Logic)
-- ==============================================================================

-- 1. Insert Two Distinct Tenants (Companies)
INSERT INTO tenants (id, name, subdomain, contact_phone, plan_type) VALUES
('11111111-1111-1111-1111-111111111111', 'شركة الأمل لمستحضرات التجميل', 'elamal', '01012345678', 'pro'),
('22222222-2222-2222-2222-222222222222', 'شركة رويال كير لتجهيز الصالونات', 'royalcare', '01122334455', 'enterprise');

-- 2. Price Tiers for Tenant 1 (El Amal)
INSERT INTO price_tiers (id, tenant_id, name, discount_percentage, is_default) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'الصالونات الذهبية', 15.00, false),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'الصالونات الفضية (افتراضي)', 5.00, true);

-- 3. Users for Tenant 1
INSERT INTO users (id, tenant_id, full_name, phone_number, password_hash, user_role) VALUES
('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'أحمد المشرف', '01099887766', 'hash_pw_mock_123', 'warehouse_worker'),
('b2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'محمد سالم المندوب', '01011223344', 'hash_pw_mock_123', 'sales_rep');

-- 4. Customer (Salon) for Tenant 1
INSERT INTO customers (id, tenant_id, customer_code, name, contact_person, phone_primary, governorate, city_area, delivery_address, price_tier_id, credit_limit, current_balance, assigned_rep_id) VALUES
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'SALON-001', 'صالون نور الحياة', 'مدام منى', '01234567890', 'القاهرة', 'مدينة نصر', 'شارع مكرم عبيد عمارة 12', 'a1111111-1111-1111-1111-111111111111', 15000.00, 3200.00, 'b2222222-2222-2222-2222-222222222222');

-- 5. Products (Cosmetic & Equipment) for Tenant 1
INSERT INTO products (id, tenant_id, sku_code, name, product_type, category, base_cost, consumer_retail_price, reorder_point) VALUES
('d1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'SKU-KERA-500', 'شامبو كيراتين معالج 500 مل', 'cosmetic', 'العناية بالشعر', 110.00, 180.00, 15),
('d2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'SKU-GHD-TITAN', 'مكواة تيتانيوم صالونات نانو', 'equipment', 'أجهزة ومعدات', 1800.00, 2600.00, 3);

-- 6. Cosmetic Batch (FEFO Sample)
INSERT INTO inventory_batches (id, tenant_id, product_id, batch_number, manufacture_date, expiry_date, quantity_available, quantity_reserved, warehouse_location) VALUES
('e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'BTH-2026-089', '2026-01-10', '2027-03-15', 45, 5, 'A-3');

-- 7. Equipment Serial Sample
INSERT INTO equipment_serials (id, tenant_id, product_id, serial_number, status) VALUES
('f1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', 'GHD-2026-00445', 'in_stock');
