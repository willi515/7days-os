/**
 * excel-csv-importer.ts
 * MIG-02 — مستورد ملفات Excel / CSV الموحد لـ 7Days OS
 * يستقبل ملفات من الشركات المشتركة الجديدة ويحولها لصيغة قاعدة البيانات
 *
 * الاستخدام:
 *   npx tsx packages/database/src/adapters/excel-csv-importer.ts
 *
 * يدعم قالبَين:
 *   1. CUSTOMERS_TEMPLATE  — عملاء / صالونات
 *   2. PRODUCTS_TEMPLATE   — منتجات (مستحضرات + أجهزة)
 */

// =========================================================
// 1. الأنواع والواجهات (Types & Interfaces)
// =========================================================

/** صف عميل كما يصل من ملف Excel/CSV */
interface RawCustomerRow {
  customer_name: string;        // اسم العميل / الصالون *مطلوب*
  customer_code?: string;       // كود داخلي (اختياري — يُولَّد تلقائياً لو فارغ)
  phone?: string;               // رقم الهاتف
  governorate?: string;         // المحافظة
  city_area?: string;           // المدينة / المنطقة
  address?: string;             // العنوان التفصيلي
  credit_limit?: string | number; // الحد الائتماني بالجنيه
  opening_balance?: string | number; // الرصيد الافتتاحي بالجنيه
  price_tier?: string;          // "جملة" | "نصف جملة" | "تجزئة"
  notes?: string;               // ملاحظات حرة
}

/** صف منتج كما يصل من ملف Excel/CSV */
interface RawProductRow {
  sku?: string;                 // كود الصنف / الباركود *مطلوب*
  product_name: string;         // اسم المنتج *مطلوب*
  product_type?: string;        // "cosmetic" | "equipment" | "accessory"
  category?: string;            // الفئة / التصنيف
  cost_price?: string | number; // سعر التكلفة
  sale_price?: string | number; // سعر البيع للصالونات
  retail_price?: string | number; // سعر التجزئة للمستهلك
  reorder_point?: string | number; // نقطة إعادة الطلب
  unit?: string;                // وحدة القياس (قطعة، لتر، كجم...)
  notes?: string;
}

/** عميل مُحوَّل جاهز لقاعدة البيانات */
interface TransformedCustomer {
  tenant_id: string;
  customer_code: string;
  name: string;
  contact_person: string;
  phone_primary: string | null;
  governorate: string;
  city_area: string;
  delivery_address: string;
  price_tier_id: string;
  credit_limit: number;
  current_balance: number;
  notes: string;
  import_source: 'excel_csv';
}

/** منتج مُحوَّل جاهز لقاعدة البيانات */
interface TransformedProduct {
  tenant_id: string;
  sku_code: string;
  name: string;
  product_type: 'cosmetic' | 'equipment' | 'accessory';
  category: string;
  unit: string;
  base_cost: number;
  wholesale_price: number;
  consumer_retail_price: number;
  reorder_point: number;
  notes: string;
  import_source: 'excel_csv';
}

/** نتيجة عملية الاستيراد */
interface ImportResult<T> {
  success: T[];
  errors: Array<{ row: number; reason: string; raw: unknown }>;
  total: number;
  success_count: number;
  error_count: number;
}

// =========================================================
// 2. ثوابت الأعمدة وقوائم الكشف التلقائي
// =========================================================

/** الكلمات الدالة على أن المنتج جهاز/معدة (equipment) */
const EQUIPMENT_KEYWORDS = [
  'سشوار', 'مجفف', 'مكواة', 'استريتشر', 'بخار', 'كرسي', 'كاب',
  'مجهر', 'آلة', 'جهاز', 'معدة', 'مضخة', 'مروحة', 'تبريد',
  'hair dryer', 'straightener', 'steamer', 'chair', 'device',
  'machine', 'equipment', 'tool', 'clipper', 'trimmer',
];

/** الكلمات الدالة على ملحقات (accessory) */
const ACCESSORY_KEYWORDS = [
  'مشط', 'فرشاة', 'مقص', 'ماطاط', 'دبوس', 'كليبس', 'قفاز',
  'comb', 'brush', 'scissors', 'clip', 'glove', 'cape', 'towel',
];

/** خريطة المحافظات المصرية (للتوحيد) */
const GOVERNORATE_MAP: Record<string, string> = {
  'cairo': 'القاهرة', 'giza': 'الجيزة', 'alex': 'الإسكندرية',
  'alexandria': 'الإسكندرية', 'قاهره': 'القاهرة', 'جيزه': 'الجيزة',
  'اسكندريه': 'الإسكندرية', 'اسكندرية': 'الإسكندرية',
};

/** خريطة شرائح الأسعار */
const PRICE_TIER_MAP: Record<string, string> = {
  'جملة':     'a2222222-2222-2222-2222-222222222222',
  'نصف جملة': 'b3333333-3333-3333-3333-333333333333',
  'تجزئة':    'c4444444-4444-4444-4444-444444444444',
  'wholesale': 'a2222222-2222-2222-2222-222222222222',
  'semi':      'b3333333-3333-3333-3333-333333333333',
  'retail':    'c4444444-4444-4444-4444-444444444444',
};

const DEFAULT_PRICE_TIER_ID = 'a2222222-2222-2222-2222-222222222222'; // جملة افتراضياً

// =========================================================
// 3. دوال المساعدة (Helpers)
// =========================================================

/** تنظيف وتوحيد أرقام الهاتف المصرية */
function sanitizeEgyptianPhone(raw: string | undefined | null): string | null {
  if (!raw) return null;

  // إزالة أي رمز غير رقمي
  let digits = String(raw).replace(/[^0-9]/g, '');

  // إزالة رمز الدولة 20 من البداية
  if (digits.startsWith('20')) {
    digits = '0' + digits.slice(2);
  }

  // إضافة الصفر لو بدأ بـ 1 مباشرة (10 أرقام)
  if (digits.length === 10 && digits.startsWith('1')) {
    digits = '0' + digits;
  }

  // التحقق من النمط المصري الصحيح: 010/011/012/015 + 8 أرقام
  const EG_PHONE_REGEX = /^(010|011|012|015)[0-9]{8}$/;
  if (EG_PHONE_REGEX.test(digits)) {
    return digits;
  }

  // الرقم لا ينطبق على الصيغة المصرية — احتفظ به كما هو مع تحذير
  console.warn(`⚠️  رقم غير مصري أو خاطئ: "${raw}" → "${digits}" (سيُحفظ كما هو)`);
  return digits.length > 0 ? digits : null;
}

/** تحويل القيمة المالية إلى رقم آمن */
function parseMoney(raw: string | number | undefined | null): number {
  if (raw === undefined || raw === null || raw === '') return 0;
  const cleaned = String(raw).replace(/[^0-9.]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : Math.round(val * 100) / 100; // دقتان عشريتان
}

/** توليد كود عميل تلقائي لو لم يُوفَّر */
function generateCustomerCode(name: string, index: number): string {
  const prefix = name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase()
    .replace(/[^A-Z\u0600-\u06FF]/g, '');
  return `IMP-${prefix || 'XX'}-${String(index).padStart(4, '0')}`;
}

/** توليد SKU تلقائي للمنتج */
function generateSku(name: string, index: number): string {
  const prefix = name
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 10)
    .toUpperCase();
  return `SKU-${prefix}-${String(index).padStart(3, '0')}`;
}

/** كشف نوع المنتج تلقائياً من اسمه */
function detectProductType(
  name: string,
  rawType?: string
): 'cosmetic' | 'equipment' | 'accessory' {
  const lowerName = name.toLowerCase();
  const lowerType = (rawType || '').toLowerCase().trim();

  // إذا صُرِّح صراحةً
  if (lowerType === 'equipment' || lowerType === 'جهاز' || lowerType === 'معدات') {
    return 'equipment';
  }
  if (lowerType === 'accessory' || lowerType === 'ملحقات' || lowerType === 'accessories') {
    return 'accessory';
  }
  if (lowerType === 'cosmetic' || lowerType === 'مستحضرات' || lowerType === 'تجميل') {
    return 'cosmetic';
  }

  // كشف تلقائي بالكلمات الدالة
  if (EQUIPMENT_KEYWORDS.some((kw) => lowerName.includes(kw.toLowerCase()))) {
    return 'equipment';
  }
  if (ACCESSORY_KEYWORDS.some((kw) => lowerName.includes(kw.toLowerCase()))) {
    return 'accessory';
  }

  // افتراضي: مستحضرات
  return 'cosmetic';
}

/** توحيد اسم المحافظة */
function normalizeGovernorate(raw?: string): string {
  if (!raw) return 'القاهرة';
  const lower = raw.trim().toLowerCase();
  return GOVERNORATE_MAP[lower] || raw.trim();
}

/** استخراج شريحة السعر */
function resolvePriceTier(raw?: string): string {
  if (!raw) return DEFAULT_PRICE_TIER_ID;
  const lower = raw.trim().toLowerCase();
  for (const [key, id] of Object.entries(PRICE_TIER_MAP)) {
    if (lower.includes(key.toLowerCase())) return id;
  }
  return DEFAULT_PRICE_TIER_ID;
}

// =========================================================
// 4. دوال التحويل الرئيسية (Core Transformers)
// =========================================================

/**
 * تحويل صف عميل خام إلى نموذج قاعدة البيانات
 */
function transformCustomerRow(
  raw: RawCustomerRow,
  tenantId: string,
  rowIndex: number
): TransformedCustomer {
  const customerCode =
    raw.customer_code?.trim() ||
    generateCustomerCode(raw.customer_name, rowIndex);

  return {
    tenant_id: tenantId,
    customer_code: customerCode,
    name: raw.customer_name.trim(),
    contact_person: raw.customer_name.trim(),
    phone_primary: sanitizeEgyptianPhone(raw.phone),
    governorate: normalizeGovernorate(raw.governorate),
    city_area: raw.city_area?.trim() || 'غير محدد',
    delivery_address: raw.address?.trim() || 'غير محدد',
    price_tier_id: resolvePriceTier(raw.price_tier),
    credit_limit: parseMoney(raw.credit_limit),
    current_balance: parseMoney(raw.opening_balance),
    notes: raw.notes?.trim() || '',
    import_source: 'excel_csv',
  };
}

/**
 * تحويل صف منتج خام إلى نموذج قاعدة البيانات
 */
function transformProductRow(
  raw: RawProductRow,
  tenantId: string,
  rowIndex: number
): TransformedProduct {
  const detectedType = detectProductType(raw.product_name, raw.product_type);
  const skuCode =
    raw.sku?.trim() || generateSku(raw.product_name, rowIndex);

  const baseCost = parseMoney(raw.cost_price);
  const wholesalePrice = parseMoney(raw.sale_price) || Math.round(baseCost * 1.3 * 100) / 100;
  const retailPrice = parseMoney(raw.retail_price) || Math.round(baseCost * 1.6 * 100) / 100;

  return {
    tenant_id: tenantId,
    sku_code: skuCode,
    name: raw.product_name.trim(),
    product_type: detectedType,
    category: raw.category?.trim() || (detectedType === 'cosmetic' ? 'مستحضرات عناية' : detectedType === 'equipment' ? 'أجهزة ومعدات' : 'ملحقات'),
    unit: raw.unit?.trim() || 'قطعة',
    base_cost: baseCost,
    wholesale_price: wholesalePrice,
    consumer_retail_price: retailPrice,
    reorder_point: parseMoney(raw.reorder_point) || (detectedType === 'equipment' ? 2 : 10),
    notes: raw.notes?.trim() || '',
    import_source: 'excel_csv',
  };
}

// =========================================================
// 5. المعالج الدُفعي (Batch Processor)
// =========================================================

/**
 * معالجة دفعة من صفوف العملاء
 */
function processCustomerBatch(
  rows: RawCustomerRow[],
  tenantId: string
): ImportResult<TransformedCustomer> {
  const result: ImportResult<TransformedCustomer> = {
    success: [],
    errors: [],
    total: rows.length,
    success_count: 0,
    error_count: 0,
  };

  rows.forEach((raw, idx) => {
    const rowNum = idx + 2; // صف 1 = رأس الجدول
    try {
      if (!raw.customer_name?.trim()) {
        throw new Error('اسم العميل فارغ أو مفقود (عمود: customer_name)');
      }
      const transformed = transformCustomerRow(raw, tenantId, idx + 1);
      result.success.push(transformed);
      result.success_count++;
    } catch (err: unknown) {
      result.errors.push({
        row: rowNum,
        reason: err instanceof Error ? err.message : String(err),
        raw,
      });
      result.error_count++;
    }
  });

  return result;
}

/**
 * معالجة دفعة من صفوف المنتجات
 */
function processProductBatch(
  rows: RawProductRow[],
  tenantId: string
): ImportResult<TransformedProduct> {
  const result: ImportResult<TransformedProduct> = {
    success: [],
    errors: [],
    total: rows.length,
    success_count: 0,
    error_count: 0,
  };

  rows.forEach((raw, idx) => {
    const rowNum = idx + 2;
    try {
      if (!raw.product_name?.trim()) {
        throw new Error('اسم المنتج فارغ أو مفقود (عمود: product_name)');
      }
      const transformed = transformProductRow(raw, tenantId, idx + 1);
      result.success.push(transformed);
      result.success_count++;
    } catch (err: unknown) {
      result.errors.push({
        row: rowNum,
        reason: err instanceof Error ? err.message : String(err),
        raw,
      });
      result.error_count++;
    }
  });

  return result;
}

// =========================================================
// 6. قالبَا Excel/CSV المرجعيان (Template Generators)
// =========================================================

/** هيكل أعمدة قالب العملاء */
export const CUSTOMERS_CSV_TEMPLATE_HEADERS = [
  'customer_name',    // اسم العميل / الصالون *مطلوب*
  'customer_code',    // كود داخلي (اختياري)
  'phone',            // رقم الهاتف (010/011/012/015...)
  'governorate',      // المحافظة (القاهرة، الجيزة...)
  'city_area',        // المنطقة / الحي
  'address',          // العنوان التفصيلي
  'credit_limit',     // الحد الائتماني بالجنيه (أرقام فقط)
  'opening_balance',  // الرصيد الافتتاحي بالجنيه
  'price_tier',       // شريحة السعر: جملة | نصف جملة | تجزئة
  'notes',            // ملاحظات
] as const;

/** هيكل أعمدة قالب المنتجات */
export const PRODUCTS_CSV_TEMPLATE_HEADERS = [
  'sku',              // كود الصنف / الباركود (اختياري)
  'product_name',     // اسم المنتج *مطلوب*
  'product_type',     // النوع: cosmetic | equipment | accessory (اختياري — يكتشف تلقائياً)
  'category',         // الفئة / التصنيف
  'cost_price',       // سعر التكلفة بالجنيه
  'sale_price',       // سعر البيع للصالونات (جملة)
  'retail_price',     // سعر المستهلك النهائي
  'reorder_point',    // نقطة إعادة الطلب (عدد القطع)
  'unit',             // وحدة القياس: قطعة | لتر | كجم | علبة
  'notes',            // ملاحظات
] as const;

/** توليد محتوى CSV قالب العملاء مع صف مثال */
export function generateCustomerCsvTemplate(): string {
  const header = CUSTOMERS_CSV_TEMPLATE_HEADERS.join(',');
  const example = [
    'صالون نور الحياة',
    'SAL-001',
    '01012345678',
    'القاهرة',
    'مدينة نصر',
    'شارع عباس العقاد - عمارة 15',
    '15000',
    '0',
    'جملة',
    'عميل مميز',
  ].join(',');
  return `${header}\n${example}\n`;
}

/** توليد محتوى CSV قالب المنتجات مع صفَّي مثال */
export function generateProductCsvTemplate(): string {
  const header = PRODUCTS_CSV_TEMPLATE_HEADERS.join(',');
  const example1 = [
    '6224001122334',
    'شامبو كيراتين برازيلي 1000 مل',
    'cosmetic',
    'مستحضرات عناية',
    '140',
    '200',
    '250',
    '20',
    'قطعة',
    '',
  ].join(',');
  const example2 = [
    'EQ-DRY-001',
    'سشوار صالونات احترافي 2500 وات',
    '', // سيكتشف تلقائياً = equipment
    'أجهزة ومعدات',
    '900',
    '1300',
    '1600',
    '3',
    'قطعة',
    'مع ضمان سنة',
  ].join(',');
  return `${header}\n${example1}\n${example2}\n`;
}

// =========================================================
// 7. الصادرات العامة (Public API)
// =========================================================

export {
  // الأنواع
  RawCustomerRow,
  RawProductRow,
  TransformedCustomer,
  TransformedProduct,
  ImportResult,
  // الدوال الرئيسية
  processCustomerBatch,
  processProductBatch,
  transformCustomerRow,
  transformProductRow,
  // المساعدات
  sanitizeEgyptianPhone,
  parseMoney,
  detectProductType,
  normalizeGovernorate,
};
