'use client';

import { use } from 'react';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductImageGallery from '@/components/product-image-gallery';
import ProductSpecs from '@/components/product-specs';
import ProductReviews from '@/components/product-reviews';
import SidebarAd from '@/components/sidebar-ad';
import LoadingPage from '@/components/loading-page';
import {
  Star,
  Bell,
  Share2,
  Heart,
  ShoppingCart,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
};

export default function ProductDetailPage({ params }: Props) {
  // Next.js 15: params를 Promise로 unwrap
  const { id } = use(params);

  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(id);
  const { addItem, items: cartItems } = useCart();

  // 장바구니에 담기
  const handleAddToCart = () => {
    if (!product) return;

    const existingItem = cartItems.find(
      (item) => item.productId === product.id
    );

    addItem(product);

    if (existingItem) {
      toast(
        `${product.name}의 수량이 증가되었습니다 (${
          existingItem.quantity + 1
        }개)`,
        {
          icon: '🔄',
          duration: 2000,
        }
      );
    } else {
      toast.success(
        <div className='flex flex-col gap-2'>
          <p className='font-medium'>{product.name}</p>
          <p className='text-sm'>장바구니에 추가되었습니다!</p>
          <button
            onClick={() => router.push('/cart')}
            className='mt-1 text-xs font-semibold text-green-600 hover:text-green-700 underline'
          >
            장바구니 보기 →
          </button>
        </div>,
        { duration: 3000 }
      );
    }
  };

  // 로딩 중
  if (isLoading) {
    return <LoadingPage />;
  }

  // 에러 발생
  if (error || !product) {
    return (
      <div className='min-h-screen bg-background'>
        <Header />
        <main className='container mx-auto px-4 py-16'>
          <div className='text-center'>
            <AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-foreground mb-2'>
              상품을 찾을 수 없습니다
            </h2>
            <p className='text-muted-foreground mb-6'>
              {error?.message || '존재하지 않는 상품이거나 삭제된 상품입니다.'}
            </p>
            <Link
              href='/main'
              className='inline-flex items-center text-green-500 hover:text-green-600 font-medium'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              메인으로 돌아가기
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 상품 이미지 배열 생성 (image_url + image_urls)
  const productImages = [
    product.image_url,
    ...(product.image_urls || []),
  ].filter(Boolean);

  // 할인율 계산
  const discountRate =
    product.original_price && product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) *
            100
        )
      : product.discount_percentage || 0;

  // 상품 스펙 데이터 구성 (ProductSpecs 컴포넌트가 요구하는 형식)
  const productSpecs = {
    nicotine: product.nicotine || '정보 없음',
    volume: product.volume || '정보 없음',
    pgvg: 'N/A', // DB에 없는 필드, 추후 추가 가능
    flavor: product.flavor || '정보 없음',
    origin: 'N/A', // DB에 없는 필드
    manufacturer: product.brand,
    importer: 'N/A', // DB에 없는 필드
  };

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      <main className='container mx-auto px-4 py-8'>
        {/* 뒤로가기 */}
        <div className='mb-4'>
          <Link
            href='/main'
            className='inline-flex items-center text-gray-600 hover:text-green-500 transition-colors'
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
                    images={productImages}
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
                  <h1 className='text-2xl font-bold text-foreground mb-3'>
                    {product.name}
                  </h1>

                  {/* 평점 */}
                  <div className='flex items-center gap-4 mb-4'>
                    <div className='flex items-center'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className='ml-2 text-foreground font-semibold'>
                        {product.rating?.toFixed(1) || '0.0'}
                      </span>
                      <span className='ml-1 text-muted-foreground'>
                        ({product.review_count || 0}개 리뷰)
                      </span>
                    </div>
                  </div>

                  {/* 가격 정보 */}
                  <div className='mb-6'>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-3xl font-bold text-foreground'>
                        {formatPrice(product.price)}원
                      </span>
                      {product.original_price &&
                        product.original_price > product.price && (
                          <>
                            <span className='text-lg text-muted-foreground line-through'>
                              {formatPrice(product.original_price)}원
                            </span>
                            <span className='text-lg font-semibold text-red-500'>
                              {discountRate}% 할인
                            </span>
                          </>
                        )}
                    </div>
                    <div className='mt-2 flex items-center gap-2 text-sm text-muted-foreground'>
                      <span>판매자 {product.sellers_count || 1}개</span>
                      {product.in_stock ? (
                        <span className='text-green-600 font-medium'>
                          ● 재고 있음
                        </span>
                      ) : (
                        <span className='text-red-600 font-medium'>● 품절</span>
                      )}
                    </div>
                  </div>

                  {/* 상품 설명 */}
                  <div className='mb-6'>
                    <p className='text-muted-foreground leading-relaxed'>
                      {product.description || '상품 설명이 없습니다.'}
                    </p>
                  </div>

                  {/* 기본 스펙 */}
                  <div className='mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                    <h3 className='text-sm font-semibold text-foreground mb-3'>
                      기본 정보
                    </h3>
                    <div className='grid grid-cols-2 gap-3 text-sm'>
                      <div>
                        <span className='text-muted-foreground'>니코틴:</span>
                        <span className='ml-2 font-medium text-foreground'>
                          {productSpecs.nicotine}
                        </span>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>용량:</span>
                        <span className='ml-2 font-medium text-foreground'>
                          {productSpecs.volume}
                        </span>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>맛:</span>
                        <span className='ml-2 font-medium text-foreground'>
                          {productSpecs.flavor}
                        </span>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>브랜드:</span>
                        <span className='ml-2 font-medium text-foreground'>
                          {productSpecs.manufacturer}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className='flex gap-3'>
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.in_stock}
                      className='flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed'
                    >
                      <ShoppingCart className='h-5 w-5' />
                      {product.in_stock ? '장바구니 담기' : '품절'}
                    </button>
                    <button className='p-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                      <Heart className='h-5 w-5 text-muted-foreground' />
                    </button>
                    <button className='p-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                      <Bell className='h-5 w-5 text-muted-foreground' />
                    </button>
                    <button className='p-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                      <Share2 className='h-5 w-5 text-muted-foreground' />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 상품 상세 스펙 */}
            <div className='bg-card rounded-lg shadow p-6 mb-6'>
              <h2 className='text-xl font-bold text-foreground mb-4'>
                상세 스펙
              </h2>
              <ProductSpecs specs={productSpecs} />
            </div>

            {/* 리뷰 섹션 */}
            <div className='bg-card rounded-lg shadow p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-foreground'>상품 리뷰</h2>
                <div className='flex items-center gap-2'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className='ml-2 font-bold text-foreground'>
                    {product.rating?.toFixed(1) || '0.0'}
                  </span>
                  <span className='text-muted-foreground'>
                    ({product.review_count || 0}개 리뷰)
                  </span>
                </div>
              </div>

              {/* 리뷰 컴포넌트에 product_id 전달 */}
              <ProductReviews productId={product.id} />
            </div>
          </div>

          {/* 사이드바 */}
          <div className='w-full lg:w-80 space-y-6'>
            <SidebarAd position='right' />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
