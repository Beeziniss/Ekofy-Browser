'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchView } from '@/modules/client/search/ui/view/search-view';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/providers/get-query-client';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = getQueryClient();
  
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';

  const handleTypeChange = (newType: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('type', newType);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchView 
        query={query}
        type={type as any}
        onTypeChange={handleTypeChange}
      />
    </HydrationBoundary>
  );
};

export default SearchPage;
