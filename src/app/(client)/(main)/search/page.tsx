'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getQueryClient } from '@/providers/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { SearchView } from '@/modules/client/search/ui/view/search-view';
import { 
  searchTracksOptions, 
  searchArtistsOptions, 
  searchPlaylistsOptions 
} from '@/gql/options/search-options';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = getQueryClient();
  
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';

  // Prefetch search queries
  if (query) {
    void queryClient.prefetchQuery(searchTracksOptions(query, 0, type === 'songs' ? 50 : 10, type));
    void queryClient.prefetchQuery(searchArtistsOptions(query, 0, type === 'artists' ? 50 : 10, type));
    void queryClient.prefetchQuery(searchPlaylistsOptions(query, 0, type === 'playlists' ? 50 : 10, type));
  }

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
