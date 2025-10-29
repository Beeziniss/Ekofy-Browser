"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrackUploadRequest } from "@/types/approval-track";

interface TrackDetailSidebarProps {
  track: TrackUploadRequest;
  onDownloadOriginal: () => void;
  createdByUser?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  } | null;
  isLoadingUser?: boolean;
}

export function TrackDetailSidebar({ 
  track, 
  createdByUser,
  isLoadingUser
}: TrackDetailSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Review Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              Pending Review
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            This track is awaiting moderator approval
          </p>
        </CardContent>
      </Card>

      {/* Track Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Track Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <span className="font-medium">Type: </span>
            <span className="text-muted-foreground">{track.track.type}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Explicit: </span>
            <span>
              {track.track.isExplicit ? "Yes" : "No"}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Categories: </span>
            <span className="text-muted-foreground">
              {track.track.categoryIds?.length || 0} categories
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Main Artists: </span>
            <span className="text-muted-foreground">
              {track.track.mainArtistIds?.length || 0} artists
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Release Info */}
      {track.track.releaseInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Release Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Status: </span>
              <span className={track.track.releaseInfo.isReleased ? "text-green-600" : "text-muted-foreground"}>
                {track.track.releaseInfo.isReleased ? "Released" : "Not Released"}
              </span>
            </div>
            {track.track.releaseInfo.releaseDate && (
              <div className="text-sm">
                <span className="font-medium">Release Date: </span>
                <span className="text-muted-foreground">
                  {new Date(track.track.releaseInfo.releaseDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {track.track.releaseInfo.releasedAt && (
              <div className="text-sm">
                <span className="font-medium">Released At: </span>
                <span className="text-muted-foreground">
                  {new Date(track.track.releaseInfo.releasedAt).toLocaleString()}
                </span>
              </div>
            )}
            {track.track.releaseInfo.releaseStatus && (
              <div className="text-sm">
                <span className="font-medium">Release Status: </span>
                <Badge variant="outline">{track.track.releaseInfo.releaseStatus}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Request Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Request Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Requested: </span>
            <span className="text-muted-foreground">
              {new Date(track.requestedAt).toLocaleString()}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Created by: </span>
            {isLoadingUser ? (
              <span className="text-muted-foreground">Loading...</span>
            ) : createdByUser ? (
              <div className="text-muted-foreground">
                <div>{createdByUser.fullName}</div>
                <Badge variant="outline" className="text-xs mt-1">
                  {createdByUser.role}
                </Badge>
              </div>
            ) : (
              <span className="text-muted-foreground">{track.createdBy}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}