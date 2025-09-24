'use client';

import { useState, useCallback } from 'react';
import {
  Search,
  Filter,
  TrendingUp,
  Crown,
  Flame,
  Users,
  ThumbsUp,
  Loader2,
} from 'lucide-react';
import ProductCard from '@/components/product-card';
import PriceFilter from '@/components/price-filter';
import SidebarAd from '@/components/sidebar-ad';
import PriceTrendChart from '@/components/price-trend-chart';
import LoadMoreButton from '@/components/load-more-button';
import { useProducts, usePopularProducts } from '@/hooks/useProducts';
import {
  useFilteredProducts,
  usePaginatedData,
} from '@/hooks/useFilteredProducts';
import { useCartStore } from '@/stores/useCartStore';

export default function PopularPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(20); // 인기 제품은 더 많이 표시
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortOrder, setSortOrder] = useState('popular'); // 기본 인기순

  // 필터 상태
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedNicotine, setSelectedNicotine] = useState<string[]>([]);

  const { addItem } = useCartStore();

  // Supabase에서 데이터 가져오기
  const { data: allProducts = [], isLoading: productsLoading } = useProducts();
  const { data: popularProducts = [], isLoading: popularLoading } =
    usePopularProducts(100); // 더 많은 인기 제품

  // 필터 핸들러들 - useCallback으로 최적화
  const handleBrandChange = useCallback((brand: string, checked: boolean) => {
    setSelectedBrands((prev) =>
      checked ? [...prev, brand] : prev.filter((b) => b !== brand)
    );
  }, []);

  const handleFlavorChange = useCallback((flavor: string, checked: boolean) => {
    setSelectedFlavors((prev) =>
      checked ? [...prev, flavor] : prev.filter((f) => f !== flavor)
    );
  }, []);

  const handleNicotineChange = useCallback(
    (nicotine: string, checked: boolean) => {
      setSelectedNicotine((prev) =>
        checked ? [...prev, nicotine] : prev.filter((n) => n !== nicotine)
      );
    },
    []
  );

  // 검색 실행 - useCallback으로 최적화
  const executeSearch = useCallback(() => {
    setActualSearchQuery(searchQuery);
    setDisplayCount(20); // 검색 시 페이지네이션 초기화
  }, [searchQuery]);

  // 기본 데이터 설정 (검색 중이면 전체 제품, 아니면 인기 제품)
  const baseProducts = actualSearchQuery ? allProducts : popularProducts;

  // ✅ Custom Hook을 사용한 선언형 필터링 (검색어는 이미 baseProducts에서 처리됨)
  const filteredProducts = useFilteredProducts(baseProducts ?? [], {
    searchQuery: actualSearchQuery,
    brands: selectedBrands,
    flavors: selectedFlavors,
    nicotine: selectedNicotine,
    sortBy: sortOrder as
      | 'popular'
      | 'latest'
      | 'price-low'
      | 'price-high'
      | 'rating',
  });

  // ✅ Custom Hook을 사용한 페이지네이션
  const {
    items: displayedProducts,
    totalItems,
    hasMore,
    remainingCount,
  } = usePaginatedData(filteredProducts, displayCount);

  // 검색/필터링 활성 상태 체크
  const isSearching = actualSearchQuery.length > 0;
  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedFlavors.length > 0 ||
    selectedNicotine.length > 0;

  const handleLoadMore = useCallback(async () => {
    setIsLoadingMore(true);
    // 로딩 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDisplayCount((prev) => prev + 12);
    setIsLoadingMore(false);
  }, []);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Left Sidebar - Filters */}
        <div className='w-full lg:w-64 space-y-6'>
          <SidebarAd position='left' />

          <div className='bg-card p-4 rounded-lg shadow'>
            <h3 className='font-bold text-lg mb-3'>필터</h3>

            <div className='space-y-4'>
              <div>
                <h4 className='font-medium text-sm text-foreground mb-2'>
                  브랜드
                </h4>
                <div className='space-y-1'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedBrands.includes('나스티')}
                      onChange={(e) =>
                        handleBrandChange('나스티', e.target.checked)
                      }
                      className='rounded text-green-500 mr-2'
                    />
                    <span>나스티</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedBrands.includes('코스모스')}
                      onChange={(e) =>
                        handleBrandChange('코스모스', e.target.checked)
                      }
                      className='rounded text-green-500 mr-2'
                    />
                    <span>코스모스</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedBrands.includes('맥스웰')}
                      onChange={(e) =>
                        handleBrandChange('맥스웰', e.target.checked)
                      }
                      className='rounded text-green-500 mr-2'
                    />
                    <span>맥스웰</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedBrands.includes('더원')}
                      onChange={(e) =>
                        handleBrandChange('더원', e.target.checked)
                      }
                      className='rounded text-green-500 mr-2'
                    />
                    <span>더원</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className='font-medium text-sm text-foreground mb-2'>맛</h4>
                <div className='space-y-1'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedFlavors.includes('과일')}
                      onChange={(e) =>
                        handleFlavorChange('과일', e.target.checked)
                      }
                      className='rounded text-green-500 mr-2'
                    />
                    <span>과일</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedFlavors.includes('멘솔')}
                      onChange={(e) =>
                        handleFlavorChange('멘솔', e.target.checked)
                      }
                      className='rounded text-green-500 mr-2'
                    />
                    <span>멘솔</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedFlavors.includes('디저트')}
                      onChange={(e) =>
                        handleFlavorChange('디저트', e.target.checked)
                      }
                      className='rounded text-green-500 mr-2'
                    />
                    <span>디저트</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedFlavors.includes('음료')}
                      onChange={(e) =>
                        handleFlavorChange('음료', e.target.checked)
                      }
                      className='rounded text-green-500 mr-2'
                    />
                    <span>음료</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className='font-medium text-sm text-foreground mb-2'>
                  니코틴
                </h4>
                <div className='space-y-1'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedNicotine.includes('0mg')}
                      onChange={(e) =>
                        handleNicotineChange('0mg', e.target.checked)
                      }
                      className='rounded text-green-500 mr-2'
                    />
                    <span>0mg</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedNicotine.includes('3mg')}
                      onChange={(e) =>
                        handleNicotineChange('3mg', e.target.checked)
                      }
                      className='rounded text-green-500 mr-2'
                    />
                    <span>3mg</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedNicotine.includes('6mg')}
                      onChange={(e) =>
                        handleNicotineChange('6mg', e.target.checked)
                      }
                      className='rounded text-green-500 mr-2'
                    />
                    <span>6mg</span>
                  </label>
                </div>
              </div>

              <PriceFilter />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1'>
          {/* 페이지 헤더 */}
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl'>
                <Flame className='h-6 w-6 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent'>
                  인기 제품
                </h1>
                <p className='text-muted-foreground'>
                  가장 많은 사용자들이 선택한 베스트 셀러 제품들
                </p>
              </div>
            </div>

            {/* 인기 통계 카드 */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
              <div className='bg-card p-4 rounded-lg shadow border'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
                    <Crown className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold'>
                      {popularProducts?.length || 0}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      인기 제품
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-card p-4 rounded-lg shadow border'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <Users className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold'>10K+</div>
                    <div className='text-sm text-muted-foreground'>
                      만족한 고객
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-card p-4 rounded-lg shadow border'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                    <ThumbsUp className='h-5 w-5 text-green-600' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold'>4.8</div>
                    <div className='text-sm text-muted-foreground'>
                      평균 평점
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Sort */}
          <div className='bg-card p-4 rounded-lg shadow mb-6'>
            <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
              <div className='flex items-center space-x-2 flex-1'>
                <div className='relative flex-1'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
                  <input
                    type='text'
                    placeholder='인기 제품에서 검색하세요'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        executeSearch();
                      }
                    }}
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  />
                </div>
                <button
                  onClick={executeSearch}
                  className='px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors'
                >
                  검색
                </button>
              </div>

              <div className='flex items-center space-x-2'>
                <Filter className='w-4 h-4 text-muted-foreground' />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className='px-3 py-2 border border-gray-300 rounded-lg'
                >
                  <option value='popular'>인기순</option>
                  <option value='latest'>최신순</option>
                  <option value='price-low'>낮은 가격순</option>
                  <option value='price-high'>높은 가격순</option>
                  <option value='rating'>평점순</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div>
            {/* 검색/필터 결과 헤더 */}
            {(isSearching || hasActiveFilters) && (
              <div className='bg-card p-4 rounded-lg shadow mb-6'>
                <h3 className='font-bold text-lg flex items-center gap-2'>
                  <Search className='h-6 w-6 text-orange-500' />
                  {isSearching
                    ? `"${actualSearchQuery}" 검색 결과`
                    : '필터링된 인기 제품'}
                  <span className='text-sm font-normal text-muted-foreground'>
                    ({totalItems}개)
                  </span>
                </h3>
              </div>
            )}

            {/* 로딩 상태 */}
            {productsLoading || popularLoading ? (
              <div className='flex justify-center items-center py-12'>
                <Loader2 className='h-8 w-8 animate-spin text-orange-500' />
                <span className='ml-2 text-muted-foreground'>
                  인기 제품을 불러오는 중...
                </span>
              </div>
            ) : displayedProducts.length > 0 ? (
              <>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {displayedProducts.map((product: any, index: number) => (
                    <div key={product.id} className='relative'>
                      {/* 인기 순위 배지 (검색 중이 아닐 때만) */}
                      {!isSearching && !hasActiveFilters && index < 3 && (
                        <div
                          className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold z-10 ${
                            index === 0
                              ? 'bg-yellow-500'
                              : index === 1
                              ? 'bg-gray-400'
                              : 'bg-orange-500'
                          }`}
                        >
                          {index + 1}
                        </div>
                      )}
                      <ProductCard
                        product={product}
                        onAddToCart={() => addItem(product)}
                      />
                    </div>
                  ))}
                </div>

                {/* 더보기 버튼 */}
                {hasMore && (
                  <LoadMoreButton
                    hasMoreItems={hasMore}
                    isLoadingMore={isLoadingMore}
                    remainingCount={remainingCount}
                    totalItems={totalItems}
                    onLoadMore={handleLoadMore}
                  />
                )}
              </>
            ) : (
              <div className='bg-card p-12 rounded-lg shadow text-center'>
                <Flame className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
                <div className='text-muted-foreground text-lg mb-2'>
                  {isSearching
                    ? '검색 결과가 없습니다'
                    : hasActiveFilters
                    ? '필터 조건에 맞는 인기 제품이 없습니다'
                    : '인기 제품이 없습니다'}
                </div>
                <div className='text-muted-foreground text-sm'>
                  {isSearching || hasActiveFilters
                    ? '다른 검색어나 필터 조건을 시도해보세요'
                    : '곧 새로운 인기 제품을 준비하겠습니다'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Popular Rankings & Trends */}
        <div className='w-full lg:w-64 space-y-6'>
          <SidebarAd position='right' />

          {/* 인기 순위 차트 */}
          <div className='bg-card p-4 rounded-lg shadow'>
            <h3 className='font-bold text-lg mb-3 flex items-center gap-2'>
              <TrendingUp className='h-5 w-5 text-orange-500' />
              인기 순위
            </h3>
            <div className='space-y-3'>
              {popularProducts
                ?.slice(0, 5)
                .map((product: any, index: number) => (
                  <div key={product.id} className='flex items-center space-x-3'>
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0
                          ? 'bg-yellow-500'
                          : index === 1
                          ? 'bg-gray-400'
                          : index === 2
                          ? 'bg-orange-500'
                          : 'bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-foreground truncate'>
                        {product.name}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        ⭐ {product.rating || 4.5} ({product.review_count || 0}
                        개 리뷰)
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 가격 추이 */}
          <div className='bg-card p-4 rounded-lg shadow'>
            <h3 className='font-bold text-lg mb-3'>인기 제품 가격 추이</h3>
            <PriceTrendChart />
            <p className='text-xs text-muted-foreground mt-2'>
              최근 30일 TOP 10 제품 평균 가격
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
