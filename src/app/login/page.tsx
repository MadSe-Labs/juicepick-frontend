'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        // 로그인 성공
        router.push('/main');
        router.refresh();
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      {/* Main Content */}
      <main className='container mx-auto px-4 py-16'>
        <div className='flex items-center justify-center'>
          <div className='max-w-md w-full space-y-8'>
            {/* Login Title */}
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-gray-900'>로그인</h2>
              <p className='mt-2 text-sm text-gray-600'>
                계정에 로그인하여 더 많은 기능을 이용하세요
              </p>
            </div>

            {/* Demo Account Info */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <h3 className='text-sm font-medium text-blue-800 mb-2'>
                테스트 계정
              </h3>
              <div className='text-xs text-blue-700 space-y-1'>
                <p>• 일반 사용자: test@juicepick.com / 123456</p>
                <p>• 관리자: admin@juicepick.com / admin123</p>
                <p>• 간편 테스트: user@example.com / password</p>
              </div>
            </div>

            {/* Login Form */}
            <div className='bg-white py-8 px-6 shadow rounded-lg'>
              <form className='space-y-6' onSubmit={handleLogin}>
                {/* Error Message */}
                {error && (
                  <div className='bg-red-50 border border-red-200 rounded-md p-3'>
                    <div className='flex items-center'>
                      <AlertCircle className='h-4 w-4 text-red-500 mr-2' />
                      <span className='text-sm text-red-700'>{error}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700'
                  >
                    이메일
                  </label>
                  <div className='mt-1'>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
                      placeholder='이메일을 입력하세요'
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700'
                  >
                    비밀번호
                  </label>
                  <div className='mt-1 relative'>
                    <input
                      id='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
                      placeholder='비밀번호를 입력하세요'
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

                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <input
                      id='remember-me'
                      name='remember-me'
                      type='checkbox'
                      className='h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded'
                    />
                    <label
                      htmlFor='remember-me'
                      className='ml-2 block text-sm text-gray-900'
                    >
                      로그인 상태 유지
                    </label>
                  </div>

                  <div className='text-sm'>
                    <Link
                      href='#'
                      className='font-medium text-green-500 hover:text-green-400'
                    >
                      비밀번호 찾기
                    </Link>
                  </div>
                </div>

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
                    {isLoading ? '로그인 중...' : '로그인'}
                  </button>
                </div>

                <div className='text-center'>
                  <p className='text-sm text-gray-600'>
                    계정이 없으신가요?{' '}
                    <Link
                      href='#'
                      className='font-medium text-green-500 hover:text-green-400'
                    >
                      회원가입
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
