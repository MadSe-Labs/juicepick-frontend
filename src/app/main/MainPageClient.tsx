'use client';

import { useMemo } from 'react';
import { Search, Filter, Bell, ChevronDown, Loader2 } from 'lucide-react';
import Header from '@/components/header';
import Banner from '@/components/banner';
import ProductCard from '@/components/product-card';
import PriceFilter from '@/components/price-filter';
import SidebarAd from '@/components/sidebar-ad';
import Footer from '@/components/footer';
import PriceTrendChart from '@/components/price-trend-chart';
import LoadMoreButton from '@/components/load-more-button';
import { useCartStore } from '@/stores/useCartStore';
import { useProductSearch } from '@/hooks/useProductSearch';
import { useProductFilter } from '@/hooks/useProductFilter';
import { usePagination } from '@/hooks/usePagination';
import { useProducts, usePopularProducts } from '@/hooks/useProducts';

export default function MainPageClient() {
  const { addItem } = useCartStore();

  // Supabase Cache Helpers 기반 Hook 사용
  const { data: supabaseProducts, isLoading: isProductsLoading } =
    useProducts();
  const { data: supabasePopularProducts } = usePopularProducts();

  // Null safety를 위한 기본값 설정
  const products = supabaseProducts ?? [];
  const popularProductsData = supabasePopularProducts ?? [];

  // 검색/필터링
  const {
    searchQuery,
    setSearchQuery,
    executeSearch,
    isSearching,
    actualSearchQuery,
  } = useProductSearch();

  // 검색 결과
  const searchResults = useMemo(() => {
    if (!actualSearchQuery || products.length === 0) {
      return products;
    }

    return products.filter(
      (product: any) =>
        product.name?.toLowerCase().includes(actualSearchQuery.toLowerCase()) ||
        product.brand
          ?.toLowerCase()
          .includes(actualSearchQuery.toLowerCase()) ||
        product.description
          ?.toLowerCase()
          .includes(actualSearchQuery.toLowerCase())
    );
  }, [actualSearchQuery, products]); // 🔧 FIX: supabaseProducts → products

  const {
    filteredProducts,
    filters: { selectedBrands, selectedFlavors, selectedNicotine },
    handleBrandChange,
    handleFlavorChange,
    handleNicotineChange,
  } = useProductFilter(searchResults as any);

  // 페이지네이션
  const {
    displayedItems: displayedProducts,
    totalItems: totalProducts,
    hasMoreItems: hasMoreProducts,
    remainingCount,
    isLoadingMore,
    handleLoadMore,
  } = usePagination({
    items: filteredProducts,
    itemsPerPage: 6,
    dependencies: [
      searchResults,
      selectedBrands,
      selectedFlavors,
      selectedNicotine,
    ],
  });

  // 검색/필터링 활성 상태 체크
  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedFlavors.length > 0 ||
    selectedNicotine.length > 0;

  // 인기 제품과 신제품
  const popularProducts = popularProductsData;
  const newProducts = useMemo(
    () => products.filter((product: any) => product.is_new),
    [products]
  );

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      {/* 메인 배너 */}
      <Banner />

      {/* 검색 바 */}
      <div className='container mx-auto px-4 -mt-6 relative z-10'>
        <div className='max-w-2xl mx-auto'>
          <div className='bg-card rounded-xl shadow-lg p-4'>
            <div className='flex gap-2'>
              <div className='flex-1 relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5' />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      executeSearch();
                    }
                  }}
                  placeholder='찾고 싶은 제품을 검색하세요...'
                  className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>
              <button
                onClick={executeSearch}
                className='px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
              >
                검색
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* 사이드바 - 필터 */}
          <aside className='w-full lg:w-64 space-y-6'>
            <PriceFilter
              selectedBrands={selectedBrands}
              selectedFlavors={selectedFlavors}
              selectedNicotine={selectedNicotine}
              onBrandChange={handleBrandChange}
              onFlavorChange={handleFlavorChange}
              onNicotineChange={handleNicotineChange}
            />
            <SidebarAd />
          </aside>

          {/* 메인 컨텐츠 영역 */}
          <main className='flex-1 space-y-8'>
            {/* 검색 결과 표시 */}
            {isSearching && (
              <div className='bg-muted/50 rounded-lg p-4'>
                <p className='text-sm text-muted-foreground'>
                  <span className='font-semibold text-foreground'>
                    "{actualSearchQuery}"
                  </span>
                  에 대한 검색 결과 {searchResults.length}개
                </p>
              </div>
            )}

            {/* 필터 적용 상태 */}
            {hasActiveFilters && (
              <div className='bg-muted/50 rounded-lg p-4'>
                <p className='text-sm text-muted-foreground'>
                  필터가 적용되었습니다. 총 {filteredProducts.length}개의 제품
                </p>
              </div>
            )}

            {/* 제품 그리드 */}
            {isProductsLoading ? (
              <div className='flex justify-center items-center py-20'>
                <Loader2 className='w-8 h-8 animate-spin text-primary' />
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {displayedProducts.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => addItem(product)}
                    />
                  ))}
                </div>

                {/* 더보기 버튼 */}
                {hasMoreProducts && (
                  <LoadMoreButton
                    onClick={handleLoadMore}
                    isLoading={isLoadingMore}
                    remainingCount={remainingCount}
                    totalCount={totalProducts}
                  />
                )}
              </>
            )}

            {/* 가격 트렌드 차트 */}
            <div className='mt-12'>
              <h2 className='text-2xl font-bold mb-6'>가격 트렌드</h2>
              <PriceTrendChart />
            </div>

            {/* 인기 제품 */}
            {!isSearching &&
              !hasActiveFilters &&
              popularProducts.length > 0 && (
                <div className='mt-12'>
                  <h2 className='text-2xl font-bold mb-6 flex items-center gap-2'>
                    <span>🔥</span> 인기 제품
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {popularProducts.slice(0, 3).map((product: any) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={() => addItem(product)}
                      />
                    ))}
                  </div>
                </div>
              )}

            {/* 신제품 */}
            {!isSearching && !hasActiveFilters && newProducts.length > 0 && (
              <div className='mt-12'>
                <h2 className='text-2xl font-bold mb-6 flex items-center gap-2'>
                  <span>✨</span> 신제품
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {newProducts.slice(0, 3).map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => addItem(product)}
                    />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
