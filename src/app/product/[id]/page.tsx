import type { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductImageGallery from '@/components/product-image-gallery';
import ProductSpecs from '@/components/product-specs';
import ProductPriceComparison from '@/components/product-price-comparison';
import ProductReviews from '@/components/product-reviews';
import SidebarAd from '@/components/sidebar-ad';
import PriceTrendChart from '@/components/price-trend-chart';
import {
  Star,
  Bell,
  Share2,
  Heart,
  ShoppingCart,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 실제 구현에서는 params.id를 사용하여 제품 정보를 가져와야 합니다
  return {
    title: '나스티 쿠션맨 액상 | 액상최저가',
    description:
      '나스티 쿠션맨 액상의 상세 정보, 최저가 비교, 리뷰를 확인하세요.',
  };
}

export default function ProductDetailPage({ params }: Props) {
  // 실제 구현에서는 params.id를 사용하여 제품 정보를 가져와야 합니다
  const product = {
    id: params.id,
    name: '나스티 쿠션맨 액상',
    brand: '나스티',
    rating: 4.5,
    reviewCount: 128,
    lowestPrice: 15000,
    averagePrice: 17500,
    discountRate: 14,
    description:
      '나스티 쿠션맨은 강한 멘솔 향과 부드러운 타격감이 특징인 프리미엄 액상입니다. 시원한 멘솔 향과 함께 은은한 과일 향이 어우러져 상쾌한 베이핑 경험을 제공합니다.',
    specs: {
      nicotine: '9.8mg',
      volume: '30ml',
      pgvg: '50/50',
      flavor: '멘솔',
      origin: '말레이시아',
      manufacturer: 'Nasty Juice',
      importer: '한국전자담배협회',
    },
    images: [
      '/placeholder.svg?height=500&width=500&text=나스티 쿠션맨 1',
      '/placeholder.svg?height=500&width=500&text=나스티 쿠션맨 2',
      '/placeholder.svg?height=500&width=500&text=나스티 쿠션맨 3',
      '/placeholder.svg?height=500&width=500&text=나스티 쿠션맨 4',
    ],
    sellers: [
      {
        name: '쿠팡',
        price: 15000,
        shipping: 0,
        isFreeShipping: true,
        isSameDay: true,
        url: '#',
      },
      {
        name: '11번가',
        price: 15500,
        shipping: 2500,
        isFreeShipping: false,
        isSameDay: false,
        url: '#',
      },
      {
        name: '스마트스토어',
        price: 16000,
        shipping: 0,
        isFreeShipping: true,
        isSameDay: false,
        url: '#',
      },
      {
        name: 'G마켓',
        price: 16500,
        shipping: 0,
        isFreeShipping: true,
        isSameDay: true,
        url: '#',
      },
      {
        name: '옥션',
        price: 17000,
        shipping: 2500,
        isFreeShipping: false,
        isSameDay: false,
        url: '#',
      },
    ],
    reviewTags: [
      { name: '멘솔 강함', count: 87 },
      { name: '타격감 좋음', count: 65 },
      { name: '단맛 적당함', count: 42 },
      { name: '기침 유발 없음', count: 38 },
      { name: '지속성 좋음', count: 31 },
    ],
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      <main className='container mx-auto px-4 py-8'>
        {/* 뒤로가기 */}
        <div className='mb-4'>
          <Link
            href='/'
            className='inline-flex items-center text-gray-600 hover:text-rose-500 transition-colors'
          >
            <ArrowLeft className='h-4 w-4 mr-1' />
            <span>메인으로 돌아가기</span>
          </Link>
        </div>

        <div className='flex flex-col lg:flex-row gap-6'>
          {/* 메인 콘텐츠 */}
          <div className='flex-1'>
            <div className='bg-card rounded-lg shadow p-6 mb-6'>
              {/* 제품 기본 정보 */}
              <div className='flex flex-col md:flex-row gap-8'>
                {/* 제품 이미지 갤러리 */}
                <div className='w-full md:w-2/5'>
                  <ProductImageGallery
                    images={product.images}
                    productName={product.name}
                  />
                </div>

                {/* 제품 정보 */}
                <div className='w-full md:w-3/5'>
                  <div className='mb-2'>
                    <span className='text-sm text-muted-foreground'>
                      {product.brand}
                    </span>
                  </div>
                  <h1 className='text-2xl font-bold mb-2'>{product.name}</h1>

                  <div className='flex items-center mb-4'>
                    <div className='flex items-center text-yellow-400 mr-2'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? 'fill-current' : ''
                          }`}
                        />
                      ))}
                    </div>
                    <span className='font-medium'>{product.rating}</span>
                    <span className='text-muted-foreground text-sm ml-1'>
                      ({product.reviewCount})
                    </span>
                  </div>

                  <div className='mb-4'>
                    <div className='flex items-baseline'>
                      <span className='text-2xl font-bold text-green-600'>
                        {formatPrice(product.lowestPrice)}원
                      </span>
                      <span className='text-sm text-muted-foreground line-through ml-2'>
                        {formatPrice(product.averagePrice)}원
                      </span>
                      <span className='ml-2 text-sm font-medium text-green-600'>
                        {product.discountRate}% 할인
                      </span>
                    </div>
                    <div className='text-xs text-muted-foreground mt-1'>
                      {product.sellers.length}개 판매처
                    </div>
                  </div>

                  <p className='text-foreground mb-6'>{product.description}</p>

                  {/* 액션 버튼 */}
                  <div className='flex flex-wrap gap-2 mb-6'>
                    <button className='flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center'>
                      <ShoppingCart className='h-5 w-5 mr-2' />
                      최저가 구매하기
                    </button>
                    <button className='px-4 py-3 border border-gray-300 rounded-lg hover:bg-background transition-colors'>
                      <Heart className='h-5 w-5' />
                    </button>
                    <button className='px-4 py-3 border border-gray-300 rounded-lg hover:bg-background transition-colors'>
                      <Bell className='h-5 w-5' />
                    </button>
                    <button className='px-4 py-3 border border-gray-300 rounded-lg hover:bg-background transition-colors'>
                      <Share2 className='h-5 w-5' />
                    </button>
                  </div>

                  {/* 간단한 스펙 정보 */}
                  <div className='grid grid-cols-2 gap-2 text-sm'>
                    <div className='bg-accent px-3 py-2 rounded flex justify-between'>
                      <span className='text-gray-600'>니코틴</span>
                      <span className='font-medium'>
                        {product.specs.nicotine}
                      </span>
                    </div>
                    <div className='bg-accent px-3 py-2 rounded flex justify-between'>
                      <span className='text-gray-600'>용량</span>
                      <span className='font-medium'>
                        {product.specs.volume}
                      </span>
                    </div>
                    <div className='bg-accent px-3 py-2 rounded flex justify-between'>
                      <span className='text-gray-600'>PG/VG</span>
                      <span className='font-medium'>{product.specs.pgvg}</span>
                    </div>
                    <div className='bg-accent px-3 py-2 rounded flex justify-between'>
                      <span className='text-gray-600'>맛</span>
                      <span className='font-medium'>
                        {product.specs.flavor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 가격 비교 */}
            <div className='bg-card rounded-lg shadow p-6 mb-6'>
              <h2 className='text-xl font-bold mb-4'>가격 비교</h2>
              <ProductPriceComparison sellers={product.sellers} />
            </div>

            {/* 상세 스펙 */}
            <div className='bg-card rounded-lg shadow p-6 mb-6'>
              <h2 className='text-xl font-bold mb-4'>상세 스펙</h2>
              <ProductSpecs specs={product.specs} />
            </div>

            {/* 리뷰 */}
            <div className='bg-card rounded-lg shadow p-6'>
              <h2 className='text-xl font-bold mb-4'>리뷰</h2>

              {/* 리뷰 요약 */}
              <div className='flex flex-col md:flex-row gap-6 mb-6 p-4 bg-background rounded-lg'>
                <div className='text-center md:w-1/4'>
                  <div className='text-5xl font-bold text-rose-500 mb-2'>
                    {product.rating}
                  </div>
                  <div className='flex items-center justify-center text-yellow-400 mb-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? 'fill-current' : ''
                        }`}
                      />
                    ))}
                  </div>
                  <div className='text-muted-foreground'>
                    {product.reviewCount}개 리뷰
                  </div>
                </div>

                <div className='md:w-3/4'>
                  <h3 className='font-medium mb-3'>주요 리뷰 키워드</h3>
                  <div className='flex flex-wrap gap-2'>
                    {product.reviewTags.map((tag, index) => (
                      <div
                        key={index}
                        className='px-3 py-1 bg-card border border-gray-200 rounded-full text-sm'
                      >
                        {tag.name}{' '}
                        <span className='text-muted-foreground'>
                          ({tag.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 리뷰 목록 */}
              <ProductReviews productId={product.id} />
            </div>
          </div>

          {/* 사이드바 */}
          <div className='w-full lg:w-64 space-y-6'>
            <SidebarAd position='right' />

            <div className='bg-card p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>가격 추이</h3>
              <PriceTrendChart />
              <p className='text-xs text-muted-foreground mt-2'>
                최근 30일 가격 변동
              </p>
            </div>

            <div className='bg-card p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>최저가 알림</h3>
              <p className='text-sm text-gray-600 mb-3'>
                원하는 가격에 도달하면 알려드립니다
              </p>
              <div className='flex mb-3'>
                <input
                  type='number'
                  placeholder='희망가격'
                  className='flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-rose-500'
                />
                <span className='px-3 py-2 bg-accent border-t border-r border-b rounded-r-lg'>
                  원
                </span>
              </div>
              <button className='w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center'>
                <Bell className='h-4 w-4 mr-1' />
                알림 설정
              </button>
            </div>

            <div className='bg-card p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>관련 제품</h3>
              <div className='space-y-3'>
                {[1, 2, 3].map((item) => (
                  <Link
                    href={`/product/${item}`}
                    key={item}
                    className='flex gap-2 group'
                  >
                    <div className='w-16 h-16 bg-accent rounded overflow-hidden flex-shrink-0'>
                      <img
                        src={`/placeholder.svg?height=64&width=64&text=관련${item}`}
                        alt={`관련 제품 ${item}`}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div>
                      <h4 className='text-sm font-medium group-hover:text-green-500 transition-colors'>
                        나스티 쿨민트 액상
                      </h4>
                      <div className='text-green-600 text-sm font-medium'>
                        15,000원
                      </div>
                      <div className='flex items-center text-xs'>
                        <Star className='h-3 w-3 text-yellow-400 fill-current' />
                        <span className='ml-1'>4.5 (98)</span>
                      </div>
                    </div>
                  </Link>
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
