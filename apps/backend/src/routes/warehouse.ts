import { Router, Request, Response } from 'express';
import { ApiResponse } from '@7days/shared-types';
import { queryWithTenant } from '../db';
import { sendWhatsAppNotification } from '../services/whatsapp';

const router = Router();

// مسار إنهاء التجميع والتغليف (WH-02)
router.post('/pick-lists/complete', async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.tenant_id || '11111111-1111-1111-1111-111111111111';
    const { order_id } = req.body;

    if (!order_id) {
      res.status(400).json({ success: false, status_code: 400, message: 'رقم الطلب مطلوب' });
      return;
    }

    const updated = await queryWithTenant(
      tenantId,
      `UPDATE orders SET status = 'ready', updated_at = NOW() WHERE id = $1 AND tenant_id = $2 RETURNING *`,
      [order_id, tenantId]
    );

    res.status(200).json({
      success: true,
      status_code: 200,
      message: 'تم إنهاء تجهيز الطلب بالكامل وأصبح جاهزاً للتحميل على الشاحنات',
      data: updated[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, status_code: 500, message: err.message });
  }
});

// مسار تأكيد التسليم بالصورة والتوقيع وخصم المخزون المحجوز نهائياً (WH-04)
router.post('/deliveries/confirm-handover', async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.tenant_id || '11111111-1111-1111-1111-111111111111';
    const { order_id, signature_url, recipient_name } = req.body;

    if (!order_id) {
      res.status(400).json({ success: false, status_code: 400, message: 'رقم الطلب مطلوب' });
      return;
    }

    // 1. تحديث حالة الطلب إلى delivered
    const orderRows = await queryWithTenant(
      tenantId,
      `UPDATE orders 
       SET status = 'delivered', updated_at = NOW() 
       WHERE id = $1 AND tenant_id = $2 
       RETURNING *`,
      [order_id, tenantId]
    );

    const order = orderRows[0];

    // 2. تثبيت خصم المخزون المحجوز نهائياً من التشغيلات (Deduct reserved qty)
    const items = await queryWithTenant(
      tenantId,
      `SELECT * FROM order_items WHERE order_id = $1 AND tenant_id = $2`,
      [order_id, tenantId]
    );

    for (const item of items) {
      if (item.batch_id) {
        await queryWithTenant(
          tenantId,
          `UPDATE inventory_batches
           SET quantity_reserved = GREATEST(0, quantity_reserved - $1)
           WHERE id = $2 AND tenant_id = $3`,
          [item.quantity, item.batch_id, tenantId]
        );
      }
    }

    // 3. إشعار واتساب تلقائي للصالون بتسليم الطلب ورابط الفاتورة
    const customer = (await queryWithTenant(
      tenantId,
      `SELECT * FROM customers WHERE id = $1 AND tenant_id = $2`,
      [order.customer_id, tenantId]
    ))[0];

    if (customer?.phone_number) {
      await sendWhatsAppNotification({
        toPhone: customer.phone_number,
        templateType: 'order_delivered',
        params: {
          salonName: customer.business_name,
          orderNumber: order.order_number,
          orderId: order.id,
        },
      });
    }

    res.status(200).json({
      success: true,
      status_code: 200,
      message: 'تم تسجيل تسليم الطلب بنجاح وتفريغ الحجز من المخزون وإشعار العميل آلياً',
      data: order,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, status_code: 500, message: err.message });
  }
});

export default router;
