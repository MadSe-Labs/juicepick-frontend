import { useMemo } from 'react';

/**
 * 커뮤니티 게시글 필터링 옵션 타입
 */
interface PostFilterOptions {
  searchQuery?: string;
  category?: string;
  sortBy?: 'latest' | 'popular' | 'oldest';
}

/**
 * 커뮤니티 게시글 타입
 */
interface CommunityPost {
  id: string;
  title?: string | null;
  content?: string | null;
  author?: string | null;
  category?: string | null;
  created_at?: string | null;
  view_count?: number | null;
  like_count?: number | null;
  comment_count?: number | null;
  is_pinned?: boolean | null;
  [key: string]: any;
}

/**
 * 커뮤니티 게시글 필터링을 위한 Custom Hook
 * 
 * @param posts - 필터링할 게시글 배열
 * @param filters - 필터링 옵션
 * @returns 필터링되고 정렬된 게시글 배열
 * 
 * @example
 * const filteredPosts = useFilteredPosts(allPosts, {
 *   searchQuery: 'vape',
 *   category: '정보',
 *   sortBy: 'latest'
 * });
 */
export function useFilteredPosts(
  posts: CommunityPost[],
  filters: PostFilterOptions
): CommunityPost[] {
  return useMemo(() => {
    if (!posts || posts.length === 0) return [];

    // 1. 필터링
    let filtered = posts.filter((post) => {
      // 검색어 필터
      if (filters.searchQuery && filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          post.title?.toLowerCase().includes(query) ||
          post.content?.toLowerCase().includes(query) ||
          post.author?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // 카테고리 필터 (전체가 아닐 때만)
      if (filters.category && filters.category !== '전체') {
        if (post.category !== filters.category) {
          return false;
        }
      }

      return true;
    });

    // 2. 정렬 (고정된 게시글은 항상 최상단)
    filtered = [...filtered]; // 원본 배열을 수정하지 않기 위해 복사

    // 고정 게시글과 일반 게시글 분리
    const pinnedPosts = filtered.filter((post) => post.is_pinned);
    const normalPosts = filtered.filter((post) => !post.is_pinned);

    // 일반 게시글 정렬
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'latest':
          normalPosts.sort(
            (a, b) =>
              new Date(b.created_at || '').getTime() -
              new Date(a.created_at || '').getTime()
          );
          break;
        case 'popular':
          normalPosts.sort(
            (a, b) =>
              (b.like_count || 0) + (b.comment_count || 0) * 2 -
              ((a.like_count || 0) + (a.comment_count || 0) * 2)
          );
          break;
        case 'oldest':
          normalPosts.sort(
            (a, b) =>
              new Date(a.created_at || '').getTime() -
              new Date(b.created_at || '').getTime()
          );
          break;
      }
    }

    // 고정 게시글을 최상단에 배치
    return [...pinnedPosts, ...normalPosts];
  }, [posts, filters.searchQuery, filters.category, filters.sortBy]);
}

/**
 * 페이지네이션을 위한 Custom Hook (제품용과 동일)
 * useFilteredProducts.ts에서 export한 것과 동일하므로 재사용 가능
 * 
 * @param items - 페이지네이션할 아이템 배열
 * @param itemsPerPage - 페이지당 아이템 수
 * @returns 현재 페이지의 아이템과 페이지네이션 정보
 */
export function usePaginatedData<T>(items: T[], itemsPerPage: number) {
  return useMemo(() => {
    const paginatedItems = items.slice(0, itemsPerPage);
    const totalItems = items.length;
    const hasMore = itemsPerPage < totalItems;
    const remainingCount = totalItems - itemsPerPage;

    return {
      items: paginatedItems,
      totalItems,
      hasMore,
      remainingCount: remainingCount > 0 ? remainingCount : 0,
    };
  }, [items, itemsPerPage]);
}
