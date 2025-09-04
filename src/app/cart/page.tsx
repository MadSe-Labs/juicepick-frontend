'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/stores/useCartStore';
import LoadingPage from '@/components/loading-page';
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  Truck,
  CreditCard,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SidebarAd from '@/components/sidebar-ad';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { data: session, status } = useSession();
  const {
    items: cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
      // 초기에 모든 아이템을 선택된 상태로 설정
      setSelectedItems(cartItems.map((item) => item.id));
    }
  }, [status, cartItems]);

  if (isLoading) {
    return <LoadingPage />;
  }

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  // 개별 아이템 선택/해제
  const toggleItemSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // 선택된 아이템들의 총 가격 계산
  const getSelectedItemsTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // 쿠폰 적용
  const applyCoupon = () => {
    const validCoupons = {
      WELCOME10: { discount: 10, type: 'percent' as const },
      SAVE5000: { discount: 5000, type: 'fixed' as const },
    };

    if (validCoupons[couponCode as keyof typeof validCoupons]) {
      setAppliedCoupon({
        code: couponCode,
        discount:
          validCoupons[couponCode as keyof typeof validCoupons].discount,
      });
    } else {
      alert('유효하지 않은 쿠폰 코드입니다.');
    }
  };

  // 최종 결제 금액 계산
  const getFinalTotal = () => {
    const selectedTotal = getSelectedItemsTotal();
    if (!appliedCoupon) return selectedTotal;

    return selectedTotal - appliedCoupon.discount;
  };

  if (cartItems.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Header />
        <div className='container mx-auto px-4 py-16'>
          <div className='text-center'>
            <ShoppingCart className='mx-auto h-24 w-24 text-gray-400 mb-6' />
            <h2 className='text-2xl font-bold text-gray-600 mb-4'>
              장바구니가 비어있습니다
            </h2>
            <p className='text-gray-500 mb-8'>다양한 액상을 둘러보세요!</p>
            <Link
              href='/main'
              className='bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors'
            >
              쇼핑 계속하기
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      <main className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* 광고 영역 */}
          <div className='w-full lg:w-64'>
            <SidebarAd position='left' />
          </div>

          {/* 장바구니 메인 콘텐츠 */}
          <div className='flex-1'>
            <div className='bg-white rounded-lg shadow-sm'>
              {/* 헤더 */}
              <div className='p-6 border-b'>
                <h1 className='text-2xl font-bold text-gray-900 flex items-center'>
                  <ShoppingCart className='mr-3 h-6 w-6' />
                  장바구니 ({getTotalItems()}개)
                </h1>
              </div>

              {/* 전체 선택 */}
              <div className='p-4 border-b bg-gray-50'>
                <div className='flex items-center justify-between'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={
                        selectedItems.length === cartItems.length &&
                        cartItems.length > 0
                      }
                      onChange={toggleSelectAll}
                      className='w-4 h-4 text-green-500 rounded border-gray-300'
                    />
                    <span className='ml-2 text-sm font-medium'>
                      전체선택 ({selectedItems.length}/{cartItems.length})
                    </span>
                  </label>
                  <button
                    onClick={clearCart}
                    className='text-sm text-gray-500 hover:text-red-500 flex items-center'
                  >
                    <Trash2 className='w-4 h-4 mr-1' />
                    전체삭제
                  </button>
                </div>
              </div>

              {/* 장바구니 아이템 목록 */}
              <div className='divide-y'>
                {cartItems.map((item) => (
                  <div key={item.id} className='p-6'>
                    <div className='flex items-start space-x-4'>
                      {/* 선택 체크박스 */}
                      <input
                        type='checkbox'
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelect(item.id)}
                        className='w-4 h-4 text-green-500 rounded border-gray-300 mt-2'
                      />

                      {/* 상품 이미지 */}
                      <div className='w-20 h-20 bg-gray-200 rounded-lg overflow-hidden'>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className='w-full h-full object-cover'
                        />
                      </div>

                      {/* 상품 정보 */}
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {item.name}
                        </h3>
                        <p className='text-sm text-gray-500 mt-1'>
                          {item.brand}
                        </p>
                        <p className='text-lg font-bold text-green-600 mt-2'>
                          {item.price.toLocaleString()}원
                        </p>
                      </div>

                      {/* 수량 조절 */}
                      <div className='flex items-center space-x-3'>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                        >
                          <Minus className='w-4 h-4' />
                        </button>
                        <span className='w-12 text-center font-medium'>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                        >
                          <Plus className='w-4 h-4' />
                        </button>
                      </div>

                      {/* 삭제 버튼 */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className='text-gray-400 hover:text-red-500'
                      >
                        <X className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 주문 요약 */}
          <div className='w-full lg:w-80'>
            <div className='bg-white rounded-lg shadow-sm p-6 sticky top-4'>
              <h2 className='text-lg font-bold mb-4'>주문 요약</h2>

              {/* 쿠폰 입력 */}
              <div className='mb-4'>
                <div className='flex space-x-2'>
                  <input
                    type='text'
                    placeholder='쿠폰 코드 입력'
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm'
                  />
                  <button
                    onClick={applyCoupon}
                    className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200'
                  >
                    적용
                  </button>
                </div>
                {appliedCoupon && (
                  <div className='mt-2 text-sm text-green-600'>
                    쿠폰 '{appliedCoupon.code}' 적용됨 (-
                    {appliedCoupon.discount.toLocaleString()}원)
                  </div>
                )}
              </div>

              {/* 가격 정보 */}
              <div className='space-y-3 mb-6'>
                <div className='flex justify-between text-sm'>
                  <span>상품금액 ({selectedItems.length}개)</span>
                  <span>{getSelectedItemsTotal().toLocaleString()}원</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>배송비</span>
                  <span>무료</span>
                </div>
                {appliedCoupon && (
                  <div className='flex justify-between text-sm text-red-500'>
                    <span>쿠폰 할인</span>
                    <span>-{appliedCoupon.discount.toLocaleString()}원</span>
                  </div>
                )}
                <div className='border-t pt-3'>
                  <div className='flex justify-between font-bold text-lg'>
                    <span>총 결제금액</span>
                    <span className='text-green-600'>
                      {getFinalTotal().toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>

              {/* 주문 버튼 */}
              <button
                disabled={selectedItems.length === 0}
                className='w-full bg-green-500 text-white py-4 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center'
              >
                <CreditCard className='w-5 h-5 mr-2' />
                주문하기
                <ArrowRight className='w-4 h-4 ml-2' />
              </button>

              {/* 배송 정보 */}
              <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
                <div className='flex items-center text-sm text-blue-700'>
                  <Truck className='w-4 h-4 mr-2' />
                  <span>50,000원 이상 무료배송</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
