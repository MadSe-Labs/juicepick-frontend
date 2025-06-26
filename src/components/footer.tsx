import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">액상최저가</h3>
            <p className="text-sm">다양한 액상 제품의 가격을 비교하고 최저가로 구매할 수 있는 서비스를 제공합니다.</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  최저가 비교
                </Link>
              </li>
              <li>
                <Link href="/popular" className="hover:text-white transition-colors">
                  인기 제품
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white transition-colors">
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  리뷰
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">고객센터</h4>
            <p className="text-sm mb-2">평일 10:00 - 18:00</p>
            <p className="text-white text-lg font-bold mb-2">1588-0000</p>
            <p className="text-sm">이메일: support@eliquid.com</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>© 2025 액상최저가. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
