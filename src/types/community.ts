export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  isPinned: boolean;
  isHot: boolean;
}

export interface CommunityCategory {
  name: string;
  count: number;
  color: string;
}

export interface CommunitySearchFilters {
  category?: string;
  sortBy?: 'latest' | 'popular' | 'views' | 'comments';
  isHot?: boolean;
  isPinned?: boolean;
}
