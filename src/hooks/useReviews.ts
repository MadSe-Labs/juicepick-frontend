'use client'

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { createClient } from '@/lib/supabase'
import { 
  getReviews, 
  getFeaturedReviews,
  getReviewsByRating,
  getVerifiedReviews,
  getHelpfulReviews,
  searchReviews,
  getReviewsByTags
} from '@/queries/reviews'
import { useMemo } from 'react'

/**
 * 모든 리뷰 조회 Hook
 */
export function useReviews() {
  const supabase = createClient()
  
  return useQuery(getReviews(supabase), {
    select: (data) => data ?? [],
  })
}

/**
 * 추천 리뷰 조회 Hook
 */
export function useFeaturedReviews(limit = 6) {
  const supabase = createClient()
  
  return useQuery(getFeaturedReviews(supabase, limit), {
    select: (data) => data ?? [],
  })
}

/**
 * 평점별 리뷰 조회 Hook
 */
export function useReviewsByRating(ratings: number[] = [], limit = 20) {
  const supabase = createClient()
  
  return useQuery(getReviewsByRating(supabase, ratings, limit), {
    select: (data) => data ?? [],
  })
}

/**
 * 검증된 구매 리뷰 조회 Hook
 */
export function useVerifiedReviews(limit = 20) {
  const supabase = createClient()
  
  return useQuery(getVerifiedReviews(supabase, limit), {
    select: (data) => data ?? [],
  })
}

/**
 * 도움 많이 받은 리뷰 조회 Hook
 */
export function useHelpfulReviews(limit = 10) {
  const supabase = createClient()
  
  return useQuery(getHelpfulReviews(supabase, limit), {
    select: (data) => data ?? [],
  })
}

/**
 * 리뷰 검색 Hook + Mock 데이터 형태로 변환
 */
export function useReviewsWithSearch(searchQuery = '', ratings: number[] = [], tags: string[] = [], verifiedOnly = false) {
  const supabase = createClient()
  
  // 기본 리뷰 데이터
  const { data: allReviews = [], isLoading, error } = useQuery(getReviews(supabase), {
    select: (data) => data ?? [],
  })

  // 필터링된 리뷰 데이터를 Memo로 최적화
  const filteredReviews = useMemo(() => {
    if (!allReviews || !allReviews.length) return []

    return allReviews.filter(review => {
      // 검색어 필터링
      if (searchQuery && !review.content?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !review.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // 평점 필터링
      if (ratings.length > 0 && !ratings.includes(review.rating)) {
        return false
      }

      // 태그 필터링
      if (tags.length > 0 && !tags.some(tag => review.tags?.includes(tag))) {
        return false
      }

      // 검증된 리뷰 필터링
      if (verifiedOnly && !review.is_verified_purchase) {
        return false
      }

      return true
    }).map(review => ({
      // Mock 데이터 형태로 변환
      id: parseInt(review.id.replace(/-/g, '').substring(0, 8), 16) || Math.floor(Math.random() * 1000),
      productName: 'Unknown Product', // 제품 정보는 별도 조회 필요
      productImage: '/placeholder.svg?height=80&width=80',
      rating: review.rating,
      title: review.title || '',
      content: review.content || '',
      author: 'Anonymous', // 사용자 정보는 별도 조회 필요
      date: review.created_at ? new Date(review.created_at).toLocaleDateString('ko-KR') : '',
      helpful: review.helpful_count || 0,
      notHelpful: review.not_helpful_count || 0,
      comments: 0, // 댓글 수는 별도 구현 필요
      verified: review.is_verified_purchase || false,
      pros: review.pros || [],
      cons: review.cons || [],
      tags: review.tags || []
    }))
  }, [allReviews, searchQuery, ratings, tags, verifiedOnly])

  return {
    data: filteredReviews,
    isLoading,
    error
  }
}
