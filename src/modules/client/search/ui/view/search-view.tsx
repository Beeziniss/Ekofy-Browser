"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchType, SearchArtistItem, SearchPlaylistItem, SearchTrackItem, SearchAlbumItem } from "@/types/search";
import { SearchLayout } from "../layout/search-layout";
import { SearchAllSection } from "../section/search-all-section/search-all-section";
import { SearchTrackSection } from "../section/search-track-section/search-track-section";
import { SearchArtistSection } from "../section/search-user-section/search-artist-section";
import { SearchPlaylistSection } from "../section/search-playlist-section/search-playlist-section";
import { SearchAlbumSection } from "../section/search-album-section";
import { SearchEmptySection } from "../component/search-empty-section";
import {
  searchTracksInfiniteOptions,
  searchArtistsInfiniteOptions,
  searchPlaylistsInfiniteOptions,
  searchAlbumsInfiniteOptions,
} from "@/gql/options/search-options";

// Types for search responses
interface SearchResponse {
  searchTracks?: { items: SearchTrackItem[] };
  searchArtists?: { items: SearchArtistItem[] };
  searchPlaylists?: { items: SearchPlaylistItem[] };
  searchAlbums?: { items: SearchAlbumItem[] };
}

interface SearchViewProps {
  query: string;
  type: SearchType;
  onTypeChange: (type: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ query, type, onTypeChange }) => {
  // Always call hooks at top level - use enabled to control execution
  const tracksQuery = useInfiniteQuery({
    ...searchTracksInfiniteOptions(query, 10),
    enabled: !!query && (type === "all" || type === "songs"),
  });

  const artistsQuery = useInfiniteQuery({
    ...searchArtistsInfiniteOptions(query, 10),
    enabled: !!query && (type === "all" || type === "artists"),
  });

  const playlistsQuery = useInfiniteQuery({
    ...searchPlaylistsInfiniteOptions(query, 10),
    enabled: !!query && (type === "all" || type === "playlists"),
  });

  const albumsQuery = useInfiniteQuery({
    ...searchAlbumsInfiniteOptions(query, 10),
    enabled: !!query && (type === "all" || type === "albums"),
  });

  if (!query) {
    return (
      <SearchLayout query={query} currentType={type} onTypeChange={onTypeChange}>
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Enter a search term to find tracks, artists, and playlists</p>
        </div>
      </SearchLayout>
    );
  }

  // Show loading state
  if (tracksQuery.isLoading || artistsQuery.isLoading || playlistsQuery.isLoading || albumsQuery.isLoading) {
    return (
      <SearchLayout query={query} currentType={type} onTypeChange={onTypeChange}>
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Searching...</p>
        </div>
      </SearchLayout>
    );
  }

  // Extract data from queries
  const tracks = tracksQuery.data?.pages.flatMap((page) => (page as SearchResponse).searchTracks?.items || []) || [];
  const artists = artistsQuery.data?.pages.flatMap((page) => (page as SearchResponse).searchArtists?.items || []) || [];
  const playlists =
    playlistsQuery.data?.pages.flatMap((page) => (page as SearchResponse).searchPlaylists?.items || []) || [];
  const albums = albumsQuery.data?.pages.flatMap((page) => (page as SearchResponse).searchAlbums?.items || []) || [];

  const renderContent = () => {
    switch (type) {
      case "songs":
        return (
          <SearchTrackSection
            tracks={tracks}
            hasNextPage={tracksQuery.hasNextPage}
            isFetchingNextPage={tracksQuery.isFetchingNextPage}
            fetchNextPage={tracksQuery.fetchNextPage}
          />
        );
      case "artists":
        return (
          <SearchArtistSection
            artists={artists}
            hasNextPage={artistsQuery.hasNextPage}
            isFetchingNextPage={artistsQuery.isFetchingNextPage}
            fetchNextPage={artistsQuery.fetchNextPage}
          />
        );
      case "playlists":
        return (
          <SearchPlaylistSection
            playlists={playlists}
            hasNextPage={playlistsQuery.hasNextPage}
            isFetchingNextPage={playlistsQuery.isFetchingNextPage}
            fetchNextPage={playlistsQuery.fetchNextPage}
          />
        );
      case "albums":
        return (
          <SearchAlbumSection
            albums={albums}
            hasNextPage={albumsQuery.hasNextPage}
            isFetchingNextPage={albumsQuery.isFetchingNextPage}
            fetchNextPage={albumsQuery.fetchNextPage}
          />
        );
      case "all":
        if (tracks.length === 0 && artists.length === 0 && playlists.length === 0 && albums.length === 0) {
          return <SearchEmptySection query={query} type={type} />;
        }
        return (
          <SearchAllSection
            tracks={tracks.slice(0, 10)}
            artists={artists.slice(0, 10)}
            playlists={playlists.slice(0, 10)}
            albums={albums.slice(0, 10)}
            query={query}
          />
        );
      default:
        return <SearchEmptySection query={query} type={type} />;
    }
  };

  return (
    <SearchLayout query={query} currentType={type} onTypeChange={onTypeChange}>
      {renderContent()}
    </SearchLayout>
  );
};
