'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, setResolvedTheme, setTheme } = useThemeStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 클라이언트에서만 실행되도록 설정
    setIsClient(true);
  }, []);

  useEffect(() => {
    // 클라이언트에서만 테마 로직 실행
    if (!isClient) return;

    // 시스템 테마 변경 감지를 위한 MediaQueryList
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 시스템 테마 변경 이벤트 핸들러
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(newSystemTheme);
    };

    // 초기 테마 설정 (페이지 로드 시)
    const initializeTheme = () => {
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';

      if (theme === 'system') {
        setResolvedTheme(systemTheme);
      } else {
        // 직접 선택한 테마가 있다면 그것을 적용
        setTheme(theme);
      }
    };

    // 초기화 실행
    initializeTheme();

    // 시스템 테마 변경 이벤트 리스너 등록
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // 클린업: 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [isClient, theme, setResolvedTheme, setTheme]);

  return <>{children}</>;
}
