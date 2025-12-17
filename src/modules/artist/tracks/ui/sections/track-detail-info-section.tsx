"use client";

import { useQuery } from "@tanstack/react-query";
import { artistTrackDetailOptions } from "@/gql/options/artist-options";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChartLineIcon, HeartIcon, PlayIcon, TagIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/utils/format-number";

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

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Cover Image */}
          <div className="relative flex-shrink-0 pl-6 rounded-md">
            {track.coverImage ? (
              <div className="relative h-64 w-full md:h-80 md:w-80">
                <Image src={track.coverImage} alt={track.name} fill className="rounded-md object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-md" />
                {track.isExplicit && (
                  <div className="bg-main-purple text-main-white absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-md text-lg font-semibold">
                    E
                  </div>
                )}
              </div>
            ) : (
              <div className="primary_gradient flex h-64 w-full items-center justify-center md:h-80 md:w-80">
                <PlayIcon className="fill-main-white h-16 w-16 text-white/80" />
              </div>
            )}
          </div>

          {/* Track Details */}
          <div className="flex min-w-0 flex-1 flex-col justify-between pr-6">
            {/* Header Section */}
            <div>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <h1 className="text-main-white mb-3 line-clamp-1 text-3xl leading-tight font-bold">{track.name}</h1>

                  <div className="mb-2 flex items-center gap-2">
                    <UserIcon className="text-main-purple h-4 w-4" />
                    <span className="text-main-white text-base font-medium">
                      {track.mainArtists?.items?.map((artist) => artist.stageName).join(", ") || "Unknown Artist"}
                    </span>
                  </div>

                  <div className="flex items-center gap-x-3">
                    {track.releaseInfo?.releaseDate && (
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="text-muted-foreground h-4 w-4" />
                        <span className="text-muted-foreground text-sm">
                          Released {formatDate(track.releaseInfo.releaseDate)}
                        </span>
                      </div>
                    )}

                    <Badge variant={track.releaseInfo?.isRelease ? "default" : "secondary"} className="justify-center">
                      {track.releaseInfo?.isRelease ? "Public" : "Private"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/artist/studio/tracks/insights/${trackId}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <ChartLineIcon className="mr-2 h-4 w-4" />
                      Insights
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="bg-muted/20 border-border/30 mb-6 grid grid-cols-2 gap-4 rounded-lg border p-4 md:grid-cols-4">
                <div className="flex flex-col items-center justify-center rounded-md py-2">
                  <div className="text-main-purple mb-1 flex items-center gap-1.5">
                    <PlayIcon className="h-5 w-5 fill-current" />
                  </div>
                  <span className="text-main-white mb-0.5 text-xl font-bold">{formatNumber(track.streamCount)}</span>
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Streams</p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-md py-2">
                  <div className="text-main-purple mb-1 flex items-center gap-1.5">
                    <HeartIcon className="h-5 w-5 fill-current" />
                  </div>
                  <span className="text-main-white mb-0.5 text-xl font-bold">{formatNumber(track.favoriteCount)}</span>
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Favorites</p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-md py-2">
                  <div className="text-main-purple mb-1 flex items-center gap-1.5">
                    <TagIcon className="h-5 w-5" />
                  </div>
                  <span className="text-main-white mb-0.5 text-xl font-bold">{track.categoryIds.length}</span>
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Categories</p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-md py-2">
                  <div className="text-main-purple mb-1 flex items-center gap-1.5">
                    <TagIcon className="h-5 w-5" />
                  </div>
                  <span className="text-main-white mb-0.5 text-xl font-bold">{track.tags.length}</span>
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Tags</p>
                </div>
              </div>
            </div>

            {/* Tags Display */}
            {track.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {track.tags.slice(0, 5).map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-main-purple/30 text-main-white">
                    <TagIcon className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
                {track.tags.length > 5 && (
                  <Badge variant="outline" className="border-main-purple/30 text-muted-foreground">
                    +{track.tags.length - 5} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackDetailInfoSection;
