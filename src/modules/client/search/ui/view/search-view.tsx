"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchType, SearchArtistItem, SearchPlaylistItem, SearchTrackItem } from "@/types/search";
import { SearchLayout } from "../layout/search-layout";
import { SearchAllSection } from "../section/search-all-section/search-all-section";
import { SearchTrackSection } from "../section/search-track-section/search-track-section";
import { SearchArtistSection } from "../section/search-user-section/search-artist-section";
import { SearchPlaylistSection } from "../section/search-playlist-section/search-playlist-section";
import { SearchEmptySection } from "../component/search-empty-section";
import {
  searchTracksInfiniteOptions,
  searchArtistsInfiniteOptions,
  searchPlaylistsInfiniteOptions,
} from "@/gql/options/search-options";
import { graphql } from "@/gql";

// Types for search responses
interface SearchResponse {
  searchTracks?: { items: SearchTrackItem[] };
  searchArtists?: { items: SearchArtistItem[] };
  searchPlaylists?: { items: SearchPlaylistItem[] };
}

// Types for search responses
interface SearchResponse {
  searchTracks?: { items: SearchTrackItem[] };
  searchArtists?: { items: SearchArtistItem[] };
  searchPlaylists?: { items: SearchPlaylistItem[] };
}

interface SearchViewProps {
  query: string;
  type: SearchType;
  onTypeChange: (type: string) => void;
}

// GraphQL Queries - using raw strings until schema is updated
export const SEARCH_ARTISTS = graphql(`
  query SearchArtists($skip: Int, $take: Int, $stageName: String!) {
    searchArtists(skip: $skip, take: $take, stageName: $stageName) {
      totalCount
      items {
        id
        userId
        stageName
        stageNameUnsigned
        email
        artistType
        avatarImage
        followerCount
        user {
          fullName
          role
        }
      }
    }
  }
`);

export const SEARCH_LISTENERS = graphql(`
  query SearchListeners($skip: Int, $take: Int, $displayName: String!) {
    searchListeners(skip: $skip, take: $take, displayName: $displayName) {
      totalCount
      items {
        id
        userId
        displayName
        displayNameUnsigned
        email
        avatarImage
        followerCount
        followingCount
        user {
          fullName
          role
        }
      }
    }
  }
`);

export const SEARCH_TRACKS = graphql(`
  query SearchTracks($skip: Int, $take: Int, $name: String!) {
    searchTracks(skip: $skip, take: $take, name: $name) {
      totalCount
      items {
        id
        name
        description
        nameUnsigned
        type
        categoryIds
        mainArtistIds
        createdAt
        mainArtists {
          items {
            id
            userId
            stageName
            artistType
          }
        }
        coverImage
        restriction {
          type
        }
      }
    }
  }
`);

export const SEARCH_PLAYLISTS = graphql(`
  query SearchPlaylists($skip: Int, $take: Int, $name: String!) {
    searchPlaylists(skip: $skip, take: $take, name: $name) {
      totalCount
      items {
        id
        userId
        name
        nameUnsigned
        tracksInfo {
          trackId
          addedTime
        }
        coverImage
        isPublic
        user {
          id
          fullName
        }
      }
    }
  }
`);

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
  if (tracksQuery.isLoading || artistsQuery.isLoading || playlistsQuery.isLoading) {
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
      case "all":
        if (tracks.length === 0 && artists.length === 0 && playlists.length === 0) {
          return <SearchEmptySection query={query} type={type} />;
        }
        return (
          <SearchAllSection
            tracks={tracks.slice(0, 10)}
            artists={artists.slice(0, 10)}
            playlists={playlists.slice(0, 10)}
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
