/* eslint-disable @typescript-eslint/no-explicit-any */
import { infiniteQueryOptions } from "@tanstack/react-query";
import { execute } from "../execute";
import {
  SEARCH_ARTISTS,
  SEARCH_LISTENERS,
  SEARCH_PLAYLISTS,
  SEARCH_TRACKS,
  SEARCH_ALBUMS,
} from "@/modules/shared/queries/client/search-queries";
// TODO: Replace with proper GraphQL-generated types

// Infinite Query Options
export const searchTracksInfiniteOptions = (query: string, take: number = 10) =>
  infiniteQueryOptions({
    queryKey: ["searchTracks", query],
    queryFn: ({ pageParam = 0 }) => execute(SEARCH_TRACKS as any, { name: query, skip: pageParam, take }),
    enabled: !!query,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const totalItems = allPages.reduce((sum, page) => sum + (page.searchTracks?.items?.length || 0), 0);
      return totalItems < (lastPage.searchTracks?.totalCount || 0) ? totalItems : undefined;
    },
    initialPageParam: 0,
  });

export const searchArtistsInfiniteOptions = (query: string, take: number = 10) =>
  infiniteQueryOptions({
    queryKey: ["searchArtists", query],
    queryFn: ({ pageParam = 0 }) => execute(SEARCH_ARTISTS as any, { stageName: query, skip: pageParam, take }),
    enabled: !!query,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const totalItems = allPages.reduce((sum, page) => sum + (page.searchArtists?.items?.length || 0), 0);
      return totalItems < (lastPage.searchArtists?.totalCount || 0) ? totalItems : undefined;
    },
    initialPageParam: 0,
  });

export const searchPlaylistsInfiniteOptions = (query: string, take: number = 10) =>
  infiniteQueryOptions({
    queryKey: ["searchPlaylists", query],
    queryFn: ({ pageParam = 0 }) => execute(SEARCH_PLAYLISTS as any, { name: query, skip: pageParam, take }),
    enabled: !!query,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const totalItems = allPages.reduce((sum, page) => sum + (page.searchPlaylists?.items?.length || 0), 0);
      return totalItems < (lastPage.searchPlaylists?.totalCount || 0) ? totalItems : undefined;
    },
    initialPageParam: 0,
  });

export const searchListenersInfiniteOptions = (query: string, take: number = 10) =>
  infiniteQueryOptions({
    queryKey: ["searchListeners", query],
    queryFn: ({ pageParam = 0 }) => execute(SEARCH_LISTENERS as any, { displayName: query, skip: pageParam, take }),
    enabled: !!query,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const totalItems = allPages.reduce((sum, page) => sum + (page.searchListeners?.items?.length || 0), 0);
      return totalItems < (lastPage.searchListeners?.totalCount || 0) ? totalItems : undefined;
    },
    initialPageParam: 0,
  });

export const searchAlbumsInfiniteOptions = (query: string, take: number = 10) =>
  infiniteQueryOptions({
    queryKey: ["searchAlbums", query],
    queryFn: ({ pageParam = 0 }) => execute(SEARCH_ALBUMS as any, { name: query, skip: pageParam, take }),
    enabled: !!query,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const totalItems = allPages.reduce((sum, page) => sum + (page.searchAlbums?.items?.length || 0), 0);
      return totalItems < (lastPage.searchAlbums?.totalCount || 0) ? totalItems : undefined;
    },
    initialPageParam: 0,
  });