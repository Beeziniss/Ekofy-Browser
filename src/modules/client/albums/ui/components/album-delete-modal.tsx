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
import { deleteAlbumMutationOptions } from "@/gql/options/client-mutation-options";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AlbumDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albumId: string;
  albumName: string;
}

const AlbumDeleteModal = ({ open, onOpenChange, albumId, albumName }: AlbumDeleteModalProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deleteAlbum, isPending } = useMutation({
    ...deleteAlbumMutationOptions,
    onSuccess: () => {
      toast.success("Album deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      onOpenChange(false);
      router.push("/albums");
    },
    onError: () => {
      toast.error("Failed to delete album");
    },
  });

  const handleDelete = () => {
    deleteAlbum(albumId);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Album</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{albumName}&quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-red-600 hover:bg-red-700">
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlbumDeleteModal;

