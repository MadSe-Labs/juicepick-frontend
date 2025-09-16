'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useThemeStore, type Theme } from '@/stores/useThemeStore';

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  // 다음 테마로 순환하는 함수
  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // 현재 테마에 따른 아이콘 반환
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className='h-5 w-5' />;
      case 'dark':
        return <Moon className='h-5 w-5' />;
      case 'system':
        return <Monitor className='h-5 w-5' />;
      default:
        return <Sun className='h-5 w-5' />;
    }
  };

  // 현재 테마에 따른 라벨 반환
  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return '라이트 모드';
      case 'dark':
        return '다크 모드';
      case 'system':
        return '시스템 설정';
      default:
        return '라이트 모드';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className='
        flex items-center justify-center
        w-10 h-10
        rounded-lg
        bg-background
        border border-border
        hover:bg-accent
        hover:text-accent-foreground
        transition-colors
        duration-200
      '
      title={`현재: ${getThemeLabel()} (클릭하여 변경)`}
      aria-label={`테마 변경 - 현재: ${getThemeLabel()}`}
    >
      {getThemeIcon()}
    </button>
  );
}
