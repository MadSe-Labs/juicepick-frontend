import { Product } from './product';

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product; // 조인 시 포함될 상품 정보
}

export interface WishlistStats {
  total_items: number;
  total_value: number;
}
