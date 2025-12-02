"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { trackUploadPendingRequestDetailOptions } from "@/gql/options/artist-options";
import { cancelTrackUploadMutationOptions } from "@/gql/options/artist-mutation-options";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface PendingRequestDetailSectionProps {
  uploadId: string;
}

export function PendingRequestDetailSection({ uploadId }: PendingRequestDetailSectionProps) {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data } = useSuspenseQuery(trackUploadPendingRequestDetailOptions(uploadId));

  const cancelMutation = useMutation(cancelTrackUploadMutationOptions);

  const handleCancelRequest = async () => {
    try {
      await cancelMutation.mutateAsync({
        uploadId: uploadId,
        reasonReject: "Request cancelled by artist",
        isCancel: true,
      });
      setShowCancelDialog(false);
      router.push("/artist/studio/tracks/pending");
    } catch (error) {
      console.error("Failed to cancel request:", error);
    }
  };

  const openCancelDialog = () => {
    setShowCancelDialog(true);
  };

  const request = data.pendingTrackUploadRequestById;

  if (!request) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/artist/studio/tracks/pending")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pending Requests
            </Button>
          </div>
        </div>
        <div className="py-12 text-center">
          <h3 className="text-main-white mb-2 text-lg font-semibold">Request Not Found</h3>
          <p className="text-main-grey">The requested upload request could not be found.</p>
        </div>
      </div>
    );
  }

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
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/artist/studio/tracks/pending")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pending Requests
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-main-white text-2xl font-bold">Track Upload Request Details</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Track Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-main-white">Track Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="primary_gradient size-20 flex-shrink-0 rounded-md">
                  {request.track.coverImage ? (
                    <Image
                      src={request.track.coverImage}
                      alt={request.track.name}
                      width={80}
                      height={80}
                      className="size-20 rounded-md object-cover"
                    />
                  ) : (
                    <div className="primary_gradient text-main-white flex size-20 items-center justify-center rounded-md text-2xl font-bold">
                      {request.track.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-main-white text-xl font-semibold">{request.track.name}</h2>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className={getTrackTypeColor(request.track.type)}>
                      {request.track.type}
                    </Badge>
                    {request.track.isExplicit && <Badge variant="destructive">Explicit</Badge>}
                  </div>
                </div>
              </div>

              {request.track.description && (
                <div>
                  <h4 className="text-main-white mb-2 text-sm font-medium">Description</h4>
                  <p className="text-main-grey text-sm">{request.track.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-main-grey">Requested:</span>
                  <p className="text-main-white">
                    {formatDistanceToNow(new Date(request.requestedAt), { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <span className="text-main-grey">Release Status:</span>
                  <p className="text-main-white">{request.track.releaseInfo?.isRelease ? "Public" : "Private"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Artists */}
          <Card>
            <CardHeader>
              <CardTitle className="text-main-white">Artists & Contributors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Artists */}
              {request.mainArtists?.items && request.mainArtists.items.length > 0 && (
                <div>
                  <h4 className="text-main-white mb-2 text-sm font-medium">Main Artists</h4>
                  <div className="space-y-2">
                    {request.mainArtists.items.map((artist) => (
                      <div key={artist.id} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={artist.avatarImage || ""} alt={artist.stageName} />
                          <AvatarFallback>{artist.stageName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-main-white text-sm font-medium">{artist.stageName}</p>
                          <p className="text-main-grey text-xs">{artist.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Artists */}
              {request.featuredArtists?.items && request.featuredArtists.items.length > 0 && (
                <div>
                  <h4 className="text-main-white mb-2 text-sm font-medium">Featured Artists</h4>
                  <div className="space-y-2">
                    {request.featuredArtists.items.map((artist) => (
                      <div key={artist.id} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{artist.stageName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-main-white text-sm font-medium">{artist.stageName}</p>
                          <p className="text-main-grey text-xs">{artist.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work & Recording Details */}
          {(request.work || request.recording) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-main-white">Work & Recording Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {request.work && (
                  <div>
                    <h4 className="text-main-white mb-2 text-sm font-medium">Work</h4>
                    <p className="text-main-grey text-sm">{request.work.description}</p>

                    {request.workUsers?.items && request.workUsers.items.length > 0 && (
                      <div className="mt-2">
                        <span className="text-main-grey text-xs">Contributors:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {request.workUsers.items.map((user) => (
                            <Badge key={user.id} variant="outline" className="text-xs">
                              {user.fullName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {request.recording && (
                  <div>
                    <h4 className="text-main-white mb-2 text-sm font-medium">Recording</h4>
                    <p className="text-main-grey text-sm">{request.recording.description}</p>

                    {request.recordingUsers?.items && request.recordingUsers.items.length > 0 && (
                      <div className="mt-2">
                        <span className="text-main-grey text-xs">Contributors:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {request.recordingUsers.items.map((user) => (
                            <Badge key={user.id} variant="outline" className="text-xs">
                              {user.fullName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Legal Documents */}
          {request.track.legalDocuments && request.track.legalDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-main-white">Legal Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {request.track.legalDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between rounded border p-2">
                      <div>
                        <p className="text-main-white text-sm font-medium">{doc.name}</p>
                        <p className="text-main-grey text-xs">{doc.documentType}</p>
                        {doc.note && <p className="text-main-grey mt-1 text-xs">{doc.note}</p>}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-main-white">Request Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="dark:text-yellow flex items-center justify-center rounded-md bg-yellow-100 p-4 dark:bg-yellow-900 dark:text-yellow-400">
                  Pending Review
                </div>

                <p className="text-main-grey text-sm">
                  Your track upload request is currently being reviewed by our moderation team.
                </p>

                <div className="text-main-grey text-xs">
                  <p>
                    <strong>Request ID:</strong> {request.id}
                  </p>
                  <p className="mt-1">
                    <strong>Submitted:</strong> {new Date(request.requestedAt).toLocaleDateString()}
                  </p>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={openCancelDialog}
                  disabled={cancelMutation.isPending}
                  className="w-full"
                >
                  Cancel request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-main-white">Cancel Track Upload Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this track upload request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)} disabled={cancelMutation.isPending}>
              Keep Request
            </Button>
            <Button variant="destructive" onClick={handleCancelRequest} disabled={cancelMutation.isPending}>
              {cancelMutation.isPending ? "Cancelling..." : "Cancel Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
