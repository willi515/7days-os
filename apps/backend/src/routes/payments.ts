import { Router, Request, Response } from 'express';
import { ApiResponse, CollectPaymentPayload } from '@7days/shared-types';
import { queryWithTenant } from '../db';
import { sendWhatsAppNotification } from '../services/whatsapp';

const router = Router();

// مسار تسجيل تحصيل نقدية وإصدار إيصال معتمد (REP-05)
router.post('/collect', async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.tenant_id || '11111111-1111-1111-1111-111111111111';
    const repId = req.user?.id || 'a0000000-0000-0000-0000-000000000002';
    const payload = req.body as CollectPaymentPayload;

    if (!payload.customer_id || !payload.amount || payload.amount <= 0) {
      res.status(400).json({
        success: false,
        status_code: 400,
        error_code: 'INVALID_AMOUNT',
        message: 'يرجى إدخال مبلغ تحصيل صحيح وقيمة أكبر من الصفر',
      });
      return;
    }

    const receiptNumber = `REC-${Date.now().toString().slice(-6)}`;

    // 1. تسجيل سند القبض في جدول payments
    const paymentRows = await queryWithTenant(
      tenantId,
      `INSERT INTO payments (
        tenant_id, customer_id, collected_by_user_id,
        receipt_number, amount, payment_method, transaction_reference,
        notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        tenantId,
        payload.customer_id,
        repId,
        receiptNumber,
        payload.amount,
        payload.payment_method,
        payload.reference_number || null,
        payload.notes || null,
      ]
    );

    const payment = paymentRows[0];

    // 2. خصم المبلغ فوراً من مديونية العميل الحالية
    const updatedCustomerRows = await queryWithTenant(
      tenantId,
      `UPDATE customers 
       SET current_balance = GREATEST(0, current_balance - $1)
       WHERE id = $2 AND tenant_id = $3
       RETURNING *`,
      [payload.amount, payload.customer_id, tenantId]
    );

    const updatedCustomer = updatedCustomerRows[0];

    // 3. إطلاق إشعار واتساب تلقائي بإيصال السداد
    if (updatedCustomer?.phone_primary) {
      await sendWhatsAppNotification({
        toPhone: updatedCustomer.phone_primary,
        templateType: 'payment_receipt',
        params: {
          salonName: updatedCustomer.name,
          amount: payload.amount,
          repName: req.user?.full_name || 'أحمد فتحي',
          remainingBalance: updatedCustomer.current_balance,
        },
      });
    }

    const successRes: ApiResponse = {
      success: true,
      status_code: 201,
      message: `تم قيد التحصيل بنجاح بمبلغ ${payload.amount} ج.م وتم تحديث مديونية الصالون فورياً`,
      data: {
        payment,
        customer_remaining_balance: updatedCustomer?.current_balance,
      },
    };

    res.status(201).json(successRes);
  } catch (err: any) {
    console.error('Error in /payments/collect:', err);
    res.status(500).json({
      success: false,
      status_code: 500,
      error_code: 'SERVER_ERROR',
      message: err.message || 'حدث خطأ أثناء تسجيل سند التحصيل',
    });
  }
});

export default router;
