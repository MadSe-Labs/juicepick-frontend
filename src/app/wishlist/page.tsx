'use client';

import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import LoadingPage from '@/components/loading-page';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Package,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { wishlistItems, stats, isLoading, removeFromWishlist, clearWishlist } =
    useWishlist();
  const { addItem } = useCartStore();

  // 로그인 체크
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('로그인이 필요합니다');
      router.push('/login?from=/wishlist');
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  const hasItems = wishlistItems.length > 0;

  // 장바구니에 담기
  const handleAddToCart = (item: any) => {
    if (item.product) {
      addItem(item.product);
      toast.success(`${item.product.name}을(를) 장바구니에 담았습니다`);
    }
  };

  // 모두 장바구니에 담기
  const handleAddAllToCart = () => {
    let count = 0;
    wishlistItems.forEach((item: any) => {
      if (item.product) {
        addItem(item.product);
        count++;
      }
    });
    toast.success(`${count}개 상품을 장바구니에 담았습니다`);
  };

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      <main className='container mx-auto px-4 py-8 max-w-7xl'>
        {/* 헤더 섹션 */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <Heart className='text-red-500 fill-current' size={32} />
              <h1 className='text-3xl font-bold'>찜 목록</h1>
            </div>

            {hasItems && (
              <div className='flex gap-2'>
                <button
                  onClick={handleAddAllToCart}
                  className='flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                >
                  <ShoppingCart size={18} />
                  <span>전체 장바구니 담기</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('찜 목록을 모두 삭제하시겠습니까?')) {
                      clearWishlist();
                    }
                  }}
                  className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
                >
                  <Trash2 size={18} />
                  <span>전체 삭제</span>
                </button>
              </div>
            )}
          </div>

          {/* 통계 */}
          {stats && (
            <div className='flex gap-6 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <Package size={16} />
                <span>총 {stats.total_items}개 상품</span>
              </div>
              <div className='flex items-center gap-2'>
                <TrendingUp size={16} />
                <span>총 {stats.total_value.toLocaleString()}원</span>
              </div>
            </div>
          )}
        </div>

        {/* 찜 목록 */}
        {hasItems ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {wishlistItems.map((item: any) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div
                  key={item.id}
                  className='group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-200'
                >
                  {/* 상품 이미지 */}
                  <Link
                    href={`/product/${product.id}`}
                    className='block relative aspect-square bg-muted overflow-hidden'
                  >
                    <Image
                      src={product.image_url || '/images/placeholder.png'}
                      alt={product.name}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-200'
                    />

                    {/* 할인율 배지 */}
                    {product.discount && product.discount > 0 && (
                      <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded'>
                        {product.discount}%
                      </div>
                    )}

                    {/* 품절 오버레이 */}
                    {!product.in_stock && (
                      <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
                        <span className='text-white font-bold text-lg'>
                          품절
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* 상품 정보 */}
                  <div className='p-4'>
                    <Link href={`/product/${product.id}`}>
                      <p className='text-xs text-muted-foreground mb-1'>
                        {product.brand}
                      </p>
                      <h3 className='font-medium mb-2 line-clamp-2 hover:text-primary transition-colors'>
                        {product.name}
                      </h3>
                    </Link>

                    {/* 가격 */}
                    <div className='mb-3'>
                      <div className='flex items-center gap-2'>
                        <span className='text-xl font-bold text-primary'>
                          {product.price.toLocaleString()}원
                        </span>
                        {product.original_price &&
                          product.original_price > product.price && (
                            <span className='text-sm text-muted-foreground line-through'>
                              {product.original_price.toLocaleString()}원
                            </span>
                          )}
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!product.in_stock}
                        className='flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <ShoppingCart size={16} />
                        <span className='text-sm'>담기</span>
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className='px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors'
                        title='삭제'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // 빈 상태
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <Heart
              size={80}
              className='text-muted-foreground/20 mb-4'
              strokeWidth={1}
            />
            <h3 className='text-xl font-bold mb-2'>찜한 상품이 없습니다</h3>
            <p className='text-muted-foreground mb-6'>
              마음에 드는 상품을 찜해보세요!
            </p>
            <Link
              href='/main'
              className='flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
            >
              <span>상품 둘러보기</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
