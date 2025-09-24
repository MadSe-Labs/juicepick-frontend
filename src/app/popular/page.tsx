import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { createClient } from '@/lib/supabase-server';
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { getPopularProducts, getProducts } from '@/queries/products';
import Header from '@/components/header';
import Banner from '@/components/banner';
import Footer from '@/components/footer';
import PopularPageClient from './PopularPageClient';

export default async function PopularPage() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  // 🚀 Server-side Prefetch - 인기 제품 페이지에 특화
  await Promise.all([
    prefetchQuery(queryClient, getPopularProducts(supabase, 50)), // 인기 제품 더 많이 로드
    prefetchQuery(queryClient, getProducts(supabase)), // 전체 제품도 프리페치 (검색용)
  ]);

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <Banner />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PopularPageClient />
      </HydrationBoundary>
      <Footer />
    </div>
  );
}
