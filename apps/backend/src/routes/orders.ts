import { Router, Request, Response } from 'express';
import { ApiResponse, CreateOrderPayload } from '@7days/shared-types';
import { queryWithTenant } from '../db';
import { allocateFEFOBatches } from '../services/fefo';

const router = Router();

// مسار إنشاء طلب جديد (REP-07 / B2B-03)
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.tenant_id || '11111111-1111-1111-1111-111111111111';
    const repId = req.user?.id || 'a0000000-0000-0000-0000-000000000002';
    const payload = req.body as CreateOrderPayload;

    if (!payload.customer_id || !payload.items || payload.items.length === 0) {
      const errorRes: ApiResponse = {
        success: false,
        status_code: 400,
        error_code: 'INVALID_PAYLOAD',
        message: 'بيانات الطلب غير مكتملة، يرجى اختيار العميل وتحديد الأصناف والكميات',
      };
      res.status(400).json(errorRes);
      return;
    }

    // 1. التحقق من المخزون وتخصيص الدفعات بنظام FEFO
    const allocationResults = [];
    let subtotal = 0;

    for (const item of payload.items) {
      const alloc = await allocateFEFOBatches(tenantId, item.product_id, item.quantity);
      if (!alloc.success) {
        const errorRes: ApiResponse = {
          success: false,
          status_code: 422,
          error_code: 'INSUFFICIENT_FEFO_STOCK',
          message: `عفواً، الكمية المطلوبة غير متوفرة في الدفعات السارية بالمستودع للصنف المحدد`,
          details: {
            product_id: item.product_id,
            requested: item.quantity,
            shortage: alloc.shortage,
          },
        };
        res.status(422).json(errorRes);
        return;
      }
      allocationResults.push({ item, alloc });
      subtotal += item.quantity * item.unit_price;
    }

    // 2. تسجيل الطلب في قاعدة البيانات
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    
    // تحويل طريقة الدفع لتتوافق مع قيود الجدول
    let paymentMethodAgreed = 'cash_on_delivery';
    if (payload.payment_method === 'credit_terms') {
      paymentMethodAgreed = 'credit_terms';
    } else if (payload.payment_method === 'vodafone_cash' || payload.payment_method === 'instapay') {
      paymentMethodAgreed = 'e_wallet';
    }

    const orderSource = payload.order_type === 'b2c_consumer' ? 'b2c_store' : 'rep_app';

    const orders = await queryWithTenant(
      tenantId,
      `INSERT INTO orders (
        tenant_id, customer_id, sales_rep_id, order_number, order_source,
        order_status, subtotal_amount, discount_amount, total_amount, payment_method_agreed
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        tenantId,
        payload.customer_id,
        repId,
        orderNumber,
        orderSource,
        'new',
        subtotal,
        0,
        subtotal,
        paymentMethodAgreed,
      ]
    );

    const createdOrder = orders[0];

    // 3. إدراج عناصر الطلب وحجز المخزون
    for (const resItem of allocationResults) {
      for (const batchAlloc of resItem.alloc.allocations) {
        await queryWithTenant(
          tenantId,
          `INSERT INTO order_items (
            tenant_id, order_id, product_id, batch_id, quantity, unit_price, total_line_amount
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            tenantId,
            createdOrder.id,
            resItem.item.product_id,
            batchAlloc.batch_id,
            batchAlloc.quantity,
            resItem.item.unit_price,
            batchAlloc.quantity * resItem.item.unit_price,
          ]
        );

        // حجز الكمية من دفعة المخزون (Reserve)
        await queryWithTenant(
          tenantId,
          `UPDATE inventory_batches 
           SET quantity_available = quantity_available - $1,
               quantity_reserved = quantity_reserved + $1
           WHERE id = $2 AND tenant_id = $3`,
          [batchAlloc.quantity, batchAlloc.batch_id, tenantId]
        );
      }
    }

    const successRes: ApiResponse = {
      success: true,
      status_code: 201,
      message: 'تم تأكيد وحجز الطلب بنجاح بنظام FEFO وجاهز لإرساله للمستودع',
      data: createdOrder,
    };
    res.status(201).json(successRes);
  } catch (err: any) {
    console.error('Error in /orders/create:', err);
    res.status(500).json({
      success: false,
      status_code: 500,
      error_code: 'SERVER_ERROR',
      message: err.message || 'حدث خطأ أثناء إنشاء الطلب',
    });
  }
});

export default router;
