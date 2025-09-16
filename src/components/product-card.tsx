import Image from 'next/image';
import Link from 'next/link';
import { Star, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  lowestPrice: number;
  averagePrice: number;
  sellers: number;
  rating: number;
  reviewCount: number;
  specs: {
    nicotine: string;
    volume: string;
    pgvg: string;
    flavor: string;
  };
}

export default function ProductCard({
  id,
  name,
  image,
  lowestPrice,
  averagePrice,
  sellers,
  rating,
  reviewCount,
  specs,
}: ProductCardProps) {
  // Format price with comma
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Calculate discount percentage
  const discountPercentage = Math.round((1 - lowestPrice / averagePrice) * 100);

  return (
    <div className='bg-card rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden'>
      <div className='relative'>
        <Link href={`/product/${id}`}>
          <div className='aspect-square overflow-hidden'>
            <Image
              src={image || '/placeholder.svg'}
              alt={name}
              width={300}
              height={300}
              className='object-cover w-full h-full hover:scale-105 transition-transform duration-300'
            />
          </div>
        </Link>
      </div>

      <div className='p-4'>
        <Link href={`/product/${id}`}>
          <h3 className='font-medium text-lg mb-2 hover:text-green-500 transition-colors line-clamp-2'>
            {name}
          </h3>
        </Link>

        <div className='flex items-center mb-2'>
          <div className='flex items-center text-yellow-400 mr-1'>
            <Star className='h-4 w-4 fill-current' />
          </div>
          <span className='font-medium'>{rating}</span>
          <span className='text-muted-foreground text-sm ml-1'>
            ({reviewCount})
          </span>
        </div>

        <div className='mb-3'>
          <div className='flex items-baseline'>
            <span className='text-xl font-bold text-green-600'>
              {formatPrice(lowestPrice)}원
            </span>
            <span className='text-sm text-muted-foreground line-through ml-2 mr-2'>
              {formatPrice(averagePrice)}원
            </span>
            {discountPercentage > 0 && (
              <div className='bg-green-500 text-white text-xs font-bold px-2 py-1 rounded'>
                {discountPercentage}% 할인
              </div>
            )}
          </div>
          <div className='text-xs text-muted-foreground mt-1'>
            {sellers}개 판매처
          </div>
        </div>

        <div className='grid grid-cols-2 gap-1 text-xs mb-3'>
          <div className='bg-accent px-2 py-1 rounded'>
            니코틴: {specs.nicotine}
          </div>
          <div className='bg-accent px-2 py-1 rounded'>
            용량: {specs.volume}
          </div>
          <div className='bg-accent px-2 py-1 rounded'>PG/VG: {specs.pgvg}</div>
          <div className='bg-accent px-2 py-1 rounded'>맛: {specs.flavor}</div>
        </div>

        <div className='flex space-x-2'>
          <Link
            href={`/product/${id}`}
            className='flex-1 px-3 py-2 bg-gray-900 text-white text-center rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors'
          >
            상세보기
          </Link>
          <button className='px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-background transition-colors'>
            <ExternalLink className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}
