import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Review, ReviewFilters } from '@/types/review';

export const useReviewSearch = (reviews: Review[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(reviews);

  // 필터 상태
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

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

  // 태그 필터 핸들러
  const handleTagChange = (tag: string, checked: boolean) => {
    if (tag === '전체') {
      setSelectedTags([]);
      return;
    }

    if (checked) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    }
  };

  // 평점 필터 핸들러
  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setSelectedRatings([...selectedRatings, rating]);
    } else {
      setSelectedRatings(selectedRatings.filter((r) => r !== rating));
    }
  };

  // 검증된 리뷰만 보기 토글
  const toggleVerifiedOnly = () => {
    setShowVerifiedOnly(!showVerifiedOnly);
  };

  // 필터 초기화
  const resetFilters = () => {
    setSelectedRatings([]);
    setSelectedTags([]);
    setShowVerifiedOnly(false);
  };

  // 검색 및 필터 적용
  useEffect(() => {
    let result = reviews;

    // 검색 적용
    if (actualSearchQuery.trim()) {
      const lowercaseQuery = actualSearchQuery.toLowerCase();
      result = result.filter(
        (review) =>
          review.title.toLowerCase().includes(lowercaseQuery) ||
          review.content.toLowerCase().includes(lowercaseQuery) ||
          review.productName.toLowerCase().includes(lowercaseQuery) ||
          review.author.toLowerCase().includes(lowercaseQuery) ||
          review.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
      );
    }

    // 태그 필터 적용
    if (selectedTags.length > 0) {
      result = result.filter((review) =>
        selectedTags.some((tag) =>
          review.tags.some((reviewTag) =>
            reviewTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    // 평점 필터 적용
    if (selectedRatings.length > 0) {
      result = result.filter((review) =>
        selectedRatings.some((rating) => review.rating >= rating)
      );
    }

    // 검증된 리뷰만 보기 필터
    if (showVerifiedOnly) {
      result = result.filter((review) => review.verified);
    }

    setSearchResults(result);
  }, [
    actualSearchQuery,
    reviews,
    selectedTags,
    selectedRatings,
    showVerifiedOnly,
  ]);

  // 정렬 함수
  const applySorting = (sortBy: ReviewFilters['sortBy']) => {
    let sorted = [...searchResults];

    switch (sortBy) {
      case 'helpful':
        sorted = sorted.sort((a, b) => b.helpful - a.helpful);
        break;
      case 'rating':
        sorted = sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'latest':
        sorted = sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case 'oldest':
        sorted = sorted.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      default:
        break;
    }

    return sorted;
  };

  return {
    // 검색 관련
    searchQuery,
    setSearchQuery,
    searchResults,
    executeSearch,
    isSearching: actualSearchQuery.trim() !== '',
    actualSearchQuery,

    // 필터 관련
    selectedRatings,
    selectedTags,
    showVerifiedOnly,
    handleTagChange,
    handleRatingChange,
    toggleVerifiedOnly,
    resetFilters,

    // 정렬
    applySorting,

    // 필터 활성 상태
    hasActiveFilters:
      selectedRatings.length > 0 || selectedTags.length > 0 || showVerifiedOnly,
  };
};
