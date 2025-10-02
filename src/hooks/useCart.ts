'use client';

import { useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import {
  getCartItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  bulkAddCartItems,
} from '@/queries/cart';
import { useCartStore } from '@/stores/useCartStore';

/**
 * Supabase와 연동된 장바구니 Hook
 * - 로그인 사용자: DB 사용
 * - 비로그인 사용자: LocalStorage 사용 (기존 useCartStore)
 */
export function useCart() {
  const session: any = null;
  const supabase = createClient();
  const queryClient = useQueryClient();

  // LocalStorage 장바구니 (비로그인용)
  const localCart = useCartStore();

  // 로그인 여부
  const isLoggedIn = !!session?.user;
  const userId = session?.user?.id;

  // Supabase 장바구니 조회 (로그인 시)
  const {
    data: dbCartItems,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cart', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await getCartItems(supabase, userId);
      if (error) throw error;
      return data;
    },
    enabled: isLoggedIn,
  });

  // 장바구니 아이템 추가 Mutation
  const addMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      if (!userId) throw new Error('User not logged in');
      const { data, error } = await addCartItem(
        supabase,
        userId,
        productId,
        quantity
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    },
  });

  // 수량 업데이트 Mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => {
      const { data, error } = await updateCartItemQuantity(
        supabase,
        itemId,
        quantity
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    },
  });

  // 아이템 삭제 Mutation
  const removeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await removeCartItem(supabase, itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    },
  });

  // 장바구니 비우기 Mutation
  const clearMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User not logged in');
      const { error } = await clearCart(supabase, userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    },
  });

  // LocalStorage -> DB 마이그레이션 (로그인 시 한 번 실행)
  useEffect(() => {
    const migrateLocalCartToDb = async () => {
      if (isLoggedIn && userId && localCart.items.length > 0) {
        try {
          const items = localCart.items.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
          }));

          await bulkAddCartItems(supabase, userId, items);
          
          // 마이그레이션 후 LocalStorage 비우기
          localCart.clearCart();
          
          // DB 장바구니 새로고침
          queryClient.invalidateQueries({ queryKey: ['cart', userId] });
        } catch (error) {
          console.error('Cart migration error:', error);
        }
      }
    };

    migrateLocalCartToDb();
  }, [isLoggedIn, userId]); // 의도적으로 localCart는 제외

  // 통합 인터페이스
  const addItem = useCallback(
    (product: any) => {
      if (isLoggedIn && userId) {
        // DB에 추가
        addMutation.mutate({ productId: product.id, quantity: 1 });
      } else {
        // LocalStorage에 추가
        localCart.addItem(product);
      }
    },
    [isLoggedIn, userId, addMutation, localCart]
  );

  const removeItem = useCallback(
    (productId: string) => {
      if (isLoggedIn && userId) {
        // DB에서 아이템 찾기
        const item = dbCartItems?.find((i: any) => i.product_id === productId);
        if (item) {
          removeMutation.mutate(item.id);
        }
      } else {
        localCart.removeItem(productId);
      }
    },
    [isLoggedIn, userId, dbCartItems, removeMutation, localCart]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (isLoggedIn && userId) {
        // DB 업데이트
        const item = dbCartItems?.find((i: any) => i.product_id === productId);
        if (item) {
          updateMutation.mutate({ itemId: item.id, quantity });
        }
      } else {
        localCart.updateQuantity(productId, quantity);
      }
    },
    [isLoggedIn, userId, dbCartItems, updateMutation, localCart]
  );

  const clearCartItems = useCallback(() => {
    if (isLoggedIn && userId) {
      clearMutation.mutate();
    } else {
      localCart.clearCart();
    }
  }, [isLoggedIn, userId, clearMutation, localCart]);

  // 장바구니 아이템 목록 (DB 또는 LocalStorage)
  const items = isLoggedIn
    ? (dbCartItems || []).map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        name: item.products?.name || '',
        brand: item.products?.brand || '',
        price: item.products?.price || 0,
        image_url: item.products?.image_url || '',
        quantity: item.quantity,
      }))
    : localCart.items;

  // 총 가격 계산
  const getTotalPrice = useCallback(() => {
    return items.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0
    );
  }, [items]);

  // 총 아이템 수 계산
  const getTotalItems = useCallback(() => {
    return items.reduce((total: number, item: any) => total + item.quantity, 0);
  }, [items]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart: clearCartItems,
    getTotalPrice,
    getTotalItems,
    isLoading,
    error,
  };
}
