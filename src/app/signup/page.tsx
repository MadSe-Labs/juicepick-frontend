'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // 입력 시 에러 초기화
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.');
      return false;
    }
    if (!formData.email.trim()) {
      setError('이메일을 입력해주세요.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 실제로는 여기서 회원가입 API 호출
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // 임시로 성공 처리
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);

      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 성공 메시지 화면
  if (success) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Header />
        <main className='container mx-auto px-4 py-16'>
          <div className='flex items-center justify-center'>
            <div className='max-w-md w-full'>
              <div className='bg-white py-8 px-6 shadow rounded-lg text-center'>
                <CheckCircle className='h-16 w-16 text-green-500 mx-auto mb-4' />
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                  회원가입 완료!
                </h2>
                <p className='text-gray-600 mb-6'>
                  환영합니다! 회원가입이 성공적으로 완료되었습니다.
                  <br />
                  잠시 후 로그인 페이지로 이동합니다.
                </p>
                <Link
                  href='/login'
                  className='inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
                >
                  로그인 페이지로 이동
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      {/* Main Content */}
      <main className='container mx-auto px-4 py-16'>
        <div className='flex items-center justify-center'>
          <div className='max-w-md w-full space-y-8'>
            {/* Signup Title */}
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-gray-900'>회원가입</h2>
              <p className='mt-2 text-sm text-gray-600'>
                액상최저가에 가입하여 더 많은 혜택을 받아보세요
              </p>
            </div>

            {/* Benefits */}
            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <h3 className='text-sm font-medium text-green-800 mb-2'>
                회원 혜택
              </h3>
              <div className='text-xs text-green-700 space-y-1'>
                <p>• 가격 알림 서비스 이용</p>
                <p>• 리뷰 작성 및 포인트 적립</p>
                <p>• 커뮤니티 참여 및 소통</p>
                <p>• 개인 맞춤형 추천 서비스</p>
              </div>
            </div>

            {/* Signup Form */}
            <div className='bg-white py-8 px-6 shadow rounded-lg'>
              <form className='space-y-6' onSubmit={handleSignup}>
                {/* Error Message */}
                {error && (
                  <div className='bg-red-50 border border-red-200 rounded-md p-3'>
                    <div className='flex items-center'>
                      <AlertCircle className='h-4 w-4 text-red-500 mr-2' />
                      <span className='text-sm text-red-700'>{error}</span>
                    </div>
                  </div>
                )}

                {/* 이름 */}
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    <div className='flex items-center space-x-1'>
                      <User className='h-4 w-4' />
                      <span>이름</span>
                    </div>
                  </label>
                  <input
                    id='name'
                    name='name'
                    type='text'
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
                    placeholder='홍길동'
                  />
                </div>

                {/* 이메일 */}
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    <div className='flex items-center space-x-1'>
                      <Mail className='h-4 w-4' />
                      <span>이메일</span>
                    </div>
                  </label>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
                    placeholder='example@email.com'
                  />
                </div>

                {/* 비밀번호 */}
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    <div className='flex items-center space-x-1'>
                      <Lock className='h-4 w-4' />
                      <span>비밀번호</span>
                    </div>
                  </label>
                  <div className='relative'>
                    <input
                      id='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className='appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
                      placeholder='최소 6자 이상'
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className='h-5 w-5 text-gray-400' />
                      ) : (
                        <Eye className='h-5 w-5 text-gray-400' />
                      )}
                    </button>
                  </div>
                </div>

                {/* 비밀번호 확인 */}
                <div>
                  <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    <div className='flex items-center space-x-1'>
                      <Lock className='h-4 w-4' />
                      <span>비밀번호 확인</span>
                    </div>
                  </label>
                  <div className='relative'>
                    <input
                      id='confirmPassword'
                      name='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className='appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
                      placeholder='비밀번호를 다시 입력하세요'
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='h-5 w-5 text-gray-400' />
                      ) : (
                        <Eye className='h-5 w-5 text-gray-400' />
                      )}
                    </button>
                  </div>
                </div>

                {/* 약관 동의 */}
                <div className='flex items-start'>
                  <input
                    id='agree-terms'
                    name='agree-terms'
                    type='checkbox'
                    required
                    className='h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded mt-0.5'
                  />
                  <label
                    htmlFor='agree-terms'
                    className='ml-2 block text-sm text-gray-900'
                  >
                    <span className='font-medium'>이용약관</span> 및{' '}
                    <span className='font-medium'>개인정보처리방침</span>에
                    동의합니다
                  </label>
                </div>

                {/* 회원가입 버튼 */}
                <div>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    }`}
                  >
                    {isLoading ? '가입 중...' : '회원가입'}
                  </button>
                </div>

                {/* 로그인 링크 */}
                <div className='text-center'>
                  <p className='text-sm text-gray-600'>
                    이미 계정이 있으신가요?{' '}
                    <Link
                      href='/login'
                      className='font-medium text-green-500 hover:text-green-400'
                    >
                      로그인
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
