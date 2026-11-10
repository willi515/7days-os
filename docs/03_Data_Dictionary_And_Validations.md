# قاموس البيانات وقواعد التحقق الصارمة (Data Dictionary & Validation Rules)
# 7Days OS Sales & Marketing Platform

**المشروع:** منصة 7Days OS Sales & Marketing (Multi-Tenant SaaS)  
**العميل ومالك المنصة:** أ. محمود  
**الجهة المصممة والمشرفة:** الإدارة الهندسية المركزية وهندسة قواعد البيانات  
**تاريخ الاعتماد الرسمي:** 10 نوفمبر 2026  
**المسار المعتمد:** `H:\7DAYS OS\docs\03_Data_Dictionary_And_Validations.md`  
**حالة الوثيقة:** معتمدة رسمياً وموثقة لمنع أي أخطاء أو هلوسة برمجية أثناء التنفيذ  

---

## 1. الدستور الهندسي العام لقواعد البيانات (Database Engineering Constitution)

لضمان دقة النظام المالي والمحاسبي واستقراره عبر السنين، يُحظر خرق أي قاعدة من القواعد الآتية تحت أي ظرف:

### 1.1 قاعدة المعاملات المالية (The Financial Precision Rule)
- **ممنوع منعاً باتاً** استخدام أنواع البيانات العشرية العائمة مثل `FLOAT` أو `REAL` أو `DOUBLE` لأي حقل مالي.
- **الإلزام القطعي:** جميع الأسعار، التكاليف، الخصومات، العمولات، الضرائب، وأرصدة الديون تُخزن بنوع:  
  `DECIMAL(18, 2)` (بحد أقصى 18 رقماً، ورقمين دقيقين بعد الفاصلة العشرية بالجنيه المصري EGP).

### 1.2 قاعدة العزل التام للمشتركين (Strict Multi-Tenant Isolation)
- كل جدول تشغيلي وتجاري في النظام **يجب** أن يحتوي على الحقل الإجباري:
  ```sql
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT
  ```
- تُطبق سياسة أمان الصفوف الصارمة (Row-Level Security - RLS) على مستوى محرك قاعدة البيانات PostgreSQL لضمان استحالة تسرب بيانات أي شركة لشركة أخرى.
- كل استعلام استرجاع أو تحديث أو حذف يتم تشغيله مشروطاً بـ `tenant_id`.

### 1.3 قاعدة التتبع والتدقيق الزمني (Audit Trail & Soft Delete)
- كل جدول يحتوي على 4 حقول تتبع قياسية:
  1. `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL`
  2. `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL`
  3. `created_by_user_id UUID REFERENCES users(id)`
  4. `deleted_at TIMESTAMP WITH TIME ZONE NULL` (الحذف الناعم — لا تُحذف السجلات نهائياً من قاعدة البيانات).

### 1.4 قاعدة المفاتيح الأساسية (Primary Keys)
- استخدام معيار `UUID v4` لجميع المفاتيح الأساسية للجداول لمنع التنبؤ بالسجلات والتسلسلات من الخارج ولتسهيل المزامنة بين تطبيق الموبايل الميداني والخادم المركزي.

---

## 2. القاموس التفصيلي لجداول المنظومة (Detailed Data Dictionary)

---

### المجموعة 1: المشتركون، المستخدمون، والأمان (Tenancy & Auth)

#### جدول `tenants` — بيانات الشركات المشتركة
| اسم الحقل | نوع البيانات | القيود | الوصف الهندسي |
|-----------|--------------|--------|---------------|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | المعرف الفريد للشركة المستأجرة |
| `name` | `VARCHAR(150)` | `NOT NULL` | اسم الشركة التجاري الكامل |
| `subdomain` | `VARCHAR(63)` | `NOT NULL, UNIQUE` | النطاق الفرعي (مثل `elamal`) |
| `custom_domain` | `VARCHAR(255)` | `NULL, UNIQUE` | نطاق خاص إضافي للشركة إن وجد |
| `logo_url` | `TEXT` | `NULL` | رابط الشعار السحابي |
| `primary_color` | `VARCHAR(7)` | `DEFAULT '#0F172A'` | كود لون الهوية البصرية (HEX) |
| `contact_phone` | `VARCHAR(20)` | `NOT NULL` | هاتف الإدارة الرسمي للتنبيهات |
| `plan_type` | `VARCHAR(20)` | `DEFAULT 'starter'` | شريحة الباقة (`starter`, `pro`, `enterprise`) |
| `subscription_status` | `VARCHAR(20)` | `DEFAULT 'active'` | حالة الاشتراك (`active`, `trial`, `suspended`, `cancelled`) |
| `return_approval_threshold` | `DECIMAL(18, 2)` | `DEFAULT 500.00` | حد اعتماد المرتجع بدون فاتورة |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | تاريخ التسجيل |

#### جدول `users` — المستخدمون والحسابات
| اسم الحقل | نوع البيانات | القيود | الوصف الهندسي |
|-----------|--------------|--------|---------------|
| `id` | `UUID` | `PRIMARY KEY` | المعرف الفريد للمستخدم |
| `tenant_id` | `UUID` | `NULL (للـ Super Admin) أو REFERENCES tenants(id)` | الشركة التابع لها |
| `full_name` | `VARCHAR(150)` | `NOT NULL` | اسم المستخدم الكامل |
| `phone_number` | `VARCHAR(20)` | `NOT NULL, UNIQUE` | رقم الموبايل للدخول والرسائل |
| `email` | `VARCHAR(255)` | `NULL` | البريد الإلكتروني (اختياري) |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | كلمة المرور المشفرة بـ Argon2id |
| `user_role` | `VARCHAR(30)` | `NOT NULL` | الدور (`super_admin`, `tenant_admin`, `sales_rep`, `warehouse_worker`, `driver`, `salon_owner`) |
| `is_active` | `BOOLEAN` | `DEFAULT true` | حالة تفعيل الحساب |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | تاريخ الإنشاء |

---

### المجموعة 2: العملاء، الصالونات، والتسعير (Customers & Price Tiers)

#### جدول `price_tiers` — شرائح أسعار الصالونات والعملاء
| اسم الحقل | نوع البيانات | القيود | الوصف الهندسي |
|-----------|--------------|--------|---------------|
| `id` | `UUID` | `PRIMARY KEY` | معرف الشريحة |
| `tenant_id` | `UUID` | `NOT NULL, REFERENCES tenants(id)` | الشركة المالكة للشريحة |
| `name` | `VARCHAR(100)` | `NOT NULL` | اسم الشريحة (فضي، ذهبي، بلاتيني) |
| `discount_percentage` | `DECIMAL(5, 2)` | `DEFAULT 0.00` | نسبة الخصم العامة إن وجدت |
| `is_default` | `BOOLEAN` | `DEFAULT false` | هل هي الشريحة الافتراضية للعميل الجديد؟ |

#### جدول `customers` — الصالونات والعملاء
| اسم الحقل | نوع البيانات | القيود | الوصف الهندسي |
|-----------|--------------|--------|---------------|
| `id` | `UUID` | `PRIMARY KEY` | معرف العميل |
| `tenant_id` | `UUID` | `NOT NULL, REFERENCES tenants(id)` | الشركة المشتركة |
| `customer_code` | `VARCHAR(50)` | `NOT NULL` | كود العميل المميز للشركة |
| `name` | `VARCHAR(150)` | `NOT NULL` | اسم الصالون أو المركز |
| `contact_person` | `VARCHAR(100)` | `NULL` | اسم المالك أو المسؤول المباشر |
| `phone_primary` | `VARCHAR(20)` | `NOT NULL` | رقم الواتساب الأساسي للصالون |
| `phone_secondary` | `VARCHAR(20)` | `NULL` | هاتف بديل |
| `governorate` | `VARCHAR(50)` | `NOT NULL` | المحافظة (القاهرة، الجيزة، إلخ) |
| `city_area` | `VARCHAR(100)` | `NOT NULL` | الحي أو المنطقة (مدينة نصر، المعادي...) |
| `delivery_address` | `TEXT` | `NOT NULL` | العنوان التفصيلي للتسليم |
| `gps_latitude` | `DECIMAL(10, 8)`| `NULL` | إحداثي خط العرض للمحل |
| `gps_longitude` | `DECIMAL(11, 8)`| `NULL` | إحداثي خط الطول للمحل |
| `price_tier_id` | `UUID` | `NOT NULL, REFERENCES price_tiers(id)` | شريحة السعر المخصصة للصالون |
| `credit_limit` | `DECIMAL(18, 2)` | `DEFAULT 5000.00` | سقف الائتمان المسموح به بالجنيه |
| `current_balance` | `DECIMAL(18, 2)` | `DEFAULT 0.00` | الرصيد الحالي (+ مدين، - دائن) |
| `assigned_rep_id` | `UUID` | `NULL, REFERENCES users(id)` | المندوب الميداني المسؤول عنه |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | تاريخ التسجيل |

---

### المجموعة 3: المنتجات والمخزون المزدوج (Dual-Track Products & Inventory)

#### جدول `products` — كتالوج المنتجات المركزي
| اسم الحقل | نوع البيانات | القيود | الوصف الهندسي |
|-----------|--------------|--------|---------------|
| `id` | `UUID` | `PRIMARY KEY` | معرف المنتج |
| `tenant_id` | `UUID` | `NOT NULL, REFERENCES tenants(id)` | الشركة المالكة للصنف |
| `sku_code` | `VARCHAR(60)` | `NOT NULL` | كود الصنف أو الباركود الدولي |
| `name` | `VARCHAR(200)` | `NOT NULL` | اسم المنتج التجاري |
| `product_type` | `VARCHAR(20)` | `NOT NULL` | نوع الصنف: `cosmetic` (مستحضر صلاحية) أو `equipment` (جهاز سيريال) |
| `category` | `VARCHAR(100)` | `NOT NULL` | القسم (عناية بشعر، صبغات، أجهزة، إلخ) |
| `base_cost` | `DECIMAL(18, 2)` | `NOT NULL` | سعر التكلفة للشركة |
| `consumer_retail_price`| `DECIMAL(18, 2)` | `NOT NULL` | سعر البيع للجمهور بالمتجر B2C |
| `reorder_point` | `INTEGER` | `DEFAULT 10` | حد التنبيه لإعادة الشراء |
| `warranty_months` | `INTEGER` | `DEFAULT 0` | مدة الضمان بالشهور (للأجهزة فقط) |
| `image_url` | `TEXT` | `NULL` | صورة المستحضر |
| `is_active` | `BOOLEAN` | `DEFAULT true` | حالة التوفر للبيع |

#### جدول `inventory_batches` — تشغيلات المستحضرات (FEFO)
| اسم الحقل | نوع البيانات | القيود | الوصف الهندسي |
|-----------|--------------|--------|---------------|
| `id` | `UUID` | `PRIMARY KEY` | معرف التشغيلة |
| `tenant_id` | `UUID` | `NOT NULL, REFERENCES tenants(id)` | معرف الشركة |
| `product_id` | `UUID` | `NOT NULL, REFERENCES products(id)` | المنتج المرتبط |
| `batch_number` | `VARCHAR(80)` | `NOT NULL` | رقم التشغيلة/الدُفعة المطبوع على العلبة |
| `manufacture_date` | `DATE` | `NULL` | تاريخ الإنتاج |
| `expiry_date` | `DATE` | `NOT NULL` | تاريخ انتهاء الصلاحية الحاكم لـ FEFO |
| `quantity_available` | `INTEGER` | `NOT NULL, CHECK (quantity_available >= 0)` | الكمية القابلة للبيع |
| `quantity_reserved` | `INTEGER` | `DEFAULT 0` | الكمية المحجوزة في طلبات قيد التجهيز |
| `warehouse_location` | `VARCHAR(50)` | `NULL` | موقع الرف بالمستودع (مثلاً: A-3) |

#### جدول `equipment_serials` — سيريالات الأجهزة والمعدات
| اسم الحقل | نوع البيانات | القيود | الوصف الهندسي |
|-----------|--------------|--------|---------------|
| `id` | `UUID` | `PRIMARY KEY` | معرف الجهاز |
| `tenant_id` | `UUID` | `NOT NULL, REFERENCES tenants(id)` | معرف الشركة |
| `product_id` | `UUID` | `NOT NULL, REFERENCES products(id)` | الموديل أو نوع المعدة |
| `serial_number` | `VARCHAR(100)` | `NOT NULL` | الرقم التسلسلي الفريد للجهاز |
| `status` | `VARCHAR(30)` | `DEFAULT 'in_stock'` | الحالة: `in_stock`, `assigned_to_order`, `sold`, `under_maintenance` |
| `sold_to_customer_id` | `UUID` | `NULL, REFERENCES customers(id)` | العميل المشتري للجهاز |
| `sold_invoice_id` | `UUID` | `NULL` | الفاتورة المباع عليها |
| `warranty_start_date`| `DATE` | `NULL` | تاريخ بدء الضمان |
| `warranty_end_date` | `DATE` | `NULL` | تاريخ نهاية الضمان |

---

### المجموعة 4: الطلبات، الفواتير، والتحصيل (Orders, Invoices & Payments)

#### جدول `orders` — الطلبات التجارية
| اسم الحقل | نوع البيانات | القيود | الوصف الهندسي |
|-----------|--------------|--------|---------------|
| `id` | `UUID` | `PRIMARY KEY` | معرف الطلب |
| `tenant_id` | `UUID` | `NOT NULL, REFERENCES tenants(id)` | معرف الشركة |
| `order_number` | `VARCHAR(40)` | `NOT NULL` | رقم الطلب التسلسلي (ORD-YYYY-XXXX) |
| `customer_id` | `UUID` | `NOT NULL, REFERENCES customers(id)` | العميل المشتري |
| `sales_rep_id` | `UUID` | `NULL, REFERENCES users(id)` | المندوب المسؤول |
| `order_source` | `VARCHAR(20)` | `NOT NULL` | مصدر الطلب: `rep_app`, `b2b_portal`, `b2c_store` |
| `subtotal_amount` | `DECIMAL(18, 2)` | `NOT NULL` | المجموع قبل الخصم |
| `discount_amount` | `DECIMAL(18, 2)` | `DEFAULT 0.00` | قيمة الخصم الممنوح |
| `total_amount` | `DECIMAL(18, 2)` | `NOT NULL` | الصافي النهائي المطلوب |
| `order_status` | `VARCHAR(30)` | `DEFAULT 'new'` | الحالة (`new`, `assigned`, `picking`, `ready`, `loaded`, `delivered`, `partially_delivered`, `cancelled`) |
| `payment_method_agreed` | `VARCHAR(20)` | `NOT NULL` | طريقة السداد: `cash_on_delivery`, `credit_terms`, `e_wallet` |
| `proof_of_delivery_photo_url` | `TEXT` | `NULL` | رابط صورة البضاعة عند التسليم |
| `customer_signature_data` | `TEXT` | `NULL` | بيانات التوقيع الرقمي للعميل |
| `delivered_at` | `TIMESTAMPTZ` | `NULL` | وقت التسليم الفعلي |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | تاريخ تسجيل الطلب |

#### جدول `order_items` — تفاصيل أصناف الطلب
| اسم الحقل | نوع البيانات | القيود | الوصف الهندسي |
|-----------|--------------|--------|---------------|
| `id` | `UUID` | `PRIMARY KEY` | معرف السجل |
| `tenant_id` | `UUID` | `NOT NULL, REFERENCES tenants(id)` | معرف الشركة |
| `order_id` | `UUID` | `NOT NULL, REFERENCES orders(id) ON DELETE CASCADE` | الطلب التابع له |
| `product_id` | `UUID` | `NOT NULL, REFERENCES products(id)` | المنتج المطلوب |
| `batch_id` | `UUID` | `NULL, REFERENCES inventory_batches(id)` | التشغيلة المحددة بنظام FEFO |
| `serial_id` | `UUID` | `NULL, REFERENCES equipment_serials(id)` | السيريال إن كان جهازاً |
| `quantity` | `INTEGER` | `NOT NULL, CHECK (quantity > 0)` | الكمية المطلوبة |
| `unit_price` | `DECIMAL(18, 2)` | `NOT NULL` | سعر بيع القطعة بالجنيه |
| `total_line_amount` | `DECIMAL(18, 2)` | `NOT NULL` | الإجمالي للسطر (`quantity * unit_price`) |

#### جدول `payments` — المقبوضات والتحصيلات النقدية
| اسم الحقل | نوع البيانات | القيود | الوصف الهندسي |
|-----------|--------------|--------|---------------|
| `id` | `UUID` | `PRIMARY KEY` | معرف السند |
| `tenant_id` | `UUID` | `NOT NULL, REFERENCES tenants(id)` | معرف الشركة |
| `receipt_number` | `VARCHAR(40)` | `NOT NULL` | رقم إيصال التحصيل |
| `customer_id` | `UUID` | `NOT NULL, REFERENCES customers(id)` | العميل الدافع |
| `collected_by_user_id`| `UUID` | `NOT NULL, REFERENCES users(id)` | المستلم (مندوب/سائق/محاسب) |
| `amount` | `DECIMAL(18, 2)` | `NOT NULL, CHECK (amount > 0)` | المبلغ المحصّل بالجنيه |
| `payment_method` | `VARCHAR(20)` | `NOT NULL` | الوسيلة (`cash`, `vodafone_cash`, `instapay`, `bank_transfer`) |
| `transaction_reference` | `VARCHAR(100)`| `NULL` | رقم العملية إن كان تحويلاً بمحفظة |
| `notes` | `TEXT` | `NULL` | ملاحظات السداد |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | وقت التحصيل الفعلي |

---

### المجموعة 5: محرك المرتجعات والحجر الصحي (Returns & Quarantine)

#### جدول `returns` — طلبات المرتجعات
| اسم الحقل | نوع البيانات | القيود | الوصف الهندسي |
|-----------|--------------|--------|---------------|
| `id` | `UUID` | `PRIMARY KEY` | معرف حركة الإرجاع |
| `tenant_id` | `UUID` | `NOT NULL, REFERENCES tenants(id)` | معرف الشركة |
| `return_number` | `VARCHAR(40)` | `NOT NULL` | كود المرتجع (RET-YYYY-XXXX) |
| `customer_id` | `UUID` | `NOT NULL, REFERENCES customers(id)` | العميل المرجع |
| `sales_rep_id` | `UUID` | `NOT NULL, REFERENCES users(id)` | المندوب الذي استلم المرتجع |
| `has_invoice_link` | `BOOLEAN` | `NOT NULL` | هل المرتجع مربوط بفاتورة أصلية؟ |
| `original_order_id`| `UUID` | `NULL, REFERENCES orders(id)` | الفاتورة الأصلية إن وجدت |
| `total_refund_amount`| `DECIMAL(18, 2)`| `NOT NULL` | إجمالي القيمة المستردة للعميل |
| `needs_admin_approval`| `BOOLEAN` | `DEFAULT false` | هل يحتاج موافقة الإدارة؟ |
| `approval_status` | `VARCHAR(20)` | `DEFAULT 'pending'` | الحالة: `pending`, `approved`, `rejected` |
| `approved_by_user_id`| `UUID` | `NULL, REFERENCES users(id)` | المدير المعتمد |
| `reason` | `TEXT` | `NOT NULL` | سبب الإرجاع المسجل |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | تاريخ الإرجاع |

#### جدول `quarantine_inventory` — مخزن الحجر الصحي والعزل
| اسم الحقل | نوع البيانات | القيود | الوصف الهندسي |
|-----------|--------------|--------|---------------|
| `id` | `UUID` | `PRIMARY KEY` | معرف سجل الحجر |
| `tenant_id` | `UUID` | `NOT NULL, REFERENCES tenants(id)` | معرف الشركة |
| `product_id` | `UUID` | `NOT NULL, REFERENCES products(id)` | المنتج التالف أو المرتجع |
| `batch_id` | `UUID` | `NULL, REFERENCES inventory_batches(id)` | التشغيلة التابع لها |
| `serial_id` | `UUID` | `NULL, REFERENCES equipment_serials(id)` | السيريال إن كان جهازاً |
| `quantity` | `INTEGER` | `NOT NULL, CHECK (quantity > 0)` | الكمية المعزولة |
| `reason_code` | `VARCHAR(50)` | `NOT NULL` | كود العزل: `expired`, `damaged_transport`, `customer_defect` |
| `disposition_status` | `VARCHAR(30)` | `DEFAULT 'in_quarantine'` | القرار: `under_inspection`, `returned_to_vendor`, `destroyed` |

---

## 3. مصفوفة قواعد التحقق الصارمة (Strict Field Validation Matrix)

### 3.1 قاعدة التحقق من أرقام الهواتف والمحافظ المصرية
- يتم رفض أي رقم هاتف أو محفظة كاش لا يطابق التعبير النمطي (RegEx):
  ```regex
  ^(010|011|012|015)[0-9]{8}$
  ```
  أو بالصيغة الدولية المعتمدة:
  ```regex
  ^(\+20|0020)(10|11|12|15)[0-9]{8}$
  ```

### 3.2 قيود الأرقام والقيم الحسابية
1. **الكميات (Quantities):**
   ```sql
   CONSTRAINT check_positive_order_qty CHECK (quantity > 0)
   CONSTRAINT check_non_negative_balance CHECK (quantity_available >= 0)
   ```
2. **الأسعار والمبالغ المالية (Financial Values):**
   ```sql
   CONSTRAINT check_positive_unit_price CHECK (unit_price >= 0.00)
   CONSTRAINT check_positive_payment CHECK (amount > 0.00)
   ```
3. **تواريخ الصلاحية والتشغيلات (Batch Dates):**
   ```sql
   CONSTRAINT check_valid_expiry CHECK (expiry_date > manufacture_date)
   ```
4. **تفرد الأرقام التسلسلية ضمن الشركة:**
   ```sql
   CONSTRAINT unique_tenant_serial UNIQUE (tenant_id, serial_number)
   ```

---

## 4. محرك دفتر الأستاذ غير القابل للتعديل (Immutable Financial Ledger)

لمنع أي تلاعب أو اختلاف في الحسابات:
1. **ممنوع الـ UPDATE أو DELETE** على سجلات جدول `payments` أو قيود المديونية المعتمدة.
2. إذا تم اكتشاف خطأ في تحصيل مسجل:
   - يتم إبقاء القيد الأصلي كما هو.
   - يتم إنشاء قيد تصحيحي جديد بعكس العملية `reversal_transaction` مع ذكر سبب الخطأ واسم المستخدم الذي قام بالتصحيح لضمان سلامة التدقيق المحاسبي (Clean Audit Trail).

---

## جدول الاعتماد والتوقيع — الوثيقة الثالثة

| البند | التفاصيل |
|-------|---------|
| **المستند** | 03_Data_Dictionary_And_Validations.md |
| **الموضوع** | قاموس البيانات، الجداول، وأنواع الحقول، والتحقق الصارم |
| **مالك المشروع** | أ. محمود |
| **تاريخ الاعتماد** | 10 نوفمبر 2026 |
| **حالة الوثيقة** | ✅ **معتمدة ومكتملة بنسبة 100% في المسار الرسمي** |
| **المحطة التالية والأخيرة** | الوثيقة 04: مصفوفة مسارات الـ API وقواعد الأعمال الخلفية (04_API_And_Business_Rules_Matrix.md) |
