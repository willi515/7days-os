import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApiResponse } from '@7days/shared-types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Base Health Check Endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  const response: ApiResponse<{ system: string; status: string; timestamp: string }> = {
    success: true,
    status_code: 200,
    message: 'منظومة 7Days OS تعمل بنجاح وجاهزة لاستقبال الطلبات',
    data: {
      system: '7Days OS Core API Engine',
      status: 'healthy',
      timestamp: new Date().toISOString()
    }
  };
  res.status(200).json(response);
});

export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[7Days OS Engine] Server running on port ${PORT}`);
  });
}
