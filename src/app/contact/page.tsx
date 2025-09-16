'use client';

import { useState } from 'react';
import {
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  User,
  FileText,
  Tag,
} from 'lucide-react';
import Header from '@/components/header';
import Banner from '@/components/banner';
import SidebarAd from '@/components/sidebar-ad';
import Footer from '@/components/footer';

// 문의 카테고리
const inquiryCategories = [
  { value: 'general', label: '일반 문의' },
  { value: 'price', label: '가격 정보' },
  { value: 'product', label: '제품 문의' },
  { value: 'technical', label: '기술 지원' },
  { value: 'account', label: '계정 관련' },
  { value: 'partnership', label: '제휴 문의' },
  { value: 'other', label: '기타' },
];

// 연락처 정보
const contactInfo = [
  {
    icon: <Phone className='h-6 w-6' />,
    title: '전화 상담',
    content: '1588-1234',
    subContent: '평일 09:00 - 18:00',
    description: '전화로 직접 상담받으세요',
  },
  {
    icon: <Mail className='h-6 w-6' />,
    title: '이메일 문의',
    content: 'support@juicepick.com',
    subContent: '24시간 접수',
    description: '상세한 문의사항을 이메일로 보내주세요',
  },
  {
    icon: <MessageSquare className='h-6 w-6' />,
    title: '실시간 채팅',
    content: '카카오톡 채널',
    subContent: '평일 09:00 - 18:00',
    description: '빠른 답변이 필요할 때 이용하세요',
  },
  {
    icon: <MapPin className='h-6 w-6' />,
    title: '오프라인 방문',
    content: '서울시 강남구 테헤란로 123',
    subContent: '사전 예약 필수',
    description: '직접 방문하여 상담받으세요',
  },
];

// FAQ 바로가기
const quickFaqs = [
  { question: '가격 정보는 얼마나 자주 업데이트되나요?', link: '/faq#price' },
  { question: '회원가입이 필요한가요?', link: '/faq#general' },
  { question: '제품 정보가 정확하지 않아요', link: '/faq#product' },
  { question: '커뮤니티 이용 규칙이 궁금해요', link: '/faq#community' },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 실제로는 여기서 API 호출
    setTimeout(() => {
      alert(
        '문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.'
      );
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1000);
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

            {/* Quick FAQ */}
            <div className='bg-card p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>자주 묻는 질문</h3>
              <div className='space-y-3'>
                {quickFaqs.map((faq, index) => (
                  <button
                    key={index}
                    className='w-full text-left text-sm text-gray-600 hover:text-blue-600 transition-colors'
                  >
                    • {faq.question}
                  </button>
                ))}
              </div>
              <div className='mt-4 pt-4 border-t border-gray-100'>
                <button className='text-sm text-blue-500 hover:text-blue-600 font-medium'>
                  더 많은 FAQ 보기 →
                </button>
              </div>
            </div>

            {/* Business Hours */}
            <div className='bg-card p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3 flex items-center gap-2'>
                <Clock className='h-5 w-5 text-blue-500' />
                운영 시간
              </h3>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>평일</span>
                  <span className='font-medium'>09:00 - 18:00</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>토요일</span>
                  <span className='font-medium'>09:00 - 15:00</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>일요일/공휴일</span>
                  <span className='text-red-500'>휴무</span>
                </div>
                <div className='mt-3 pt-3 border-t border-gray-100'>
                  <p className='text-xs text-muted-foreground'>
                    점심시간: 12:00 - 13:00
                    <br />
                    이메일 문의는 24시간 접수
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Page Title */}
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-foreground mb-2 flex items-center gap-3'>
                <MessageSquare className='h-8 w-8 text-blue-500' />
                문의하기
              </h1>
              <p className='text-gray-600'>
                궁금한 점이 있으시면 언제든지 문의해주세요. 친절하고 신속하게
                답변드리겠습니다.
              </p>
            </div>

            {/* Contact Methods */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className='bg-card p-6 rounded-lg shadow hover:shadow-md transition-shadow'
                >
                  <div className='flex items-start gap-4'>
                    <div className='text-blue-500 mt-1'>{info.icon}</div>
                    <div className='flex-1'>
                      <h3 className='text-lg font-semibold text-foreground mb-1'>
                        {info.title}
                      </h3>
                      <p className='text-gray-800 font-medium mb-1'>
                        {info.content}
                      </p>
                      <p className='text-sm text-blue-600 mb-2'>
                        {info.subContent}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {info.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className='bg-card p-6 rounded-lg shadow'>
              <h2 className='text-xl font-bold text-foreground mb-6'>
                온라인 문의
              </h2>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* 이름 */}
                  <div>
                    <label className='flex items-center gap-2 text-sm font-medium text-foreground mb-2'>
                      <User className='h-4 w-4' />
                      이름 <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='홍길동'
                    />
                  </div>

                  {/* 이메일 */}
                  <div>
                    <label className='flex items-center gap-2 text-sm font-medium text-foreground mb-2'>
                      <Mail className='h-4 w-4' />
                      이메일 <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='example@email.com'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* 연락처 */}
                  <div>
                    <label className='flex items-center gap-2 text-sm font-medium text-foreground mb-2'>
                      <Phone className='h-4 w-4' />
                      연락처
                    </label>
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='010-1234-5678'
                    />
                  </div>

                  {/* 문의 유형 */}
                  <div>
                    <label className='flex items-center gap-2 text-sm font-medium text-foreground mb-2'>
                      <Tag className='h-4 w-4' />
                      문의 유형 <span className='text-red-500'>*</span>
                    </label>
                    <select
                      name='category'
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value=''>선택해주세요</option>
                      {inquiryCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 제목 */}
                <div>
                  <label className='flex items-center gap-2 text-sm font-medium text-foreground mb-2'>
                    <FileText className='h-4 w-4' />
                    제목 <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='subject'
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='문의 제목을 입력해주세요'
                  />
                </div>

                {/* 내용 */}
                <div>
                  <label className='flex items-center gap-2 text-sm font-medium text-foreground mb-2'>
                    <MessageSquare className='h-4 w-4' />
                    문의 내용 <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='문의하실 내용을 자세히 작성해주세요&#10;&#10;- 문제 상황&#10;- 사용 환경&#10;- 오류 메시지 (있는 경우)&#10;&#10;자세히 작성해주시면 더 정확한 답변을 드릴 수 있습니다.'
                  />
                </div>

                {/* 개인정보 처리 동의 */}
                <div className='bg-background p-4 rounded-lg'>
                  <label className='flex items-start gap-3'>
                    <input type='checkbox' required className='mt-1' />
                    <span className='text-sm text-foreground'>
                      <strong>개인정보 수집 및 이용에 동의합니다.</strong>
                      <br />
                      수집항목: 이름, 이메일, 연락처, 문의내용
                      <br />
                      이용목적: 문의 처리 및 답변
                      <br />
                      보유기간: 문의 처리 완료 후 1년
                    </span>
                  </label>
                </div>

                {/* 제출 버튼 */}
                <div className='flex justify-center pt-4'>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                      isSubmitting
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    <Send className='h-4 w-4' />
                    {isSubmitting ? '전송 중...' : '문의 전송'}
                  </button>
                </div>
              </form>
            </div>

            {/* Additional Info */}
            <div className='mt-8 bg-blue-50 p-6 rounded-lg'>
              <h3 className='text-lg font-bold text-blue-900 mb-3'>
                문의 전 확인사항
              </h3>
              <div className='text-sm text-blue-800 space-y-2'>
                <p>
                  • <strong>FAQ를 먼저 확인해주세요</strong> - 자주 묻는
                  질문에서 답을 찾을 수 있습니다.
                </p>
                <p>
                  • <strong>구체적으로 작성해주세요</strong> - 상황을 자세히
                  설명하시면 더 정확한 답변을 받을 수 있습니다.
                </p>
                <p>
                  • <strong>답변 시간</strong> - 평일 기준 24시간 이내
                  답변드립니다.
                </p>
                <p>
                  • <strong>긴급한 경우</strong> - 전화나 실시간 채팅을
                  이용해주세요.
                </p>
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
