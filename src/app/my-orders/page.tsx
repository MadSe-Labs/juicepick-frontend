'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useOrderStore } from '@/stores/useOrderStore';
import LoadingPage from '@/components/loading-page';
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  CreditCard,
  MapPin,
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SidebarAd from '@/components/sidebar-ad';
import Image from 'next/image';
import { Order, StatusTypes } from '@/types/order';

const statusConfig: Record<StatusTypes, Record<string, any>> = {
  pending: {
    label: '주문접수',
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    icon: Clock,
  },
  processing: {
    label: '처리중',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    icon: Package,
  },
  shipped: {
    label: '배송중',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    icon: Truck,
  },
  delivered: {
    label: '배송완료',
    color: 'text-green-600',
    bg: 'bg-green-100',
    icon: CheckCircle,
  },
  cancelled: {
    label: '주문취소',
    color: 'text-red-600',
    bg: 'bg-red-100',
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const { getOrdersByUserId } = useOrderStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      const userOrders = getOrdersByUserId(session.user.id);
      setOrders(userOrders);
      setIsLoading(false);
    } else if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [session, status, getOrdersByUserId]);

  if (status === 'loading' || isLoading) {
    return <LoadingPage />;
  }

  if (!session) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Header />
        <div className='container mx-auto px-4 py-16 text-center'>
          <h2 className='text-2xl font-bold text-gray-600 mb-4'>
            로그인이 필요합니다
          </h2>
        </div>
        <Footer />
      </div>
    );
  }

  const openOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      <main className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* 광고 영역 */}
          <div className='w-full lg:w-64'>
            <SidebarAd position='left' />
          </div>

          {/* 주문 메인 콘텐츠 */}
          <div className='flex-1'>
            <div className='bg-white rounded-lg shadow-sm'>
              {/* 헤더 */}
              <div className='p-6 border-b'>
                <h1 className='text-2xl font-bold text-gray-900 flex items-center'>
                  <Package className='mr-3 h-6 w-6' />
                  주문 내역 ({orders.length})
                </h1>
              </div>

              {orders.length === 0 ? (
                <div className='p-12 text-center'>
                  <Package className='mx-auto h-16 w-16 text-gray-400 mb-4' />
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    주문 내역이 없습니다
                  </h3>
                  <p className='text-gray-500 mb-6'>첫 주문을 시작해보세요!</p>
                  <button className='bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600'>
                    쇼핑하러 가기
                  </button>
                </div>
              ) : (
                <div className='divide-y'>
                  {orders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon;
                    return (
                      <div key={order.id} className='p-6'>
                        <div className='flex items-start justify-between mb-4'>
                          <div>
                            <div className='flex items-center space-x-3 mb-2'>
                              <h3 className='text-lg font-semibold'>
                                주문번호: {order.id}
                              </h3>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  statusConfig[order.status].bg
                                } ${statusConfig[order.status].color}`}
                              >
                                <StatusIcon className='w-3 h-3 mr-1' />
                                {statusConfig[order.status].label}
                              </span>
                            </div>
                            <div className='flex items-center text-sm text-gray-500 space-x-4'>
                              <div className='flex items-center'>
                                <Calendar className='w-4 h-4 mr-1' />
                                주문일: {order.orderDate}
                              </div>
                              {order.deliveryDate && (
                                <div className='flex items-center'>
                                  <Truck className='w-4 h-4 mr-1' />
                                  배송완료: {order.deliveryDate}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => openOrderDetail(order)}
                            className='flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50'
                          >
                            <Eye className='w-4 h-4 mr-1' />
                            상세보기
                          </button>
                        </div>

                        {/* 주문 상품 미리보기 */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
                          {order.items
                            .slice(0, 3)
                            .map((item: any, index: number) => (
                              <div
                                key={index}
                                className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'
                              >
                                <div className='w-12 h-12 bg-gray-200 rounded-lg overflow-hidden'>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={48}
                                    height={48}
                                    className='w-full h-full object-cover'
                                  />
                                </div>
                                <div className='flex-1 min-w-0'>
                                  <p className='text-sm font-medium text-gray-900 truncate'>
                                    {item.name}
                                  </p>
                                  <p className='text-xs text-gray-500'>
                                    {item.quantity}개 ×{' '}
                                    {item.price.toLocaleString()}원
                                  </p>
                                </div>
                              </div>
                            ))}
                          {order.items.length > 3 && (
                            <div className='flex items-center justify-center p-3 bg-gray-100 rounded-lg text-sm text-gray-600'>
                              외 {order.items.length - 3}개 상품
                            </div>
                          )}
                        </div>

                        {/* 주문 금액 */}
                        <div className='flex items-center justify-between pt-4 border-t'>
                          <div className='flex items-center text-sm text-gray-500'>
                            <CreditCard className='w-4 h-4 mr-1' />총{' '}
                            {order.items.length}개 상품
                          </div>
                          <div className='text-lg font-bold text-green-600'>
                            {order.totalAmount.toLocaleString()}원
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 주문 상세 모달 */}
      {showModal && selectedOrder && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold'>주문 상세 정보</h2>
                <button
                  onClick={closeModal}
                  className='text-gray-400 hover:text-gray-600'
                >
                  <XCircle className='w-6 h-6' />
                </button>
              </div>
            </div>

            <div className='p-6'>
              {/* 주문 정보 */}
              <div className='mb-6'>
                <h3 className='font-semibold mb-3'>주문 정보</h3>
                <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>주문번호</span>
                    <span className='font-medium'>{selectedOrder.id}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>주문일시</span>
                    <span>{selectedOrder.orderDate}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>주문상태</span>
                    <span
                      className={`${
                        statusConfig[selectedOrder.status].color
                      } font-medium`}
                    >
                      {statusConfig[selectedOrder.status].label}
                    </span>
                  </div>
                  {selectedOrder.deliveryDate && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>배송완료일</span>
                      <span>{selectedOrder.deliveryDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 배송지 정보 */}
              <div className='mb-6'>
                <h3 className='font-semibold mb-3 flex items-center'>
                  <MapPin className='w-4 h-4 mr-2' />
                  배송지 정보
                </h3>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <p className='font-medium'>
                    {selectedOrder.shippingAddress.name}
                  </p>
                  <p className='text-sm text-gray-600 mt-1'>
                    {selectedOrder.shippingAddress.phone}
                  </p>
                  <p className='text-sm text-gray-600 mt-1'>
                    ({selectedOrder.shippingAddress.zipCode}){' '}
                    {selectedOrder.shippingAddress.address}{' '}
                    {selectedOrder.shippingAddress.detailAddress}
                  </p>
                </div>
              </div>

              {/* 주문 상품 */}
              <div className='mb-6'>
                <h3 className='font-semibold mb-3'>주문 상품</h3>
                <div className='space-y-3'>
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className='flex items-center space-x-4 p-4 border border-gray-200 rounded-lg'
                    >
                      <div className='w-16 h-16 bg-gray-200 rounded-lg overflow-hidden'>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-medium'>{item.name}</h4>
                        <p className='text-sm text-gray-600'>{item.brand}</p>
                        <p className='text-sm text-gray-500'>
                          {item.quantity}개 × {item.price.toLocaleString()}원
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium'>
                          {(item.quantity * item.price).toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 결제 정보 */}
              <div className='border-t pt-6'>
                <h3 className='font-semibold mb-3 flex items-center'>
                  <CreditCard className='w-4 h-4 mr-2' />
                  결제 정보
                </h3>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <div className='flex justify-between mb-2'>
                    <span className='text-gray-600'>상품금액</span>
                    <span>{selectedOrder.totalAmount.toLocaleString()}원</span>
                  </div>
                  <div className='flex justify-between mb-2'>
                    <span className='text-gray-600'>배송비</span>
                    <span>무료</span>
                  </div>
                  <div className='border-t pt-2 mt-2'>
                    <div className='flex justify-between font-bold text-lg'>
                      <span>총 결제금액</span>
                      <span className='text-green-600'>
                        {selectedOrder.totalAmount.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
