'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import LoadingPage from '@/components/loading-page';
import {
  ShoppingBag,
  Search,
  Filter,
  ChevronDown,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Star,
  MessageSquare,
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SidebarAd from '@/components/sidebar-ad';
import Image from 'next/image';

// 주문 상태 타입
type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// 주문 아이템 인터페이스
interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  options?: string;
}

// 주문 인터페이스
interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

// 더미 주문 데이터
const dummyOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'JP-2024-001234',
    date: '2024-01-20',
    status: 'delivered',
    items: [
      {
        id: '1',
        name: '나스티 쿠션맨 액상',
        image: '/placeholder.svg?height=80&width=80',
        price: 15000,
        quantity: 2,
        options: '9.8mg, 30ml',
      },
      {
        id: '2',
        name: '코스모스 블루베리 액상',
        image: '/placeholder.svg?height=80&width=80',
        price: 13500,
        quantity: 1,
        options: '6mg, 30ml',
      },
    ],
    totalAmount: 43500,
    shippingFee: 3000,
    discountAmount: 2000,
    finalAmount: 44500,
    shippingAddress: '서울시 강남구 테헤란로 123',
    trackingNumber: '1234567890',
    estimatedDelivery: '2024-01-22',
  },
  {
    id: '2',
    orderNumber: 'JP-2024-001235',
    date: '2024-01-18',
    status: 'shipped',
    items: [
      {
        id: '3',
        name: '맥스웰 민트 액상',
        image: '/placeholder.svg?height=80&width=80',
        price: 14200,
        quantity: 3,
        options: '3mg, 30ml',
      },
    ],
    totalAmount: 42600,
    shippingFee: 0,
    discountAmount: 1000,
    finalAmount: 41600,
    shippingAddress: '서울시 강남구 테헤란로 123',
    trackingNumber: '0987654321',
    estimatedDelivery: '2024-01-20',
  },
  {
    id: '3',
    orderNumber: 'JP-2024-001236',
    date: '2024-01-15',
    status: 'processing',
    items: [
      {
        id: '4',
        name: '더원 망고 액상',
        image: '/placeholder.svg?height=80&width=80',
        price: 12800,
        quantity: 1,
        options: '9mg, 30ml',
      },
      {
        id: '5',
        name: '베이프윌 딸기 액상',
        image: '/placeholder.svg?height=80&width=80',
        price: 11500,
        quantity: 2,
        options: '6mg, 30ml',
      },
    ],
    totalAmount: 35800,
    shippingFee: 3000,
    discountAmount: 0,
    finalAmount: 38800,
    shippingAddress: '서울시 강남구 테헤란로 123',
    estimatedDelivery: '2024-01-18',
  },
  {
    id: '4',
    orderNumber: 'JP-2024-001237',
    date: '2024-01-10',
    status: 'cancelled',
    items: [
      {
        id: '6',
        name: '프리미어 바닐라 액상',
        image: '/placeholder.svg?height=80&width=80',
        price: 16800,
        quantity: 1,
        options: '3mg, 30ml',
      },
    ],
    totalAmount: 16800,
    shippingFee: 3000,
    discountAmount: 500,
    finalAmount: 19300,
    shippingAddress: '서울시 강남구 테헤란로 123',
  },
];

// 주문 상태별 스타일
const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock className='h-4 w-4' />,
        label: '주문확인중',
      };
    case 'processing':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <Package className='h-4 w-4' />,
        label: '상품준비중',
      };
    case 'shipped':
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        icon: <Truck className='h-4 w-4' />,
        label: '배송중',
      };
    case 'delivered':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className='h-4 w-4' />,
        label: '배송완료',
      };
    case 'cancelled':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircle className='h-4 w-4' />,
        label: '주문취소',
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: <Clock className='h-4 w-4' />,
        label: '확인중',
      };
  }
};

// 필터 옵션
const filterOptions = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '주문확인중' },
  { value: 'processing', label: '상품준비중' },
  { value: 'shipped', label: '배송중' },
  { value: 'delivered', label: '배송완료' },
  { value: 'cancelled', label: '주문취소' },
];

export default function MyOrders() {
  const { data: session, status } = useSession();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 사용자별 주문 데이터 로딩
  useEffect(() => {
    if (session?.user) {
      const loadUserOrders = async () => {
        setIsLoading(true);
        try {
          // 실제로는 API 호출: `/api/orders/${session.user.id}`
          // 임시로 더미 데이터 사용
          setOrders(dummyOrders);
        } catch (error) {
          console.error('주문 내역 로딩 실패:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadUserOrders();
    }
  }, [session]);

  // 세션 로딩 중
  if (status === 'loading' || isLoading) {
    return <LoadingPage message='주문 내역을 불러오는 중입니다...' />;
  }

  // 필터링 및 검색 로직
  const filteredOrders = orders
    .filter((order) => {
      if (selectedFilter !== 'all' && order.status !== selectedFilter)
        return false;
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchLower)
          )
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 주문 통계 계산
  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      <main className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Left Sidebar */}
          <div className='w-full lg:w-64 space-y-6'>
            <SidebarAd position='left' />

            {/* Profile Menu */}
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>마이페이지</h3>
              <nav className='space-y-2'>
                <button className='w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors'>
                  프로필
                </button>
                <button className='w-full text-left px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium'>
                  주문 내역
                </button>
                <button className='w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors'>
                  찜한 상품
                </button>
                <button className='w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors'>
                  작성 리뷰
                </button>
                <button className='w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors'>
                  포인트 내역
                </button>
                <button className='w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors'>
                  알림 설정
                </button>
              </nav>
            </div>

            {/* Order Stats */}
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>주문 현황</h3>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>전체 주문</span>
                  <span className='font-medium text-gray-900'>
                    {orderStats.total}건
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>배송중</span>
                  <span className='font-medium text-purple-600'>
                    {orderStats.shipped}건
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>배송완료</span>
                  <span className='font-medium text-green-600'>
                    {orderStats.delivered}건
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>상품준비중</span>
                  <span className='font-medium text-blue-600'>
                    {orderStats.processing}건
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Page Title */}
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3'>
                <ShoppingBag className='h-8 w-8 text-green-500' />
                주문 내역
              </h1>
              <p className='text-gray-600'>
                주문하신 상품의 배송 현황을 확인할 수 있습니다.
              </p>
            </div>

            {/* Search and Filter */}
            <div className='bg-white p-4 rounded-lg shadow mb-6'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1'>
                  <input
                    type='text'
                    placeholder='주문번호 또는 상품명 검색'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  />
                  <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                </div>

                <div className='flex gap-2'>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className='px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  >
                    {filterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className='px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  >
                    <option value='newest'>최신순</option>
                    <option value='oldest'>과거순</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className='space-y-6'>
              {filteredOrders.length === 0 ? (
                <div className='bg-white p-8 rounded-lg shadow text-center'>
                  <ShoppingBag className='h-12 w-12 text-gray-300 mx-auto mb-4' />
                  <p className='text-gray-500 mb-2'>주문 내역이 없습니다</p>
                  <p className='text-sm text-gray-400'>
                    첫 주문을 시작해보세요!
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const statusStyle = getStatusStyle(order.status);
                  return (
                    <div
                      key={order.id}
                      className='bg-white rounded-lg shadow overflow-hidden'
                    >
                      {/* Order Header */}
                      <div className='p-4 border-b border-gray-200 bg-gray-50'>
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                          <div>
                            <h3 className='text-lg font-semibold text-gray-900'>
                              {order.orderNumber}
                            </h3>
                            <p className='text-sm text-gray-600'>
                              {formatDate(order.date)}
                            </p>
                          </div>

                          <div className='flex items-center gap-3'>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                            >
                              {statusStyle.icon}
                              <span className='ml-1'>{statusStyle.label}</span>
                            </span>

                            {order.trackingNumber && (
                              <button className='text-sm text-blue-600 hover:text-blue-700 font-medium'>
                                배송조회
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className='p-4'>
                        <div className='space-y-4'>
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className='flex items-center space-x-4'
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={60}
                                height={60}
                                className='rounded-lg object-cover border'
                              />

                              <div className='flex-1'>
                                <h4 className='font-medium text-gray-900'>
                                  {item.name}
                                </h4>
                                {item.options && (
                                  <p className='text-sm text-gray-500'>
                                    {item.options}
                                  </p>
                                )}
                                <p className='text-sm text-gray-600'>
                                  {formatPrice(item.price)}원 × {item.quantity}
                                  개
                                </p>
                              </div>

                              <div className='text-right'>
                                <p className='font-medium text-gray-900'>
                                  {formatPrice(item.price * item.quantity)}원
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Summary */}
                        <div className='mt-4 pt-4 border-t border-gray-200'>
                          <div className='flex justify-between items-start'>
                            <div className='text-sm text-gray-600'>
                              <p className='mb-1'>
                                배송지: {order.shippingAddress}
                              </p>
                              {order.estimatedDelivery && (
                                <p>
                                  예상 배송일:{' '}
                                  {formatDate(order.estimatedDelivery)}
                                </p>
                              )}
                            </div>

                            <div className='text-right space-y-1'>
                              <div className='flex justify-between min-w-[200px]'>
                                <span className='text-sm text-gray-600'>
                                  상품금액:
                                </span>
                                <span className='text-sm'>
                                  {formatPrice(order.totalAmount)}원
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-sm text-gray-600'>
                                  배송비:
                                </span>
                                <span className='text-sm'>
                                  {formatPrice(order.shippingFee)}원
                                </span>
                              </div>
                              {order.discountAmount > 0 && (
                                <div className='flex justify-between'>
                                  <span className='text-sm text-gray-600'>
                                    할인:
                                  </span>
                                  <span className='text-sm text-red-600'>
                                    -{formatPrice(order.discountAmount)}원
                                  </span>
                                </div>
                              )}
                              <div className='flex justify-between font-semibold text-lg pt-1 border-t'>
                                <span>총 결제금액:</span>
                                <span className='text-green-600'>
                                  {formatPrice(order.finalAmount)}원
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2'>
                          <button className='flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm'>
                            <Eye className='h-4 w-4' />
                            <span>주문상세</span>
                          </button>

                          {order.status === 'delivered' && (
                            <>
                              <button className='flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm'>
                                <Star className='h-4 w-4' />
                                <span>리뷰작성</span>
                              </button>
                              <button className='flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm'>
                                <RefreshCw className='h-4 w-4' />
                                <span>재주문</span>
                              </button>
                            </>
                          )}

                          {order.status === 'pending' && (
                            <button className='flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm'>
                              <XCircle className='h-4 w-4' />
                              <span>주문취소</span>
                            </button>
                          )}

                          <button className='flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm'>
                            <MessageSquare className='h-4 w-4' />
                            <span>문의하기</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Load More */}
            {filteredOrders.length > 0 && (
              <div className='mt-8 text-center'>
                <button className='px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium'>
                  더 많은 주문 보기
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className='w-full lg:w-64'>
            <SidebarAd position='right' />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
