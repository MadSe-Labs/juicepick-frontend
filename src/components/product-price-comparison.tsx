import { ExternalLink, Truck, Clock } from 'lucide-react';
import Link from 'next/link';

interface Seller {
  name: string;
  price: number;
  shipping: number;
  isFreeShipping: boolean;
  isSameDay: boolean;
  url: string;
}

interface ProductPriceComparisonProps {
  sellers: Seller[];
}

export default function ProductPriceComparison({
  sellers,
}: ProductPriceComparisonProps) {
  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 판매처를 가격 순으로 정렬
  const sortedSellers = [...sellers].sort(
    (a, b) => a.price + a.shipping - (b.price + b.shipping)
  );

  return (
    <div className='border rounded-lg overflow-hidden'>
      <table className='w-full'>
        <thead className='bg-background'>
          <tr>
            <th className='px-4 py-3 text-left text-sm font-medium text-foreground'>
              판매처
            </th>
            <th className='px-4 py-3 text-left text-sm font-medium text-foreground'>
              판매가
            </th>
            <th className='px-4 py-3 text-left text-sm font-medium text-foreground'>
              배송비
            </th>
            <th className='px-4 py-3 text-left text-sm font-medium text-foreground'>
              총 가격
            </th>
            <th className='px-4 py-3 text-left text-sm font-medium text-foreground'>
              배송 정보
            </th>
            <th className='px-4 py-3 text-left text-sm font-medium text-foreground'></th>
          </tr>
        </thead>
        <tbody>
          {sortedSellers.map((seller, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-card' : 'bg-background'}
            >
              <td className='px-4 py-3 border-t border-gray-200 font-medium'>
                {seller.name}
              </td>
              <td className='px-4 py-3 border-t border-gray-200'>
                {formatPrice(seller.price)}원
              </td>
              <td className='px-4 py-3 border-t border-gray-200'>
                {seller.isFreeShipping
                  ? '무료'
                  : `${formatPrice(seller.shipping)}원`}
              </td>
              <td className='px-4 py-3 border-t border-gray-200 font-medium'>
                {formatPrice(seller.price + seller.shipping)}원
              </td>
              <td className='px-4 py-3 border-t border-gray-200'>
                <div className='flex items-center space-x-2'>
                  {seller.isFreeShipping && (
                    <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
                      <Truck className='h-3 w-3 mr-1' />
                      무료배송
                    </span>
                  )}
                  {seller.isSameDay && (
                    <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800'>
                      <Clock className='h-3 w-3 mr-1' />
                      당일배송
                    </span>
                  )}
                </div>
              </td>
              <td className='px-4 py-3 border-t border-gray-200'>
                <Link
                  href={seller.url}
                  target='_blank'
                  className='inline-flex items-center px-3 py-1 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors'
                >
                  구매하기
                  <ExternalLink className='h-3 w-3 ml-1' />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
