-- =============================================
-- public.users와 user_profiles 자동 연동
-- =============================================

-- 1. users에 새 사용자가 생성되면 user_profiles에도 자동 생성하는 함수
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- public.users에 새 사용자가 생성되면 user_profiles에 기본 프로필 생성
  INSERT INTO public.user_profiles (
    user_id,
    display_name,
    newsletter_subscribed,
    sms_marketing_agreed,
    push_notifications_enabled,
    preferred_language,
    timezone
  )
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1), -- 이메일 앞부분을 기본 display_name으로 사용
    false,
    false,
    true,
    'ko',
    'Asia/Seoul'
  )
  ON CONFLICT (user_id) DO NOTHING; -- 이미 존재하면 무시
  
  RETURN NEW;
END;
$$;

-- 2. public.users에 사용자 생성 시 자동으로 user_profiles 추가하는 트리거
DROP TRIGGER IF EXISTS on_user_created_create_profile ON public.users;
CREATE TRIGGER on_user_created_create_profile
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- 3. 기존 users에 대한 user_profiles 생성 (이미 존재하는 사용자들)
INSERT INTO public.user_profiles (
  user_id,
  display_name,
  newsletter_subscribed,
  sms_marketing_agreed,
  push_notifications_enabled,
  preferred_language,
  timezone
)
SELECT 
  u.id,
  SPLIT_PART(u.email, '@', 1),
  false,
  false,
  true,
  'ko',
  'Asia/Seoul'
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profiles up WHERE up.user_id = u.id
);
