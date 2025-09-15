import { ChevronDown, Loader2 } from 'lucide-react';

interface LoadMoreButtonProps {
  hasMoreItems: boolean;
  isLoadingMore: boolean;
  remainingCount: number;
  totalItems: number;
  onLoadMore: () => void;
  className?: string;
}

const LoadMoreButton = ({
  hasMoreItems,
  isLoadingMore,
  remainingCount,
  totalItems,
  onLoadMore,
  className = '',
}: LoadMoreButtonProps) => {
  return (
    <div className={`mt-8 text-center ${className}`}>
      {hasMoreItems ? (
        <button
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className='inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
                     text-white rounded-full hover:shadow-lg transform hover:scale-105 
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     disabled:transform-none font-medium cursor-pointer'
        >
          {isLoadingMore ? (
            <>
              <Loader2 className='animate-spin h-4 w-4 mr-2' />
              로딩 중...
            </>
          ) : (
            <>
              더 보기 ({remainingCount}개 남음)
              <ChevronDown className='ml-2 h-4 w-4' />
            </>
          )}
        </button>
      ) : (
        <div className='py-4'>
          <p className='text-gray-500 mb-2'>🎉 모든 상품을 확인했습니다!</p>
          <p className='text-sm text-gray-400'>
            총 {totalItems}개의 상품을 둘러보셨어요
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadMoreButton;
