import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromPlaylistMutationOptions } from "@/gql/options/client-mutation-options";
import { useProcessTrackEngagementPopularity } from "@/gql/client-mutation-options/popularity-mutation-option";
import { PopularityActionType } from "@/gql/graphql";

interface PlaylistRemoveTrackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistId: string;
  trackId: string;
  trackName: string;
  onSuccess?: () => void;
}

const PlaylistRemoveTrackModal = ({
  open,
  onOpenChange,
  playlistId,
  trackId,
  trackName,
  onSuccess,
}: PlaylistRemoveTrackModalProps) => {
  const queryClient = useQueryClient();
  const { mutate: trackEngagementPopularity } = useProcessTrackEngagementPopularity();

  const { mutate: removeFromPlaylist, isPending: isRemovingFromPlaylist } = useMutation({
    ...removeFromPlaylistMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist-detail"] });
      queryClient.invalidateQueries({
        queryKey: ["playlist-detail-tracklist"],
      });
      queryClient.invalidateQueries({
        queryKey: ["check-track-in-playlist", trackId],
      });
      onSuccess?.();
      // Don't close modal after successful removal
      toast.success("Track removed from playlist successfully!");
      // Track popularity for remove from playlist
      trackEngagementPopularity({
        trackId,
        actionType: PopularityActionType.RemoveFromPlaylist,
      });
    },
    onError: (error) => {
      console.error("Failed to remove track from playlist:", error);
      toast.error("Failed to remove track from playlist. Please try again.");
    },
  });

  const handleConfirmDelete = () => {
    removeFromPlaylist({ playlistId, trackId });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the track
            <strong className="text-main-white font-bold">&ldquo;{trackName}&rdquo;</strong> from the playlist.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isRemovingFromPlaylist}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isRemovingFromPlaylist ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PlaylistRemoveTrackModal;
