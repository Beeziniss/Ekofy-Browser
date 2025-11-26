import { graphql } from "@/gql";

export const PROCESS_TRACK_ENGAGEMENT_POPULARITY = graphql(`
    mutation ProcessTrackEngagementPopularity($trackId: String!, $actionType: PopularityActionType! ) {
        processTrackEngagementMetric(trackId: $trackId, actionType: $actionType)
    }
`);

export const PROCESS_TRACK_DISCOVERY_POPULARITY = graphql(`
    mutation ProcessTrackDiscoveryPopularity($trackId: String!, $actionType: PopularityActionType! ) {
        processTrackDiscovery(trackId: $trackId, actionType: $actionType)
    }
`);

export const PROCESS_ARTIST_ENGAGEMENT_POPULARITY = graphql(`
    mutation ProcessArtistEngagementPopularity($artistId: String!, $actionType: PopularityActionType! ) {
        processArtistEngagement(artistId: $artistId, actionType: $actionType)
    }
`);

export const PROCESS_ARTIST_DISCOVERY_POPULARITY = graphql(`
    mutation ProcessArtistDiscoveryPopularity($artistId: String!, $actionType: PopularityActionType! ) {
        processArtistDiscovery(artistId: $artistId, actionType: $actionType)
    }
`);
