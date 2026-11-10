// Common Enums for 7Days OS across Backend & Frontend

export type UserRole =
  | 'super_admin'
  | 'tenant_admin'
  | 'sales_rep'
  | 'warehouse_worker'
  | 'driver'
  | 'salon_owner';

export type ProductType = 'cosmetic' | 'equipment';

export type OrderStatus =
  | 'new'
  | 'assigned'
  | 'picking'
  | 'ready'
  | 'loaded'
  | 'delivered'
  | 'partially_delivered'
  | 'cancelled';

export type PaymentMethod =
  | 'cash'
  | 'vodafone_cash'
  | 'instapay'
  | 'bank_transfer'
  | 'credit_terms';

export type ReturnApprovalStatus = 'pending' | 'approved' | 'rejected';

export type DebtAgingCategory = 'green_0_30' | 'yellow_31_60' | 'red_plus_60';

// API Response Standard Envelope
export interface ApiResponse<T = unknown> {
  success: boolean;
  status_code: number;
  message: string;
  data?: T;
  error_code?: string;
  details?: Record<string, unknown>;
}

// Database Entity Interfaces
export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  custom_domain?: string | null;
  logo_url?: string | null;
  primary_color: string;
  contact_phone: string;
  plan_type: 'starter' | 'pro' | 'enterprise' | 'custom';
  subscription_status: 'active' | 'trial' | 'suspended' | 'cancelled';
  return_approval_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  tenant_id?: string | null;
  full_name: string;
  phone_number: string;
  email?: string | null;
  role: UserRole;
  is_active: boolean;
  commission_rate_sales?: number;
  commission_rate_collections?: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  tenant_id: string;
  assigned_rep_id?: string | null;
  tier_id?: string | null;
  business_name: string;
  contact_person: string;
  phone_number: string;
  address: string;
  city: string;
  governorate: string;
  gps_latitude?: number | null;
  gps_longitude?: number | null;
  current_balance: number;
  credit_limit: number;
  credit_status: 'cash_only' | 'committed' | 'warning' | 'overdue';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  tenant_id: string;
  name_ar: string;
  name_en?: string | null;
  sku: string;
  barcode: string;
  product_type: ProductType;
  retail_price: number;
  wholesale_price: number;
  salon_price: number;
  min_stock_alert: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryBatch {
  id: string;
  tenant_id: string;
  product_id: string;
  batch_number: string;
  expiry_date: string;
  quantity_available: number;
  quantity_reserved: number;
  warehouse_location?: string | null;
}

export interface OrderItemInput {
  product_id: string;
  quantity: number;
  unit_price: number;
  batch_id?: string | null;
  serial_number?: string | null;
}

export interface CreateOrderPayload {
  customer_id: string;
  order_type: 'b2b_salon' | 'b2c_consumer';
  payment_method: PaymentMethod;
  notes?: string;
  items: OrderItemInput[];
}

export interface CollectPaymentPayload {
  customer_id: string;
  order_id?: string | null;
  amount: number;
  payment_method: PaymentMethod;
  reference_number?: string;
  proof_image_url?: string;
  notes?: string;
}

export interface SubmitReturnPayload {
  order_id: string;
  customer_id: string;
  product_id: string;
  batch_id?: string | null;
  quantity: number;
  reason: string;
  condition: 'sealed' | 'opened' | 'damaged' | 'expired';
}
