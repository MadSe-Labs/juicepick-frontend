import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import { getFullUserProfile, updateFullUserProfile } from '@/queries/profile';

/**
 * 현재 로그인한 사용자의 전체 프로필 정보 조회 Hook
 */
export function useUserProfile() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      // 1. 현재 로그인한 사용자 확인
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('인증되지 않은 사용자입니다.');
      }

      // 2. 전체 프로필 정보 조회
      const { data, error } = await getFullUserProfile(supabase, user.id);

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('프로필 정보를 찾을 수 없습니다.');
      }

      return data;
    },
  });
}

/**
 * 프로필 수정 Mutation Hook
 */
export function useUpdateProfile() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      phone?: string;
      display_name?: string;
      first_name?: string;
      last_name?: string;
      birth_date?: string;
      gender?: 'male' | 'female' | 'other';
      bio?: string;
      avatar_url?: string;
      newsletter_subscribed?: boolean;
      sms_marketing_agreed?: boolean;
      push_notifications_enabled?: boolean;
    }) => {
      // 1. 현재 로그인한 사용자 확인
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('인증되지 않은 사용자입니다.');
      }

      // 2. 프로필 업데이트
      const result = await updateFullUserProfile(supabase, user.id, data);

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: () => {
      // 프로필 쿼리 무효화하여 최신 데이터 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}
