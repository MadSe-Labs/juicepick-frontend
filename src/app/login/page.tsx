'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 아무 id, password를 입력하면 메인페이지로 라우팅
    if (id.trim() && password.trim()) {
      router.push('/main');
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

            {/* Login Form */}
            <div className='bg-white py-8 px-6 shadow rounded-lg'>
              <form className='space-y-6' onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor='id'
                    className='block text-sm font-medium text-gray-700'
                  >
                    아이디
                  </label>
                  <div className='mt-1'>
                    <input
                      id='id'
                      name='id'
                      type='text'
                      required
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
                      placeholder='아이디를 입력하세요'
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
                    className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors'
                  >
                    로그인
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
