'use client';

import {
  Search,
  Filter,
  TrendingUp,
  ChevronDown,
  Crown,
  Flame,
  Users,
  ThumbsUp,
} from 'lucide-react';
import Header from '@/components/header';
import Banner from '@/components/banner';
import ProductCard from '@/components/product-card';
import PriceFilter from '@/components/price-filter';
import SidebarAd from '@/components/sidebar-ad';
import Footer from '@/components/footer';
import { useProductStore } from '@/stores/useProductStore';
import { useCartStore } from '@/stores/useCartStore';
import { useProductSearch } from '@/hooks/useProductSearch';
import { useProductFilter } from '@/hooks/useProductFilter';

export default function Popular() {
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

  // 인기 및 신제품은 store에서 직접 가져오기
  const { popularProducts, newProducts } = useProductStore();

  // 검색/필터링 활성 상태 체크
  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedFlavors.length > 0 ||
    selectedNicotine.length > 0;
  const showTopSection = !isSearching && !hasActiveFilters;

  // 인기도 순으로 정렬 (특화 기능)
  const sortedByPopularity = [...filteredProducts].sort(
    (a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount
  );

  // TOP 3 상품 추출 (기본 상태에서만)
  const topProducts = showTopSection ? sortedByPopularity.slice(0, 3) : [];
  const otherProducts = showTopSection
    ? sortedByPopularity.slice(3)
    : sortedByPopularity;

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <Banner />

      <main className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Left Sidebar - Ads and Filters */}
          <div className='w-full lg:w-64 space-y-6'>
            <SidebarAd position='left' />

            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>필터</h3>

              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium text-sm text-gray-700 mb-2'>
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
                  <h4 className='font-medium text-sm text-gray-700 mb-2'>맛</h4>
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
                      <span>과일맛</span>
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
                      <span>민트맛</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={selectedFlavors.includes('담배')}
                        onChange={(e) =>
                          handleFlavorChange('담배', e.target.checked)
                        }
                        className='rounded text-green-500 mr-2'
                      />
                      <span>담배맛</span>
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
                      <span>디저트맛</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className='font-medium text-sm text-gray-700 mb-2'>
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
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={selectedNicotine.includes('9mg+')}
                        onChange={(e) =>
                          handleNicotineChange('9mg+', e.target.checked)
                        }
                        className='rounded text-green-500 mr-2'
                      />
                      <span>9mg+</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <PriceFilter />
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Page Title and Description */}
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3'>
                <Flame className='h-8 w-8 text-red-500' />
                인기 제품
              </h1>
              <p className='text-gray-600'>
                지금 가장 인기 있는 액상들을 만나보세요. 실시간 판매량과 리뷰를
                기반으로 선정됩니다.
              </p>
            </div>

            {/* Search and Sort */}
            <div className='bg-white p-4 rounded-lg shadow mb-6'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1'>
                  <input
                    type='text'
                    placeholder='인기 제품 검색'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        executeSearch();
                      }
                    }}
                    className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                  />
                  <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                </div>
                <div className='flex gap-2'>
                  <button className='flex items-center gap-1 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50'>
                    <Filter className='h-4 w-4' />
                    <span>필터</span>
                  </button>
                  <button className='flex items-center gap-1 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50'>
                    <span>인기순</span>
                    <ChevronDown className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </div>

            {/* Popular Rankings Banner */}
            <div className='bg-gradient-to-r from-red-600 to-orange-500 p-6 rounded-lg shadow mb-6 text-white'>
              <div className='flex flex-col sm:flex-row items-center justify-between'>
                <div className='flex items-center gap-3 mb-4 sm:mb-0'>
                  <Crown className='h-6 w-6' />
                  <div>
                    <h2 className='text-xl font-bold'>실시간 인기 순위</h2>
                    <p className='text-red-100'>
                      판매량과 리뷰 평점을 종합한 순위입니다
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-4 text-red-100'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-white'>1,234</div>
                    <div className='text-xs'>일일 판매량</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-white'>4.8</div>
                    <div className='text-xs'>평균 평점</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Categories */}
            <div className='bg-white p-4 rounded-lg shadow mb-6'>
              <h3 className='font-bold text-lg mb-4 flex items-center gap-2'>
                <TrendingUp className='h-5 w-5 text-green-500' />
                트렌딩 카테고리
              </h3>
              <div className='flex flex-wrap gap-2'>
                <button className='px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center gap-1'>
                  <Flame className='h-4 w-4' />
                  과일 액상
                </button>
                <button className='px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center gap-1'>
                  <Users className='h-4 w-4' />
                  신제품
                </button>
                <button className='px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 flex items-center gap-1'>
                  <ThumbsUp className='h-4 w-4' />
                  고평점
                </button>
                <button className='px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100'>
                  프리미엄
                </button>
                <button className='px-3 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100'>
                  저니코틴
                </button>
              </div>
            </div>

            {/* Products Grid with Popularity Rankings */}
            <div className='space-y-6'>
              {showTopSection ? (
                <>
                  {/* Top 3 Popular Products */}
                  <div>
                    <h3 className='font-bold text-xl mb-4 flex items-center gap-2'>
                      <Crown className='h-6 w-6 text-yellow-500' />
                      TOP 3 인기상품
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      {topProducts.map((product, index) => (
                        <div key={product.id} className='relative'>
                          <div
                            className={`absolute -top-2 -left-2 ${
                              index === 0
                                ? 'bg-yellow-500'
                                : index === 1
                                ? 'bg-gray-400'
                                : 'bg-orange-500'
                            } text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg z-10`}
                          >
                            {index + 1}
                          </div>
                          <ProductCard
                            id={product.id}
                            name={product.name}
                            image={product.image}
                            lowestPrice={product.price}
                            averagePrice={
                              product.originalPrice || product.price
                            }
                            sellers={
                              product.sellers || (parseInt(product.id) % 8) + 3
                            }
                            rating={product.rating}
                            reviewCount={product.reviewCount}
                            specs={{
                              nicotine: product.nicotine,
                              volume: '30ml',
                              pgvg: '50/50',
                              flavor: product.flavor,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other Popular Products */}
                  <div>
                    <h3 className='font-bold text-xl mb-4 flex items-center gap-2'>
                      <Flame className='h-6 w-6 text-red-500' />
                      기타 인기상품
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {otherProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          image={product.image}
                          lowestPrice={product.price}
                          averagePrice={product.originalPrice || product.price}
                          sellers={
                            product.sellers || (parseInt(product.id) % 8) + 3
                          }
                          rating={product.rating}
                          reviewCount={product.reviewCount}
                          specs={{
                            nicotine: product.nicotine,
                            volume: '30ml',
                            pgvg: '50/50',
                            flavor: product.flavor,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* 검색/필터링 결과 */
                <div>
                  <h3 className='font-bold text-xl mb-4 flex items-center gap-2'>
                    <Search className='h-6 w-6 text-blue-500' />
                    {isSearching
                      ? `"${actualSearchQuery}" 검색 결과`
                      : '필터링된 상품'}
                    <span className='text-sm font-normal text-gray-500'>
                      ({sortedByPopularity.length}개)
                    </span>
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {sortedByPopularity.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        image={product.image}
                        lowestPrice={product.price}
                        averagePrice={product.originalPrice || product.price}
                        sellers={
                          product.sellers || (parseInt(product.id) % 8) + 3
                        }
                        rating={product.rating}
                        reviewCount={product.reviewCount}
                        specs={{
                          nicotine: product.nicotine,
                          volume: '30ml',
                          pgvg: '50/50',
                          flavor: product.flavor,
                        }}
                      />
                    ))}
                  </div>
                  {sortedByPopularity.length === 0 && (
                    <div className='bg-white p-12 rounded-lg shadow text-center'>
                      <div className='text-gray-400 text-lg mb-2'>
                        검색 결과가 없습니다
                      </div>
                      <div className='text-gray-500 text-sm'>
                        다른 검색어나 필터를 시도해보세요
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Load More Button */}
            <div className='mt-8 text-center'>
              <button className='px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium'>
                더 많은 인기상품 보기
              </button>
            </div>
          </div>

          {/* Right Sidebar - Ads */}
          <div className='w-full lg:w-64'>
            <SidebarAd position='right' />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
