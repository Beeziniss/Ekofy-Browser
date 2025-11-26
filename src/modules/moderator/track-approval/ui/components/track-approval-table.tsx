"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { TrackUploadRequestListItem } from "@/types/approval-track";
import { SimplePlayButton } from "./simple-play-button";
import { ApproveTrackDialog } from "./approve-track-dialog";
import { RejectTrackDialog } from "./reject-track-dialog";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Eye, CheckCircle, XCircle, Music, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useApproveTrackUploadRequest,
  useRejectTrackUploadRequest,
} from "@/gql/client-mutation-options/moderator-mutation";

export function TrackApprovalTable({
  data,
  totalCount,
  isLoading,
  currentPage,
  pageSize,
  onViewDetailAction,
}: {
  data: TrackUploadRequestListItem[];
  totalCount: number;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  onViewDetailAction: (uploadId: string) => void;
}) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [approveDialog, setApproveDialog] = useState<{
    open: boolean;
    uploadId: string;
    trackName: string;
    artistName: string;
  }>({
    open: false,
    uploadId: "",
    trackName: "",
    artistName: "",
  });
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    uploadId: string;
    trackName: string;
    artistName: string;
  }>({
    open: false,
    uploadId: "",
    trackName: "",
    artistName: "",
  });
  const approveMutation = useApproveTrackUploadRequest();
  const rejectMutation = useRejectTrackUploadRequest();

  const handleApproveConfirm = async () => {
    try {
      await approveMutation.mutateAsync(approveDialog.uploadId);
    } catch (error) {
      console.error("Failed to approve track:", error);
    }
  };

  const handleRejectConfirm = async (reasonReject: string) => {
    try {
      await rejectMutation.mutateAsync({
        uploadId: rejectDialog.uploadId,
        reasonReject,
      });
    } catch (error) {
      console.error("Failed to reject track:", error);
    }
  };

  const openApproveDialog = (item: TrackUploadRequestListItem) => {
    setApproveDialog({
      open: true,
      uploadId: item.id,
      trackName: item.track.name,
      artistName: item.mainArtists?.items?.map((artist) => artist.stageName).join(", ") || "Unknown Artist",
    });
  };

  const openRejectDialog = (item: TrackUploadRequestListItem) => {
    setRejectDialog({
      open: true,
      uploadId: item.id,
      trackName: item.track.name,
      artistName: item.mainArtists?.items?.map((artist) => artist.stageName).join(", ") || "Unknown Artist",
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(data.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox disabled />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead>Track</TableHead>
              <TableHead>Artists</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: pageSize }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox disabled />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-8 w-8 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="bg-muted h-12 w-12 animate-pulse rounded" />
                    <div className="space-y-2">
                      <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                      <div className="bg-muted h-3 w-24 animate-pulse rounded" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-6 w-16 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-6 w-20 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-8 w-8 animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <Music className="text-muted-foreground mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">No pending tracks</h3>
        <p className="text-muted-foreground">There are no track upload requests to review at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedItems.length === data.length}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead>Track</TableHead>
              <TableHead>Artists</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: TrackUploadRequestListItem) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                    aria-label={`Select ${item.track.name}`}
                  />
                </TableCell>
                <TableCell>
                  <SimplePlayButton
                    trackId={item.track.id}
                    trackName={item.track.name}
                    trackArtist={
                      item.mainArtists?.items?.map((artist) => artist.stageName).join(", ") || "Unknown Artist"
                    }
                    trackCoverImage={item.track.coverImage}
                    uploadId={item.id} // Pass uploadId for audio player
                    size="md"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={item.track.coverImage || "/ekofy-logo.svg"} alt={item.track.name} />
                      <AvatarFallback>
                        <Music className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.track.name}</p>
                      {item.track.description && (
                        <p className="text-muted-foreground text-sm">
                          {item.track.description.length > 50
                            ? `${item.track.description.substring(0, 50)}...`
                            : item.track.description}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={item.mainArtists?.items?.map((artist) => artist.avatarImage).join(", ") || " "}
                        alt={item.mainArtists?.items?.map((artist) => artist.stageName).join(", ") || "Various Artists"}
                      />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {item.mainArtists?.items?.slice(0, 2).map((artist) => (
                        <div key={artist.id} className="text-sm">
                          {artist.stageName}
                        </div>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={cn(getTrackTypeColor(item.track.type))}>
                    {item.track.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <time className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(item.requestedAt), {
                      addSuffix: true,
                    })}
                  </time>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onViewDetailAction(item.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-green-600"
                        onClick={() => openApproveDialog(item)}
                        disabled={approveMutation.isPending}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {approveMutation.isPending ? "Approving..." : "Approve"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => openRejectDialog(item)}
                        disabled={rejectMutation.isPending}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination would go here */}
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <div>
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
          tracks
        </div>
        {/* Add pagination component here */}
      </div>

      {/* Approve Dialog */}
      <ApproveTrackDialog
        open={approveDialog.open}
        onOpenChange={(open) => setApproveDialog({ ...approveDialog, open })}
        trackName={approveDialog.trackName}
        artistName={approveDialog.artistName}
        onConfirm={handleApproveConfirm}
        isLoading={approveMutation.isPending}
      />

      {/* Reject Dialog */}
      <RejectTrackDialog
        open={rejectDialog.open}
        onOpenChange={(open) => setRejectDialog({ ...rejectDialog, open })}
        trackName={rejectDialog.trackName}
        artistName={rejectDialog.artistName}
        onConfirm={handleRejectConfirm}
        isLoading={rejectMutation.isPending}
      />
    </div>
  );
}
