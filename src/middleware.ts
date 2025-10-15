import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// ✅ 경로 상수 분리
const AUTH_PAGES = ['/login', '/signup'];
const PROTECTED_PATHS = ['/profile', '/my-orders']; // ✅ /cart 제거 (비로그인 접근 허용)
const MAIN_PAGE = '/main';

// 경로 유틸
function isAuthPage(pathname: string) {
  return AUTH_PAGES.some((page) => pathname.startsWith(page));
}

function isProtectedPage(pathname: string) {
  return PROTECTED_PATHS.some((page) => pathname.startsWith(page));
}

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Supabase 클라이언트 생성
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            req.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Supabase 세션 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuth = !!user;
  const { pathname, search } = req.nextUrl;

  // 로그인하지 않은 사용자가 보호된 페이지 접근 → 로그인 페이지로
  if (!isAuth && isProtectedPage(pathname)) {
    let from = pathname + (search || '');
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  // 로그인한 사용자가 인증 페이지 접근 → 메인 페이지로
  if (isAuth && isAuthPage(pathname) && pathname !== MAIN_PAGE) {
    return NextResponse.redirect(new URL(MAIN_PAGE, req.url));
  }

  return response;
}

// ✅ matcher도 상수 재활용
export const config = {
  matcher: [
    ...PROTECTED_PATHS.map((path) => `${path}/:path*`),
    ...AUTH_PAGES.map((page) => `${page}/:path*`),
  ],
};
