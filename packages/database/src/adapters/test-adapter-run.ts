import { EasyStoreAdapter, EasyStoreClient, EasyStoreItem } from './easystore-adapter';

// Mock Test of EasyStore Migration
const tenantId = '11111111-1111-1111-1111-111111111111';
const defaultPriceTierId = 'a2222222-2222-2222-2222-222222222222';

const adapter = new EasyStoreAdapter(tenantId, defaultPriceTierId);

// Test 1: Transform Client from EasyStore
const sampleLegacyClient: EasyStoreClient = {
  ClientID: 104,
  ClientName: 'صالون مدام رشا للتجميل',
  ClientCode: 'CL-104',
  ClientMobile: '01224455667',
  ClientAddress: 'شارع عباس العقاد - مدينة نصر',
  CurrentBalance: 4500.50,
  CreditLimit: 12000.00
};

const transformedCustomer = adapter.transformCustomer(sampleLegacyClient);
console.log('=== TRANSFORMED CUSTOMER ===');
console.log(JSON.stringify(transformedCustomer, null, 2));

// Test 2: Transform Cosmetic Product from EasyStore
const sampleLegacyCosmetic: EasyStoreItem = {
  ItemID: 501,
  ItemName: 'حمام كريم كيراتين برازيلي 1000 مل',
  ItemBarcode: '6224001122334',
  BuyPrice: 140.00,
  SalePrice: 220.00,
  MinLimit: 20,
  KindName: 'مستحضرات عناية'
};

const transformedCosmetic = adapter.transformProduct(sampleLegacyCosmetic);
console.log('=== TRANSFORMED COSMETIC PRODUCT ===');
console.log(JSON.stringify(transformedCosmetic, null, 2));

// Test 3: Transform Equipment Product from EasyStore (Auto-detecting equipment)
const sampleLegacyEquipment: EasyStoreItem = {
  ItemID: 802,
  ItemName: 'سشوار صالونات احترافي تورنادو 2500 وات',
  ItemCode: 'EQ-DRY-802',
  BuyPrice: 950.00,
  SalePrice: 1450.00,
  MinLimit: 5
};

const transformedEquipment = adapter.transformProduct(sampleLegacyEquipment);
console.log('=== TRANSFORMED EQUIPMENT PRODUCT (AUTO-DETECTED) ===');
console.log(JSON.stringify(transformedEquipment, null, 2));
