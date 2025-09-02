'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import LoadingPage from '@/components/loading-page';
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  Heart,
  RefreshCw,
  Truck,
  Shield,
  CreditCard,
  Gift,
  AlertCircle,
  Check,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SidebarAd from '@/components/sidebar-ad';
import Image from 'next/image';
import Link from 'next/link';

// 장바구니 아이템 인터페이스
interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number; // 할인 전 가격
  quantity: number;
  options: {
    nicotine: string;
    volume: string;
  };
  brand: string;
  stock: number;
  isSelected: boolean;
  discount?: number; // 할인율
}

// 더미 장바구니 데이터
const dummyCartItems: CartItem[] = [
  {
    id: '1',
    name: '나스티 쿠션맨 액상',
    image: '/placeholder.svg?height=120&width=120',
    price: 13500,
    originalPrice: 15000,
    quantity: 2,
    options: {
      nicotine: '9.8mg',
      volume: '30ml',
    },
    brand: '나스티',
    stock: 15,
    isSelected: true,
    discount: 10,
  },
  {
    id: '2',
    name: '코스모스 블루베리 액상',
    image: '/placeholder.svg?height=120&width=120',
    price: 12800,
    quantity: 1,
    options: {
      nicotine: '6mg',
      volume: '30ml',
    },
    brand: '코스모스',
    stock: 8,
    isSelected: true,
  },
  {
    id: '3',
    name: '맥스웰 민트 액상',
    image: '/placeholder.svg?height=120&width=120',
    price: 14200,
    originalPrice: 16000,
    quantity: 3,
    options: {
      nicotine: '3mg',
      volume: '30ml',
    },
    brand: '맥스웰',
    stock: 5,
    isSelected: false,
    discount: 15,
  },
  {
    id: '4',
    name: '더원 망고 액상',
    image: '/placeholder.svg?height=120&width=120',
    price: 11500,
    quantity: 1,
    options: {
      nicotine: '9mg',
      volume: '30ml',
    },
    brand: '더원',
    stock: 12,
    isSelected: true,
  },
];

// 추천 상품 데이터
const recommendedItems = [
  {
    id: 'r1',
    name: '베이프윌 딸기 액상',
    price: 11800,
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 'r2',
    name: '프리미어 바닐라 액상',
    price: 16800,
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 'r3',
    name: '쥬시 레몬 액상',
    price: 10200,
    image: '/placeholder.svg?height=80&width=80',
  },
];

export default function CartPage() {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: 'percent' | 'fixed';
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 사용자별 장바구니 데이터 로딩
  useEffect(() => {
    if (session?.user) {
      const loadUserCart = async () => {
        setIsLoading(true);
        try {
          // 실제로는 API 호출: `/api/cart/${session.user.id}`
          // 임시로 더미 데이터 사용
          setCartItems(dummyCartItems);
        } catch (error) {
          console.error('장바구니 로딩 실패:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadUserCart();
    }
  }, [session]);

  // 세션 로딩 중
  if (status === 'loading' || isLoading) {
    return <LoadingPage message='장바구니를 불러오는 중입니다...' />;
  }

  // 전체 선택/해제
  const toggleSelectAll = () => {
    const allSelected = cartItems.every((item) => item.isSelected);
    setCartItems((items) =>
      items.map((item) => ({
        ...item,
        isSelected: !allSelected,
      }))
    );
  };

  // 개별 아이템 선택/해제
  const toggleItemSelect = (id: string) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  // 수량 변경
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          if (newQuantity > item.stock) {
            alert(`재고가 부족합니다. (최대 ${item.stock}개)`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // 아이템 삭제
  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  // 선택된 아이템들 삭제
  const removeSelectedItems = () => {
    setCartItems((items) => items.filter((item) => !item.isSelected));
  };

  // 찜하기로 이동
  const moveToWishlist = (id: string) => {
    // 실제로는 찜 목록에 추가하는 API 호출
    removeItem(id);
    alert('찜 목록으로 이동되었습니다.');
  };

  // 쿠폰 적용
  const applyCoupon = () => {
    const coupons = {
      WELCOME10: { discount: 10, type: 'percent' as const },
      SAVE5000: { discount: 5000, type: 'fixed' as const },
      FIRST20: { discount: 20, type: 'percent' as const },
    };

    const coupon = coupons[couponCode as keyof typeof coupons];
    if (coupon) {
      setAppliedCoupon({ code: couponCode, ...coupon });
      setCouponCode('');
    } else {
      alert('유효하지 않은 쿠폰 코드입니다.');
    }
  };

  // 가격 계산
  const selectedItems = cartItems.filter((item) => item.isSelected);
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal >= 50000 ? 0 : 3000;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      couponDiscount = Math.floor(subtotal * (appliedCoupon.discount / 100));
    } else {
      couponDiscount = Math.min(appliedCoupon.discount, subtotal);
    }
  }

  const totalAmount = subtotal + shippingFee - couponDiscount;

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      <main className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Left Sidebar */}
          <div className='w-full lg:w-64'>
            <SidebarAd position='left' />
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Page Title */}
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3'>
                <ShoppingCart className='h-8 w-8 text-green-500' />
                장바구니
              </h1>
              <p className='text-gray-600'>
                선택하신 상품들을 확인하고 주문을 진행해보세요.
              </p>
            </div>

            {cartItems.length === 0 ? (
              /* Empty Cart */
              <div className='bg-white p-12 rounded-lg shadow text-center'>
                <ShoppingCart className='h-16 w-16 text-gray-300 mx-auto mb-4' />
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  장바구니가 비어있습니다
                </h3>
                <p className='text-gray-500 mb-6'>
                  원하는 상품을 장바구니에 담아보세요!
                </p>
                <Link
                  href='/main'
                  className='inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium'
                >
                  쇼핑 계속하기
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </div>
            ) : (
              <div className='space-y-6'>
                {/* Cart Actions */}
                <div className='bg-white p-4 rounded-lg shadow'>
                  <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div className='flex items-center space-x-4'>
                      <button
                        onClick={toggleSelectAll}
                        className='flex items-center space-x-2 text-gray-700 hover:text-green-600'
                      >
                        <div
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                            cartItems.every((item) => item.isSelected)
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300'
                          }`}
                        >
                          {cartItems.every((item) => item.isSelected) && (
                            <Check className='h-3 w-3' />
                          )}
                        </div>
                        <span className='font-medium'>
                          전체선택 ({selectedItems.length}/{cartItems.length})
                        </span>
                      </button>
                    </div>

                    <div className='flex space-x-2'>
                      <button
                        onClick={removeSelectedItems}
                        disabled={selectedItems.length === 0}
                        className='flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                      >
                        <Trash2 className='h-4 w-4' />
                        <span>선택삭제</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cart Items */}
                <div className='bg-white rounded-lg shadow divide-y'>
                  {cartItems.map((item) => (
                    <div key={item.id} className='p-6'>
                      <div className='flex items-start space-x-4'>
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleItemSelect(item.id)}
                          className='mt-2'
                        >
                          <div
                            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                              item.isSelected
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300'
                            }`}
                          >
                            {item.isSelected && <Check className='h-3 w-3' />}
                          </div>
                        </button>

                        {/* Product Image */}
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={120}
                          height={120}
                          className='rounded-lg object-cover border'
                        />

                        {/* Product Info */}
                        <div className='flex-1'>
                          <div className='flex justify-between items-start'>
                            <div>
                              <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                                {item.name}
                              </h3>
                              <p className='text-sm text-gray-500 mb-2'>
                                {item.brand}
                              </p>
                              <div className='flex items-center space-x-2 mb-2'>
                                <span className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded'>
                                  {item.options.nicotine}
                                </span>
                                <span className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded'>
                                  {item.options.volume}
                                </span>
                              </div>
                              <p className='text-xs text-gray-500'>
                                재고: {item.stock}개
                              </p>
                            </div>

                            {/* Actions */}
                            <div className='flex space-x-2'>
                              <button
                                onClick={() => moveToWishlist(item.id)}
                                className='p-2 text-gray-400 hover:text-red-500 transition-colors'
                                title='찜하기로 이동'
                              >
                                <Heart className='h-4 w-4' />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className='p-2 text-gray-400 hover:text-red-500 transition-colors'
                                title='삭제'
                              >
                                <X className='h-4 w-4' />
                              </button>
                            </div>
                          </div>

                          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end mt-4'>
                            {/* Price */}
                            <div className='mb-4 sm:mb-0'>
                              <div className='flex items-center space-x-2'>
                                <span className='text-2xl font-bold text-gray-900'>
                                  {formatPrice(item.price)}원
                                </span>
                                {item.originalPrice && (
                                  <>
                                    <span className='text-sm text-gray-500 line-through'>
                                      {formatPrice(item.originalPrice)}원
                                    </span>
                                    {item.discount && (
                                      <span className='px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded'>
                                        {item.discount}% 할인
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                              <p className='text-lg font-medium text-green-600 mt-1'>
                                총 {formatPrice(item.price * item.quantity)}원
                              </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className='flex items-center border rounded-lg'>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className='p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                              >
                                <Minus className='h-4 w-4' />
                              </button>
                              <span className='px-4 py-2 text-lg font-medium min-w-[60px] text-center'>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                disabled={item.quantity >= item.stock}
                                className='p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                              >
                                <Plus className='h-4 w-4' />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommended Products */}
                <div className='bg-white p-6 rounded-lg shadow'>
                  <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center'>
                    <Gift className='h-5 w-5 text-green-500 mr-2' />
                    이런 상품은 어떠세요?
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    {recommendedItems.map((product) => (
                      <div
                        key={product.id}
                        className='border rounded-lg p-4 hover:shadow-md transition-shadow'
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={80}
                          height={80}
                          className='rounded-lg object-cover mx-auto mb-3'
                        />
                        <h4 className='font-medium text-gray-900 text-sm mb-2 text-center'>
                          {product.name}
                        </h4>
                        <p className='text-green-600 font-bold text-center mb-2'>
                          {formatPrice(product.price)}원
                        </p>
                        <button className='w-full px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors'>
                          장바구니 담기
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Order Summary */}
          {cartItems.length > 0 && (
            <div className='w-full lg:w-80 space-y-6'>
              {/* Order Summary */}
              <div className='bg-white p-6 rounded-lg shadow sticky top-4'>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>
                  주문 요약
                </h3>

                {/* Coupon */}
                <div className='mb-4'>
                  <div className='flex space-x-2'>
                    <input
                      type='text'
                      placeholder='쿠폰 코드 입력'
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className='flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    />
                    <button
                      onClick={applyCoupon}
                      className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors'
                    >
                      적용
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className='mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700'>
                      <div className='flex justify-between items-center'>
                        <span>쿠폰 적용: {appliedCoupon.code}</span>
                        <button
                          onClick={() => setAppliedCoupon(null)}
                          className='text-green-600 hover:text-green-700'
                        >
                          <X className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className='space-y-3 mb-6'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>상품 금액</span>
                    <span>{formatPrice(subtotal)}원</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>배송비</span>
                    <span>
                      {shippingFee === 0
                        ? '무료'
                        : `${formatPrice(shippingFee)}원`}
                    </span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className='flex justify-between text-red-600'>
                      <span>쿠폰 할인</span>
                      <span>-{formatPrice(couponDiscount)}원</span>
                    </div>
                  )}
                  <hr />
                  <div className='flex justify-between text-lg font-bold'>
                    <span>총 결제금액</span>
                    <span className='text-green-600'>
                      {formatPrice(totalAmount)}원
                    </span>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {subtotal < 50000 && (
                  <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                    <div className='flex items-center text-blue-700 text-sm'>
                      <Truck className='h-4 w-4 mr-2' />
                      <span>
                        {formatPrice(50000 - subtotal)}원 더 주문하면 무료배송!
                      </span>
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  disabled={selectedItems.length === 0}
                  className='w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
                >
                  주문하기 ({selectedItems.length}개)
                </button>

                {/* Payment Methods */}
                <div className='mt-4 text-center'>
                  <div className='flex justify-center space-x-4 text-gray-400 mb-2'>
                    <CreditCard className='h-5 w-5' />
                    <Shield className='h-5 w-5' />
                    <Truck className='h-5 w-5' />
                  </div>
                  <p className='text-xs text-gray-500'>
                    안전한 결제 시스템으로 보호됩니다
                  </p>
                </div>
              </div>

              {/* Continue Shopping */}
              <div className='bg-white p-4 rounded-lg shadow'>
                <Link
                  href='/main'
                  className='flex items-center justify-center space-x-2 text-green-600 hover:text-green-700 font-medium'
                >
                  <RefreshCw className='h-4 w-4' />
                  <span>쇼핑 계속하기</span>
                </Link>
              </div>

              <SidebarAd position='right' />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
