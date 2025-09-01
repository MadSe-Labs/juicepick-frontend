import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// 더미 사용자 데이터 (개발용)
const dummyUsers = [
  {
    id: '1',
    email: 'test@juicepick.com',
    password: '123456',
    name: '테스트 유저',
    role: 'user',
  },
  {
    id: '2',
    email: 'admin@juicepick.com',
    password: 'admin123',
    name: '관리자',
    role: 'admin',
  },
  {
    id: '3',
    email: 'user@example.com',
    password: 'password',
    name: '일반 사용자',
    role: 'user',
  },
];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 개발 환경에서는 더미 사용자 사용
        if (process.env.NODE_ENV === 'development') {
          const user = dummyUsers.find(
            (u) =>
              u.email === credentials.email &&
              u.password === credentials.password
          );

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        }

        // 나중에 실제 API 호출로 변경
        // const response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(credentials)
        // });

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
