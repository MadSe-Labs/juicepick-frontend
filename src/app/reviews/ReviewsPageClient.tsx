'use client';

import {
  Search,
  Filter,
  Star,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Calendar,
  Award,
} from 'lucide-react';
import SidebarAd from '@/components/sidebar-ad';
import SupabaseConnectionError from '@/components/supabase-connection-error';
import Image from 'next/image';
import { MOCK_TOP_REVIEWERS, FILTER_TAGS } from '@/lib/mockData';
import { useReviewsWithSearch } from '@/hooks/useReviews';
import { usePagination } from '@/hooks/usePagination';
import { Review } from '@/types/review';
import LoadMoreButton from '@/components/load-more-button';
import { useState } from 'react';

export default function ReviewsPageClient() {
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  // 리뷰 데이터 가져오기 (Supabase에서)
  const {
    data: searchResults = [],
    isLoading,
    error: reviewsError,
  } = useReviewsWithSearch(
    searchQuery,
    selectedRatings,
    selectedTags,
    showVerifiedOnly
  );

  // 페이지네이션 커스텀 훅 사용
  const {
    displayedItems: displayedProducts,
    totalItems: totalProducts,
    hasMoreItems: hasMoreProducts,
    remainingCount,
    isLoadingMore,
    handleLoadMore,
  } = usePagination({
    items: searchResults,
    itemsPerPage: 6,
    dependencies: [searchResults],
  });

  const hasActiveFilters =
    selectedRatings.length > 0 || selectedTags.length > 0 || showVerifiedOnly;

  const handleTagChange = (tag: string, isSelected: boolean) => {
    if (tag === '전체') {
      setSelectedTags([]);
      return;
    }

    if (isSelected) {
      setSelectedTags((prev) => [...prev, tag]);
    } else {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    }
  };

  const handleRatingChange = (rating: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedRatings((prev) => [...prev, rating]);
    } else {
      setSelectedRatings((prev) => prev.filter((r) => r !== rating));
    }
  };

  const executeSearch = () => {
    // 검색은 실시간으로 진행됨 (useReviewsWithSearch에서 처리)
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return <div className='container mx-auto px-4 py-8'>로딩 중...</div>;
  }

  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Left Sidebar */}
        <div className='w-full lg:w-64 space-y-6'>
          <SidebarAd position='left' />

          {/* Filter Tags */}
          <div className='bg-card p-4 rounded-lg shadow'>
            <h3 className='font-bold text-lg mb-3'>태그 필터</h3>
            <div className='flex flex-wrap gap-2'>
              {FILTER_TAGS.map((tag, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleTagChange(tag, !selectedTags.includes(tag))
                  }
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    tag === '전체'
                      ? selectedTags.length === 0
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-card text-foreground border-gray-300 hover:bg-background'
                      : selectedTags.includes(tag)
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-card text-foreground border-gray-300 hover:bg-background'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className='bg-card p-4 rounded-lg shadow'>
            <h3 className='font-bold text-lg mb-3'>평점 필터</h3>
            <div className='space-y-2'>
              {[5, 4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className='flex items-center space-x-3 cursor-pointer'
                >
                  <input
                    type='checkbox'
                    checked={selectedRatings.includes(rating)}
                    onChange={(e) =>
                      handleRatingChange(rating, e.target.checked)
                    }
                    className='rounded border-gray-300'
                  />
                  <div className='flex items-center space-x-1'>
                    {renderStars(rating)}
                  </div>
                  <span className='text-sm'>({rating}점)</span>
                </label>
              ))}
            </div>
          </div>

          {/* Verified Filter */}
          <div className='bg-card p-4 rounded-lg shadow'>
            <label className='flex items-center space-x-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={showVerifiedOnly}
                onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                className='rounded border-gray-300'
              />
              <span className='font-medium'>구매확인 리뷰만</span>
            </label>
          </div>

          {/* Top Reviewers */}
          <div className='bg-card p-4 rounded-lg shadow'>
            <div className='flex items-center space-x-2 mb-3'>
              <Award className='h-5 w-5 text-yellow-500' />
              <h3 className='font-bold text-lg'>우수 리뷰어</h3>
            </div>
            <div className='space-y-3'>
              {MOCK_TOP_REVIEWERS.map((reviewer, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <div>
                    <div className='font-medium text-sm'>{reviewer.name}</div>
                    <div className='text-xs text-muted-foreground'>
                      {reviewer.reviews}개 리뷰
                    </div>
                  </div>
                  <div className='flex items-center space-x-1 text-xs text-yellow-600'>
                    <ThumbsUp className='h-3 w-3' />
                    <span>{reviewer.helpful}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Notice */}
          <div className='bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border border-green-200'>
            <div className='flex items-center space-x-3 mb-2'>
              <MessageCircle className='h-8 w-8 text-green-500' />
              <div>
                <h3 className='font-bold text-green-800'>커뮤니티 참여</h3>
                <p className='text-sm text-green-700'>
                  다른 사용자와 제품에 대한 의견을 나누어보세요
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1'>
          {/* Supabase 연결 오류 */}
          <SupabaseConnectionError error={reviewsError} />

          {/* Search and Filter Header */}
          <div className='bg-card p-6 rounded-lg shadow mb-6'>
            <div className='flex flex-col lg:flex-row gap-4'>
              {/* Search Input */}
              <div className='flex-1 relative'>
                <Search className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
                <input
                  type='text'
                  placeholder='리뷰 내용, 제품명으로 검색'
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Button */}
              <button className='flex items-center space-x-2 px-4 py-2 bg-background border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                <Filter className='h-4 w-4' />
                <span>필터</span>
                <ChevronDown className='h-4 w-4' />
              </button>
            </div>
          </div>

          {/* 페이지 헤더 - 다른 페이지들과 일관된 스타일 */}
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl'>
                <Star className='h-6 w-6 text-white fill-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'>
                  리뷰 {totalProducts}개
                </h1>
                <p className='text-muted-foreground'>
                  실제 사용자들의 솔직한 후기와 평가를 확인해보세요
                </p>
              </div>
            </div>

            {/* 리뷰 통계 카드들 */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
              <div className='bg-card p-4 rounded-lg shadow border'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-yellow-100 rounded-lg'>
                    <Star className='h-5 w-5 text-yellow-600 fill-yellow-600' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>평균 평점</p>
                    <p className='text-2xl font-bold text-yellow-600'>4.5</p>
                  </div>
                </div>
              </div>

              <div className='bg-card p-4 rounded-lg shadow border'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-green-100 rounded-lg'>
                    <Award className='h-5 w-5 text-green-600' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      구매확인 리뷰
                    </p>
                    <p className='text-2xl font-bold text-green-600'>
                      {searchResults.filter((r) => r.verified).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-card p-4 rounded-lg shadow border'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-blue-100 rounded-lg'>
                    <ThumbsUp className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>도움된 리뷰</p>
                    <p className='text-2xl font-bold text-blue-600'>
                      {searchResults.reduce((acc, r) => acc + r.helpful, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-card p-4 rounded-lg shadow border'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-purple-100 rounded-lg'>
                    <MessageCircle className='h-5 w-5 text-purple-600' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>활성 필터</p>
                    <p className='text-2xl font-bold text-purple-600'>
                      {hasActiveFilters ? '적용됨' : '전체'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* No Results */}
          {totalProducts === 0 ? (
            <div className='text-center py-12'>
              <div className='flex flex-col items-center space-y-4'>
                <Search className='h-16 w-16 text-gray-400' />
                <div>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    검색 결과가 없습니다
                  </h3>
                  <p className='text-gray-500'>
                    다른 검색어나 필터를 시도해보세요.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Review Grid */
            <div className='grid gap-6 mb-8'>
              {displayedProducts.map((review: Review) => (
                <div
                  key={review.id}
                  className='bg-card p-6 rounded-lg shadow hover:shadow-md transition-shadow'
                >
                  <div className='flex flex-col lg:flex-row gap-4'>
                    <div className='lg:w-20 flex-shrink-0'>
                      <Image
                        src={review.productImage}
                        alt={review.productName}
                        width={80}
                        height={80}
                        className='rounded-lg object-cover mx-auto'
                      />
                    </div>

                    <div className='flex-1'>
                      <div className='flex items-start justify-between mb-2'>
                        <div>
                          <h3 className='font-bold text-lg text-gray-900 mb-1'>
                            {review.title}
                          </h3>
                          <p className='text-sm text-muted-foreground mb-2'>
                            {review.productName}
                          </p>
                          <div className='flex items-center space-x-2'>
                            <div className='flex items-center space-x-1'>
                              {renderStars(review.rating)}
                            </div>
                            <span className='text-sm font-medium'>
                              {review.rating}.0
                            </span>
                          </div>
                        </div>
                        <div className='text-right text-sm text-muted-foreground'>
                          <div className='flex items-center space-x-1 mb-1'>
                            <Calendar className='h-4 w-4' />
                            <span>{review.date}</span>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <span>{review.author}</span>
                            {review.verified && (
                              <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                                구매확인
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className='mb-4'>
                        <p className='text-gray-700 leading-relaxed'>
                          {review.content}
                        </p>
                      </div>

                      {/* Pros and Cons */}
                      {(review.pros.length > 0 || review.cons.length > 0) && (
                        <div className='grid md:grid-cols-2 gap-4 mb-4'>
                          {review.pros.length > 0 && (
                            <div>
                              <h4 className='font-medium text-green-700 mb-2 text-sm'>
                                👍 좋은 점
                              </h4>
                              <ul className='space-y-1'>
                                {review.pros.map((pro, index) => (
                                  <li
                                    key={index}
                                    className='text-sm text-green-600 flex items-start'
                                  >
                                    <span className='mr-2'>•</span>
                                    <span>{pro}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {review.cons.length > 0 && (
                            <div>
                              <h4 className='font-medium text-red-700 mb-2 text-sm'>
                                👎 아쉬운 점
                              </h4>
                              <ul className='space-y-1'>
                                {review.cons.map((con, index) => (
                                  <li
                                    key={index}
                                    className='text-sm text-red-600 flex items-start'
                                  >
                                    <span className='mr-2'>•</span>
                                    <span>{con}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      <div className='flex flex-wrap gap-2 mb-4'>
                        {review.tags.map((tag, index) => (
                          <span
                            key={index}
                            className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full'
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className='flex items-center space-x-4 text-sm'>
                        <button className='flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors'>
                          <ThumbsUp className='h-4 w-4' />
                          <span>도움됨 {review.helpful}</span>
                        </button>
                        <button className='flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors'>
                          <ThumbsDown className='h-4 w-4' />
                          <span>안도움됨 {review.notHelpful}</span>
                        </button>
                        <button className='flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors'>
                          <MessageCircle className='h-4 w-4' />
                          <span>댓글 {review.comments}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMoreProducts && (
            <div className='text-center'>
              <LoadMoreButton
                hasMoreItems={hasMoreProducts}
                isLoadingMore={isLoadingMore}
                remainingCount={remainingCount}
                totalItems={totalProducts}
                onLoadMore={handleLoadMore}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className='w-full lg:w-64'>
          <SidebarAd position='right' />
        </div>
      </div>
    </main>
  );
}
