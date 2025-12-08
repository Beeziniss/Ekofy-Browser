import { graphql } from "@/gql";

export const RELATED_TRACKS_QUERY_KEY = graphql(`
    query RelatedTracks($skip: Int, $take: Int, $where: TrackFilterInput, $order: [TrackSortInput!]) {
        tracks(skip: $skip, take: $take, where: $where, order: $order) {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
            }
            items {
                name
                id
                mainArtistIds
                featuredArtistIds
                streamCount
                favoriteCount
                coverImage
                createdAt
                checkTrackInFavorite
                type
                tags
                categoryIds
                mainArtists {
                    items {
                        userId
                        id
                        stageName
                    }
                }
                featuredArtists {
                    items {
                        id
                        userId
                        stageName
                    }
                }
                categories {
                    items {
                        id
                        name
                    }
                }
            }
        }
    }
`);