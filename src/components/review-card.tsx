import { Star, ThumbsUp, Flag } from "lucide-react"
import Image from "next/image"

interface Review {
  id: string
  author: string
  date: string
  rating: number
  content: string
  images: string[]
  likes: number
  categoryRatings: {
    flavor: number
    hit: number
    durability: number
  }
}

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(
      2,
      "0",
    )}`
  }

  return (
    <div className="border-b pb-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-medium">{review.author}</div>
          <div className="text-sm text-gray-500">{formatDate(review.date)}</div>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
          ))}
        </div>
      </div>

      {/* 항목별 평가 */}
      <div className="flex flex-wrap gap-4 mb-3 text-xs text-gray-600">
        <div className="flex items-center">
          <span className="mr-1">향:</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < review.categoryRatings.flavor ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <span className="mr-1">타격감:</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < review.categoryRatings.hit ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <span className="mr-1">지속성:</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < review.categoryRatings.durability ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 리뷰 내용 */}
      <div className="text-gray-700 mb-3">{review.content}</div>

      {/* 리뷰 이미지 */}
      {review.images.length > 0 && (
        <div className="flex gap-2 mb-3">
          {review.images.map((image, index) => (
            <div key={index} className="w-20 h-20 rounded overflow-hidden">
              <Image
                src={image || "/placeholder.svg"}
                alt={`리뷰 이미지 ${index + 1}`}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* 리뷰 액션 */}
      <div className="flex items-center text-sm text-gray-500">
        <button className="flex items-center hover:text-green-500 transition-colors">
          <ThumbsUp className="h-4 w-4 mr-1" />
          <span>도움됨 {review.likes}</span>
        </button>
        <span className="mx-2">•</span>
        <button className="flex items-center hover:text-green-500 transition-colors">
          <Flag className="h-4 w-4 mr-1" />
          <span>신고</span>
        </button>
      </div>
    </div>
  )
}
