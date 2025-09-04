'use client';

import { Search, Filter, Bell, ChevronDown } from 'lucide-react';
import Header from '@/components/header';
import Banner from '@/components/banner';
import ProductCard from '@/components/product-card';
import PriceFilter from '@/components/price-filter';
import SidebarAd from '@/components/sidebar-ad';
import Footer from '@/components/footer';
import PriceTrendChart from '@/components/price-trend-chart';
import { useProductStore } from '@/stores/useProductStore';
import { useCartStore } from '@/stores/useCartStore';

export default function Home() {
  const { products, popularProducts, newProducts } = useProductStore();
  const { addItem } = useCartStore();

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
                        className='rounded text-green-500 mr-2'
                      />
                      <span>나스티</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        className='rounded text-green-500 mr-2'
                      />
                      <span>코스모스</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        className='rounded text-green-500 mr-2'
                      />
                      <span>맥스웰</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
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
                        className='rounded text-green-500 mr-2'
                      />
                      <span>과일</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        className='rounded text-green-500 mr-2'
                      />
                      <span>멘솔</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        className='rounded text-green-500 mr-2'
                      />
                      <span>디저트</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        className='rounded text-green-500 mr-2'
                      />
                      <span>음료</span>
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
                        className='rounded text-green-500 mr-2'
                      />
                      <span>0mg</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        className='rounded text-green-500 mr-2'
                      />
                      <span>3mg</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
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
            <div className='bg-white p-4 rounded-lg shadow mb-6'>
              <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
                <div className='flex items-center space-x-2 flex-1'>
                  <div className='relative flex-1'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                    <input
                      type='text'
                      placeholder='제품명, 브랜드를 검색하세요'
                      className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    />
                  </div>
                  <button className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
                    검색
                  </button>
                </div>

                <div className='flex items-center space-x-2'>
                  <Filter className='w-4 h-4 text-gray-500' />
                  <select className='px-3 py-2 border border-gray-300 rounded-lg'>
                    <option>인기순</option>
                    <option>최신순</option>
                    <option>낮은 가격순</option>
                    <option>높은 가격순</option>
                    <option>평점순</option>
                  </select>
                </div>

                <button className='px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors'>
                  최저가 알림 설정
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  lowestPrice={product.price}
                  averagePrice={product.originalPrice || product.price}
                  sellers={product.sellers || (parseInt(product.id) % 8) + 3} // 고정된 패턴으로 판매자 수 생성
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

            {/* Load More Button */}
            <div className='mt-8 text-center'>
              <button className='px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                더 보기
              </button>
            </div>
          </div>

          {/* Right Sidebar - Ads and Price Trends */}
          <div className='w-full lg:w-64 space-y-6'>
            <SidebarAd position='right' />

            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>가격 추이</h3>
              <PriceTrendChart />
              <p className='text-xs text-gray-500 mt-2'>
                최근 30일 인기 제품 가격 변동
              </p>
            </div>

            <div className='bg-white p-4 rounded-lg shadow'>
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
                      <p className='text-sm font-medium text-gray-900 truncate'>
                        {product.name}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {product.price.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='bg-white p-4 rounded-lg shadow'>
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
                      <p className='text-sm font-medium text-gray-900 truncate'>
                        {product.name}
                      </p>
                      <p className='text-xs text-gray-500'>
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
