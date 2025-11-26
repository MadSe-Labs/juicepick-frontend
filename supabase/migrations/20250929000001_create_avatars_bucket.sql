-- =============================================
-- 아바타 이미지 저장을 위한 Storage Bucket 생성
-- =============================================

-- 1. avatars 버킷 생성 (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,  -- public 버킷 (누구나 이미지 URL로 접근 가능)
  5242880,  -- 5MB (bytes 단위: 5 * 1024 * 1024)
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']  -- 허용되는 이미지 타입
)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS (Row Level Security) Policy 설정

-- 2-1. 누구나 아바타 이미지를 볼 수 있음 (public read)
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- 2-2. 사용자는 자신의 아바타만 업로드 가능
-- 경로 형식: avatars/{user_id}/avatar-{timestamp}.jpg
-- storage.foldername(name)[1]은 경로의 첫 번째 폴더명을 반환 (user_id)
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 2-3. 사용자는 자신의 아바타만 업데이트 가능
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 2-4. 사용자는 자신의 아바타만 삭제 가능
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- 참고사항:
-- - auth.uid()::text: 현재 로그인한 사용자의 ID
-- - storage.foldername(name)[1]: 파일 경로에서 첫 번째 폴더명 추출
--   예: "avatars/user-123/avatar.jpg" → "user-123"
-- - 이를 통해 사용자는 자신의 폴더(auth.uid())에만 파일을 업로드/수정/삭제 가능
-- =============================================
