import Image from "next/image"

export default function Banner() {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-green-600 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-6 md:mb-0 md:mr-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">액상 최저가 비교</h1>
            <p className="text-lg md:text-xl opacity-90 mb-4">다양한 쇼핑몰의 가격을 한눈에 비교하세요</p>
            <div className="flex space-x-4">
              <button className="px-6 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                최저가 찾기
              </button>
              <button className="px-6 py-2 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                인기 제품 보기
              </button>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="액상 제품 이미지"
              width={300}
              height={200}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
