"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Music, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { TrackUploadRequest } from "@/types/approval-track";
import { SimplePlayButton } from "./simple-play-button";

interface TrackInfoCardProps {
  track: TrackUploadRequest;
  createdByUser?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  } | null;
  isLoadingUser?: boolean;
}

export function TrackInfoCard({ track, createdByUser, isLoadingUser }: TrackInfoCardProps) {
  const getTrackTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "original":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cover":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "remix":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "live":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Track Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="group relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src={track.track.coverImage || undefined} alt={track.track.name} />
              <AvatarFallback>
                <Music className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <SimplePlayButton
                trackId={track.track.id}
                trackName={track.track.name}
                trackArtist={track.mainArtists?.items?.map((artist) => artist.stageName).join(", ") || "Unknown Artist"}
                trackCoverImage={track.track.coverImage}
                uploadId={track.id} // Pass uploadId for audio player
                size="lg"
                className="h-14 w-14"
              />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{track.track.name}</h2>
              <Badge variant="secondary" className={cn(getTrackTypeColor(track.track.type))}>
                {track.track.type}
              </Badge>
              {track.track.isExplicit && <Badge variant="destructive">Explicit</Badge>}
            </div>
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                Requested: {formatDistanceToNow(new Date(track.requestedAt), { addSuffix: true })}
              </div>
              <div className="flex items-center gap-1">
                {isLoadingUser
                  ? "Loading user..."
                  : createdByUser
                    ? `Created by: ${createdByUser.fullName}`
                    : `Created by: ${track.createdBy}`}
              </div>
            </div>
            <div className="text-muted-foreground">
              <div className="flex items-center gap-1">
                Description:{" "}
                {track.track.description && <p className="text-muted-foreground">{track.track.description}</p>}
              </div>
            </div>
          </div>
        </div>
        {/* Track Details - Di chuyển từ sidebar */}
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="font-medium">Track Details</h3>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="outline" className={cn(getTrackTypeColor(track.track.type))}>
                  {track.track.type}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Explicit:</span>
                <span>{track.track.isExplicit ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categories:</span>
                <span>{track.track.categoryIds?.length || 0} categories</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Main Artists:</span>
                <span>{track.track.mainArtistIds?.length || 0} artists</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Featured Artists:</span>
                <span>{track.track.featuredArtistIds?.length || 0} artists</span>
              </div>
            </div>
          </div>
        </>

        {/* Release Information */}
        {track.track.releaseInfo && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="font-medium">Release Information</h3>
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={track.track.releaseInfo.isRelease ? "text-green-600" : "text-main-white"}>
                    {track.track.releaseInfo.isRelease ? "Released" : "Not Released"}
                  </span>
                </div>
                {track.track.releaseInfo.releaseDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Release Date:</span>
                    <span>{new Date(track.track.releaseInfo.releaseDate).toLocaleDateString()}</span>
                  </div>
                )}
                {track.track.releaseInfo.releasedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Released At:</span>
                    <span>{new Date(track.track.releaseInfo.releasedAt).toLocaleString()}</span>
                  </div>
                )}
                {track.track.releaseInfo.releaseStatus && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Release Status:</span>
                    <Badge variant="outline">{track.track.releaseInfo.releaseStatus}</Badge>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Lyrics */}
        {track.track.lyrics && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 font-medium">
                <FileText className="h-4 w-4" />
                Lyrics
              </h3>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm whitespace-pre-wrap">{track.track.lyrics}</pre>
              </div>
            </div>
          </>
        )}

        {/* Preview Video */}
        {track.track.previewVideo && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-medium">Preview Video</h3>
              <video src={track.track.previewVideo} controls className="w-full rounded-lg" preload="metadata">
                Your browser does not support the video tag.
              </video>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
