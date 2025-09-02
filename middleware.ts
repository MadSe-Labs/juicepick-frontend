import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith('/login') ||
      req.nextUrl.pathname.startsWith('/signup');

    console.log('req', req);
    console.log('isAuth', isAuth);
    console.log('isAuthPage', isAuthPage);

    // 로그인하지 않은 사용자가 보호된 페이지에 접근하려는 경우
    if (!isAuth && !isAuthPage) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // 이미 로그인한 사용자가 로그인/회원가입 페이지에 접근하려는 경우
    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL('/main', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log('callbacks req', req);
        console.log('callbacks isAuth', token);
        const isAuthPage =
          req.nextUrl.pathname.startsWith('/login') ||
          req.nextUrl.pathname.startsWith('/signup');

        // 인증이 필요한 페이지들
        const protectedPaths = ['/profile', '/my-orders', '/cart'];
        const isProtectedPage = protectedPaths.some((path) =>
          req.nextUrl.pathname.startsWith(path)
        );

        // 보호된 페이지가 아니거나, 인증 페이지이거나, 토큰이 있으면 허용
        if (!isProtectedPage || isAuthPage || !!token) {
          return true;
        }

        // 그 외의 경우 차단
        return false;
      },
    },
  }
);

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    // 보호할 페이지들
    '/profile/:path*',
    '/my-orders/:path*',
    '/cart/:path*',
    // 인증 페이지들 (로그인한 사용자 리다이렉트용)
    '/login/:path*',
    '/signup/:path*',
  ],
};
