import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { createClient } from '@/lib/supabase-server';
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { getProducts, getPopularProducts } from '@/queries/products';
import MainPageClient from './MainPageClient';

export default async function MainPage() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  // 🚀 Server-side Prefetch
  await Promise.all([
    prefetchQuery(queryClient, getProducts(supabase)),
    prefetchQuery(queryClient, getPopularProducts(supabase)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainPageClient />
    </HydrationBoundary>
  );
}
