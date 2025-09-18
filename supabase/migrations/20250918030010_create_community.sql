-- =============================================
-- 커뮤니티 관련 테이블 생성
-- =============================================

-- 커뮤니티 카테고리 테이블
CREATE TABLE community_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(50), -- CSS 클래스나 색상코드
  post_count INTEGER DEFAULT 0 CHECK (post_count >= 0),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 커뮤니티 게시글 테이블
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES community_categories(id) ON DELETE RESTRICT,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL, -- 작성자명 스냅샷
  views INTEGER DEFAULT 0 CHECK (views >= 0),
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  comment_count INTEGER DEFAULT 0 CHECK (comment_count >= 0),
  is_pinned BOOLEAN DEFAULT false,
  is_hot BOOLEAN DEFAULT false, -- 인기글 여부
  is_active BOOLEAN DEFAULT true,
  images TEXT[], -- 첨부 이미지들
  tags TEXT[], -- 태그들
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 커뮤니티 댓글 테이블
CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE, -- 대댓글 지원
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_community_categories_display_order ON community_categories(display_order);
CREATE INDEX idx_community_posts_category_id ON community_posts(category_id);
CREATE INDEX idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_community_posts_views ON community_posts(views DESC);
CREATE INDEX idx_community_posts_likes ON community_posts(likes DESC);
CREATE INDEX idx_community_posts_pinned ON community_posts(is_pinned) WHERE is_pinned = true;
CREATE INDEX idx_community_posts_hot ON community_posts(is_hot) WHERE is_hot = true;
CREATE INDEX idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX idx_community_comments_author_id ON community_comments(author_id);
CREATE INDEX idx_community_comments_parent ON community_comments(parent_comment_id);

-- 트리거 생성
CREATE TRIGGER update_community_categories_updated_at 
  BEFORE UPDATE ON community_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at 
  BEFORE UPDATE ON community_posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at 
  BEFORE UPDATE ON community_comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 커뮤니티 댓글 수 업데이트 함수
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_comment_count_trigger
  AFTER INSERT OR DELETE ON community_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- 카테고리별 게시글 수 업데이트 함수
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_categories SET post_count = post_count - 1 WHERE id = OLD.category_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' AND OLD.category_id != NEW.category_id THEN
    UPDATE community_categories SET post_count = post_count - 1 WHERE id = OLD.category_id;
    UPDATE community_categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER category_post_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_category_post_count();

-- Row Level Security 설정
ALTER TABLE community_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON community_categories FOR SELECT TO authenticated USING (is_active = true);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view posts" ON community_posts FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Users can manage own posts" ON community_posts FOR ALL USING (auth.uid()::uuid = author_id);

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comments" ON community_comments FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Users can manage own comments" ON community_comments FOR ALL USING (auth.uid()::uuid = author_id);
