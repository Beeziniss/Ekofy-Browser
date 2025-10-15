import { queryOptions } from '@tanstack/react-query';
import { execute } from '../execute';
import { SEARCH_ARTISTS, SEARCH_LISTENERS, SEARCH_PLAYLISTS, SEARCH_TRACKS } from '@/modules/client/search/ui/view/search-view';

// Query Options
export const searchTracksOptions = (query: string, skip: number = 0, take: number = 50, type?: string) =>
  queryOptions({
    queryKey: ['searchTracks', query, skip, take],
    queryFn: () => execute(SEARCH_TRACKS, { contains: query, skip, take }),
    enabled: !!query && (type === 'all' || type === 'songs' || !type),
  });

export const searchArtistsOptions = (query: string, skip: number = 0, take: number = 50, type?: string) =>
  queryOptions({
    queryKey: ['searchArtists', query, skip, take],
    queryFn: () => execute(SEARCH_ARTISTS, { contains: query, skip, take }),
    enabled: !!query && (type === 'all' || type === 'artists' || !type),
  });

export const searchPlaylistsOptions = (query: string, skip: number = 0, take: number = 50, type?: string) =>
  queryOptions({
    queryKey: ['searchPlaylists', query, skip, take],
    queryFn: () => execute(SEARCH_PLAYLISTS, { contains: query, skip, take }),
    enabled: !!query && (type === 'all' || type === 'playlists' || !type),
  });

export const searchListenersOptions = (query: string, skip: number = 0, take: number = 50, type?: string) =>
  queryOptions({
    queryKey: ['searchListeners', query, skip, take],
    queryFn: () => execute(SEARCH_LISTENERS, { contains: query, skip, take }),
    enabled: !!query && (type === 'all' || type === 'listeners' || !type),
  });