import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    original_price?: number | null;
    discount_percentage?: number | null;
    rating?: number | null;
    review_count?: number | null;
    image_url: string;
    nicotine?: string | null;
    volume?: string | null;
    flavor?: string | null;
    in_stock?: boolean | null;
    sellers_count?: number | null;
  };
  onAddToCart?: () => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  // Format price with comma
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Calculate discount percentage if original price exists
  const discountPercentage =
    product.original_price && product.original_price > product.price
      ? Math.round((1 - product.price / product.original_price) * 100)
      : product.discount_percentage || 0;

  return (
    <div className='bg-card rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden'>
      <div className='relative'>
        <Link href={`/product/${product.id}`}>
          <div className='aspect-square overflow-hidden'>
            <Image
              src={product.image_url || '/placeholder.svg'}
              alt={product.name}
              width={300}
              height={300}
              className='object-cover w-full h-full hover:scale-105 transition-transform duration-300'
            />
          </div>
        </Link>
      </div>

      <div className='p-4'>
        <Link href={`/product/${product.id}`}>
          <h3 className='font-medium text-lg mb-2 hover:text-green-500 transition-colors line-clamp-2'>
            {product.name}
          </h3>
        </Link>

        <div className='text-sm text-muted-foreground mb-2'>
          {product.brand}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className='flex items-center mb-2'>
            <div className='flex items-center text-yellow-400 mr-1'>
              <Star className='h-4 w-4 fill-current' />
            </div>
            <span className='font-medium'>{product.rating}</span>
            {product.review_count && (
              <span className='text-muted-foreground text-sm ml-1'>
                ({product.review_count})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className='mb-3'>
          <div className='flex items-baseline flex-wrap gap-2'>
            <span className='text-xl font-bold text-green-600'>
              {formatPrice(product.price)}원
            </span>
            {product.original_price &&
              product.original_price > product.price && (
                <span className='text-sm text-muted-foreground line-through'>
                  {formatPrice(product.original_price)}원
                </span>
              )}
            {discountPercentage > 0 && (
              <div className='bg-green-500 text-white text-xs font-bold px-2 py-1 rounded'>
                {discountPercentage}% 할인
              </div>
            )}
          </div>
          {product.sellers_count && (
            <div className='text-xs text-muted-foreground mt-1'>
              {product.sellers_count}개 판매처
            </div>
          )}
        </div>

        {/* Product Specs */}
        <div className='grid grid-cols-2 gap-1 text-xs mb-3'>
          {product.nicotine && (
            <div className='bg-accent px-2 py-1 rounded'>
              니코틴: {product.nicotine}
            </div>
          )}
          {product.volume && (
            <div className='bg-accent px-2 py-1 rounded'>
              용량: {product.volume}
            </div>
          )}
          {product.flavor && (
            <div className='bg-accent px-2 py-1 rounded col-span-2'>
              맛: {product.flavor}
            </div>
          )}
        </div>

        {/* Stock Status */}
        {product.in_stock === false && (
          <div className='text-red-500 text-sm font-medium mb-2'>품절</div>
        )}

        {/* Action Buttons */}
        <div className='flex space-x-2'>
          <Link
            href={`/product/${product.id}`}
            className='flex-1 px-3 py-2 bg-gray-900 text-white text-center rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors'
          >
            상세보기
          </Link>
          {onAddToCart && product.in_stock !== false && (
            <button
              onClick={onAddToCart}
              className='px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-background transition-colors'
            >
              <ShoppingCart className='h-4 w-4' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
