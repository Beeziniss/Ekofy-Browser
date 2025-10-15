'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchType } from '@/types/search';
import { SearchLayout } from '../layout/search-layout';
import { SearchAllSection } from '../section/search-all-section/search-all-section';
import { SearchTrackSection } from '../section/search-track-section/search-track-section';
import { SearchArtistSection } from '../section/search-user-section/search-artist-section';
import { SearchPlaylistSection } from '../section/search-playlist-section/search-playlist-section';
import { SearchEmptySection } from '../component/search-empty-section';
import { 
  searchTracksOptions, 
  searchArtistsOptions, 
  searchPlaylistsOptions, 
  searchListenersOptions 
} from '@/gql/options/search-options';
import { graphql } from '@/gql';

interface SearchViewProps {
  query: string;
  type: SearchType;
  onTypeChange: (type: string) => void;
}

// GraphQL Queries
export const SEARCH_ARTISTS = graphql(`
    query SearchArtists($skip: Int, $take: Int, $contains: String) {
        artists(skip: $skip, take: $take, where: { stageNameUnsigned: { contains: $contains } }) {
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
                pageInfo {
            hasNextPage
            hasPreviousPage
        }
        }
    }
`);

export const SEARCH_LISTENERS = graphql(`
    query SearchListeners($skip: Int, $take: Int, $contains: String) {
        listeners(skip: $skip, take: $take, where: { displayNameUnsigned: { contains: $contains } }) {
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
                pageInfo {
            hasNextPage
            hasPreviousPage
        }
        }
    }
`);

export const SEARCH_TRACKS = graphql(`
    query SearchTracks($skip: Int, $take: Int, $contains: String) {
        tracks(skip: $skip, take: $take, where: { nameUnsigned: { contains: $contains } }) {
            totalCount
            items {
                id
                name
                description
                nameUnsigned
                type
                categoryIds
                mainArtistIds
                coverImage
                restriction {
                    type
                }
                artist {
                    id
                    userId
                    stageName
                    artistType
                }  
            }
                pageInfo {
            hasNextPage
            hasPreviousPage
        }
        }
    }
`);

export const SEARCH_PLAYLISTS = graphql(`
    query SearchPlaylists($skip: Int, $take: Int, $contains: String) {
        playlists(skip: $skip, take: $take, where: { nameUnsigned: { contains: $contains } }) {
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
                pageInfo {
            hasNextPage
            hasPreviousPage
        }
        }
    }
`);

export const SearchView: React.FC<SearchViewProps> = ({ query, type, onTypeChange }) => {
  // Search for tracks
  const { data: tracksData, isLoading: tracksLoading } = useQuery(
    searchTracksOptions(query, 0, type === 'songs' ? 50 : 10, type)
  );

  // Search for artists
  const { data: artistsData, isLoading: artistsLoading } = useQuery(
    searchArtistsOptions(query, 0, type === 'artists' ? 50 : 10, type)
  );

  // Search for playlists
  const { data: playlistsData, isLoading: playlistsLoading } = useQuery(
    searchPlaylistsOptions(query, 0, type === 'playlists' ? 50 : 10, type)
  );

  const tracks = tracksData?.tracks?.items || [];
  const artists = artistsData?.artists?.items || [];
  const playlists = playlistsData?.playlists?.items || [];

  const renderContent = () => {
    if (!query) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">Search for music</h2>
          <p className="text-gray-400">Find your favorite songs, artists, and playlists</p>
        </div>
      );
    }

    switch (type) {
      case 'songs':
        return (
          <SearchTrackSection 
            tracks={tracks} 
            isLoading={tracksLoading} 
          />
        );
      
      case 'artists':
        return (
          <SearchArtistSection 
            artists={artists} 
            isLoading={artistsLoading} 
          />
        );
      
      case 'playlists':
        return (
          <SearchPlaylistSection 
            playlists={playlists} 
            isLoading={playlistsLoading} 
          />
        );
      
      case 'albums':
      case 'profiles':
      case 'genres':
        return (
          <SearchEmptySection 
            type={type} 
            query={query} 
          />
        );
      
      case 'all':
      default:
        return (
          <SearchAllSection
            query={query}
            tracks={tracks}
            artists={artists}
            playlists={playlists}
            isLoading={tracksLoading || artistsLoading || playlistsLoading}
          />
        );
    }
  };

  return (
    <SearchLayout
      currentType={type}
      onTypeChange={onTypeChange}
      query={query}
    >
      {renderContent()}
    </SearchLayout>
  );
};