import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProductStore } from '@/stores/useProductStore';

export const useProductSearch = () => {
  const { products, searchProducts } = useProductStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(products);

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

  // 검색 적용
  useEffect(() => {
    let result = products;

    if (actualSearchQuery.trim()) {
      result = searchProducts(actualSearchQuery);
    }

    setSearchResults(result);
  }, [actualSearchQuery, products, searchProducts]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    executeSearch,
    isSearching: actualSearchQuery.trim() !== '',
  };
};
