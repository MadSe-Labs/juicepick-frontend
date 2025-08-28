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

// 더미 데이터
const communityPosts = [
  {
    id: 1,
    title: '나스티 쿠션맨 맛 후기 - 완전 대박!',
    content:
      '드디어 나스티 쿠션맨 액상을 써봤는데 정말 맛이 좋네요. 과일 맛이 진짜 진하고...',
    author: '베이프러버',
    category: '제품후기',
    likes: 42,
    views: 1234,
    comments: 18,
    createdAt: '2시간 전',
    isPinned: true,
    isHot: true,
  },
  {
    id: 2,
    title: '액상 DIY 레시피 공유합니다',
    content:
      '오랫동안 연구한 DIY 레시피를 공유해요. PG/VG 비율은 30/70으로 하고...',
    author: 'DIY마스터',
    category: 'DIY/팁',
    likes: 28,
    views: 856,
    comments: 12,
    createdAt: '4시간 전',
    isPinned: false,
    isHot: true,
  },
  {
    id: 3,
    title: '초보자 질문 - 니코틴 함량 추천 부탁드려요',
    content:
      '담배를 끊으려고 전자담배를 시작하려는데 니코틴 함량을 얼마나 해야할지...',
    author: '금연도전자',
    category: '질문/답변',
    likes: 15,
    views: 623,
    comments: 25,
    createdAt: '6시간 전',
    isPinned: false,
    isHot: false,
  },
  {
    id: 4,
    title: '온라인 쇼핑몰별 가격 비교해봤어요',
    content:
      '주요 온라인몰에서 같은 제품 가격을 비교해봤는데 차이가 꽤 나네요...',
    author: '가격헌터',
    category: '정보공유',
    likes: 67,
    views: 2341,
    comments: 8,
    createdAt: '8시간 전',
    isPinned: false,
    isHot: true,
  },
  {
    id: 5,
    title: '맥스웰 신제품 출시 소식!',
    content:
      '맥스웰에서 새로운 맛 출시한다고 하네요. 언제부터 판매하는지 아시는 분?',
    author: '뉴스헌터',
    category: '뉴스/소식',
    likes: 23,
    views: 789,
    comments: 14,
    createdAt: '12시간 전',
    isPinned: false,
    isHot: false,
  },
  {
    id: 6,
    title: '코일 수명 늘리는 꿀팁 공유',
    content: '코일을 오래 쓸 수 있는 방법들을 정리해봤습니다. 도움이 되시길...',
    author: '베테랑유저',
    category: 'DIY/팁',
    likes: 31,
    views: 1456,
    comments: 6,
    createdAt: '1일 전',
    isPinned: false,
    isHot: false,
  },
];

const categories = [
  { name: '전체', count: 1247, color: 'bg-blue-50 text-blue-700' },
  { name: '제품후기', count: 456, color: 'bg-green-50 text-green-700' },
  { name: '질문/답변', count: 321, color: 'bg-orange-50 text-orange-700' },
  { name: 'DIY/팁', count: 234, color: 'bg-purple-50 text-purple-700' },
  { name: '정보공유', count: 156, color: 'bg-red-50 text-red-700' },
  { name: '뉴스/소식', count: 80, color: 'bg-indigo-50 text-indigo-700' },
];

const hotTopics = [
  '니코틴 함량 선택법',
  '코일 관리 방법',
  '액상 보관법',
  '맛 추천',
  'DIY 레시피',
];

export default function Community() {
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
                {categories.map((category, index) => (
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
                    className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                </div>
                <div className='flex gap-2'>
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
              {communityPosts.map((post) => (
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
              ))}
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
                {communityPosts.slice(0, 5).map((post, index) => (
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
