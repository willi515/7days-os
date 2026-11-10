import { Router, Request, Response } from 'express';
import { ApiResponse, SubmitReturnPayload } from '@7days/shared-types';
import { queryWithTenant } from '../db';

const router = Router();

// مسار تسجيل وتأكيد طلب إرجاع (REP-06 / ADM-07)
router.post('/submit', async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.tenant_id || '11111111-1111-1111-1111-111111111111';
    const repId = req.user?.id || 'a0000000-0000-0000-0000-000000000002';
    const payload = req.body as SubmitReturnPayload;

    if (!payload.order_id || !payload.customer_id || !payload.product_id || !payload.quantity) {
      res.status(400).json({
        success: false,
        status_code: 400,
        error_code: 'INVALID_RETURN_PAYLOAD',
        message: 'بيانات طلب الإرجاع غير مكتملة، يرجى تحديد الصنف والكمية والسبب',
      });
      return;
    }

    const returnNumber = `RET-${Date.now().toString().slice(-6)}`;

    // تسجيل في جدول returns
    const returnRows = await queryWithTenant(
      tenantId,
      `INSERT INTO returns (
        tenant_id, order_id, customer_id, product_id, batch_id,
        initiated_by_user_id, return_number, quantity, reason,
        condition, approval_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        tenantId,
        payload.order_id,
        payload.customer_id,
        payload.product_id,
        payload.batch_id || null,
        repId,
        returnNumber,
        payload.quantity,
        payload.reason,
        payload.condition,
        'pending',
      ]
    );

    const createdReturn = returnRows[0];

    const successRes: ApiResponse = {
      success: true,
      status_code: 201,
      message: 'تم تسجيل إشعار المرتجع ورفع الطلب للاعتماد المكتبي أو إدخال المخزن للحجر',
      data: createdReturn,
    };
    res.status(201).json(successRes);
  } catch (err: any) {
    console.error('Error in /returns/submit:', err);
    res.status(500).json({
      success: false,
      status_code: 500,
      error_code: 'SERVER_ERROR',
      message: err.message || 'حدث خطأ أثناء رفع طلب الإرجاع',
    });
  }
});

export default router;
