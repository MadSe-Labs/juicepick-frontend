"use client"

import Link from "next/link"
import { User, ShoppingCart, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-green-500">액상최저가</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-900 font-medium hover:text-green-500 transition-colors">
              최저가
            </Link>
            <Link href="/popular" className="text-gray-600 hover:text-green-500 transition-colors">
              인기제품
            </Link>
            <Link href="/community" className="text-gray-600 hover:text-green-500 transition-colors">
              커뮤니티
            </Link>
            <Link href="/reviews" className="text-gray-600 hover:text-green-500 transition-colors">
              리뷰
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-600 hover:text-green-500 transition-colors">
              <User className="h-5 w-5" />
            </button>
            <button className="text-gray-600 hover:text-green-500 transition-colors">
              <ShoppingCart className="h-5 w-5" />
            </button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              로그인
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-900 font-medium hover:text-green-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                최저가
              </Link>
              <Link
                href="/popular"
                className="text-gray-600 hover:text-green-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                인기제품
              </Link>
              <Link
                href="/community"
                className="text-gray-600 hover:text-green-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                커뮤니티
              </Link>
              <Link
                href="/reviews"
                className="text-gray-600 hover:text-green-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                리뷰
              </Link>
              <div className="flex items-center space-x-4 pt-2">
                <button className="text-gray-600 hover:text-green-500 transition-colors">
                  <User className="h-5 w-5" />
                </button>
                <button className="text-gray-600 hover:text-green-500 transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                </button>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  로그인
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
