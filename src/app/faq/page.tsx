'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Search,
  Phone,
  Mail,
  MessageSquare,
} from 'lucide-react';
import Header from '@/components/header';
import Banner from '@/components/banner';
import SidebarAd from '@/components/sidebar-ad';
import Footer from '@/components/footer';

// FAQ 데이터
const faqCategories = [
  {
    id: 'general',
    name: '일반',
    color: 'bg-blue-50 text-blue-700',
    faqs: [
      {
        id: 1,
        question: '액상최저가는 어떤 서비스인가요?',
        answer:
          '액상최저가는 다양한 온라인 쇼핑몰의 전자담배 액상 가격을 실시간으로 비교하여 가장 저렴한 가격을 찾아주는 서비스입니다. 사용자들이 합리적인 소비를 할 수 있도록 도와드리고 있습니다.',
      },
      {
        id: 2,
        question: '서비스 이용료가 있나요?',
        answer:
          '아니요, 액상최저가는 완전히 무료로 이용하실 수 있습니다. 가격 비교, 리뷰 확인, 커뮤니티 참여 등 모든 기능을 무료로 제공하고 있습니다.',
      },
      {
        id: 3,
        question: '회원가입이 필요한가요?',
        answer:
          '가격 비교와 제품 정보 확인은 비회원도 이용 가능합니다. 다만 리뷰 작성, 커뮤니티 참여, 가격 알림 설정 등의 기능은 회원가입 후 이용하실 수 있습니다.',
      },
    ],
  },
  {
    id: 'price',
    name: '가격비교',
    color: 'bg-green-50 text-green-700',
    faqs: [
      {
        id: 4,
        question: '가격 정보는 얼마나 자주 업데이트되나요?',
        answer:
          '대부분의 제품 가격은 매시간 업데이트됩니다. 인기 제품의 경우 더 자주 업데이트되어 실시간에 가까운 최신 가격 정보를 제공합니다.',
      },
      {
        id: 5,
        question: '표시된 가격과 실제 구매 가격이 다를 수 있나요?',
        answer:
          '네, 가능합니다. 쇼핑몰의 할인 이벤트, 쿠폰, 배송비 등으로 인해 최종 구매 가격이 다를 수 있습니다. 구매 전 해당 쇼핑몰에서 최종 가격을 꼭 확인해주세요.',
      },
      {
        id: 6,
        question: '가격 알림 기능은 어떻게 설정하나요?',
        answer:
          '원하는 제품 페이지에서 "가격 알림 설정" 버튼을 클릭하고 희망 가격을 입력하시면 됩니다. 해당 가격 이하로 내려갔을 때 이메일로 알림을 보내드립니다.',
      },
    ],
  },
  {
    id: 'product',
    name: '제품정보',
    color: 'bg-purple-50 text-purple-700',
    faqs: [
      {
        id: 7,
        question: '제품 정보는 얼마나 정확한가요?',
        answer:
          '제품 정보는 제조사 공식 데이터와 온라인 쇼핑몰 정보를 종합하여 제공합니다. 하지만 100% 정확성을 보장할 수는 없으므로, 구매 전 해당 쇼핑몰에서 제품 정보를 다시 한번 확인해주시기 바랍니다.',
      },
      {
        id: 8,
        question: '새로운 제품은 언제 추가되나요?',
        answer:
          '새로운 제품은 출시와 동시에 최대한 빠르게 추가하려고 노력하고 있습니다. 보통 신제품 출시 후 1-3일 내에 사이트에 반영됩니다.',
      },
      {
        id: 9,
        question: '특정 제품을 찾을 수 없어요',
        answer:
          '원하는 제품을 찾을 수 없으시다면 검색 키워드를 다르게 입력해보시거나, 고객센터로 문의해주세요. 빠른 시일 내에 해당 제품을 추가하도록 하겠습니다.',
      },
    ],
  },
  {
    id: 'community',
    name: '커뮤니티',
    color: 'bg-orange-50 text-orange-700',
    faqs: [
      {
        id: 10,
        question: '커뮤니티 이용 규칙이 있나요?',
        answer:
          '네, 있습니다. 상호 존중, 광고 금지, 정확한 정보 공유, 개인정보 보호 등의 기본 규칙이 있습니다. 자세한 내용은 커뮤니티 페이지 하단의 규칙을 확인해주세요.',
      },
      {
        id: 11,
        question: '리뷰 작성 시 주의사항이 있나요?',
        answer:
          '솔직하고 객관적인 후기를 작성해주시면 됩니다. 허위 정보나 과도한 비방은 삭제될 수 있으며, 구매 인증이 가능한 경우 더욱 신뢰할 수 있는 리뷰로 표시됩니다.',
      },
      {
        id: 12,
        question: '부적절한 게시글은 어떻게 신고하나요?',
        answer:
          '각 게시글 하단의 "신고하기" 버튼을 클릭하시거나, 고객센터로 직접 문의해주시면 됩니다. 신고된 내용은 검토 후 적절한 조치를 취하겠습니다.',
      },
    ],
  },
];

const quickHelp = [
  {
    icon: <Phone className='h-6 w-6' />,
    title: '전화 문의',
    content: '1588-1234',
    subContent: '평일 9:00-18:00',
  },
  {
    icon: <Mail className='h-6 w-6' />,
    title: '이메일 문의',
    content: 'help@juicepick.com',
    subContent: '24시간 접수',
  },
  {
    icon: <MessageSquare className='h-6 w-6' />,
    title: '실시간 채팅',
    content: '챗봇 상담',
    subContent: '24시간 운영',
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs =
    faqCategories
      .find((cat) => cat.id === selectedCategory)
      ?.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <Banner />

      <main className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Left Sidebar */}
          <div className='w-full lg:w-64 space-y-6'>
            <SidebarAd position='left' />

            {/* FAQ Categories */}
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>카테고리</h3>
              <div className='space-y-2'>
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? category.color
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category.name} ({category.faqs.length})
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Help */}
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>빠른 도움</h3>
              <div className='space-y-4'>
                {quickHelp.map((item, index) => (
                  <div key={index} className='flex items-start gap-3'>
                    <div className='text-blue-500 mt-1'>{item.icon}</div>
                    <div>
                      <h4 className='text-sm font-medium text-gray-900'>
                        {item.title}
                      </h4>
                      <p className='text-sm text-gray-700'>{item.content}</p>
                      <p className='text-xs text-gray-500'>{item.subContent}</p>
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
                <HelpCircle className='h-8 w-8 text-blue-500' />
                자주 묻는 질문
              </h1>
              <p className='text-gray-600'>
                궁금한 점을 빠르게 해결해보세요. 원하는 답을 찾지 못하셨다면
                고객센터로 문의해주세요.
              </p>
            </div>

            {/* Search */}
            <div className='bg-white p-4 rounded-lg shadow mb-6'>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='FAQ 검색'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
              </div>
            </div>

            {/* FAQ Stats Banner */}
            <div className='bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg shadow mb-6 text-white'>
              <div className='flex flex-col sm:flex-row items-center justify-between'>
                <div className='flex items-center gap-3 mb-4 sm:mb-0'>
                  <HelpCircle className='h-6 w-6' />
                  <div>
                    <h2 className='text-xl font-bold'>도움이 필요하세요?</h2>
                    <p className='text-blue-100'>
                      가장 많이 묻는 질문들을 정리했습니다
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-6 text-blue-100'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-white'>
                      {faqCategories.reduce(
                        (total, cat) => total + cat.faqs.length,
                        0
                      )}
                    </div>
                    <div className='text-xs'>총 FAQ</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-white'>4</div>
                    <div className='text-xs'>카테고리</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-white'>95%</div>
                    <div className='text-xs'>해결률</div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ List */}
            <div className='space-y-4'>
              {filteredFaqs.length === 0 ? (
                <div className='bg-white p-8 rounded-lg shadow text-center'>
                  <HelpCircle className='h-12 w-12 text-gray-300 mx-auto mb-4' />
                  <p className='text-gray-500'>검색 결과가 없습니다.</p>
                  <p className='text-sm text-gray-400 mt-2'>
                    다른 키워드로 검색하거나 카테고리를 변경해보세요.
                  </p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className='bg-white rounded-lg shadow overflow-hidden'
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className='w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors'
                    >
                      <h3 className='text-lg font-medium text-gray-900 pr-4'>
                        {faq.question}
                      </h3>
                      {openItems.includes(faq.id) ? (
                        <ChevronUp className='h-5 w-5 text-gray-500 flex-shrink-0' />
                      ) : (
                        <ChevronDown className='h-5 w-5 text-gray-500 flex-shrink-0' />
                      )}
                    </button>

                    {openItems.includes(faq.id) && (
                      <div className='px-6 pb-4 border-t border-gray-100'>
                        <p className='text-gray-700 leading-relaxed pt-4'>
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Contact Section */}
            <div className='mt-8 bg-white p-6 rounded-lg shadow'>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>
                원하는 답을 찾지 못하셨나요?
              </h3>
              <p className='text-gray-600 mb-4'>
                더 자세한 도움이 필요하시면 고객센터로 문의해주세요. 전문
                상담원이 친절하게 도움을 드리겠습니다.
              </p>
              <div className='flex flex-wrap gap-3'>
                <button className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
                  문의하기
                </button>
                <button className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors'>
                  실시간 채팅
                </button>
              </div>
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
