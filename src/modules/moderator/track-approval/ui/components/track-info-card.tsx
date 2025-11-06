"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Music, Calendar, User, Tag, FileText } from "lucide-react";
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
            {track.track.description && <p className="text-muted-foreground">{track.track.description}</p>}
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Requested {formatDistanceToNow(new Date(track.requestedAt), { addSuffix: true })}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {isLoadingUser
                  ? "Loading user..."
                  : createdByUser
                    ? `Created by: ${createdByUser.fullName}`
                    : `Created by: ${track.createdBy}`}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Audio Player - Now integrated into cover image */}

        {/* Tags */}
        {track.track.tags && track.track.tags.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 font-medium">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {track.track.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="w-14 h-10 text-[14px]">
                    {tag}
                  </Badge>
                ))}
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
