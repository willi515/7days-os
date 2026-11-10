import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || '7days_os_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function queryWithTenant<T = any>(
  tenantId: string,
  sqlText: string,
  params: any[] = []
): Promise<T[]> {
  const client = await pool.connect();
  try {
    // تفعيل عزل الـ RLS على مستوى الـ Session الحالية
    await client.query(`SET LOCAL app.current_tenant_id = $1`, [tenantId]);
    const res = await client.query(sqlText, params);
    return res.rows;
  } finally {
    client.release();
  }
}
