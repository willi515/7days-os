/**
 * ==============================================================================
 * 7Days OS - EasyStore Data Migration Adapter
 * Version: 1.0.0
 * Reference: D:\REA COBy\EasyStore_Reverse_Engineering_Documentation
 * ==============================================================================
 * Maps legacy EasyStore ERP tables (Clients, Items, ItemsMove) into
 * 7Days OS Multi-Tenant Cloud Architecture (customers, products, batches).
 */

export interface EasyStoreClient {
  ClientID: number;
  ClientName: string;
  ClientCode?: string;
  ClientPhone?: string;
  ClientMobile?: string;
  ClientAddress?: string;
  FirstAccount?: number;
  CurrentBalance?: number;
  CreditLimit?: number;
}

export interface EasyStoreItem {
  ItemID: number;
  ItemCode?: string;
  ItemBarcode?: string;
  ItemName: string;
  BuyPrice?: number;
  SalePrice?: number;
  GomlaPrice?: number;
  MinLimit?: number;
  CurrentQty?: number;
  KindName?: string;
}

export interface Target7DaysCustomer {
  tenant_id: string;
  customer_code: string;
  name: string;
  contact_person?: string;
  phone_primary: string;
  governorate: string;
  city_area: string;
  delivery_address: string;
  price_tier_id: string;
  credit_limit: number;
  current_balance: number;
}

export interface Target7DaysProduct {
  tenant_id: string;
  sku_code: string;
  name: string;
  product_type: 'cosmetic' | 'equipment';
  category: string;
  base_cost: number;
  consumer_retail_price: number;
  reorder_point: number;
}

export class EasyStoreAdapter {
  private tenantId: string;
  private defaultPriceTierId: string;

  constructor(tenantId: string, defaultPriceTierId: string) {
    this.tenantId = tenantId;
    this.defaultPriceTierId = defaultPriceTierId;
  }

  /**
   * Cleans and formats Egyptian phone numbers into standard 11 digits
   */
  public sanitizeEgyptianPhone(phone?: string, mobile?: string): string {
    const raw = mobile || phone || '01000000000';
    const digits = raw.replace(/\D/g, '');
    
    if (digits.length === 11 && /^(010|011|012|015)/.test(digits)) {
      return digits;
    }
    if (digits.length === 10 && /^(10|11|12|15)/.test(digits)) {
      return '0' + digits;
    }
    // Fallback valid format if corrupted in legacy
    return digits.padStart(11, '0').slice(-11);
  }

  /**
   * Transforms an EasyStore Client into a 7Days OS Customer record
   */
  public transformCustomer(legacy: EasyStoreClient): Target7DaysCustomer {
    return {
      tenant_id: this.tenantId,
      customer_code: legacy.ClientCode || `CUST-ES-${legacy.ClientID}`,
      name: legacy.ClientName.trim(),
      contact_person: legacy.ClientName.trim(),
      phone_primary: this.sanitizeEgyptianPhone(legacy.ClientPhone, legacy.ClientMobile),
      governorate: 'القاهرة',
      city_area: 'غير محدد - مستورد من EasyStore',
      delivery_address: legacy.ClientAddress?.trim() || 'العنوان المسجل في EasyStore',
      price_tier_id: this.defaultPriceTierId,
      credit_limit: Math.max(0, Number(legacy.CreditLimit || 5000.0)),
      current_balance: Number(legacy.CurrentBalance || legacy.FirstAccount || 0.0),
    };
  }

  /**
   * Determines if item is equipment (tools, dryers, irons) or cosmetic (shampoo, cream, oils)
   */
  public detectProductType(itemName: string, categoryName?: string): 'cosmetic' | 'equipment' {
    const combined = `${itemName} ${categoryName || ''}`.toLowerCase();
    const equipmentKeywords = [
      'مكواة', 'سشوار', 'استشوار', 'جهاز', 'كرسي', 'حلاقة', 'ماكينة', 
      'بخار', 'ليزر', 'مقص', 'تيتانيوم', 'iron', 'dryer', 'machine', 'chair'
    ];

    const isEquipment = equipmentKeywords.some(keyword => combined.includes(keyword));
    return isEquipment ? 'equipment' : 'cosmetic';
  }

  /**
   * Transforms an EasyStore Item into a 7Days OS Product record
   */
  public transformProduct(legacy: EasyStoreItem): Target7DaysProduct {
    const productType = this.detectProductType(legacy.ItemName, legacy.KindName);
    
    return {
      tenant_id: this.tenantId,
      sku_code: legacy.ItemBarcode || legacy.ItemCode || `SKU-ES-${legacy.ItemID}`,
      name: legacy.ItemName.trim(),
      product_type: productType,
      category: legacy.KindName?.trim() || (productType === 'equipment' ? 'أجهزة ومعدات' : 'مستحضرات عناية'),
      base_cost: Math.max(0, Number(legacy.BuyPrice || 0.0)),
      consumer_retail_price: Math.max(0, Number(legacy.SalePrice || legacy.GomlaPrice || 0.0)),
      reorder_point: Math.max(0, Number(legacy.MinLimit || 10)),
    };
  }
}
