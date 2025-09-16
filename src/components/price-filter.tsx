'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';

export default function PriceFilter() {
  const [priceRange, setPriceRange] = useState([0, 30000]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  return (
    <div className='bg-card p-4 rounded-lg shadow'>
      <h3 className='font-bold text-lg mb-3'>가격 필터</h3>

      <div className='space-y-4'>
        <Slider
          defaultValue={[0, 30000]}
          max={50000}
          step={1000}
          value={priceRange}
          onValueChange={handlePriceChange}
          className='mt-6'
        />

        <div className='flex items-center justify-between'>
          <div className='px-3 py-1 bg-accent rounded text-sm'>
            {priceRange[0].toLocaleString()}원
          </div>
          <div className='px-3 py-1 bg-accent rounded text-sm'>
            {priceRange[1].toLocaleString()}원
          </div>
        </div>

        <div className='grid grid-cols-3 gap-2'>
          <button
            className='px-2 py-1 text-xs border rounded hover:bg-background transition-colors'
            onClick={() => setPriceRange([0, 10000])}
          >
            ~1만원
          </button>
          <button
            className='px-2 py-1 text-xs border rounded hover:bg-background transition-colors'
            onClick={() => setPriceRange([10000, 20000])}
          >
            1~2만원
          </button>
          <button
            className='px-2 py-1 text-xs border rounded hover:bg-background transition-colors'
            onClick={() => setPriceRange([20000, 50000])}
          >
            2만원~
          </button>
        </div>

        <button className='w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors'>
          가격 적용
        </button>
      </div>
    </div>
  );
}
