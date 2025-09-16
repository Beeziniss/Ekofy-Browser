import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const subdomain = host.split('.')[0];
  
  // Check if it's actually a subdomain (not localhost or the main domain)
  const isSubdomain = host.includes('.') && subdomain !== 'localhost' && subdomain !== host;

  if (isSubdomain) {
    if (subdomain === 'admin') {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }

    if (subdomain === 'moderator') {
      url.pathname = `/moderator${url.pathname}`;
      return NextResponse.rewrite(url);
    }

    if (subdomain === 'artist') {
      url.pathname = `/artist${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    
    // Subdomain không hợp lệ → chuyển đến trang 404
    url.pathname = '/404';
    return NextResponse.rewrite(url);
  }
  
  // Không có subdomain (domain chính) → để Next.js xử lý bình thường
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * - static files (/_next/, /favicon.ico etc.)
     */
    '/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
