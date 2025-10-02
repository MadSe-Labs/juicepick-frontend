export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image_url: string;
  image_urls: string[];
  description: string;
  flavor: string;
  nicotine: string;
  volume: string;
  inStock: boolean;
  isPopular: boolean;
  isNew: boolean;
  sellers?: number; // 판매자 수 (선택적 필드)
}
