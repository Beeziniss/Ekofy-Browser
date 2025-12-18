"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { removeTrackFromAlbumMutationOptions } from "@/gql/options/client-mutation-options";
import { toast } from "sonner";

interface AlbumRemoveTrackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albumId: string;
  trackId: string;
  trackName: string;
  onSuccess?: () => void;
}

const AlbumRemoveTrackModal = ({
  open,
  onOpenChange,
  albumId,
  trackId,
  trackName,
  onSuccess,
}: AlbumRemoveTrackModalProps) => {
  const queryClient = useQueryClient();

  const { mutate: removeTrack, isPending } = useMutation({
    ...removeTrackFromAlbumMutationOptions,
    onSuccess: () => {
      toast.success("Track removed from album");
      queryClient.invalidateQueries({ queryKey: ["album-detail", albumId] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to remove track from album");
    },
  });

  const handleRemove = () => {
    removeTrack({ albumId, trackId });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Track</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove &quot;{trackName}&quot; from this album?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemove} disabled={isPending} className="bg-red-600 hover:bg-red-700">
            {isPending ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlbumRemoveTrackModal;

