import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { createClient } from '@/lib/supabase-server';
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query';
import {
  getCommunityPosts,
  getPopularCommunityPosts,
  getHotCommunityPosts,
  getPinnedCommunityPosts,
  getCommunityCategories,
} from '@/queries/community';
import Header from '@/components/header';
import Banner from '@/components/banner';
import Footer from '@/components/footer';
import CommunityPageClient from './CommunityPageClient';

export default async function CommunityPage() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  // 🚀 Server-side Prefetch - 커뮤니티 페이지에 특화
  await Promise.all([
    prefetchQuery(queryClient, getCommunityPosts(supabase)),
    prefetchQuery(queryClient, getPopularCommunityPosts(supabase, 10)),
    prefetchQuery(queryClient, getHotCommunityPosts(supabase, 5)),
    prefetchQuery(queryClient, getPinnedCommunityPosts(supabase)),
    prefetchQuery(queryClient, getCommunityCategories(supabase)),
  ]);

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <Banner />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CommunityPageClient />
      </HydrationBoundary>
      <Footer />
    </div>
  );
}
