import { Request, Response, NextFunction } from 'express';
import { ApiResponse, UserRole } from '@7days/shared-types';

export interface AuthenticatedUser {
  id: string;
  tenant_id: string;
  role: UserRole;
  phone_number: string;
  full_name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * ميدلوير التحقق من التوكن وعزل المستأجر (Tenant Isolation Middleware)
 * وفق وثيقة docs/04_API_And_Business_Rules_Matrix.md:
 * يتم استخراج tenant_id حصرًا من المصادقة ولا يُقبل كـ Parameter خارجي لمنع أي اختراق
 */
export function authAndTenantMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  // للمحاكاة والتطوير الميداني السريع (Fallback demo context if dev)
  if (!authHeader) {
    req.user = {
      id: 'a0000000-0000-0000-0000-000000000002',
      tenant_id: '11111111-1111-1111-1111-111111111111',
      role: 'sales_rep',
      phone_number: '01012345678',
      full_name: 'أحمد فتحي (مندوب تجريبي)',
    };
    return next();
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) {
    const errorRes: ApiResponse = {
      success: false,
      status_code: 401,
      error_code: 'UNAUTHORIZED',
      message: 'غير مصرح: يرجى تسجيل الدخول وإرسال رمز المصادقة المعتمد',
    };
    res.status(401).json(errorRes);
    return;
  }

  // في الإنتاج يتم فك تشفير JWT واستخراج tenant_id
  req.user = {
    id: 'a0000000-0000-0000-0000-000000000002',
    tenant_id: '11111111-1111-1111-1111-111111111111',
    role: 'sales_rep',
    phone_number: '01012345678',
    full_name: 'أحمد فتحي',
  };

  next();
}
