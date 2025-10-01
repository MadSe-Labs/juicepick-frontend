'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Search,
  Filter,
  MessageSquare,
  Users,
  TrendingUp,
  ChevronDown,
  Heart,
  Eye,
  MessageCircle,
  Clock,
  Pin,
  Flame,
  Award,
  Loader2,
} from 'lucide-react';
import SidebarAd from '@/components/sidebar-ad';
import LoadMoreButton from '@/components/load-more-button';
import SupabaseConnectionError from '@/components/supabase-connection-error';
import {
  useCommunityPosts,
  usePopularCommunityPosts,
  useHotCommunityPosts,
  usePinnedCommunityPosts,
  useCommunityCategories,
  useSearchCommunityPosts,
} from '@/hooks/useCommunity';
import { useFilteredPosts, usePaginatedData } from '@/hooks/useFilteredPosts';

// 핫 토픽 키워드 (기존과 동일)
const hotTopics = [
  '니코틴 함량 선택법',
  '코일 관리 방법',
  '액상 보관법',
  '맛 추천',
  'DIY 레시피',
];

export default function CommunityPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [displayCount, setDisplayCount] = useState(6); // 기존과 동일한 초기값
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Supabase에서 데이터 가져오기
  const {
    data: allPosts = [],
    isLoading: postsLoading,
    error: postsError,
  } = useCommunityPosts();
  const { data: popularPosts = [], isLoading: popularLoading } =
    usePopularCommunityPosts(5);
  const { data: hotPosts = [], isLoading: hotLoading } =
    useHotCommunityPosts(3);
  const { data: pinnedPosts = [], isLoading: pinnedLoading } =
    usePinnedCommunityPosts();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCommunityCategories();

  // 검색 결과 (검색어가 있을 때만 활성화)
  const { data: searchResults = [], isLoading: searchLoading } =
    useSearchCommunityPosts(actualSearchQuery, 50);

  // 검색 실행 - useCallback으로 최적화
  const executeSearch = useCallback(() => {
    setActualSearchQuery(searchQuery);
    setDisplayCount(6);
  }, [searchQuery]);

  // ✅ basePosts 메모이제이션 - 무한 루프 방지
  const basePosts = useMemo(() => {
    return actualSearchQuery ? searchResults : allPosts;
  }, [actualSearchQuery, searchResults, allPosts]);

  // ✅ Custom Hook을 사용한 선언형 필터링
  const filteredPosts = useFilteredPosts(basePosts ?? [], {
    searchQuery: actualSearchQuery,
    category: selectedCategory,
    sortBy: 'latest',
  });

  // ✅ Custom Hook을 사용한 페이지네이션
  const {
    items: displayedPosts,
    totalItems,
    hasMore,
    remainingCount,
  } = usePaginatedData(filteredPosts, displayCount);

  // 검색 활성 상태 체크
  const isSearching = actualSearchQuery.length > 0;

  const handleLoadMore = useCallback(async () => {
    setIsLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDisplayCount((prev) => prev + 6);
    setIsLoadingMore(false);
  }, []);

  // 시간 포맷팅 함수
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Left Sidebar - 기존 구조 유지 */}
        <div className='w-full lg:w-64 space-y-6'>
          <SidebarAd position='left' />

          {/* Categories - 기존 스타일 유지 */}
          <div className='bg-card p-4 rounded-lg shadow'>
            <h3 className='font-bold text-lg mb-3'>카테고리</h3>
            <div className='space-y-2'>
              {/* 전체 카테고리 */}
              <button
                onClick={() => setSelectedCategory('전체')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity ${
                  selectedCategory === '전체'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <div className='flex justify-between items-center'>
                  <span>전체</span>
                  <span className='text-xs opacity-70'>
                    ({allPosts?.length || 0})
                  </span>
                </div>
              </button>
              {/* Supabase 카테고리 */}
              {categories?.map((category: any) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity ${
                    selectedCategory === category.name
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className='flex justify-between items-center'>
                    <span>{category.name}</span>
                    <span className='text-xs opacity-70'>
                      (
                      {
                        allPosts?.filter(
                          (post: any) =>
                            post.community_categories?.name === category.name
                        ).length
                      }
                      )
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hot Topics - 기존 스타일 유지 */}
          <div className='bg-card p-4 rounded-lg shadow'>
            <h3 className='font-bold text-lg mb-3 flex items-center gap-2'>
              <Flame className='h-5 w-5 text-red-500' />
              핫토픽
            </h3>
            <div className='space-y-2'>
              {hotTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(topic);
                    executeSearch();
                  }}
                  className='w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors'
                >
                  #{topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - 기존 구조 유지 */}
        <div className='flex-1'>
          {/* Page Title - 기존과 동일 */}
          <div className='mb-6'>
            <h1 className='text-3xl font-bold text-foreground mb-2 flex items-center gap-3'>
              <MessageSquare className='h-8 w-8 text-blue-500' />
              커뮤니티
            </h1>
            <p className='text-muted-foreground'>
              액상 애호가들과 함께 정보를 공유하고 소통해보세요.
            </p>
          </div>
          {/* Search and Actions - 기존 구조 유지 */}
          <div className='bg-card p-4 rounded-lg shadow mb-6'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='relative flex-1'>
                <input
                  type='text'
                  placeholder='게시글 검색'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      executeSearch();
                    }
                  }}
                  className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <Search className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={executeSearch}
                  className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                >
                  검색
                </button>
                <button className='flex items-center gap-1 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent'>
                  <Filter className='h-4 w-4' />
                  <span>필터</span>
                </button>
                <button className='flex items-center gap-1 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent'>
                  <span>최신순</span>
                  <ChevronDown className='h-4 w-4' />
                </button>
                <button className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium'>
                  글쓰기
                </button>
              </div>
            </div>
          </div>
          {/* Community Stats Banner - 기존 구조 유지 */}
          <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg shadow mb-6 text-white'>
            <div className='flex flex-col sm:flex-row items-center justify-between'>
              <div className='flex items-center gap-3 mb-4 sm:mb-0'>
                <Users className='h-6 w-6' />
                <div>
                  <h2 className='text-xl font-bold'>활발한 커뮤니티</h2>
                  <p className='text-blue-100'>
                    매일 새로운 정보와 후기를 만나보세요
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-6 text-blue-100'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-white'>
                    {allPosts?.length.toLocaleString() || 0}
                  </div>
                  <div className='text-xs'>총 게시글</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-white'>3,421</div>
                  <div className='text-xs'>활성 유저</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-white'>
                    {hotPosts?.length}
                  </div>
                  <div className='text-xs'>오늘 신규글</div>
                </div>
              </div>
            </div>
          </div>
          {/* 고정 게시글 */}
          {!isSearching && pinnedPosts?.length ? (
            <div className='mb-6'>
              <div className='space-y-3'>
                {pinnedPosts?.map((post: any) => (
                  <div
                    key={post.id}
                    className='bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg'
                  >
                    <div className='flex items-center gap-2 mb-2'>
                      <Pin className='h-4 w-4 text-yellow-600' />
                      <span className='text-yellow-600 text-sm font-medium'>
                        공지
                      </span>
                    </div>
                    <h3 className='font-medium text-lg mb-1'>{post.title}</h3>
                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                      <span>
                        by {post.author_name || post.author || '관리자'}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        {formatTimeAgo(post.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Supabase 연결 오류 */}
          <SupabaseConnectionError error={postsError} />
          {/* Posts List */}
          <div className='space-y-4'>
            {/* 검색 결과 헤더 */}
            {isSearching && (
              <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                <div className='flex items-center gap-2'>
                  <Search className='h-5 w-5 text-blue-600' />
                  <span className='font-medium text-blue-700'>
                    "{actualSearchQuery}" 검색 결과 ({totalItems}개)
                  </span>
                </div>
              </div>
            )}

            {/* 로딩 상태 */}
            {postsLoading || searchLoading ? (
              <div className='flex justify-center items-center py-12'>
                <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
                <span className='ml-2 text-muted-foreground'>
                  게시글을 불러오는 중...
                </span>
              </div>
            ) : displayedPosts.length > 0 ? (
              <>
                {/* 게시글 리스트 - 기존 카드 스타일 유지 */}
                {displayedPosts.map((post: any) => (
                  <div
                    key={post.id}
                    className='bg-card p-6 rounded-lg shadow hover:shadow-md transition-shadow border'
                  >
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                          {(post.author_name || post.author || 'A')[0]}
                        </div>
                        <div>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium text-foreground'>
                              {post.author_name || post.author || '익명'}
                            </span>
                            <span className='text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full'>
                              {post.community_categories?.name || '일반'}
                            </span>
                          </div>
                          <div className='flex items-center gap-1 text-sm text-muted-foreground mt-1'>
                            <Clock className='h-3 w-3' />
                            <span>{formatTimeAgo(post.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                          <Heart className='h-4 w-4' />
                          <span>{post.likes || 0}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Eye className='h-4 w-4' />
                          <span>{post.views || 0}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <MessageCircle className='h-4 w-4' />
                          <span>{post.comment_count || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className='mb-3'>
                      <h3 className='text-lg font-semibold text-foreground mb-2 hover:text-blue-600 cursor-pointer'>
                        {post.title}
                      </h3>
                      <p className='text-muted-foreground line-clamp-2'>
                        {post.content}
                      </p>
                    </div>

                    {post.is_hot && (
                      <div className='flex items-center gap-1 text-orange-600 text-sm'>
                        <Flame className='h-4 w-4' />
                        <span className='font-medium'>인기 게시글</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* 더보기 버튼 - 기존 스타일 유지 */}
                {hasMore && (
                  <LoadMoreButton
                    hasMoreItems={hasMore}
                    isLoadingMore={isLoadingMore}
                    remainingCount={remainingCount}
                    totalItems={totalItems}
                    onLoadMore={handleLoadMore}
                  />
                )}
              </>
            ) : (
              <div className='text-center py-12'>
                <MessageSquare className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
                <div className='text-muted-foreground text-lg mb-2'>
                  {isSearching ? '검색 결과가 없습니다' : '게시글이 없습니다'}
                </div>
                <div className='text-muted-foreground text-sm'>
                  {isSearching
                    ? '다른 검색어를 시도해보세요'
                    : '첫 번째 게시글을 작성해보세요!'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className='w-full lg:w-64 space-y-6'>
          <SidebarAd position='right' />

          {/* 인기 게시글 */}
          <div className='bg-card p-4 rounded-lg shadow'>
            <h3 className='font-bold text-lg mb-3 flex items-center gap-2'>
              <TrendingUp className='h-5 w-5 text-orange-500' />
              인기 게시글
            </h3>
            <div className='space-y-3'>
              {popularPosts?.map((post: any, index: number) => (
                <div key={post.id} className='flex items-start gap-3'>
                  <span className='flex-shrink-0 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold'>
                    {index + 1}
                  </span>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-foreground line-clamp-2'>
                      {post.title}
                    </p>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground mt-1'>
                      <span className='flex items-center gap-1'>
                        <Heart className='h-3 w-3' />
                        {post.likes || 0}
                      </span>
                      <span className='flex items-center gap-1'>
                        <MessageCircle className='h-3 w-3' />
                        {post.comment_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 활발한 토론 */}
          <div className='bg-card p-4 rounded-lg shadow'>
            <h3 className='font-bold text-lg mb-3 flex items-center gap-2'>
              <MessageCircle className='h-5 w-5 text-green-500' />
              활발한 토론
            </h3>
            <div className='space-y-3'>
              {hotPosts?.map((post: any) => (
                <div key={post.id} className='flex items-start gap-3'>
                  <div className='flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2'></div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-foreground line-clamp-2'>
                      {post.title}
                    </p>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground mt-1'>
                      <span>{formatTimeAgo(post.created_at)}</span>
                      <span className='flex items-center gap-1'>
                        <MessageCircle className='h-3 w-3' />
                        {post.comment_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
