export type SearchType = "all" | "songs" | "artists" | "playlists" | "albums" | "profiles" | "genres";

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
  { id: "all", label: "All" },
  { id: "songs", label: "Songs" },
  { id: "artists", label: "Artists" },
  { id: "playlists", label: "Playlists" },
  { id: "albums", label: "Albums" },
];

// Search Query Variables
export interface SearchQueryVariables {
  contains: string;
  skip: number;
  take: number;
}

// Search Response Types
export interface SearchTrackItem {
  id: string;
  name: string;
  description: string;
  nameUnsigned: string;
  type: string;
  categoryIds: string[];
  mainArtistIds: string[];
  createdAt: string;
  coverImage: string;
  restriction: {
    type: string;
  };
  mainArtists: {
    items: {
      id: string;
      userId: string;
      stageName: string;
      artistType: string;
    }[];
  };
  checkTrackInFavorite: boolean;
  // Add other track properties as needed
}

export interface SearchArtistItem {
  id: string;
  stageName: string;
  stageNameUnsigned: string;
  userId: string;
  email: string;
  artistType: string;
  avatarImage: string;
  followerCount: number;
  user: {
    fullName: string;
    role: string;
    checkUserFollowing?: boolean;
  }[];
  // Add other artist properties as needed
}

export interface SearchPlaylistItem {
  id: string;
  userId: string;
  name: string;
  nameUnsigned: string;
  tracksInfo: {
    trackId: string;
    addedTime: string;
  }[];
  coverImage: string;
  isPublic: boolean;
  user: {
    id: string;
    fullName: string;
  }[];
  checkPlaylistInFavorite: boolean;
  // Add other playlist properties as needed
}

export interface SearchListenerItem {
  id: string;
  userId: string;
  displayName: string;
  displayNameUnsigned: string;
  email: string;
  avatarImage: string;
  followerCount: number;
  followingCount: number;
  user: {
    fullName: string;
    role: string;
  };
  // Add other listener properties as needed
}

export interface SearchTracksResponse {
  tracks: {
    totalCount: number;
    items: SearchTrackItem[];
  };
}

export interface SearchArtistsResponse {
  artists: {
    totalCount: number;
    items: SearchArtistItem[];
  };
}

export interface SearchPlaylistsResponse {
  playlists: {
    totalCount: number;
    items: SearchPlaylistItem[];
  };
}

export interface SearchListenersResponse {
  listeners: {
    totalCount: number;
    items: SearchListenerItem[];
  };
}

// Union types for components
export type SearchableItem = SearchArtistItem | SearchPlaylistItem | SearchTrackItem;
