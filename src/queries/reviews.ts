import type { TypedSupabaseClient } from '@/lib/supabase-types'

/**
 * 모든 리뷰 조회 (최신순)
 */
export function getReviews(client: TypedSupabaseClient) {
  return client
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
}

/**
 * 추천 리뷰 조회 (featured)
 */
export function getFeaturedReviews(client: TypedSupabaseClient, limit = 6) {
  return client
    .from('reviews')
    .select('*')
    .eq('is_featured', true)
    .order('helpful_count', { ascending: false })
    .limit(limit)
}

/**
 * 평점별 리뷰 조회
 */
export function getReviewsByRating(client: TypedSupabaseClient, ratings: number[] = [], limit = 20) {
  let query = client
    .from('reviews')
    .select('*')

  if (ratings.length > 0) {
    query = query.in('rating', ratings)
  }

  return query
    .order('created_at', { ascending: false })
    .limit(limit)
}

/**
 * 검증된 구매 리뷰 조회
 */
export function getVerifiedReviews(client: TypedSupabaseClient, limit = 20) {
  return client
    .from('reviews')
    .select('*')
    .eq('is_verified_purchase', true)
    .order('created_at', { ascending: false })
    .limit(limit)
}

/**
 * 도움 많이 받은 리뷰 조회
 */
export function getHelpfulReviews(client: TypedSupabaseClient, limit = 10) {
  return client
    .from('reviews')
    .select('*')
    .gt('helpful_count', 0)
    .order('helpful_count', { ascending: false })
    .limit(limit)
}

/**
 * 리뷰 검색 (제목, 내용 기준)
 */
export function searchReviews(client: TypedSupabaseClient, searchQuery: string, limit = 20) {
  if (!searchQuery.trim()) {
    return Promise.resolve([])
  }

  return client
    .from('reviews')
    .select('*')
    .or(`content.ilike.%${searchQuery}%,title.ilike.%${searchQuery}%`)
    .order('helpful_count', { ascending: false })
    .limit(limit)
}

/**
 * 태그별 리뷰 조회
 */
export function getReviewsByTags(client: TypedSupabaseClient, tags: string[] = [], limit = 20) {
  if (tags.length === 0) {
    return Promise.resolve([])
  }

  return client
    .from('reviews')
    .select('*')
    .overlaps('tags', tags)
    .order('helpful_count', { ascending: false })
    .limit(limit)
}
