'use client';

import type React from 'react';

import { useState } from 'react';
import ReviewCard from '@/components/review-card';
import { Star, ChevronDown } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState('recent');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // 샘플 리뷰 데이터
  const reviews = [
    {
      id: '1',
      author: 'user123',
      date: '2025-05-01',
      rating: 5,
      content:
        '정말 좋은 제품입니다. 멘솔 향이 강하면서도 부드러워서 좋아요. 타격감도 좋고 지속성도 괜찮습니다. 다음에도 구매할 의향이 있습니다.',
      images: ['/placeholder.svg?height=100&width=100&text=리뷰이미지1'],
      likes: 12,
      categoryRatings: {
        flavor: 5,
        hit: 4,
        durability: 5,
      },
    },
    {
      id: '2',
      author: 'vaper99',
      date: '2025-04-28',
      rating: 4,
      content:
        '멘솔 향이 강해서 좋아요. 다만 타격감이 조금 약한 느낌이 있습니다. 그래도 전체적으로 만족스러운 제품입니다.',
      images: [],
      likes: 8,
      categoryRatings: {
        flavor: 4,
        hit: 3,
        durability: 4,
      },
    },
    {
      id: '3',
      author: 'cloud_maker',
      date: '2025-04-15',
      rating: 5,
      content:
        '이 액상은 정말 추천합니다. 멘솔 향이 강하지만 목이 아프지 않고, 연기량도 적당해요. 특히 타격감이 좋아서 만족스럽습니다.',
      images: [
        '/placeholder.svg?height=100&width=100&text=리뷰이미지2',
        '/placeholder.svg?height=100&width=100&text=리뷰이미지3',
      ],
      likes: 15,
      categoryRatings: {
        flavor: 5,
        hit: 5,
        durability: 4,
      },
    },
  ];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 구현에서는 리뷰를 서버에 제출하는 로직이 필요합니다
    alert('리뷰가 제출되었습니다.');
    setShowReviewForm(false);
    setRating(5);
    setReviewText('');
  };

  return (
    <div>
      {/* 리뷰 작성 버튼 */}
      <div className='flex justify-between items-center mb-6'>
        <div className='flex items-center space-x-4'>
          <button
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'recent'
                ? 'bg-green-100 text-green-700'
                : 'bg-accent text-foreground'
            }`}
            onClick={() => setSortBy('recent')}
          >
            최신순
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'rating'
                ? 'bg-green-100 text-green-700'
                : 'bg-accent text-foreground'
            }`}
            onClick={() => setSortBy('rating')}
          >
            평점순
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'likes'
                ? 'bg-green-100 text-green-700'
                : 'bg-accent text-foreground'
            }`}
            onClick={() => setSortBy('likes')}
          >
            추천순
          </button>
        </div>
        <button
          className='px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors'
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          리뷰 작성
        </button>
      </div>

      {/* 리뷰 작성 폼 */}
      {showReviewForm && (
        <div className='bg-background p-4 rounded-lg mb-6'>
          <h3 className='font-medium mb-4'>리뷰 작성</h3>
          <form onSubmit={handleSubmitReview}>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-foreground mb-1'>
                평점
              </label>
              <div className='flex items-center'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type='button'
                    onClick={() => setRating(star)}
                    className='text-yellow-400 focus:outline-none'
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating >= star ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-foreground mb-1'>
                항목별 평가
              </label>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm text-gray-600 mb-1'>향</label>
                  <div className='flex items-center'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className='h-4 w-4 text-yellow-400' />
                    ))}
                  </div>
                </div>
                <div>
                  <label className='block text-sm text-gray-600 mb-1'>
                    타격감
                  </label>
                  <div className='flex items-center'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className='h-4 w-4 text-yellow-400' />
                    ))}
                  </div>
                </div>
                <div>
                  <label className='block text-sm text-gray-600 mb-1'>
                    지속성
                  </label>
                  <div className='flex items-center'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className='h-4 w-4 text-yellow-400' />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-foreground mb-1'>
                리뷰 내용
              </label>
              <textarea
                className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-green-500'
                rows={4}
                placeholder='제품에 대한 솔직한 의견을 작성해주세요.'
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              ></textarea>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-foreground mb-1'>
                사진 첨부 (선택)
              </label>
              <div className='flex items-center justify-center w-full'>
                <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent'>
                  <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                    <svg
                      className='w-8 h-8 mb-4 text-muted-foreground'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 20 16'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                      />
                    </svg>
                    <p className='mb-2 text-sm text-muted-foreground'>
                      <span className='font-semibold'>클릭하여 업로드</span>{' '}
                      또는 드래그 앤 드롭
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      PNG, JPG (최대 5MB)
                    </p>
                  </div>
                  <input
                    id='dropzone-file'
                    type='file'
                    className='hidden'
                    multiple
                    accept='image/*'
                  />
                </label>
              </div>
            </div>

            <div className='flex justify-end space-x-2'>
              <button
                type='button'
                className='px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-background transition-colors'
                onClick={() => setShowReviewForm(false)}
              >
                취소
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors'
              >
                리뷰 등록
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 리뷰 목록 */}
      <div className='space-y-6'>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* 더보기 버튼 */}
      <div className='mt-6 text-center'>
        <button className='flex items-center justify-center mx-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-background transition-colors'>
          더 보기
          <ChevronDown className='h-4 w-4 ml-1' />
        </button>
      </div>
    </div>
  );
}
