import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 테마 타입 정의
export type Theme = 'light' | 'dark' | 'system';

// 스토어 인터페이스 정의
interface ThemeStore {
  // 현재 선택된 테마 모드 ('light', 'dark', 'system')
  theme: Theme;

  // 실제로 적용되는 테마 (system일 경우 실제 light/dark로 결정됨)
  resolvedTheme: 'light' | 'dark';

  // 다크모드 여부를 쉽게 확인할 수 있는 computed 값
  isDark: boolean;

  // 테마 변경 함수
  setTheme: (theme: Theme) => void;

  // 시스템 테마 변경을 감지했을 때 호출할 함수
  setResolvedTheme: (resolvedTheme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeStore>()(
  // persist 미들웨어로 localStorage에 테마 설정 저장
  persist(
    (set, get) => ({
      // 초기값들
      theme: 'system', // 기본값은 시스템 테마 따르기
      resolvedTheme: 'light', // 기본값은 라이트 모드
      isDark: false,

      // 테마 설정 함수
      setTheme: (theme: Theme) => {
        set({ theme });

        // 브라우저 환경에서만 실행 (SSR 안전성)
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;

          if (theme === 'system') {
            // 시스템 테마일 경우 실제 시스템 설정 확인
            const systemTheme = window.matchMedia(
              '(prefers-color-scheme: dark)'
            ).matches
              ? 'dark'
              : 'light';

            // DOM에 클래스 적용
            root.classList.toggle('dark', systemTheme === 'dark');

            // 스토어 상태 업데이트
            set({
              resolvedTheme: systemTheme,
              isDark: systemTheme === 'dark',
            });
          } else {
            // 직접 선택한 테마일 경우
            root.classList.toggle('dark', theme === 'dark');

            set({
              resolvedTheme: theme,
              isDark: theme === 'dark',
            });
          }
        }
      },

      // 시스템 테마 변경 감지 시 호출되는 함수
      setResolvedTheme: (resolvedTheme: 'light' | 'dark') => {
        const currentTheme = get().theme;

        // 'system' 모드일 때만 시스템 테마 변경에 반응
        if (currentTheme === 'system' && typeof window !== 'undefined') {
          const root = window.document.documentElement;
          root.classList.toggle('dark', resolvedTheme === 'dark');

          set({
            resolvedTheme,
            isDark: resolvedTheme === 'dark',
          });
        }
      },
    }),
    {
      name: 'theme-storage', // localStorage 키 이름

      // localStorage에 저장할 데이터만 선택 (theme만 저장)
      partialize: (state) => ({ theme: state.theme }),

      // 저장된 데이터를 불러올 때 호출되는 함수
      onRehydrateStorage: () => (state) => {
        // 새로고침 시 저장된 테마 설정 복원
        if (state && typeof window !== 'undefined') {
          // Hydration이 완료된 후 실행하도록 지연
          const applyTheme = () => {
            const systemTheme = window.matchMedia(
              '(prefers-color-scheme: dark)'
            ).matches
              ? 'dark'
              : 'light';

            let resolvedTheme: 'light' | 'dark';

            if (state.theme === 'system') {
              resolvedTheme = systemTheme;
            } else {
              resolvedTheme = state.theme as 'light' | 'dark';
            }

            // DOM에 즉시 클래스 적용 (플리커링 방지)
            const root = window.document.documentElement;
            root.classList.toggle('dark', resolvedTheme === 'dark');

            // 스토어 상태 업데이트
            state.resolvedTheme = resolvedTheme;
            state.isDark = resolvedTheme === 'dark';
          };

          // document가 완전히 로드된 후 실행
          if (document.readyState === 'complete') {
            applyTheme();
          } else {
            window.addEventListener('load', applyTheme, { once: true });
          }
        }
      },
    }
  )
);
