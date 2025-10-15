# 🛒 JuicePick - 전자담배 액상 최저가 비교 플랫폼

전자담배 액상의 최저가를 비교하고, 리뷰를 확인하며, 커뮤니티에서 정보를 공유할 수 있는 종합 플랫폼입니다.

## 🎯 주요 기능

- 🔍 **상품 검색 및 필터링** - 브랜드, 맛, 니코틴 함량별 검색
- 💰 **최저가 비교** - 여러 판매처의 가격 비교
- 🛒 **장바구니** - 로그인 시 DB 저장, 비로그인 시 LocalStorage
- ⭐ **리뷰 시스템** - 별점, 장단점, 도움됨 투표
- 💬 **커뮤니티** - 제품 후기, 질문/답변, DIY 팁 공유
- 🔐 **인증** - Supabase Auth 기반 회원가입/로그인

## 🛠️ 기술 스택

### Frontend

- **Next.js 15.3.4** (App Router, React 19)
- **TypeScript**
- **Tailwind CSS 4**
- **TanStack React Query 5** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리

### Backend & Database

- **Supabase** (PostgreSQL, Auth, Storage, Realtime)
- **@supabase-cache-helpers** - React Query + Supabase 통합

### UI Libraries

- **Radix UI** - 접근성 높은 컴포넌트
- **Lucide React** - 아이콘
- **React Hot Toast** - 알림

---

## 🚀 시작하기

### 1️⃣ 사전 요구사항

다음 프로그램들이 설치되어 있어야 합니다:

- **Node.js** 18.17 이상 ([다운로드](https://nodejs.org/))
- **pnpm** 8.0 이상
  ```bash
  npm install -g pnpm
  ```
- **Git** ([다운로드](https://git-scm.com/))
- **Supabase CLI** (설치 방법은 아래 참고)

---

### 2️⃣ 프로젝트 클론 및 설치

```bash
# 1. 저장소 클론
git clone <repository-url>
cd juicepick-frontend

# 2. 의존성 설치
pnpm install
```

---

### 3️⃣ Supabase CLI 설치 및 설정

#### macOS / Linux

```bash
# Homebrew로 설치 (권장)
brew install supabase/tap/supabase

# 또는 npm으로 설치
npm install -g supabase
```

#### Windows

```bash
# Scoop으로 설치 (권장)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# 또는 npm으로 설치
npm install -g supabase
```

#### 설치 확인

```bash
supabase --version
# 출력 예: 1.150.0 이상
```

---

### 4️⃣ Supabase 로컬 환경 시작

**⚠️ 중요: 클라우드 Supabase는 사용하지 않습니다!**

팀원들은 각자의 로컬 Docker 환경에서 독립적으로 개발합니다.

#### Docker Desktop 설치 확인

Supabase CLI는 Docker를 사용하므로 먼저 Docker Desktop이 설치되어 있어야 합니다:

- [Docker Desktop 다운로드](https://www.docker.com/products/docker-desktop/)
- 설치 후 Docker Desktop 실행
- 시스템 트레이에 Docker 아이콘이 표시되면 준비 완료

#### Supabase 로컬 시작

```bash
# Supabase 로컬 환경 시작 (Docker 컨테이너)
supabase start

# ⏳ 처음 실행 시 Docker 이미지 다운로드로 1-2분 소요

# ✅ 성공 시 출력 예시:
# Started supabase local development setup.
#
#          API URL: http://127.0.0.1:54321
#      GraphQL URL: http://127.0.0.1:54321/graphql/v1
#           DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
#       Studio URL: http://127.0.0.1:54323
#     Inbucket URL: http://127.0.0.1:54324
#       JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
#         anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**중요:**

- 🐳 Docker Desktop이 실행 중이어야 합니다
- 📦 로컬 DB는 Docker 볼륨에 저장됩니다
- 🔄 Migration 파일(`supabase/migrations/`)이 자동으로 적용됩니다
- 📊 샘플 데이터도 자동으로 생성됩니다

---

### 5️⃣ Supabase Studio 확인

로컬 Supabase Studio에서 테이블과 데이터를 확인할 수 있습니다:

```bash
# 브라우저에서 접속
open http://localhost:54323
# 또는 직접 주소 입력: http://localhost:54323
```

**Studio에서 할 수 있는 것:**

- 📊 **Table Editor** - 테이블 데이터 조회/수정
- 📝 **SQL Editor** - SQL 쿼리 실행
- 👤 **Authentication** - 사용자 관리
- 📁 **Storage** - 파일 관리
- 📈 **Logs** - API 요청 로그 확인

**자동 생성되는 테이블:**

- `users`, `user_profiles`, `user_addresses` - 사용자 정보
- `categories`, `products` - 상품 관리
- `cart_items` - 장바구니
- `orders`, `order_items` - 주문
- `reviews`, `review_votes` - 리뷰
- `community_categories`, `community_posts`, `community_comments` - 커뮤니티

---

### 6️⃣ 환경 변수 설정 (이미 설정됨)

`.env.development` 파일에 로컬 Supabase 설정이 이미 되어 있습니다:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (로컬 고정값)
```

**별도 설정 불필요!** 그대로 사용하면 됩니다.

---

### 7️⃣ Supabase 로컬 환경 관리

```bash
# 로컬 Supabase 중지
supabase stop

# 로컬 Supabase 재시작
supabase start

# 로컬 Supabase 상태 확인
supabase status

# 로컬 DB 초기화 (주의: 모든 데이터 삭제!)
supabase db reset
```

**데이터 보존:**

- Docker 볼륨에 저장되므로 `supabase stop` 후에도 데이터 유지
- 컴퓨터 재시작 후 `supabase start`하면 이전 데이터 그대로 사용 가능
- 완전히 초기화하려면 `supabase db reset` 사용

---

---

### 8️⃣ 개발 서버 실행

이제 개발 서버를 실행할 준비가 완료되었습니다!

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

#### 🎉 성공!

다음 페이지들이 정상 작동하는지 확인:

- `/main` - 메인 페이지 (상품 목록)
- `/login` - 로그인
- `/signup` - 회원가입
- `/product/[id]` - 상품 상세
- `/cart` - 장바구니
- `/community` - 커뮤니티

---

## 📁 프로젝트 구조

```
juicepick-frontend/
├── src/
│   ├── app/                 # Next.js App Router 페이지
│   │   ├── main/           # 메인 페이지
│   │   ├── product/[id]/   # 상품 상세 (Dynamic Route)
│   │   ├── cart/           # 장바구니
│   │   ├── login/          # 로그인
│   │   ├── signup/         # 회원가입
│   │   ├── profile/        # 프로필 (보호 라우트)
│   │   ├── my-orders/      # 주문 내역 (보호 라우트)
│   │   ├── community/      # 커뮤니티
│   │   └── reviews/        # 리뷰 모아보기
│   │
│   ├── components/         # 재사용 가능한 UI 컴포넌트
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── product-card.tsx
│   │   └── ...
│   │
│   ├── hooks/              # Custom React Hooks
│   │   ├── useAuth.ts      # 인증
│   │   ├── useCart.ts      # 장바구니
│   │   ├── useProducts.ts  # 상품
│   │   └── ...
│   │
│   ├── queries/            # Supabase 쿼리 함수
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   ├── reviews.ts
│   │   └── ...
│   │
│   ├── stores/             # Zustand 전역 상태
│   │   ├── useCartStore.ts
│   │   ├── useThemeStore.ts
│   │   └── ...
│   │
│   ├── types/              # TypeScript 타입 정의
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   └── ...
│   │
│   ├── lib/                # 유틸리티
│   │   ├── supabase.ts     # Supabase 클라이언트
│   │   ├── supabase-server.ts
│   │   └── utils.ts
│   │
│   └── middleware.ts       # 인증 미들웨어
│
├── supabase/
│   └── migrations/         # DB 마이그레이션 파일들
│       ├── 20250918030001_setup_extensions.sql
│       ├── 20250918030002_create_categories.sql
│       └── ...
│
├── public/                 # 정적 파일
├── .env.local              # 환경 변수 (Git 제외)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🗄️ 데이터베이스 스키마

### 주요 테이블

#### 사용자 관리

- `users` - 기본 사용자 정보 (Supabase Auth 연동)
- `user_profiles` - 상세 프로필 정보
- `user_addresses` - 배송지 주소

#### 상품

- `categories` - 상품 카테고리
- `products` - 전자담배 액상 상품 정보

#### 주문

- `orders` - 주문 정보
- `order_items` - 주문 상세 항목
- `cart_items` - 장바구니

#### 리뷰

- `reviews` - 상품 리뷰
- `review_votes` - 리뷰 도움됨 투표

#### 커뮤니티

- `community_categories` - 커뮤니티 카테고리
- `community_posts` - 게시글
- `community_comments` - 댓글 (대댓글 지원)

### ERD 보기

Supabase Dashboard → Database → Schema Visualizer

---

## 🔐 인증 시스템

### Supabase Auth

- **회원가입**: 이메일/비밀번호
- **로그인**: 이메일/비밀번호
- **비밀번호 재설정**: 이메일 링크
- **세션 관리**: Supabase SSR

### 자동화된 프로세스

```
회원가입 (auth.users)
    ↓
Trigger → public.users 생성
    ↓
Trigger → user_profiles 생성 (기본값)
```

### 보호된 라우트

- `/profile` - 프로필 페이지
- `/my-orders` - 주문 내역

비로그인 접근 시 `/login?from=원래경로`로 리다이렉트

---

## 🧪 테스트 계정

샘플 데이터가 포함된 테스트 계정을 생성하려면:

```bash
# 1. 회원가입: http://localhost:3000/signup
# 2. 로그인: http://localhost:3000/login
```

또는 Supabase Dashboard → Authentication → Users에서 직접 생성

---

## 📝 주요 명령어

```bash
# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린트
pnpm lint

# Supabase 상태 확인
supabase status

# Supabase 로컬 환경 시작
supabase start

# Supabase 로컬 환경 중지
supabase stop

# DB 마이그레이션 적용
supabase db push

# DB 마이그레이션 초기화 (주의!)
supabase db reset
```

---

## 🔧 트러블슈팅

### 1. `supabase: command not found`

Supabase CLI가 설치되지 않았습니다.

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows
scoop install supabase

# 또는
npm install -g supabase
```

### 2. `Error: Project ref is required`

Supabase 프로젝트와 연결되지 않았습니다.

```bash
supabase link --project-ref <your-project-ref>
```

### 3. 환경 변수 오류

`.env.local` 파일이 없거나 잘못 설정되었습니다.

```bash
# .env.local 파일 확인
cat .env.local

# 환경 변수가 올바른지 확인
echo $NEXT_PUBLIC_SUPABASE_URL
```

개발 서버를 재시작해야 환경 변수가 적용됩니다.

```bash
# Ctrl + C로 서버 중지 후
pnpm dev
```

### 4. Migration 충돌

로컬 migration과 원격 DB가 충돌하는 경우:

```bash
# 원격 DB를 로컬 migration으로 덮어쓰기 (주의!)
supabase db push --force

# 또는 로컬 migration을 원격 DB와 동기화
supabase db pull
```

### 5. Port 충돌 (3000번 포트 사용 중)

```bash
# 다른 포트로 실행
PORT=3001 pnpm dev

# 또는 3000번 포트 사용 중인 프로세스 종료 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### 6. Supabase 연결 오류

```bash
# Supabase 프로젝트 상태 확인
supabase projects list

# 연결 끊고 다시 연결
supabase unlink
supabase link --project-ref <your-project-ref>
```

### 7. TypeScript 오류

```bash
# node_modules 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install

# TypeScript 캐시 삭제
rm -rf .next
pnpm dev
```

---

## 🤝 기여하기

1. 새 브랜치 생성: `git checkout -b feature/amazing-feature`
2. 변경사항 커밋: `git commit -m 'Add some amazing feature'`
3. 브랜치에 푸시: `git push origin feature/amazing-feature`
4. Pull Request 생성

---

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase CLI 가이드](https://supabase.com/docs/guides/cli)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

---

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 있습니다.

---

## 👥 팀

문의사항이나 도움이 필요하면 팀 채널로 연락주세요!

---

**Happy Coding! 🚀**
