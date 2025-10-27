'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

/**
 * 찜하기 버튼 컴포넌트
 * - 로그인 필요
 * - 클릭 시 토글 (추가/제거)
 * - 애니메이션 효과
 */
export default function WishlistButton({
  productId,
  size = 'md',
  showText = false,
  className,
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isAdding, isRemoving } = useWishlist();
  const isWished = isInWishlist(productId);
  const isLoading = isAdding || isRemoving;

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      disabled={isLoading}
      className={cn(
        'group relative flex items-center gap-2 rounded-full transition-all duration-200',
        'hover:scale-110 active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        isWished
          ? 'bg-red-50 dark:bg-red-950/30 text-red-500'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
        className
      )}
      title={isWished ? '찜 취소' : '찜하기'}
    >
      {/* 하트 아이콘 */}
      <Heart
        size={iconSizes[size]}
        className={cn(
          'transition-all duration-200',
          isWished && 'fill-current',
          isLoading && 'animate-pulse'
        )}
      />

      {/* 텍스트 (옵션) */}
      {showText && (
        <span className='text-sm font-medium'>
          {isWished ? '찜 취소' : '찜하기'}
        </span>
      )}

      {/* 클릭 효과 */}
      {isWished && (
        <span className='absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20' />
      )}
    </button>
  );
}
