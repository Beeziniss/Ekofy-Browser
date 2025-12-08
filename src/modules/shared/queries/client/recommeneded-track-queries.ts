import { graphql } from "@/gql";

export const RECOMMENDED_TRACKS_BY_TRACK_ID = graphql(`
    query RecommendedTracksByTrackId($skip: Int, $take: Int, $algorithm: RecommendationAlgorithm!, $trackId: String!, $limit: Int!, $audioFeatureWeight: AudioFeatureWeightInput!, $order: [TrackSortInput!]) {
        recommendedTracksByTrackId(skip: $skip, take: $take, algorithm: $algorithm, trackId: $trackId, limit: $limit, audioFeatureWeight: $audioFeatureWeight, order: $order) {
            totalCount
        pageInfo {
            hasNextPage
            hasPreviousPage
        }
        items {
            id
            name
            coverImage
            mainArtistIds
            featuredArtistIds
            mainArtists {
                items {
                    id
                    userId
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
            checkTrackInFavorite
            favoriteCount
            createdAt
            streamCount
            tags
            categoryIds
            type
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