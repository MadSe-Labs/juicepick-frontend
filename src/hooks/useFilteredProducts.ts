import { useMemo } from 'react';

/**
 * 제품 필터링 옵션 타입
 */
interface ProductFilterOptions {
  searchQuery?: string;
  brands?: string[];
  flavors?: string[];
  nicotine?: string[];
  sortBy?: 'latest' | 'popular' | 'price-low' | 'price-high' | 'rating';
}

/**
 * 제품 타입 (간단한 정의, 실제 타입은 types/product.ts 참조)
 */
interface Product {
  id: string;
  name?: string | null;
  brand?: string | null;
  flavor?: string | null;
  nicotine?: string | null;
  price?: number | null;
  created_at?: string | null;
  view_count?: number | null;
  rating?: number | null;
  [key: string]: any;
}

/**
 * 제품 필터링을 위한 Custom Hook
 * 
 * @param products - 필터링할 제품 배열
 * @param filters - 필터링 옵션
 * @returns 필터링되고 정렬된 제품 배열
 * 
 * @example
 * const filteredProducts = useFilteredProducts(allProducts, {
 *   searchQuery: 'mint',
 *   brands: ['Brand A', 'Brand B'],
 *   sortBy: 'latest'
 * });
 */
export function useFilteredProducts(
  products: Product[],
  filters: ProductFilterOptions
): Product[] {
  return useMemo(() => {
    if (!products || products.length === 0) return [];

    // 1. 필터링
    let filtered = products.filter((product) => {
      // 검색어 필터
      if (filters.searchQuery && filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          product.name?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // 브랜드 필터
      if (filters.brands && filters.brands.length > 0) {
        if (!filters.brands.includes(product.brand || '')) {
          return false;
        }
      }

      // 맛 필터
      if (filters.flavors && filters.flavors.length > 0) {
        const matchesFlavor = filters.flavors.some((flavor) =>
          product.flavor?.toLowerCase().includes(flavor.toLowerCase())
        );
        if (!matchesFlavor) return false;
      }

      // 니코틴 필터
      if (filters.nicotine && filters.nicotine.length > 0) {
        if (!filters.nicotine.includes(product.nicotine || '')) {
          return false;
        }
      }

      return true;
    });

    // 2. 정렬
    if (filters.sortBy) {
      filtered = [...filtered]; // 원본 배열을 수정하지 않기 위해 복사

      switch (filters.sortBy) {
        case 'latest':
          filtered.sort(
            (a, b) =>
              new Date(b.created_at || '').getTime() -
              new Date(a.created_at || '').getTime()
          );
          break;
        case 'popular':
          filtered.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
          break;
        case 'price-low':
          filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price-high':
          filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'rating':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
      }
    }

    return filtered;
  }, [
    products,
    filters.searchQuery,
    filters.brands,
    filters.flavors,
    filters.nicotine,
    filters.sortBy,
  ]);
}

/**
 * 페이지네이션을 위한 Custom Hook
 * 
 * @param items - 페이지네이션할 아이템 배열
 * @param itemsPerPage - 페이지당 아이템 수
 * @returns 현재 페이지의 아이템과 페이지네이션 정보
 * 
 * @example
 * const paginatedData = usePaginatedData(filteredProducts, displayCount);
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
