import { useState, useEffect } from 'react';

interface UsePaginationProps {
  items: any[];
  itemsPerPage?: number;
  dependencies?: any[];
}

interface UsePaginationReturn {
  // 표시 상태
  currentPage: number;
  displayedItems: any[];
  totalItems: number;
  currentDisplayedCount: number;
  remainingCount: number;
  hasMoreItems: boolean;

  // 로딩 상태
  isLoadingMore: boolean;

  // 액션
  handleLoadMore: () => Promise<void>;
  resetPagination: () => void;
}

export const usePagination = ({
  items,
  itemsPerPage = 6,
  dependencies = [],
}: UsePaginationProps): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 페이지네이션 계산
  const totalItems = items.length;
  const currentDisplayedCount = currentPage * itemsPerPage;
  const displayedItems = items.slice(0, currentDisplayedCount);
  const remainingCount = totalItems - currentDisplayedCount;
  const hasMoreItems = remainingCount > 0;

  // 더보기 버튼 핸들러
  const handleLoadMore = async () => {
    setIsLoadingMore(true);

    // 로딩 애니메이션을 위한 의도적 지연
    await new Promise((resolve) => setTimeout(resolve, 500));

    setCurrentPage((prev) => prev + 1);
    setIsLoadingMore(false);
  };

  // 페이지 리셋 함수
  const resetPagination = () => {
    setCurrentPage(1);
  };

  // 의존성 배열이 변경될 때 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, dependencies);

  return {
    // 표시 상태
    currentPage,
    displayedItems,
    totalItems,
    currentDisplayedCount,
    remainingCount,
    hasMoreItems,

    // 로딩 상태
    isLoadingMore,

    // 액션
    handleLoadMore,
    resetPagination,
  };
};
