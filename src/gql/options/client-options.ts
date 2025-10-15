import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { execute } from "../execute";
import { TrackListHomeQuery } from "@/modules/client/home/ui/views/home-view";
import {
  GetListenerProfileQuery,
  GetUserActiveSubscriptionQuery,
} from "@/modules/client/profile/ui/views/queries";
import { TrackDetailViewQuery } from "@/modules/client/track/ui/views/track-detail-view";
import { PlaylistsQuery } from "@/modules/client/library/ui/views/library-view";
import {
  CheckTrackInPlaylistQuery,
  PlaylistBriefQuery,
  PlaylistDetailQuery,
  PlaylistDetailTrackListQuery,
} from "@/modules/client/playlist/ui/views/playlist-detail-view";

export const trackListHomeOptions = queryOptions({
  queryKey: ["tracks-home"],
  queryFn: async () => await execute(TrackListHomeQuery, { take: 10 }),
});

export const listenerProfileOptions = (userId: string) =>
  queryOptions({
    queryKey: ["listener-profile", userId],
    queryFn: async () => {
      const result = await execute(GetListenerProfileQuery, {
        where: { userId: { eq: userId } },
        take: 1,
        skip: 0,
      });
      return result.listeners?.items?.[0] || null;
    },
    enabled: !!userId,
  });

export const userActiveSubscriptionOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-active-subscription", userId],
    queryFn: async () => {
      const result = await execute(GetUserActiveSubscriptionQuery, {
        where: {
          userId: { eq: userId },
          isActive: { eq: true },
          cancelAtEndOfPeriod: { eq: false },
        },
        take: 1,
        skip: 0,
      });
      return result.userSubscriptions?.items?.[0] || null;
    },
    enabled: !!userId,
  });

export const trackDetailOptions = (trackId: string) =>
  queryOptions({
    queryKey: ["track-detail", trackId],
    queryFn: async () => await execute(TrackDetailViewQuery, { trackId }),
  });

export const playlistOptions = infiniteQueryOptions({
  queryKey: ["playlists"],
  queryFn: async () => await execute(PlaylistsQuery),
  initialPageParam: 1,
  getNextPageParam: (lastPage, allPages) => {
    const totalCount = lastPage.playlists?.totalCount || 0;
    const loadedCount = allPages
      .map((page) => page.playlists?.items?.length || 0)
      .reduce((a, b) => a + b, 0);
    return loadedCount < totalCount ? allPages.length + 1 : undefined;
  },
});

export const playlistDetailOptions = (playlistId: string) =>
  queryOptions({
    queryKey: ["playlist-detail", playlistId],
    queryFn: async () => await execute(PlaylistDetailQuery, { playlistId }),
  });

export const playlistDetailTrackListOptions = (playlistId: string) =>
  queryOptions({
    queryKey: ["playlist-detail-tracklist", playlistId],
    queryFn: async () =>
      await execute(PlaylistDetailTrackListQuery, { playlistId }),
  });

export const playlistBriefOptions = queryOptions({
  queryKey: ["playlist-brief"],
  queryFn: async () => await execute(PlaylistBriefQuery),
});

export const checkTrackInPlaylistOptions = (trackId: string) =>
  queryOptions({
    queryKey: ["check-track-in-playlist", trackId],
    queryFn: async () => await execute(CheckTrackInPlaylistQuery, { trackId }),
  });
