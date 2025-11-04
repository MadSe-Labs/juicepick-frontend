# 🎯 찜하기/위시리스트 기능 구현 완료

## ✅ 구현된 기능

### 1️⃣ **데이터베이스**

- `wishlist_items` 테이블 생성
- `products` 테이블에 `wishlist_count` 컬럼 추가
- 자동 트리거: 찜하기 추가/삭제 시 상품의 찜 횟수 자동 업데이트
- Row Level Security (RLS) 설정: 사용자는 자신의 위시리스트만 접근 가능
- 위시리스트 통계 함수: 총 상품 수, 총 가격 계산

### 2️⃣ **UI 컴포넌트**

- `WishlistButton`: 하트 모양 찜하기 버튼 (3가지 사이즈: sm, md, lg)
  - 클릭 시 토글 (추가/제거)
  - 애니메이션 효과
  - 로딩 상태 표시
  - 찜 상태에 따라 하트 채우기/비우기

### 3️⃣ **페이지**

- `/wishlist`: 찜 목록 페이지
  - 그리드 레이아웃으로 상품 표시
  - 전체 장바구니 담기 버튼
  - 전체 삭제 버튼
  - 개별 상품 장바구니 담기
  - 개별 상품 삭제
  - 찜한 상품 없을 때 빈 상태 UI
  - 통계 표시 (총 상품 수, 총 가격)

### 4️⃣ **통합**

- 상품 카드에 찜하기 버튼 추가 (우측 상단)
- 헤더에 찜 목록 링크 추가 (하트 아이콘)
- 모바일 메뉴에도 찜 목록 추가
- 로그인 필요 (미들웨어 보호)

---

## 🚀 설치 및 실행

### 1. 마이그레이션 실행

```bash
# Supabase가 실행 중이어야 합니다
supabase start

# 마이그레이션이 자동으로 적용됩니다
# 만약 적용되지 않았다면:
supabase db reset
```

### 2. 개발 서버 실행

```bash
pnpm dev
```

이제 찜하기 기능을 테스트할 수 있습니다! 🎉

---

## 📖 사용 방법

### 1️⃣ **상품 찜하기**

1. 로그인합니다
2. 메인 페이지에서 상품 카드의 우측 상단 하트 버튼 클릭
3. 빨간 하트로 변하면 찜하기 완료!

### 2️⃣ **찜 목록 보기**

1. 헤더의 하트 아이콘 클릭
2. 또는 `/wishlist` 직접 접속
3. 찜한 모든 상품 확인 가능

### 3️⃣ **찜 목록에서 작업**

- **장바구니 담기**: 각 상품의 "담기" 버튼 클릭
- **전체 장바구니 담기**: 상단 "전체 장바구니 담기" 버튼 클릭
- **삭제**: 각 상품의 휴지통 아이콘 클릭
- **전체 삭제**: 상단 "전체 삭제" 버튼 클릭

---

## 🎨 컴포넌트 사용 예제

### WishlistButton 사용

```tsx
import WishlistButton from '@/components/wishlist-button';

// 기본 사용
<WishlistButton productId="123" />

// 크기 지정
<WishlistButton productId="123" size="sm" />
<WishlistButton productId="123" size="md" />
<WishlistButton productId="123" size="lg" />

// 텍스트 포함
<WishlistButton productId="123" showText />
```

### useWishlist Hook 사용

```tsx
import { useWishlist } from '@/hooks/useWishlist';

function MyComponent() {
  const {
    wishlistItems, // 찜 목록 (상품 정보 포함)
    stats, // 통계 (총 개수, 총 가격)
    isLoading, // 로딩 상태
    isInWishlist, // 특정 상품이 찜 목록에 있는지 확인
    toggleWishlist, // 찜하기/취소 토글
    addToWishlist, // 찜하기 추가
    removeFromWishlist, // 찜하기 제거
    clearWishlist, // 전체 삭제
  } = useWishlist();

  return (
    <div>
      {isInWishlist('product-id') ? '찜함' : '찜 안함'}
      <button onClick={() => toggleWishlist('product-id')}>찜하기 토글</button>
    </div>
  );
}
```

---

## 📊 데이터베이스 스키마

```sql
-- 위시리스트 테이블
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMPTZ,
  UNIQUE(user_id, product_id)  -- 중복 방지
);

-- 상품 테이블에 찜 횟수 추가
ALTER TABLE products
ADD COLUMN wishlist_count INTEGER DEFAULT 0;
```

---

## 🔐 보안

- **RLS (Row Level Security)** 활성화
- 사용자는 자신의 위시리스트만 접근 가능
- 로그인 필수 (`/wishlist` 페이지는 보호된 라우트)

---

## 🐛 트러블슈팅

### 마이그레이션 실패 시

```bash
# DB 리셋 (주의: 모든 데이터 삭제!)
supabase db reset
```

### 찜하기 버튼 동작 안 함

1. 로그인 상태 확인
2. Supabase 연결 확인
3. 브라우저 콘솔에서 에러 확인

---

## 📝 구현 파일 목록

### 신규 생성 파일

- `supabase/migrations/20250918030014_create_wishlist.sql` - DB 마이그레이션
- `src/types/wishlist.ts` - TypeScript 타입
- `src/queries/wishlist.ts` - Supabase 쿼리 함수
- `src/hooks/useWishlist.ts` - Custom Hook
- `src/components/wishlist-button.tsx` - 찜하기 버튼 컴포넌트
- `src/app/wishlist/page.tsx` - 찜 목록 페이지

### 수정된 파일

- `src/components/product-card.tsx` - 찜하기 버튼 추가
- `src/components/header.tsx` - 찜 목록 링크 추가
- `src/middleware.ts` - /wishlist 보호 라우트 추가

---

## 🎉 완료!

찜하기/위시리스트 기능이 완전히 구현되었습니다!
사용자들이 마음에 드는 상품을 저장하고 나중에 구매할 수 있습니다.
