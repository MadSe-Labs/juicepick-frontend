'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Bell, ChevronDown, Loader2 } from 'lucide-react';
import Header from '@/components/header';
import Banner from '@/components/banner';
import ProductCard from '@/components/product-card';
import PriceFilter from '@/components/price-filter';
import SidebarAd from '@/components/sidebar-ad';
import Footer from '@/components/footer';
import PriceTrendChart from '@/components/price-trend-chart';
import LoadMoreButton from '@/components/load-more-button';
import { useProductStore } from '@/stores/useProductStore';
import { useCartStore } from '@/stores/useCartStore';
import { useProductSearch } from '@/hooks/useProductSearch';
import { useProductFilter } from '@/hooks/useProductFilter';
import { usePagination } from '@/hooks/usePagination';

export default function Home() {
  const { addItem } = useCartStore();

  // 커스텀 훅 사용
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    executeSearch,
    isSearching,
    actualSearchQuery,
  } = useProductSearch();
  const {
    filteredProducts,
    filters: { selectedBrands, selectedFlavors, selectedNicotine },
    handleBrandChange,
    handleFlavorChange,
    handleNicotineChange,
  } = useProductFilter(searchResults);

  // 페이지네이션 커스텀 훅 사용
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

  // 인기 및 신제품은 store에서 직접 가져오기
  const { popularProducts, newProducts } = useProductStore();

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <Banner />

      <main className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Left Sidebar - Ads and Filters */}
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
                  <h4 className='font-medium text-sm text-foreground mb-2'>
                    맛
                  </h4>
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
            {/* Search and Sort */}
            <div className='bg-card p-4 rounded-lg shadow mb-6'>
              <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
                <div className='flex items-center space-x-2 flex-1'>
                  <div className='relative flex-1'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
                    <input
                      type='text'
                      placeholder='제품명, 브랜드를 검색하세요'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          executeSearch();
                        }
                      }}
                      className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    />
                  </div>
                  <button
                    onClick={executeSearch}
                    className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
                  >
                    검색
                  </button>
                </div>

                <div className='flex items-center space-x-2'>
                  <Filter className='w-4 h-4 text-muted-foreground' />
                  <select className='px-3 py-2 border border-gray-300 rounded-lg'>
                    <option>인기순</option>
                    <option>최신순</option>
                    <option>낮은 가격순</option>
                    <option>높은 가격순</option>
                    <option>평점순</option>
                  </select>
                </div>

                <button className='px-4 py-2 bg-card text-foreground rounded-lg font-medium hover:bg-accent transition-colors border border-border'>
                  최저가 알림 설정
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div>
              {/* 검색/필터 결과 헤더 */}
              {(isSearching || hasActiveFilters) && (
                <div className='bg-card p-4 rounded-lg shadow mb-6'>
                  <h3 className='font-bold text-lg flex items-center gap-2'>
                    <Search className='h-6 w-6 text-blue-500' />
                    {isSearching
                      ? `"${actualSearchQuery}" 검색 결과`
                      : '필터링된 상품'}
                    <span className='text-sm font-normal text-muted-foreground'>
                      ({totalProducts}개)
                    </span>
                  </h3>
                </div>
              )}

              {/* 상품 그리드 */}
              {displayedProducts.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      image={product.image}
                      lowestPrice={product.price}
                      averagePrice={product.originalPrice || product.price}
                      sellers={
                        product.sellers || (parseInt(product.id) % 8) + 3
                      } // 고정된 패턴으로 판매자 수 생성
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      specs={{
                        nicotine: product.nicotine,
                        volume: product.volume,
                        pgvg: '50/50', // 임시 값
                        flavor: product.flavor,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className='bg-card p-12 rounded-lg shadow text-center'>
                  <div className='text-muted-foreground text-lg mb-2'>
                    {isSearching
                      ? '검색 결과가 없습니다'
                      : hasActiveFilters
                      ? '필터 조건에 맞는 상품이 없습니다'
                      : '상품이 없습니다'}
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    {isSearching || hasActiveFilters
                      ? '다른 검색어나 필터 조건을 시도해보세요'
                      : '곧 새로운 상품을 준비하겠습니다'}
                  </div>
                </div>
              )}
            </div>

            {displayedProducts.length > 0 && (
              <LoadMoreButton
                hasMoreItems={hasMoreProducts}
                isLoadingMore={isLoadingMore}
                remainingCount={remainingCount}
                totalItems={totalProducts}
                onLoadMore={handleLoadMore}
              />
            )}
          </div>

          {/* Right Sidebar - Ads and Price Trends */}
          <div className='w-full lg:w-64 space-y-6'>
            <SidebarAd position='right' />

            <div className='bg-card p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>가격 추이</h3>
              <PriceTrendChart />
              <p className='text-xs text-muted-foreground mt-2'>
                최근 30일 인기 제품 가격 변동
              </p>
            </div>

            <div className='bg-card p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>인기 제품</h3>
              <div className='space-y-3'>
                {popularProducts.slice(0, 3).map((product, index) => (
                  <div key={product.id} className='flex items-center space-x-3'>
                    <div className='flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                      <span className='text-sm font-bold text-green-600'>
                        {index + 1}
                      </span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-foreground truncate'>
                        {product.name}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {product.price.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='bg-card p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>신제품</h3>
              <div className='space-y-3'>
                {newProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className='flex items-center space-x-3'>
                    <div className='flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg overflow-hidden'>
                      <img
                        src={product.image}
                        alt={product.name}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-foreground truncate'>
                        {product.name}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {product.price.toLocaleString()}원
                      </p>
                      <span className='inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                        NEW
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
