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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deletePlaylistMutationOptions } from "@/gql/options/client-mutation-options";

interface PlaylistDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistId: string;
  playlistName: string;
  onSuccess?: () => void;
}

const PlaylistDeleteModal = ({
  open,
  onOpenChange,
  playlistId,
  playlistName,
  onSuccess,
}: PlaylistDeleteModalProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: deletePlaylist, isPending: isDeleting } = useMutation({
    ...deletePlaylistMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast.success("Playlist deleted successfully!");
      onOpenChange(false);
      onSuccess?.();
      router.push("/library");
    },
    onError: (error) => {
      console.error("Failed to delete playlist:", error);
      toast.error("Failed to delete playlist. Please try again.");
    },
  });

  const handleConfirmDelete = () => {
    deletePlaylist(playlistId);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            playlist &ldquo;{playlistName}&rdquo; and remove all its content.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PlaylistDeleteModal;
