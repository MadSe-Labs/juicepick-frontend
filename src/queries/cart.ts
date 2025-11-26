import type { TypedSupabaseClient } from '@/lib/supabase-types';

/**
 * 사용자의 장바구니 아이템 조회
 */
export function getCartItems(client: TypedSupabaseClient, userId: string) {
  return client
    .from('cart_items')
    .select(
      `
      *,
      products (
        id,
        name,
        brand,
        price,
        image_url,
        in_stock
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

/**
 * 장바구니에 아이템 추가 또는 수량 증가
 */
export async function addCartItem(
  client: TypedSupabaseClient,
  userId: string,
  productId: string,
  quantity: number = 1
) {
  // 이미 있는지 확인
  const { data: existing } = await client
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    // 수량 증가
    return client
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single();
  } else {
    // 새로 추가
    return client
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: productId,
        quantity,
      })
      .select()
      .single();
  }
}

/**
 * 장바구니 아이템 수량 업데이트
 */
export function updateCartItemQuantity(
  client: TypedSupabaseClient,
  itemId: string,
  quantity: number
) {
  return client
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .select()
    .single();
}

/**
 * 장바구니 아이템 삭제
 */
export function removeCartItem(client: TypedSupabaseClient, itemId: string) {
  return client.from('cart_items').delete().eq('id', itemId);
}

/**
 * 장바구니 전체 비우기
 */
export function clearCart(client: TypedSupabaseClient, userId: string) {
  return client.from('cart_items').delete().eq('user_id', userId);
}

/**
 * 여러 아이템을 한 번에 추가 (LocalStorage -> DB 마이그레이션용)
 * 
 * 🔥 Race Condition 방지 전략:
 * 1. 각 상품을 개별적으로 처리 (addCartItem 재사용)
 * 2. addCartItem은 이미 중복 체크 + 수량 합산 로직 포함
 */
export async function bulkAddCartItems(
  client: TypedSupabaseClient,
  userId: string,
  items: Array<{ product_id: string; quantity: number }>
) {
  // 각 아이템을 개별적으로 처리 (addCartItem 재사용)
  const results = await Promise.allSettled(
    items.map((item) => 
      addCartItem(client, userId, item.product_id, item.quantity)
    )
  );

  // 실패한 작업 확인
  const failures = results.filter((r) => r.status === 'rejected');
  if (failures.length > 0) {
    console.warn('일부 상품 추가 실패:', failures);
  }

  // 성공한 작업 수 확인
  const successes = results.filter((r) => r.status === 'fulfilled');
  console.log(`${successes.length}/${items.length} 상품 마이그레이션 성공`);

  // 최종 장바구니 조회하여 반환
  return client
    .from('cart_items')
    .select(
      `
      *,
      products (
        id,
        name,
        brand,
        price,
        image_url,
        in_stock
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}
