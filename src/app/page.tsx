import { Search, Filter, Bell, ChevronDown } from "lucide-react"
import Header from "@/components/header"
import Banner from "@/components/banner"
import ProductCard from "@/components/product-card"
import PriceFilter from "@/components/price-filter"
import SidebarAd from "@/components/sidebar-ad"
import Footer from "@/components/footer"
import PriceTrendChart from "@/components/price-trend-chart"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Banner />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Ads and Filters */}
          <div className="w-full lg:w-64 space-y-6">
            <SidebarAd position="left" />

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-3">필터</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">브랜드</h4>
                  <div className="space-y-1">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-green-500 mr-2" />
                      <span>나스티</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-green-500 mr-2" />
                      <span>코스모스</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-green-500 mr-2" />
                      <span>맥스웰</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-green-500 mr-2" />
                      <span>더원</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">맛</h4>
                  <div className="space-y-1">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-green-500 mr-2" />
                      <span>멘솔</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-green-500 mr-2" />
                      <span>과일</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-green-500 mr-2" />
                      <span>디저트</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-green-500 mr-2" />
                      <span>음료</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">니코틴 함량</h4>
                  <div className="space-y-1">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-green-500 mr-2" />
                      <span>0mg</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-green-500 mr-2" />
                      <span>3mg</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-green-500 mr-2" />
                      <span>6mg</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-green-500 mr-2" />
                      <span>9mg</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <PriceFilter />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="제품명, 브랜드 검색"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    <span>필터</span>
                  </button>
                  <button className="flex items-center gap-1 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                    <span>인기순</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Price Alert Banner */}
            <div className="bg-gradient-to-r from-gray-900 to-green-600 p-4 rounded-lg shadow mb-6 text-white">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center gap-2 mb-3 sm:mb-0">
                  <Bell className="h-5 w-5" />
                  <span className="font-medium">원하는 가격에 도달하면 알려드려요!</span>
                </div>
                <button className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  최저가 알림 설정
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ProductCard
                id="1"
                name="나스티 쿠션맨 액상"
                image="/placeholder.svg?height=200&width=200"
                lowestPrice={15000}
                averagePrice={17500}
                sellers={5}
                rating={4.5}
                reviewCount={128}
                specs={{
                  nicotine: "9.8mg",
                  volume: "30ml",
                  pgvg: "50/50",
                  flavor: "멘솔",
                }}
              />
              <ProductCard
                id="2"
                name="코스모스 블루베리 액상"
                image="/placeholder.svg?height=200&width=200"
                lowestPrice={12000}
                averagePrice={14000}
                sellers={7}
                rating={4.2}
                reviewCount={95}
                specs={{
                  nicotine: "6mg",
                  volume: "30ml",
                  pgvg: "70/30",
                  flavor: "과일",
                }}
              />
              <ProductCard
                id="3"
                name="맥스웰 바닐라 크림 액상"
                image="/placeholder.svg?height=200&width=200"
                lowestPrice={18000}
                averagePrice={19500}
                sellers={4}
                rating={4.7}
                reviewCount={156}
                specs={{
                  nicotine: "3mg",
                  volume: "60ml",
                  pgvg: "60/40",
                  flavor: "디저트",
                }}
              />
              <ProductCard
                id="4"
                name="더원 콜라 액상"
                image="/placeholder.svg?height=200&width=200"
                lowestPrice={16500}
                averagePrice={18000}
                sellers={6}
                rating={4.0}
                reviewCount={87}
                specs={{
                  nicotine: "9mg",
                  volume: "30ml",
                  pgvg: "50/50",
                  flavor: "음료",
                }}
              />
              <ProductCard
                id="5"
                name="나스티 쿨민트 액상"
                image="/placeholder.svg?height=200&width=200"
                lowestPrice={15000}
                averagePrice={16500}
                sellers={8}
                rating={4.8}
                reviewCount={210}
                specs={{
                  nicotine: "6mg",
                  volume: "30ml",
                  pgvg: "50/50",
                  flavor: "멘솔",
                }}
              />
              <ProductCard
                id="6"
                name="코스모스 딸기 액상"
                image="/placeholder.svg?height=200&width=200"
                lowestPrice={13000}
                averagePrice={15000}
                sellers={5}
                rating={4.3}
                reviewCount={112}
                specs={{
                  nicotine: "3mg",
                  volume: "30ml",
                  pgvg: "70/30",
                  flavor: "과일",
                }}
              />
            </div>

            {/* Load More Button */}
            <div className="mt-8 text-center">
              <button className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                더 보기
              </button>
            </div>
          </div>

          {/* Right Sidebar - Ads and Price Trends */}
          <div className="w-full lg:w-64 space-y-6">
            <SidebarAd position="right" />

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-3">가격 추이</h3>
              <PriceTrendChart />
              <p className="text-xs text-gray-500 mt-2">최근 30일 인기 제품 가격 변동</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-3">인기 검색어</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-6 h-6 flex items-center justify-center bg-rose-500 text-white rounded-full text-xs font-bold mr-2">
                    1
                  </span>
                  <span>나스티 쿠션맨</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6 h-6 flex items-center justify-center bg-rose-400 text-white rounded-full text-xs font-bold mr-2">
                    2
                  </span>
                  <span>코스모스 블루베리</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6 h-6 flex items-center justify-center bg-rose-300 text-white rounded-full text-xs font-bold mr-2">
                    3
                  </span>
                  <span>맥스웰 바닐라</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full text-xs font-bold mr-2">
                    4
                  </span>
                  <span>더원 콜라</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full text-xs font-bold mr-2">
                    5
                  </span>
                  <span>나스티 쿨민트</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
