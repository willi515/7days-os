import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (manifest.json, sw.js, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // فحص النطاقات الفرعية (e.g. alamal.7daysos.com أو tenant1.localhost:3000)
  const currentHost = hostname.replace(/:\d+$/, ''); // إزالة رقم المنفذ
  const parts = currentHost.split('.');

  let subdomain: string | null = null;

  // إذا كان على نطاق رئيسي 7daysos.com أو localhost مع subdomain
  if (parts.length > 2 && !currentHost.startsWith('www')) {
    subdomain = parts[0];
  } else if (parts.length === 2 && parts[1] === 'localhost') {
    subdomain = parts[0];
  }

  // إضافة subdomain إلى headers لتمكين الصفحات ومكونات السيرفر من قراءته فورياً
  const requestHeaders = new Headers(request.headers);
  if (subdomain) {
    requestHeaders.set('x-tenant-subdomain', subdomain);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
