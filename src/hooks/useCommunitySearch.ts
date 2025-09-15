import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { CommunityPost, CommunitySearchFilters } from '@/types/community';

export const useCommunitySearch = (posts: CommunityPost[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(posts);

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
    let result = posts;

    if (actualSearchQuery.trim()) {
      const lowercaseQuery = actualSearchQuery.toLowerCase();
      result = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(lowercaseQuery) ||
          post.content.toLowerCase().includes(lowercaseQuery) ||
          post.author.toLowerCase().includes(lowercaseQuery) ||
          post.category.toLowerCase().includes(lowercaseQuery)
      );
    }

    setSearchResults(result);
  }, [actualSearchQuery, posts]);

  // 필터링 함수
  const applyFilters = (filters: CommunitySearchFilters) => {
    let result = searchResults;

    if (filters.category && filters.category !== '전체') {
      result = result.filter((post) => post.category === filters.category);
    }

    if (filters.isHot) {
      result = result.filter((post) => post.isHot);
    }

    if (filters.isPinned) {
      result = result.filter((post) => post.isPinned);
    }

    // 정렬
    switch (filters.sortBy) {
      case 'popular':
        result = result.sort((a, b) => b.likes - a.likes);
        break;
      case 'views':
        result = result.sort((a, b) => b.views - a.views);
        break;
      case 'comments':
        result = result.sort((a, b) => b.comments - a.comments);
        break;
      case 'latest':
      default:
        // 최신순은 이미 기본 정렬이므로 별도 처리 불필요
        break;
    }

    return result;
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    executeSearch,
    applyFilters,
    isSearching: actualSearchQuery.trim() !== '',
    actualSearchQuery, // 실제 검색된 쿼리 추가
  };
};
