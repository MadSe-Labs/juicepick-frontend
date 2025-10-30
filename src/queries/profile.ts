import type { TypedSupabaseClient } from '@/lib/supabase-types';

/**
 * 사용자 기본 정보 조회 (users 테이블)
 */
export function getUserInfo(client: TypedSupabaseClient, userId: string) {
  return client.from('users').select('*').eq('id', userId).single();
}

/**
 * 사용자 프로필 정보 조회 (user_profiles 테이블)
 */
export function getUserProfile(client: TypedSupabaseClient, userId: string) {
  return client.from('user_profiles').select('*').eq('user_id', userId).single();
}

/**
 * 사용자 전체 정보 조회 (users + user_profiles 조인)
 */
export function getFullUserProfile(client: TypedSupabaseClient, userId: string) {
  return client
    .from('users')
    .select(
      `
      *,
      user_profiles (*)
    `
    )
    .eq('id', userId)
    .single();
}

/**
 * 사용자 기본 정보 업데이트 (users 테이블)
 * phone만 업데이트 가능
 */
export function updateUserInfo(
  client: TypedSupabaseClient,
  userId: string,
  data: {
    phone?: string;
  }
) {
  return client.from('users').update(data).eq('id', userId).select().single();
}

/**
 * 사용자 프로필 정보 업데이트 (user_profiles 테이블)
 */
export function updateUserProfile(
  client: TypedSupabaseClient,
  userId: string,
  data: {
    display_name?: string;
    first_name?: string;
    last_name?: string;
    birth_date?: string; // YYYY-MM-DD 형식
    gender?: 'male' | 'female' | 'other';
    bio?: string;
    avatar_url?: string | null; // null 허용 (삭제 시)
    newsletter_subscribed?: boolean;
    sms_marketing_agreed?: boolean;
    push_notifications_enabled?: boolean;
    preferred_language?: string;
    timezone?: string;
  }
) {
  return client
    .from('user_profiles')
    .update(data)
    .eq('user_id', userId)
    .select()
    .single();
}

/**
 * 사용자 전체 정보 업데이트 (users + user_profiles)
 */
export async function updateFullUserProfile(
  client: TypedSupabaseClient,
  userId: string,
  data: {
    // users 테이블
    phone?: string;
    // user_profiles 테이블
    display_name?: string;
    first_name?: string;
    last_name?: string;
    birth_date?: string;
    gender?: 'male' | 'female' | 'other';
    bio?: string;
    avatar_url?: string | null; // null 허용 (삭제 시)
    newsletter_subscribed?: boolean;
    sms_marketing_agreed?: boolean;
    push_notifications_enabled?: boolean;
    preferred_language?: string;
    timezone?: string;
  }
) {
  // 1. users 테이블 업데이트 (phone만)
  if (data.phone !== undefined) {
    const { error: userError } = await updateUserInfo(client, userId, {
      phone: data.phone,
    });
    if (userError) throw userError;
  }

  // 2. user_profiles 테이블 업데이트
  const profileData = {
    display_name: data.display_name,
    first_name: data.first_name,
    last_name: data.last_name,
    birth_date: data.birth_date,
    gender: data.gender,
    bio: data.bio,
    avatar_url: data.avatar_url,
    newsletter_subscribed: data.newsletter_subscribed,
    sms_marketing_agreed: data.sms_marketing_agreed,
    push_notifications_enabled: data.push_notifications_enabled,
    preferred_language: data.preferred_language,
    timezone: data.timezone,
  };

  // undefined 값 제거
  const cleanedProfileData = Object.fromEntries(
    Object.entries(profileData).filter(([_, value]) => value !== undefined)
  );

  if (Object.keys(cleanedProfileData).length > 0) {
    const { error: profileError } = await updateUserProfile(
      client,
      userId,
      cleanedProfileData
    );
    if (profileError) throw profileError;
  }

  // 3. 업데이트된 전체 정보 반환
  return getFullUserProfile(client, userId);
}
