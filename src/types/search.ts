export type SearchType = 'all' | 'songs' | 'artists' | 'playlists' | 'albums' | 'profiles' | 'genres';

export interface SearchParams {
  query: string;
  type: SearchType;
  skip?: number;
  take?: number;
}

export interface SearchTabItem {
  id: SearchType;
  label: string;
  count?: number;
}

export const SEARCH_TABS: SearchTabItem[] = [
  { id: 'all', label: 'All' },
  { id: 'songs', label: 'Songs' },
  { id: 'artists', label: 'Artists' },
  { id: 'playlists', label: 'Playlists' },
  { id: 'albums', label: 'Albums' },
];