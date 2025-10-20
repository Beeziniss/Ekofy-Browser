/* eslint-disable @typescript-eslint/no-explicit-any */
import { infiniteQueryOptions } from '@tanstack/react-query';
import { execute } from '../execute';
import { SEARCH_ARTISTS, SEARCH_LISTENERS, SEARCH_PLAYLISTS, SEARCH_TRACKS } from '@/modules/client/search/ui/view/search-view';
// TODO: Replace with proper GraphQL-generated types

// Infinite Query Options
export const searchTracksInfiniteOptions = (query: string, take: number = 10) =>
  infiniteQueryOptions({
    queryKey: ['searchTracks', query],
    queryFn: ({ pageParam = 0 }) => 
      execute(SEARCH_TRACKS as any, { contains: query, skip: pageParam, take }),
    enabled: !!query,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const totalItems = allPages.reduce((sum, page) => sum + (page.tracks?.items?.length || 0), 0);
      return totalItems < (lastPage.tracks?.totalCount || 0) ? totalItems : undefined;
    },
    initialPageParam: 0,
  });

export const searchArtistsInfiniteOptions = (query: string, take: number = 10) =>
  infiniteQueryOptions({
    queryKey: ['searchArtists', query],
    queryFn: ({ pageParam = 0 }) => 
      execute(SEARCH_ARTISTS as any, { contains: query, skip: pageParam, take }),
    enabled: !!query,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const totalItems = allPages.reduce((sum, page) => sum + (page.artists?.items?.length || 0), 0);
      return totalItems < (lastPage.artists?.totalCount || 0) ? totalItems : undefined;
    },
    initialPageParam: 0,
  });

export const searchPlaylistsInfiniteOptions = (query: string, take: number = 10) =>
  infiniteQueryOptions({
    queryKey: ['searchPlaylists', query],
    queryFn: ({ pageParam = 0 }) => 
      execute(SEARCH_PLAYLISTS as any, { contains: query, skip: pageParam, take }),
    enabled: !!query,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const totalItems = allPages.reduce((sum, page) => sum + (page.playlists?.items?.length || 0), 0);
      return totalItems < (lastPage.playlists?.totalCount || 0) ? totalItems : undefined;
    },
    initialPageParam: 0,
  });

export const searchListenersInfiniteOptions = (query: string, take: number = 10) =>
  infiniteQueryOptions({
    queryKey: ['searchListeners', query],
    queryFn: ({ pageParam = 0 }) => 
      execute(SEARCH_LISTENERS as any, { contains: query, skip: pageParam, take }),
    enabled: !!query,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const totalItems = allPages.reduce((sum, page) => sum + (page.listeners?.items?.length || 0), 0);
      return totalItems < (lastPage.listeners?.totalCount || 0) ? totalItems : undefined;
    },
    initialPageParam: 0,
  });