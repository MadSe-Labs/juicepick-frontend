'use client';

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
} from 'lucide-react';
import Header from '@/components/header';
import Banner from '@/components/banner';
import SidebarAd from '@/components/sidebar-ad';
import Footer from '@/components/footer';

import {
  MOCK_COMMUNITY_POSTS,
  MOCK_COMMUNITY_CATEGORIES,
} from '@/lib/mockData';

import { useCommunitySearch } from '@/hooks/useCommunitySearch';

const hotTopics = [
  '니코틴 함량 선택법',
  '코일 관리 방법',
  '액상 보관법',
  '맛 추천',
  'DIY 레시피',
];

export default function Community() {
  // 커뮤니티 검색 훅 사용
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    executeSearch,
    isSearching,
    actualSearchQuery,
  } = useCommunitySearch(MOCK_COMMUNITY_POSTS);
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <Banner />

      <main className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Left Sidebar */}
          <div className='w-full lg:w-64 space-y-6'>
            <SidebarAd position='left' />

            {/* Categories */}
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>카테고리</h3>
              <div className='space-y-2'>
                {MOCK_COMMUNITY_CATEGORIES.map((category, index) => (
                  <button
                    key={index}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity ${category.color}`}
                  >
                    <div className='flex justify-between items-center'>
                      <span>{category.name}</span>
                      <span className='text-xs opacity-70'>
                        ({category.count})
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hot Topics */}
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3 flex items-center gap-2'>
                <Flame className='h-5 w-5 text-red-500' />
                핫토픽
              </h3>
              <div className='space-y-2'>
                {hotTopics.map((topic, index) => (
                  <button
                    key={index}
                    className='w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors'
                  >
                    #{topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Page Title */}
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3'>
                <MessageSquare className='h-8 w-8 text-blue-500' />
                커뮤니티
              </h1>
              <p className='text-gray-600'>
                액상 애호가들과 함께 정보를 공유하고 소통해보세요.
              </p>
            </div>

            {/* Search and Actions */}
            <div className='bg-white p-4 rounded-lg shadow mb-6'>
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
                  <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={executeSearch}
                    className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                  >
                    검색
                  </button>
                  <button className='flex items-center gap-1 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50'>
                    <Filter className='h-4 w-4' />
                    <span>필터</span>
                  </button>
                  <button className='flex items-center gap-1 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50'>
                    <span>최신순</span>
                    <ChevronDown className='h-4 w-4' />
                  </button>
                  <button className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium'>
                    글쓰기
                  </button>
                </div>
              </div>
            </div>

            {/* Community Stats Banner */}
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
                    <div className='text-2xl font-bold text-white'>12,456</div>
                    <div className='text-xs'>총 게시글</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-white'>3,421</div>
                    <div className='text-xs'>활성 유저</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-white'>156</div>
                    <div className='text-xs'>오늘 신규글</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts List */}
            <div className='space-y-4'>
              {/* 검색 결과 헤더 */}
              {isSearching && (
                <div className='bg-white p-4 rounded-lg shadow mb-4'>
                  <h3 className='font-bold text-lg flex items-center gap-2'>
                    <Search className='h-5 w-5 text-blue-500' />"
                    {actualSearchQuery}" 검색 결과
                    <span className='text-sm font-normal text-gray-500'>
                      ({searchResults.length}개)
                    </span>
                  </h3>
                </div>
              )}

              {/* 게시글 목록 */}
              {searchResults.length > 0 ? (
                searchResults.map((post) => (
                  <div
                    key={post.id}
                    className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex items-center gap-3'>
                        {post.isPinned && (
                          <Pin className='h-4 w-4 text-red-500' />
                        )}
                        {post.isHot && (
                          <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium'>
                            HOT
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            post.category === '제품후기'
                              ? 'bg-green-50 text-green-700'
                              : post.category === '질문/답변'
                              ? 'bg-orange-50 text-orange-700'
                              : post.category === 'DIY/팁'
                              ? 'bg-purple-50 text-purple-700'
                              : post.category === '정보공유'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {post.category}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-xs text-gray-500'>
                        <Clock className='h-3 w-3' />
                        <span>{post.createdAt}</span>
                      </div>
                    </div>

                    <h3 className='text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer'>
                      {post.title}
                    </h3>

                    <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                      {post.content}
                    </p>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <span className='font-medium text-gray-700'>
                          {post.author}
                        </span>
                        <div className='flex items-center gap-4'>
                          <div className='flex items-center gap-1'>
                            <Heart className='h-4 w-4' />
                            <span>{post.likes}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Eye className='h-4 w-4' />
                            <span>{post.views}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <MessageCircle className='h-4 w-4' />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='bg-white p-12 rounded-lg shadow text-center'>
                  <div className='text-gray-400 text-lg mb-2'>
                    {isSearching ? '검색 결과가 없습니다' : '게시글이 없습니다'}
                  </div>
                  <div className='text-gray-500 text-sm'>
                    {isSearching
                      ? '다른 검색어를 시도해보세요'
                      : '첫 번째 게시글을 작성해보세요'}
                  </div>
                </div>
              )}
            </div>

            {/* Load More Button */}
            <div className='mt-8 text-center'>
              <button className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium'>
                더 많은 게시글 보기
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-full lg:w-64 space-y-6'>
            <SidebarAd position='right' />

            {/* Popular Posts */}
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3 flex items-center gap-2'>
                <Award className='h-5 w-5 text-yellow-500' />
                인기글
              </h3>
              <div className='space-y-3'>
                {MOCK_COMMUNITY_POSTS.slice(0, 5).map((post, index) => (
                  <div key={post.id} className='flex items-start gap-2'>
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        index === 0
                          ? 'bg-yellow-500 text-white'
                          : index === 1
                          ? 'bg-gray-400 text-white'
                          : index === 2
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className='flex-1'>
                      <h4 className='text-sm font-medium text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-2'>
                        {post.title}
                      </h4>
                      <div className='flex items-center gap-2 text-xs text-gray-500 mt-1'>
                        <Heart className='h-3 w-3' />
                        <span>{post.likes}</span>
                        <MessageCircle className='h-3 w-3' />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Rules */}
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>커뮤니티 규칙</h3>
              <div className='text-sm text-gray-600 space-y-2'>
                <p>• 서로 존중하는 마음으로 소통해주세요</p>
                <p>• 광고성 게시물은 금지입니다</p>
                <p>• 정확한 정보 공유를 지향합니다</p>
                <p>• 개인정보 공유는 주의해주세요</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
