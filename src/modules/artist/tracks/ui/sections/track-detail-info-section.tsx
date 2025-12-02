"use client";

import { useQuery } from "@tanstack/react-query";
import { artistTrackDetailOptions } from "@/gql/options/artist-options";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, EyeIcon, HeartIcon, PlayIcon, TagIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface TrackDetailInfoSectionProps {
  trackId: string;
}

const TrackDetailInfoSection = ({ trackId }: TrackDetailInfoSectionProps) => {
  const { data: track, isLoading } = useQuery(artistTrackDetailOptions(trackId));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="mb-4 h-6 w-1/3 rounded-md" />
          <div className="flex gap-6">
            <Skeleton className="h-32 w-32 rounded-lg" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-1/2 rounded-md" />
              <Skeleton className="h-4 w-1/3 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!track) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Track not found</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Cover Image */}
          <div className="flex-shrink-0">
            {track.coverImage ? (
              <Image
                src={track.coverImage}
                alt={track.name}
                width={128}
                height={128}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="primary_gradient flex h-32 w-32 items-center justify-center rounded-lg">
                <PlayIcon className="h-8 w-8 text-white" />
              </div>
            )}
          </div>

          {/* Track Details */}
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="text-main-white mb-2 text-2xl font-bold">{track.name}</h1>

                <div className="mb-2 flex items-center gap-2">
                  <UserIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    {track.mainArtists?.items?.map((artist) => artist.stageName).join(", ") || "Unknown Artist"}
                  </span>
                </div>

                {track.releaseInfo?.releaseDate && (
                  <div className="mb-4 flex items-center gap-2">
                    <CalendarIcon className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Released on {formatDate(track.releaseInfo.releaseDate)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {track.isExplicit && <Badge variant="destructive">Explicit</Badge>}
                <Badge variant={track.releaseInfo?.isRelease ? "default" : "secondary"}>
                  {track.releaseInfo?.isRelease ? "Public" : "Private"}
                </Badge>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-main-white flex items-center justify-center gap-1">
                  <PlayIcon className="h-4 w-4" />
                  <span className="font-semibold">{formatNumber(track.streamCount)}</span>
                </div>
                <p className="text-muted-foreground text-xs">Streams</p>
              </div>

              <div className="text-center">
                <div className="text-main-white flex items-center justify-center gap-1">
                  <HeartIcon className="h-4 w-4" />
                  <span className="font-semibold">{formatNumber(track.favoriteCount)}</span>
                </div>
                <p className="text-muted-foreground text-xs">Favorites</p>
              </div>

              <div className="text-center">
                <div className="text-main-white flex items-center justify-center gap-1">
                  <TagIcon className="h-4 w-4" />
                  <span className="font-semibold">{track.categoryIds.length}</span>
                </div>
                <p className="text-muted-foreground text-xs">Categories</p>
              </div>

              <div className="text-center">
                <div className="text-main-white flex items-center justify-center gap-1">
                  <TagIcon className="h-4 w-4" />
                  <span className="font-semibold">{track.tags.length}</span>
                </div>
                <p className="text-muted-foreground text-xs">Tags</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Link href={`/artist/studio/tracks/insights/${trackId}`}>
                <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                  <EyeIcon className="mr-1 h-3 w-3" />
                  View Analytics
                </Badge>
              </Link>

              {track.tags.length > 0 && (
                <Badge variant="outline">
                  <TagIcon className="mr-1 h-3 w-3" />
                  {track.tags.slice(0, 2).join(", ")}
                  {track.tags.length > 2 && `... +${track.tags.length - 2}`}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackDetailInfoSection;
