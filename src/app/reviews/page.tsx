import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { createClient } from '@/lib/supabase-server';
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { getReviews, getFeaturedReviews } from '@/queries/reviews';
import Header from '@/components/header';
import Banner from '@/components/banner';
import Footer from '@/components/footer';
import ReviewsPageClient from './ReviewsPageClient';

export default async function ReviewsPage() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  // 🚀 Server-side Prefetch - 리뷰 데이터 미리 로드
  await Promise.all([
    prefetchQuery(queryClient, getReviews(supabase)),
    prefetchQuery(queryClient, getFeaturedReviews(supabase, 10)),
  ]);

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <Banner />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ReviewsPageClient />
      </HydrationBoundary>
      <Footer />
    </div>
  );
}
