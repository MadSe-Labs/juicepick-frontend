/**
 * 아바타 이미지 업로드 유틸리티
 * Supabase Storage를 이용한 프로필 사진 관리
 */

import { createClient } from './supabase';

/**
 * 파일 검증 결과 타입
 */
interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * 이미지 파일 검증
 * - 파일 크기: 5MB 이하
 * - 파일 타입: JPG, PNG, WEBP만 허용
 * 
 * @param file - 검증할 파일
 * @returns 검증 결과
 */
export function validateImageFile(file: File): ValidationResult {
  // 파일 크기 체크 (5MB = 5 * 1024 * 1024 bytes)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: '파일 크기는 5MB 이하여야 합니다.',
    };
  }

  // 파일 타입 체크
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'JPG, PNG, WEBP 파일만 업로드 가능합니다.',
    };
  }

  return { valid: true };
}

/**
 * 아바타 이미지 업로드
 * 
 * 경로 형식: avatars/{user_id}/avatar-{timestamp}.{extension}
 * 예: avatars/550e8400-e29b-41d4-a716-446655440000/avatar-1735459200000.jpg
 * 
 * @param file - 업로드할 이미지 파일
 * @param userId - 사용자 ID
 * @returns 업로드된 이미지의 Public URL
 * @throws 업로드 실패 시 에러
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<string> {
  const supabase = createClient();

  // 파일 검증
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 파일 확장자 추출
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';

  // 파일명 생성: avatar-{timestamp}.{extension}
  const timestamp = Date.now();
  const fileName = `avatar-${timestamp}.${fileExt}`;

  // 저장 경로: avatars/{user_id}/avatar-{timestamp}.{extension}
  const filePath = `${userId}/${fileName}`;

  // Supabase Storage에 업로드
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600', // 1시간 캐시
      upsert: false, // 덮어쓰기 방지 (타임스탬프로 고유성 보장)
    });

  if (error) {
    console.error('❌ 아바타 업로드 실패:', error);
    throw new Error(`업로드 실패: ${error.message}`);
  }

  // Public URL 생성
  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(data.path);

  console.log('✅ 아바타 업로드 성공:', publicUrl);
  return publicUrl;
}

/**
 * 기존 아바타 삭제
 * 
 * Public URL에서 경로를 추출하여 파일을 삭제합니다.
 * 
 * @param avatarUrl - 삭제할 아바타의 Public URL
 * @throws 삭제 실패 시 에러
 */
export async function deleteAvatar(avatarUrl: string): Promise<void> {
  if (!avatarUrl) return;

  const supabase = createClient();

  try {
    // URL에서 파일 경로 추출
    // 예: http://127.0.0.1:54321/storage/v1/object/public/avatars/user-id/avatar.jpg
    //     → user-id/avatar.jpg
    const urlParts = avatarUrl.split('/avatars/');
    if (urlParts.length < 2) {
      console.warn('⚠️ 잘못된 아바타 URL 형식:', avatarUrl);
      return;
    }

    const filePath = urlParts[1];

    // Supabase Storage에서 삭제
    const { error } = await supabase.storage.from('avatars').remove([filePath]);

    if (error) {
      console.error('❌ 아바타 삭제 실패:', error);
      throw new Error(`삭제 실패: ${error.message}`);
    }

    console.log('✅ 기존 아바타 삭제 성공:', filePath);
  } catch (error: any) {
    console.error('❌ 아바타 삭제 중 오류:', error);
    // 삭제 실패는 치명적이지 않으므로 에러를 던지지 않음
    // (이미 삭제된 파일이거나 존재하지 않는 파일일 수 있음)
  }
}

/**
 * 아바타 이미지 업데이트 (기존 삭제 + 새로운 업로드)
 * 
 * @param file - 업로드할 새 이미지 파일
 * @param userId - 사용자 ID
 * @param currentAvatarUrl - 현재 아바타 URL (삭제용, optional)
 * @returns 새로 업로드된 이미지의 Public URL
 */
export async function updateAvatar(
  file: File,
  userId: string,
  currentAvatarUrl?: string
): Promise<string> {
  // 1. 기존 아바타 삭제 (있는 경우)
  if (currentAvatarUrl) {
    await deleteAvatar(currentAvatarUrl);
  }

  // 2. 새 아바타 업로드
  const newAvatarUrl = await uploadAvatar(file, userId);

  return newAvatarUrl;
}

/**
 * 사용자의 모든 아바타 파일 조회
 * (관리자 기능 또는 디버깅용)
 * 
 * @param userId - 사용자 ID
 * @returns 파일 목록
 */
export async function listUserAvatars(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from('avatars')
    .list(userId, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    console.error('❌ 아바타 목록 조회 실패:', error);
    throw new Error(`조회 실패: ${error.message}`);
  }

  return data;
}
