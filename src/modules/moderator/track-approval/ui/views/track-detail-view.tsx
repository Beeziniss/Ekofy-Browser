"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { moderatorTrackDetailOptions } from "@/gql/options/moderator-options";
import { TrackDetailViewProps } from "@/types/approval-track";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AudioPlayer } from "../components/audio-player";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Download, 
  Music,
  User,
  Calendar,
  FileText,
  Tag
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { execute } from "@/gql/execute";
import { 
  ApproveTrackUploadRequestMutation, 
  RejectTrackUploadRequestMutation 
} from "../queries/track-approval-queries";
import { useRouter } from "next/navigation";

export function TrackDetailView({ trackId }: TrackDetailViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: track, isLoading, error } = useQuery(
    moderatorTrackDetailOptions(trackId)
  );

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (uploadId: string) => {
      return await execute(ApproveTrackUploadRequestMutation, { uploadId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderator-pending-tracks"] });
      router.push("/moderator/track-approval");
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ uploadId, reasonReject }: { uploadId: string; reasonReject: string }) => {
      return await execute(RejectTrackUploadRequestMutation, { uploadId, reasonReject });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderator-pending-tracks"] });
      router.push("/moderator/track-approval");
    },
  });

  const handleApprove = async () => {
    if (!track) return;
    try {
      await approveMutation.mutateAsync(track.id);
    } catch (error) {
      console.error("Failed to approve track:", error);
    }
  };

  const handleReject = async () => {
    if (!track) return;
    try {
      await rejectMutation.mutateAsync({ 
        uploadId: track.id, 
        reasonReject: "Rejected by moderator after detailed review" 
      });
    } catch (error) {
      console.error("Failed to reject track:", error);
    }
  };

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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-destructive">
            Failed to load track details. Please try again.
          </p>
          <Button 
            variant="outline" 
            onClick={() => router.push("/moderator/track-approval")}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Track Approval
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push("/moderator/track-approval")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
          <h1 className="text-2xl font-bold">Track Review</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={rejectMutation.isPending}
            className="text-red-600 hover:text-red-700"
          >
            <XCircle className="mr-2 h-4 w-4" />
            {rejectMutation.isPending ? "Rejecting..." : "Reject"}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={approveMutation.isPending}
            className="text-green-600 hover:text-green-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {approveMutation.isPending ? "Approving..." : "Approve"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Track Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Track Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={track.track.coverImage} 
                    alt={track.track.name}
                  />
                  <AvatarFallback>
                    <Music className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">{track.track.name}</h2>
                    <Badge 
                      variant="secondary" 
                      className={cn(getTrackTypeColor(track.track.type))}
                    >
                      {track.track.type}
                    </Badge>
                  </div>
                  {track.track.description && (
                    <p className="text-muted-foreground">{track.track.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Requested {formatDistanceToNow(new Date(track.requestedAt), { addSuffix: true })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {track.createdBy}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Audio Player */}
              <div className="space-y-2">
                <h3 className="font-medium">Preview</h3>
                <AudioPlayer trackId={track.track.id} />
              </div>

              {/* Tags */}
              {track.track.tags && track.track.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {track.track.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
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
                    <h3 className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Lyrics
                    </h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">{track.track.lyrics}</pre>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Artists */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Artists & Contributors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Artists */}
              {track.mainArtists?.items && track.mainArtists.items.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Main Artists</h3>
                  <div className="grid gap-2">
                    {track.mainArtists.items.map((artist) => (
                      <div key={artist.id} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{artist.stageName}</p>
                          <p className="text-sm text-muted-foreground">{artist.email}</p>
                        </div>
                        <Badge variant="outline">{artist.artistType}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Artists */}
              {track.featuredArtists?.items && track.featuredArtists.items.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Featured Artists</h3>
                  <div className="grid gap-2">
                    {track.featuredArtists.items.map((artist) => (
                      <div key={artist.id} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{artist.stageName}</p>
                          <p className="text-sm text-muted-foreground">{artist.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-yellow-600">
                Pending Review
              </Badge>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download Original
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View Legal Documents
              </Button>
            </CardContent>
          </Card>

          {/* Release Info */}
          {track.track.releaseInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Release Information</CardTitle>
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}