export interface Review {
  id: number;
  productName: string;
  productImage: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  date: string;
  helpful: number;
  notHelpful: number;
  comments: number;
  verified: boolean;
  pros: string[];
  cons: string[];
  tags: string[];
}

export interface ReviewFilters {
  ratings?: number[];
  tags?: string[];
  verified?: boolean;
  sortBy?: 'helpful' | 'latest' | 'rating' | 'oldest';
}

export interface TopReviewer {
  name: string;
  reviews: number;
  helpful: number;
}
