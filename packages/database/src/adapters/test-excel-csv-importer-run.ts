/**
 * test-excel-csv-importer-run.ts
 * سكريبت اختبار سريع للتحقق من عمل مستورد Excel/CSV (MIG-02)
 */

import {
  processCustomerBatch,
  processProductBatch,
  generateCustomerCsvTemplate,
  generateProductCsvTemplate,
  RawCustomerRow,
  RawProductRow,
} from './excel-csv-importer';

const DEMO_TENANT_ID = '11111111-1111-1111-1111-111111111111';

// 1. عينة عملاء
const sampleCustomers: RawCustomerRow[] = [
  {
    customer_name: 'صالون ليدي كوين',
    customer_code: 'SAL-LQ-01',
    phone: '201099887766', // هاتف بصيغة 20
    governorate: 'قاهره', // يحتاج توحيد
    city_area: 'مصر الجديدة',
    address: 'شارع النزهة',
    credit_limit: '20000',
    opening_balance: '1500.50',
    price_tier: 'جملة',
    notes: 'عميل بريميوم',
  },
  {
    customer_name: 'مركز باربي بيوتي',
    phone: '01155443322',
    governorate: 'الجيزة',
    city_area: 'الدقي',
    address: 'شارع مصدق',
    credit_limit: 10000,
    opening_balance: 0,
    price_tier: 'نصف جملة',
  },
  {
    // صف به خطأ متعمد لاختبار آلية التقاط الأخطاء
    customer_name: '',
    phone: '01200000000',
  },
];

// 2. عينة منتجات
const sampleProducts: RawProductRow[] = [
  {
    sku: '6221112223334',
    product_name: 'سيروم شعر بالأرجان 100 مل',
    product_type: 'cosmetic',
    category: 'سيروم وزيوت',
    cost_price: '85.50',
    sale_price: '130.00',
    retail_price: '180.00',
    reorder_point: 15,
    unit: 'قطعة',
  },
  {
    // بدون sku وبدون نوع صريح - اختبار التوليد التلقائي والكشف عن المعدات
    product_name: 'مكواة شعر نانو تيتانيوم بيبي ليس',
    category: 'أجهزة ومعدات',
    cost_price: 1200,
    sale_price: 1650,
    retail_price: 2100,
  },
  {
    // بدون اسم منتج - خطأ متعمد
    product_name: '   ',
    cost_price: 50,
  },
];

console.log('--- 1. اختبار استيراد العملاء ---');
const customerResult = processCustomerBatch(sampleCustomers, DEMO_TENANT_ID);
console.log(`إجمالي العملاء: ${customerResult.total}`);
console.log(`الناجح: ${customerResult.success_count}`);
console.log(`الأخطاء: ${customerResult.error_count}`);
console.log('بيانات العميل الأول المُعالج:');
console.log(JSON.stringify(customerResult.success[0], null, 2));

console.log('\n--- 2. اختبار استيراد المنتجات ---');
const productResult = processProductBatch(sampleProducts, DEMO_TENANT_ID);
console.log(`إجمالي المنتجات: ${productResult.total}`);
console.log(`الناجح: ${productResult.success_count}`);
console.log(`الأخطاء: ${productResult.error_count}`);
console.log('المنتج المكتشف كجهاز تلقائياً:');
console.log(JSON.stringify(productResult.success[1], null, 2));

console.log('\n--- 3. التحقق من قوالب الـ CSV ---');
console.log('Customer Template Header:\n' + generateCustomerCsvTemplate().split('\n')[0]);
console.log('Product Template Header:\n' + generateProductCsvTemplate().split('\n')[0]);
