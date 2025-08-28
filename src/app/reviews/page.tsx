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

// 더미 리뷰 데이터
const reviews = [
  {
    id: 1,
    productName: '나스티 쿠션맨 액상',
    productImage: '/placeholder.svg?height=80&width=80',
    rating: 5,
    title: '정말 맛있는 액상입니다!',
    content:
      '처음에는 기대 안했는데 정말 맛있어요. 과일 맛이 진하고 목넘김도 부드러워서 매일 사용하고 있습니다. 특히 아침에 커피 대신 이걸로 시작하면 기분이 좋아져요.',
    author: '베이프러버123',
    date: '2024-01-15',
    helpful: 42,
    notHelpful: 3,
    comments: 8,
    verified: true,
    pros: ['진한 과일맛', '부드러운 목넘김', '가성비 좋음'],
    cons: ['냄새가 좀 강함'],
    tags: ['과일맛', '입문자추천', '가성비'],
  },
  {
    id: 2,
    productName: '코스모스 블루베리 액상',
    productImage: '/placeholder.svg?height=80&width=80',
    rating: 4,
    title: '블루베리 맛이 진짜네요',
    content:
      '블루베리 액상을 많이 써봤는데 이게 제일 진짜 블루베리 같아요. 달콤함도 적당하고 연무량도 만족스럽습니다. 다만 가격이 조금 비싼게 아쉬워요.',
    author: '과일맛헌터',
    date: '2024-01-14',
    helpful: 28,
    notHelpful: 2,
    comments: 5,
    verified: true,
    pros: ['진짜 블루베리맛', '적당한 단맛', '좋은 연무량'],
    cons: ['가격이 비쌈', '용량이 아쉬움'],
    tags: ['블루베리', '진짜맛', '연무량'],
  },
  {
    id: 3,
    productName: '맥스웰 민트 액상',
    productImage: '/placeholder.svg?height=80&width=80',
    rating: 3,
    title: '민트맛은 좋은데...',
    content:
      '민트 향이 정말 시원하고 좋아요. 여름에 쓰기 딱 좋을 것 같습니다. 하지만 코일 수명이 짧아지는 느낌이에요. 그래도 민트 좋아하시면 추천드려요.',
    author: '민트매니아',
    date: '2024-01-13',
    helpful: 19,
    notHelpful: 1,
    comments: 12,
    verified: false,
    pros: ['시원한 민트', '여름용으로 좋음'],
    cons: ['코일 수명 단축', '목이 아플 때 있음'],
    tags: ['민트', '시원함', '여름용'],
  },
  {
    id: 4,
    productName: '더원 망고 액상',
    productImage: '/placeholder.svg?height=80&width=80',
    rating: 5,
    title: '망고 맛 진짜 끝내줍니다',
    content:
      '망고 액상 중에서 최고인 것 같아요. 향도 좋고 맛도 진짜 망고 같아요. 니코틴도 적당해서 하루 종일 써도 목이 아프지 않아요. 강력 추천!',
    author: '망고사랑',
    date: '2024-01-12',
    helpful: 35,
    notHelpful: 0,
    comments: 6,
    verified: true,
    pros: ['진짜 망고맛', '좋은 향', '적당한 니코틴'],
    cons: [],
    tags: ['망고', '향좋음', '니코틴적당'],
  },
  {
    id: 5,
    productName: '베이프윌 딸기 액상',
    productImage: '/placeholder.svg?height=80&width=80',
    rating: 4,
    title: '딸기 맛 괜찮아요',
    content:
      '달달한 딸기 맛이 좋네요. 인공적인 맛이 아니라 자연스러운 딸기 맛입니다. 가격도 저렴해서 부담 없이 쓸 수 있어요.',
    author: '딸기좋아',
    date: '2024-01-11',
    helpful: 22,
    notHelpful: 4,
    comments: 3,
    verified: true,
    pros: ['자연스러운 딸기맛', '저렴한 가격', '달달함'],
    cons: ['연무량이 적음'],
    tags: ['딸기', '저렴', '달콤'],
  },
];

const filterTags = [
  '전체',
  '과일맛',
  '민트',
  '담배맛',
  '디저트',
  '입문자추천',
  '가성비',
  '프리미엄',
  '고농도',
  '저농도',
];

const topReviewers = [
  { name: '베이프러버123', reviews: 156, helpful: 2341 },
  { name: '과일맛헌터', reviews: 89, helpful: 1567 },
  { name: '리뷰왕', reviews: 134, helpful: 1432 },
  { name: '액상마스터', reviews: 67, helpful: 987 },
];

export default function Reviews() {
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
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <Banner />

      <main className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Left Sidebar */}
          <div className='w-full lg:w-64 space-y-6'>
            <SidebarAd position='left' />

            {/* Filter Tags */}
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>태그 필터</h3>
              <div className='flex flex-wrap gap-2'>
                {filterTags.map((tag, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      tag === '전체'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>평점 필터</h3>
              <div className='space-y-2'>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    className='flex items-center cursor-pointer'
                  >
                    <input type='checkbox' className='mr-3' />
                    <div className='flex items-center gap-1'>
                      {renderStars(rating)}
                      <span className='text-sm text-gray-600 ml-2'>이상</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Top Reviewers */}
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3 flex items-center gap-2'>
                <Award className='h-5 w-5 text-yellow-500' />
                베스트 리뷰어
              </h3>
              <div className='space-y-3'>
                {topReviewers.map((reviewer, index) => (
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
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className='text-sm font-medium'>
                        {reviewer.name}
                      </span>
                    </div>
                    <div className='text-xs text-gray-500'>
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
              <h1 className='text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3'>
                <MessageCircle className='h-8 w-8 text-green-500' />
                리뷰
              </h1>
              <p className='text-gray-600'>
                실제 사용자들의 솔직한 리뷰를 확인해보세요.
              </p>
            </div>

            {/* Search and Sort */}
            <div className='bg-white p-4 rounded-lg shadow mb-6'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1'>
                  <input
                    type='text'
                    placeholder='제품명이나 리뷰 내용 검색'
                    className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  />
                  <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                </div>
                <div className='flex gap-2'>
                  <button className='flex items-center gap-1 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50'>
                    <Filter className='h-4 w-4' />
                    <span>필터</span>
                  </button>
                  <button className='flex items-center gap-1 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50'>
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
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'
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
                        <h3 className='text-lg font-bold text-gray-900'>
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
                        <span className='text-sm font-bold text-gray-900'>
                          {review.rating}.0
                        </span>
                      </div>
                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <span className='font-medium text-gray-700'>
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
                  <h4 className='text-lg font-semibold text-gray-900 mb-2'>
                    {review.title}
                  </h4>
                  <p className='text-gray-700 mb-4 leading-relaxed'>
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
                        className='bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full'
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
                    <button className='text-sm text-gray-500 hover:text-gray-700 transition-colors'>
                      신고하기
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className='mt-8 text-center'>
              <button className='px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium'>
                더 많은 리뷰 보기
              </button>
            </div>
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
