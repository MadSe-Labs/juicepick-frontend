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

export default function Popular() {
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
                      <span>과일맛</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        className='rounded text-green-500 mr-2'
                      />
                      <span>민트맛</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        className='rounded text-green-500 mr-2'
                      />
                      <span>담배맛</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
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
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
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
              {/* Top 3 Popular Products */}
              <div>
                <h3 className='font-bold text-xl mb-4 flex items-center gap-2'>
                  <Crown className='h-6 w-6 text-yellow-500' />
                  TOP 3 인기상품
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='relative'>
                    <div className='absolute -top-2 -left-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg z-10'>
                      1
                    </div>
                    <ProductCard
                      id='1'
                      name='나스티 쿠션맨 액상'
                      image='/placeholder.svg?height=200&width=200'
                      lowestPrice={15000}
                      averagePrice={17500}
                      sellers={8}
                      rating={4.8}
                      reviewCount={312}
                      specs={{
                        nicotine: '9.8mg',
                        volume: '30ml',
                        pgvg: '50/50',
                        flavor: '과일믹스',
                      }}
                    />
                  </div>
                  <div className='relative'>
                    <div className='absolute -top-2 -left-2 bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg z-10'>
                      2
                    </div>
                    <ProductCard
                      id='2'
                      name='코스모스 블루베리 액상'
                      image='/placeholder.svg?height=200&width=200'
                      lowestPrice={13500}
                      averagePrice={15800}
                      sellers={6}
                      rating={4.7}
                      reviewCount={289}
                      specs={{
                        nicotine: '6mg',
                        volume: '30ml',
                        pgvg: '70/30',
                        flavor: '블루베리',
                      }}
                    />
                  </div>
                  <div className='relative'>
                    <div className='absolute -top-2 -left-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg z-10'>
                      3
                    </div>
                    <ProductCard
                      id='3'
                      name='맥스웰 민트 액상'
                      image='/placeholder.svg?height=200&width=200'
                      lowestPrice={14200}
                      averagePrice={16500}
                      sellers={7}
                      rating={4.6}
                      reviewCount={205}
                      specs={{
                        nicotine: '3mg',
                        volume: '30ml',
                        pgvg: '50/50',
                        flavor: '멘톨민트',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Other Popular Products */}
              <div>
                <h3 className='font-bold text-xl mb-4 flex items-center gap-2'>
                  <Flame className='h-6 w-6 text-red-500' />
                  기타 인기상품
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  <ProductCard
                    id='4'
                    name='더원 망고 액상'
                    image='/placeholder.svg?height=200&width=200'
                    lowestPrice={12800}
                    averagePrice={15200}
                    sellers={5}
                    rating={4.5}
                    reviewCount={178}
                    specs={{
                      nicotine: '9mg',
                      volume: '30ml',
                      pgvg: '60/40',
                      flavor: '망고',
                    }}
                  />
                  <ProductCard
                    id='5'
                    name='베이프윌 딸기 액상'
                    image='/placeholder.svg?height=200&width=200'
                    lowestPrice={11500}
                    averagePrice={13800}
                    sellers={4}
                    rating={4.4}
                    reviewCount={156}
                    specs={{
                      nicotine: '6mg',
                      volume: '30ml',
                      pgvg: '50/50',
                      flavor: '딸기',
                    }}
                  />
                  <ProductCard
                    id='6'
                    name='프리미어 바닐라 액상'
                    image='/placeholder.svg?height=200&width=200'
                    lowestPrice={16800}
                    averagePrice={19200}
                    sellers={6}
                    rating={4.7}
                    reviewCount={234}
                    specs={{
                      nicotine: '3mg',
                      volume: '30ml',
                      pgvg: '70/30',
                      flavor: '바닐라',
                    }}
                  />
                  <ProductCard
                    id='7'
                    name='클라우드 체리 액상'
                    image='/placeholder.svg?height=200&width=200'
                    lowestPrice={13200}
                    averagePrice={15600}
                    sellers={5}
                    rating={4.3}
                    reviewCount={142}
                    specs={{
                      nicotine: '9mg',
                      volume: '30ml',
                      pgvg: '50/50',
                      flavor: '체리',
                    }}
                  />
                  <ProductCard
                    id='8'
                    name='유니크 콜라 액상'
                    image='/placeholder.svg?height=200&width=200'
                    lowestPrice={14500}
                    averagePrice={16900}
                    sellers={4}
                    rating={4.2}
                    reviewCount={98}
                    specs={{
                      nicotine: '6mg',
                      volume: '30ml',
                      pgvg: '60/40',
                      flavor: '콜라',
                    }}
                  />
                  <ProductCard
                    id='9'
                    name='레전드 포도 액상'
                    image='/placeholder.svg?height=200&width=200'
                    lowestPrice={12000}
                    averagePrice={14400}
                    sellers={6}
                    rating={4.6}
                    reviewCount={187}
                    specs={{
                      nicotine: '3mg',
                      volume: '30ml',
                      pgvg: '70/30',
                      flavor: '포도',
                    }}
                  />
                </div>
              </div>
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
