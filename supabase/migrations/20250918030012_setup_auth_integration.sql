-- =============================================
-- Supabase Auth와 public.users 연동
-- =============================================

-- 1. auth.users와 public.users를 연동하는 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- auth.users에 새 사용자가 생성되면 public.users에도 자동 생성
  INSERT INTO public.users (id, email, email_verified, role, password_hash)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.email_confirmed_at IS NOT NULL,
    'user',
    'managed_by_supabase_auth' -- dummy 값 (실제 비밀번호는 auth.users에 있음)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    email_verified = EXCLUDED.email_verified;
  
  RETURN NEW;
END;
$$;

-- 2. auth.users에 사용자 생성 시 자동으로 public.users에 추가하는 트리거
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. 기존 RLS 정책 확인 및 수정
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- 새로운 RLS 정책 생성 (auth.uid() 기반)
CREATE POLICY "Users can view own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);
