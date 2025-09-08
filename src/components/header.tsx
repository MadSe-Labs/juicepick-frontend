'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  User,
  ShoppingCart,
  Menu,
  X,
  LogIn,
  LogOut,
  UserCircle,
  Search,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/stores/useCartStore';

export default function Header() {
  const { data: session, status } = useSession();
  const { items: cartItems } = useCartStore();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지로 드롭다운 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 검색 처리 함수
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/main?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // 현재 경로에 따른 활성 상태 확인 함수
  const isActive = (path: string) => {
    if (path === '/main') {
      return pathname === '/' || pathname === '/main';
    }
    return pathname === path;
  };

  // 활성 상태에 따른 스타일 클래스 반환 함수
  const getLinkClassName = (path: string) => {
    return isActive(path)
      ? 'text-gray-900 font-medium hover:text-green-500 transition-colors'
      : 'text-gray-600 hover:text-green-500 transition-colors';
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/main' });
  };

  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link href='/main' className='flex items-center'>
            <span className='text-2xl font-bold text-green-500'>
              액상최저가
            </span>
          </Link>

          {/* Search Bar */}
          <div className='hidden md:flex flex-1 max-w-lg mx-8'>
            <form onSubmit={handleSearch} className='w-full'>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='상품명, 브랜드, 맛을 검색하세요...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                />
                <button
                  type='submit'
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500'
                >
                  <Search className='h-5 w-5' />
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-8'>
            <Link href='/main' className={getLinkClassName('/main')}>
              최저가
            </Link>
            <Link href='/popular' className={getLinkClassName('/popular')}>
              인기제품
            </Link>
            <Link href='/community' className={getLinkClassName('/community')}>
              커뮤니티
            </Link>
            <Link href='/reviews' className={getLinkClassName('/reviews')}>
              리뷰
            </Link>
          </nav>

          {/* User Actions */}
          <div className='hidden md:flex items-center space-x-4'>
            {status === 'loading' ? (
              <div className='text-gray-400'>로딩중...</div>
            ) : session ? (
              <>
                {/* 장바구니 */}
                <Link
                  href='/cart'
                  className='text-gray-600 hover:text-green-500 transition-colors relative cursor-pointer'
                >
                  <ShoppingCart className='h-5 w-5' />
                  <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>
                    {cartItems.length || 0}
                  </span>
                </Link>

                {/* 사용자 메뉴 */}
                <div className='relative' ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className='flex items-center space-x-2 text-gray-700 hover:text-green-500 transition-colors cursor-pointer'
                  >
                    <UserCircle className='h-5 w-5' />
                    <span className='text-sm font-medium'>
                      {session.user?.name}
                    </span>
                  </button>

                  {/* 드롭다운 메뉴 */}
                  {isUserMenuOpen && (
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border'>
                      <Link
                        href='/profile'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <div className='flex items-center space-x-2'>
                          <User className='h-4 w-4' />
                          <span>프로필</span>
                        </div>
                      </Link>
                      <Link
                        href='/my-orders'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <div className='flex items-center space-x-2'>
                          <ShoppingCart className='h-4 w-4' />
                          <span>주문 내역</span>
                        </div>
                      </Link>
                      <hr className='my-1' />
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleSignOut();
                        }}
                        className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
                      >
                        <div className='flex items-center space-x-2'>
                          <LogOut className='h-4 w-4' />
                          <span>로그아웃</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href='/login'
                  className='flex items-center space-x-1 text-gray-600 hover:text-green-500 transition-colors'
                >
                  <LogIn className='h-4 w-4' />
                  <span>로그인</span>
                </Link>
                <Link
                  href='/signup'
                  className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden text-gray-600'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='md:hidden py-4 border-t'>
            <nav className='flex flex-col space-y-4'>
              <Link
                href='/main'
                className={getLinkClassName('/main')}
                onClick={() => setIsMenuOpen(false)}
              >
                최저가
              </Link>
              <Link
                href='/popular'
                className={getLinkClassName('/popular')}
                onClick={() => setIsMenuOpen(false)}
              >
                인기제품
              </Link>
              <Link
                href='/community'
                className={getLinkClassName('/community')}
                onClick={() => setIsMenuOpen(false)}
              >
                커뮤니티
              </Link>
              <Link
                href='/reviews'
                className={getLinkClassName('/reviews')}
                onClick={() => setIsMenuOpen(false)}
              >
                리뷰
              </Link>

              {/* 모바일 사용자 액션 */}
              <div className='pt-4 border-t border-gray-200'>
                {session ? (
                  <div className='space-y-3'>
                    <div className='flex items-center space-x-3 px-2'>
                      <UserCircle className='h-6 w-6 text-gray-600' />
                      <div>
                        <p className='text-sm font-medium text-gray-900'>
                          {session.user?.name}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href='/profile'
                      className='flex items-center space-x-3 px-2 py-2 text-gray-600 hover:text-green-500 transition-colors'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className='h-5 w-5' />
                      <span>프로필</span>
                    </Link>
                    <Link
                      href='/cart'
                      className='flex items-center space-x-3 px-2 py-2 text-gray-600 hover:text-green-500 transition-colors'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart className='h-5 w-5' />
                      <span>장바구니</span>
                      <span className='bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center ml-auto'>
                        4
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                      className='flex items-center space-x-3 px-2 py-2 text-gray-600 hover:text-red-500 transition-colors w-full text-left'
                    >
                      <LogOut className='h-5 w-5' />
                      <span>로그아웃</span>
                    </button>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    <Link
                      href='/login'
                      className='flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className='h-4 w-4' />
                      <span>로그인</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
