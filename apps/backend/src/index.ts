import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApiResponse } from '@7days/shared-types';
import { authAndTenantMiddleware } from './middleware/auth';
import ordersRouter from './routes/orders';
import paymentsRouter from './routes/payments';
import returnsRouter from './routes/returns';
import warehouseRouter from './routes/warehouse';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// فحص جاهزية النظام العام (Health Check)
app.get('/api/v1/health', (req: Request, res: Response) => {
  const response: ApiResponse<{ system: string; status: string; timestamp: string }> = {
    success: true,
    status_code: 200,
    message: 'منظومة 7Days OS تعمل بنجاح وجاهزة لاستقبال طلبات الـ API',
    data: {
      system: '7Days OS Core API Engine',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  };
  res.status(200).json(response);
});

// تفعيل طبقة المصادقة وعزل الـ Multi-Tenancy
app.use('/api/v1', authAndTenantMiddleware);

// تسجيل مسارات الـ API التشغيلية
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/payments', paymentsRouter);
app.use('/api/v1/returns', returnsRouter);
app.use('/api/v1/warehouse', warehouseRouter);

export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[7Days OS Engine] Server running on port ${PORT}`);
  });
}
