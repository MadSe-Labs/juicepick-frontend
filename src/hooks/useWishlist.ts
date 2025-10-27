'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import { useAuth } from './useAuth';
import {
  getUserWishlist,
  checkProductInWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  getWishlistStats,
} from '@/queries/wishlist';
import toast from 'react-hot-toast';

/**
 * 위시리스트 관리 Hook
 */
export function useWishlist() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const supabase = createClient();

  // 위시리스트 조회
  const {
    data: wishlistItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await getUserWishlist(supabase, user.id);
      if (error) throw error;
      return data || [];
    },
    enabled: isAuthenticated && !!user?.id,
  });

  // 위시리스트 통계
  const { data: stats } = useQuery({
    queryKey: ['wishlist-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return { total_items: 0, total_value: 0 };
      return await getWishlistStats(supabase, user.id);
    },
    enabled: isAuthenticated && !!user?.id,
  });

  // 위시리스트에 추가
  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user?.id) throw new Error('로그인이 필요합니다');
      
      // 중복 체크 (서버 호출 전)
      const isAlreadyInWishlist = wishlistItems.some(
        (item: any) => item.product_id === productId
      );
      
      if (isAlreadyInWishlist) {
        throw new Error('이미 찜한 상품입니다');
      }
      
      const { data, error } = await addToWishlist(supabase, user.id, productId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-stats', user?.id] });
      toast.success('찜 목록에 추가되었습니다');
    },
    onError: (error: any) => {
      console.error('Wishlist add error:', error);
      
      // 에러 메시지에 따라 다른 토스트 표시
      if (error.message === '이미 찜한 상품입니다') {
        toast.error('이미 찜한 상품입니다');
      } else if (error.code === '23505') {
        // PostgreSQL unique violation
        toast.error('이미 찜한 상품입니다');
      } else if (error.message === '로그인이 필요합니다') {
        toast.error('로그인이 필요합니다');
      } else {
        toast.error('찜하기에 실패했습니다');
      }
    },
  });

  // 위시리스트에서 제거
  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user?.id) throw new Error('로그인이 필요합니다');
      const { error } = await removeFromWishlist(supabase, user.id, productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-stats', user?.id] });
      toast.success('찜 목록에서 제거되었습니다');
    },
    onError: () => {
      toast.error('제거에 실패했습니다');
    },
  });

  // 위시리스트 전체 삭제
  const clearMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('로그인이 필요합니다');
      const { error } = await clearWishlist(supabase, user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-stats', user?.id] });
      toast.success('찜 목록이 전체 삭제되었습니다');
    },
    onError: () => {
      toast.error('삭제에 실패했습니다');
    },
  });

  // 특정 상품이 위시리스트에 있는지 확인
  const isInWishlist = (productId: string) => {
    if (!wishlistItems || wishlistItems.length === 0) return false;
    return wishlistItems.some((item: any) => item.product_id === productId);
  };

  // 위시리스트 토글 (추가/제거)
  const toggleWishlist = (productId: string) => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요한 기능입니다');
      return;
    }

    // 로딩 중이면 중복 클릭 방지
    if (addMutation.isPending || removeMutation.isPending) {
      return;
    }

    if (isInWishlist(productId)) {
      removeMutation.mutate(productId);
    } else {
      addMutation.mutate(productId);
    }
  };

  return {
    wishlistItems,
    stats,
    isLoading,
    error,
    isInWishlist,
    toggleWishlist,
    addToWishlist: addMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
    clearWishlist: clearMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}

/**
 * 특정 상품의 위시리스트 상태 확인 Hook (최적화 버전)
 */
export function useProductWishlistStatus(productId: string) {
  const { user, isAuthenticated } = useAuth();
  const supabase = createClient();

  return useQuery({
    queryKey: ['wishlist-status', user?.id, productId],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data } = await checkProductInWishlist(
        supabase,
        user.id,
        productId
      );
      return !!data;
    },
    enabled: isAuthenticated && !!user?.id && !!productId,
  });
}
