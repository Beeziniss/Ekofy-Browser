import {
    PROCESS_TRACK_ENGAGEMENT_POPULARITY,
    PROCESS_TRACK_DISCOVERY_POPULARITY,
    PROCESS_ARTIST_ENGAGEMENT_POPULARITY,
    PROCESS_ARTIST_DISCOVERY_POPULARITY
} from "@/modules/shared/mutations/client/popuarity-mutation";

import { PopularityActionType } from "@/gql/graphql";
import { useMutation } from "@tanstack/react-query";
import { execute } from "../execute";

export const useProcessTrackEngagementPopularity = () => {
    // const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: { trackId: string; actionType: PopularityActionType }) => {
            const result = await execute(PROCESS_TRACK_ENGAGEMENT_POPULARITY, params);
            return result;
        },
    });
};

export const useProcessTrackDiscoveryPopularity = () => {
    // const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: { trackId: string; actionType: PopularityActionType }) => {
            const result = await execute(PROCESS_TRACK_DISCOVERY_POPULARITY, params);
            return result;
        },
    });
};

export const useProcessArtistEngagementPopularity = () => {
    // const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: { artistId: string; actionType: PopularityActionType }) => {
            const result = await execute(PROCESS_ARTIST_ENGAGEMENT_POPULARITY, params);
            return result;
        },
    });
};

export const useProcessArtistDiscoveryPopularity = () => {
    // const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: { artistId: string; actionType: PopularityActionType }) => {
            const result = await execute(PROCESS_ARTIST_DISCOVERY_POPULARITY, params);
            return result;
        },
    });
};
