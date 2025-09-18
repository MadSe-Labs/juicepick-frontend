-- =============================================
-- 리뷰 관련 테이블 생성
-- =============================================

-- 리뷰 테이블
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL, -- 구매 확인용
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT NOT NULL,
  pros TEXT[], -- 장점들
  cons TEXT[], -- 단점들
  tags TEXT[], -- 태그들
  helpful_count INTEGER DEFAULT 0 CHECK (helpful_count >= 0),
  not_helpful_count INTEGER DEFAULT 0 CHECK (not_helpful_count >= 0),
  is_verified_purchase BOOLEAN DEFAULT false, -- 구매 확인 리뷰인지
  images TEXT[], -- 리뷰 이미지들
  is_featured BOOLEAN DEFAULT false, -- 추천 리뷰 여부
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 한 사용자당 같은 상품에 대해 하나의 리뷰만 허용
  UNIQUE(user_id, product_id)
);

-- 리뷰 도움됨 투표 테이블
CREATE TABLE review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL, -- true: 도움됨, false: 도움안됨
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 한 사용자당 같은 리뷰에 대해 하나의 투표만 허용
  UNIQUE(review_id, user_id)
);

-- 인덱스 생성
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_featured ON reviews(is_featured) WHERE is_featured = true;
CREATE INDEX idx_reviews_verified ON reviews(is_verified_purchase) WHERE is_verified_purchase = true;
CREATE INDEX idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX idx_review_votes_user_id ON review_votes(user_id);

-- 트리거 생성
CREATE TRIGGER update_reviews_updated_at 
  BEFORE UPDATE ON reviews 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 리뷰 투표 수 업데이트 함수
CREATE OR REPLACE FUNCTION update_review_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.is_helpful THEN
      UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
    ELSE
      UPDATE reviews SET not_helpful_count = not_helpful_count + 1 WHERE id = NEW.review_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_helpful != NEW.is_helpful THEN
      IF NEW.is_helpful THEN
        UPDATE reviews SET 
          helpful_count = helpful_count + 1,
          not_helpful_count = not_helpful_count - 1 
        WHERE id = NEW.review_id;
      ELSE
        UPDATE reviews SET 
          helpful_count = helpful_count - 1,
          not_helpful_count = not_helpful_count + 1 
        WHERE id = NEW.review_id;
      END IF;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.is_helpful THEN
      UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = OLD.review_id;
    ELSE
      UPDATE reviews SET not_helpful_count = not_helpful_count - 1 WHERE id = OLD.review_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER review_vote_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON review_votes
  FOR EACH ROW EXECUTE FUNCTION update_review_vote_counts();

-- 제품 리뷰 통계 업데이트 함수
CREATE OR REPLACE FUNCTION update_product_review_stats()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating DECIMAL(3,2);
  review_cnt INTEGER;
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
    -- 해당 제품의 평균 평점과 리뷰 수 계산
    SELECT 
      COALESCE(AVG(rating), 0)::DECIMAL(3,2),
      COUNT(*)
    INTO avg_rating, review_cnt
    FROM reviews 
    WHERE product_id = COALESCE(NEW.product_id, OLD.product_id);
    
    -- 제품 테이블 업데이트
    UPDATE products 
    SET 
      rating = avg_rating,
      review_count = review_cnt
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_review_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_review_stats();

-- Row Level Security 설정
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own reviews" ON reviews FOR ALL USING (auth.uid()::uuid = user_id);

ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can vote on reviews" ON review_votes FOR ALL USING (auth.uid()::uuid = user_id);
