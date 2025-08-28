'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

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
            <button className='text-gray-600 hover:text-green-500 transition-colors'>
              <User className='h-5 w-5' />
            </button>
            <button className='text-gray-600 hover:text-green-500 transition-colors'>
              <ShoppingCart className='h-5 w-5' />
            </button>
            <Link
              href='/login'
              className='px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors'
            >
              로그인
            </Link>
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
              <div className='flex items-center space-x-4 pt-2'>
                <button className='text-gray-600 hover:text-green-500 transition-colors'>
                  <User className='h-5 w-5' />
                </button>
                <button className='text-gray-600 hover:text-green-500 transition-colors'>
                  <ShoppingCart className='h-5 w-5' />
                </button>
                <Link
                  href='/login'
                  className='px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors'
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
