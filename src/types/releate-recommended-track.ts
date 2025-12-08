/**
 * Track information interface for track card components
 * Contains all necessary fields for displaying track details, metadata, and stats
 */
export interface TrackInfo {
  id?: string | null;
  name?: string | null;
  coverImage?: string | null;
  streamCount?: number | null;
  favoriteCount?: number | null;
  checkTrackInFavorite?: boolean | null;
  tags?: (string | null)[] | null;
  categoryIds?: (string | null)[] | null;
  mainArtists?: {
    items?: (ArtistInfo | null)[] | null;
  } | null;
  featuredArtists?: {
    items?: (ArtistInfo | null)[] | null;
  } | null;
  categories?: {
    items?: (CategoryInfo | null)[] | null;
  } | null;
}

/**
 * Artist information for track cards
 */
export interface ArtistInfo {
  id?: string | null;
  userId?: string | null;
  stageName?: string | null;
}

/**
 * Category information for track cards
 */
export interface CategoryInfo {
  id?: string | null;
  name?: string | null;
}
