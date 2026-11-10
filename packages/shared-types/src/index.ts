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
