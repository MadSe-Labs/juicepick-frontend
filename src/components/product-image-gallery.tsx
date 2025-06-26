"use client"

import { useState } from "react"
import Image from "next/image"

interface ProductImageGalleryProps {
  images: string[]
  productName: string
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div>
      {/* 메인 이미지 */}
      <div className="aspect-square rounded-lg overflow-hidden border mb-4">
        <Image
          src={images[selectedImage] || "/placeholder.svg"}
          alt={`${productName} 이미지 ${selectedImage + 1}`}
          width={500}
          height={500}
          className="w-full h-full object-contain"
        />
      </div>

      {/* 썸네일 이미지 */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`aspect-square rounded-md overflow-hidden border ${
              selectedImage === index ? "border-green-500" : "border-gray-200"
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${productName} 썸네일 ${index + 1}`}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
