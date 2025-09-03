import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// ✅ 경로 상수 분리
const AUTH_PAGES = ['/login', '/signup'];
const PROTECTED_PATHS = ['/profile', '/my-orders', '/cart'];
const MAIN_PAGE = '/main';

// 경로 유틸
function isAuthPage(pathname: string) {
  return AUTH_PAGES.some((page) => pathname.startsWith(page));
}

function isProtectedPage(pathname: string) {
  return PROTECTED_PATHS.some((page) => pathname.startsWith(page));
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const { pathname, search } = req.nextUrl;

    // 로그인하지 않은 사용자가 보호된 페이지 접근 → 로그인 페이지로
    if (!isAuth && isProtectedPage(pathname)) {
      let from = pathname + (search || '');
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // 로그인한 사용자가 인증 페이지 접근 → 메인 페이지로 (루프 방지 조건 포함)
    if (isAuth && isAuthPage(pathname) && pathname !== MAIN_PAGE) {
      return NextResponse.redirect(new URL(MAIN_PAGE, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // ✅ 모든 요청 허용 - 미들웨어 함수에서 로직 처리
      authorized: () => true,
    },
  }
);

// ✅ matcher도 상수 재활용 가능 (import/export 구조로 관리 가능)
export const config = {
  matcher: [
    ...PROTECTED_PATHS.map((path) => `${path}/:path*`),
    ...AUTH_PAGES.map((page) => `${page}/:path*`),
  ],
};
