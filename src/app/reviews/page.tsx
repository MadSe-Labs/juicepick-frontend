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
import Header from '@/components/header';
import Banner from '@/components/banner';
import SidebarAd from '@/components/sidebar-ad';
import Footer from '@/components/footer';
import Image from 'next/image';
import { MOCK_REVIEWS, MOCK_TOP_REVIEWERS, FILTER_TAGS } from '@/lib/mockData';
import { useReviewSearch } from '@/hooks/useReviewSearch';
import { usePagination } from '@/hooks/usePagination';
import { Review } from '@/types/review';
import LoadMoreButton from '@/components/load-more-button';

export default function Reviews() {
  // 리뷰 검색/필터 훅 사용
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    executeSearch,
    isSearching,
    actualSearchQuery,
    selectedRatings,
    selectedTags,
    showVerifiedOnly,
    handleTagChange,
    handleRatingChange,
    toggleVerifiedOnly,
    hasActiveFilters,
  } = useReviewSearch(MOCK_REVIEWS);

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

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <Banner />

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
                    className='flex items-center cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      className='mr-3'
                      checked={selectedRatings.includes(rating)}
                      onChange={(e) =>
                        handleRatingChange(rating, e.target.checked)
                      }
                    />
                    <div className='flex items-center gap-1'>
                      {renderStars(rating)}
                      <span className='text-sm text-gray-600 ml-2'>이상</span>
                    </div>
                  </label>
                ))}

                {/* 검증된 리뷰만 보기 */}
                <label className='flex items-center cursor-pointer pt-2 border-t border-gray-100'>
                  <input
                    type='checkbox'
                    className='mr-3'
                    checked={showVerifiedOnly}
                    onChange={toggleVerifiedOnly}
                  />
                  <span className='text-sm text-foreground'>
                    검증된 리뷰만 보기
                  </span>
                </label>
              </div>
            </div>

            {/* Top Reviewers */}
            <div className='bg-card p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3 flex items-center gap-2'>
                <Award className='h-5 w-5 text-yellow-500' />
                베스트 리뷰어
              </h3>
              <div className='space-y-3'>
                {MOCK_TOP_REVIEWERS.map((reviewer, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center gap-2'>
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          index === 0
                            ? 'bg-yellow-500 text-white'
                            : index === 1
                            ? 'bg-gray-400 text-white'
                            : index === 2
                            ? 'bg-orange-500 text-white'
                            : 'bg-accent text-gray-600'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className='text-sm font-medium'>
                        {reviewer.name}
                      </span>
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      <div>{reviewer.reviews}개 리뷰</div>
                      <div>도움 {reviewer.helpful}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Page Title */}
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-foreground mb-2 flex items-center gap-3'>
                <MessageCircle className='h-8 w-8 text-green-500' />
                리뷰
              </h1>
              <p className='text-gray-600'>
                실제 사용자들의 솔직한 리뷰를 확인해보세요.
              </p>
            </div>

            {/* Search and Sort */}
            <div className='bg-card p-4 rounded-lg shadow mb-6'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1'>
                  <input
                    type='text'
                    placeholder='제품명이나 리뷰 내용 검색'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        executeSearch();
                      }
                    }}
                    className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  />
                  <Search className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={executeSearch}
                    className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
                  >
                    검색
                  </button>
                  <button className='flex items-center gap-1 px-4 py-2 bg-card border rounded-lg hover:bg-background'>
                    <Filter className='h-4 w-4' />
                    <span>필터</span>
                  </button>
                  <button className='flex items-center gap-1 px-4 py-2 bg-card border rounded-lg hover:bg-background'>
                    <span>도움순</span>
                    <ChevronDown className='h-4 w-4' />
                  </button>
                  <button className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium'>
                    리뷰 작성
                  </button>
                </div>
              </div>
            </div>

            {/* Review Stats Banner */}
            <div className='bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-lg shadow mb-6 text-white'>
              <div className='flex flex-col sm:flex-row items-center justify-between'>
                <div className='flex items-center gap-3 mb-4 sm:mb-0'>
                  <Star className='h-6 w-6 fill-current' />
                  <div>
                    <h2 className='text-xl font-bold'>신뢰할 수 있는 리뷰</h2>
                    <p className='text-green-100'>
                      검증된 구매자들의 진솔한 후기
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-6 text-green-100'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-white'>8,542</div>
                    <div className='text-xs'>총 리뷰</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-white'>4.6</div>
                    <div className='text-xs'>평균 평점</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-white'>89%</div>
                    <div className='text-xs'>검증된 리뷰</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className='space-y-6'>
              {/* 검색/필터 결과 헤더 */}
              {(isSearching || hasActiveFilters) && (
                <div className='bg-card p-4 rounded-lg shadow mb-6'>
                  <h3 className='font-bold text-lg flex items-center gap-2'>
                    <Search className='h-6 w-6 text-green-500' />
                    {isSearching
                      ? `"${actualSearchQuery}" 검색 결과`
                      : '필터링된 리뷰'}
                    <span className='text-sm font-normal text-muted-foreground'>
                      ({searchResults.length}개)
                    </span>
                  </h3>
                </div>
              )}

              {/* 리뷰 목록 */}
              {displayedProducts.length > 0 ? (
                displayedProducts.map((review: Review) => (
                  <div
                    key={review.id}
                    className='bg-card p-6 rounded-lg shadow hover:shadow-md transition-shadow'
                  >
                    {/* Review Header */}
                    <div className='flex items-start gap-4 mb-4'>
                      <Image
                        src={review.productImage}
                        alt={review.productName}
                        width={80}
                        height={80}
                        className='rounded-lg object-cover'
                      />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between mb-2'>
                          <h3 className='text-lg font-bold text-foreground'>
                            {review.productName}
                          </h3>
                          {review.verified && (
                            <span className='bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium'>
                              구매 확인됨
                            </span>
                          )}
                        </div>
                        <div className='flex items-center gap-2 mb-2'>
                          <div className='flex items-center'>
                            {renderStars(review.rating)}
                          </div>
                          <span className='text-sm font-bold text-foreground'>
                            {review.rating}.0
                          </span>
                        </div>
                        <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                          <span className='font-medium text-foreground'>
                            {review.author}
                          </span>
                          <div className='flex items-center gap-1'>
                            <Calendar className='h-4 w-4' />
                            <span>{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <h4 className='text-lg font-semibold text-foreground mb-2'>
                      {review.title}
                    </h4>
                    <p className='text-foreground mb-4 leading-relaxed'>
                      {review.content}
                    </p>

                    {/* Pros and Cons */}
                    {(review.pros.length > 0 || review.cons.length > 0) && (
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        {review.pros.length > 0 && (
                          <div>
                            <h5 className='text-sm font-semibold text-green-700 mb-2'>
                              👍 좋은 점
                            </h5>
                            <ul className='text-sm text-gray-600 space-y-1'>
                              {review.pros.map((pro, index) => (
                                <li
                                  key={index}
                                  className='flex items-center gap-2'
                                >
                                  <span className='w-1 h-1 bg-green-500 rounded-full'></span>
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {review.cons.length > 0 && (
                          <div>
                            <h5 className='text-sm font-semibold text-red-700 mb-2'>
                              👎 아쉬운 점
                            </h5>
                            <ul className='text-sm text-gray-600 space-y-1'>
                              {review.cons.map((con, index) => (
                                <li
                                  key={index}
                                  className='flex items-center gap-2'
                                >
                                  <span className='w-1 h-1 bg-red-500 rounded-full'></span>
                                  {con}
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
                          className='bg-accent text-foreground text-xs px-2 py-1 rounded-full'
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Review Actions */}
                    <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                      <div className='flex items-center gap-4'>
                        <button className='flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors'>
                          <ThumbsUp className='h-4 w-4' />
                          <span>도움됨 ({review.helpful})</span>
                        </button>
                        <button className='flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors'>
                          <ThumbsDown className='h-4 w-4' />
                          <span>도움안됨 ({review.notHelpful})</span>
                        </button>
                        <button className='flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors'>
                          <MessageCircle className='h-4 w-4' />
                          <span>댓글 ({review.comments})</span>
                        </button>
                      </div>
                      <button className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
                        신고하기
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className='bg-card p-12 rounded-lg shadow text-center'>
                  <div className='text-muted-foreground text-lg mb-2'>
                    {isSearching
                      ? '검색 결과가 없습니다'
                      : hasActiveFilters
                      ? '필터 조건에 맞는 리뷰가 없습니다'
                      : '리뷰가 없습니다'}
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    {isSearching || hasActiveFilters
                      ? '다른 검색어나 필터 조건을 시도해보세요'
                      : '첫 번째 리뷰를 작성해보세요'}
                  </div>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {displayedProducts.length > 0 && (
              <LoadMoreButton
                hasMoreItems={hasMoreProducts}
                isLoadingMore={isLoadingMore}
                remainingCount={remainingCount}
                totalItems={totalProducts}
                onLoadMore={handleLoadMore}
              />
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
