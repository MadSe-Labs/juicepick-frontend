import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const useProductSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');

  // URL 파라미터에서 검색어 추출
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      setActualSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  // 검색 실행 함수
  const executeSearch = () => {
    setActualSearchQuery(searchQuery);
    if (searchQuery.trim()) {
      router.push(
        `${window.location.pathname}?search=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );
    } else {
      router.push(window.location.pathname);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    executeSearch,
    isSearching: actualSearchQuery.trim() !== '',
    actualSearchQuery,
  };
};
