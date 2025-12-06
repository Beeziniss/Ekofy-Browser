import { LockIcon, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlaylistMutationOptions, updatePlaylistMutationOptions } from "@/gql/options/client-mutation-options";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { usePlaylistCoverUpload } from "../../hooks/use-playlist-cover-upload";
import { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";

// Zod schema for form validation
const createPlaylistFormSchema = z.object({
  name: z.string().min(3, "Playlist name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  isPublic: z.boolean(),
  coverImage: z.string(),
});

const editPlaylistFormSchema = z.object({
  name: z.string().min(3, "Playlist name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  isPublic: z.boolean(),
  coverImage: z.string(),
});

type CreatePlaylistFormValues = z.infer<typeof createPlaylistFormSchema>;
type EditPlaylistFormValues = z.infer<typeof editPlaylistFormSchema>;
type PlaylistFormValues = CreatePlaylistFormValues | EditPlaylistFormValues;

export interface PlaylistData {
  id?: string;
  name: string;
  description?: string;
  isPublic: boolean;
  coverImage: string;
}

interface PlaylistManagementModalProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  initialData?: PlaylistData;
  onSuccess?: () => void;
}

const PlaylistManagementModal = ({
  mode,
  open,
  onOpenChange,
  trigger,
  initialData,
  onSuccess,
}: PlaylistManagementModalProps) => {
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";
  const formSchema = isEdit ? editPlaylistFormSchema : createPlaylistFormSchema;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevOpenRef = useRef<boolean>(false);

  // Cover upload hook
  const {
    isUploading: isCoverUploading,
    previewUrl,
    error: uploadError,
    uploadCover,
    setPreviewFromFile,
    clearPreview,
    clearError,
    resetUpload,
  } = usePlaylistCoverUpload();

  // Store the selected file for upload on save
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // For create mode
  const { mutate: createPlaylist, isPending: isCreating } = useMutation({
    ...createPlaylistMutationOptions,
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist-detail"] });
      onOpenChange(false);
      onSuccess?.();
      toast.success("Playlist created successfully!");
    },
    onError: (error) => {
      console.error("Failed to create playlist:", error);
      toast.error("Failed to create playlist. Please try again.");
    },
  });

  const { mutate: updatePlaylist, isPending: isUpdating } = useMutation({
    ...updatePlaylistMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({
        queryKey: ["playlist-detail", initialData?.id],
      });
      onOpenChange(false);
      onSuccess?.();
      toast.success("Playlist updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update playlist:", error);
      toast.error("Failed to update playlist. Please try again.");
    },
  });

  // Create stable default values
  const defaultValues = useMemo(() => {
    if (mode === "edit" && initialData) {
      return {
        name: initialData.name || "",
        description: initialData.description || "",
        isPublic: initialData.isPublic ?? true,
        coverImage: initialData.coverImage || "https://placehold.co/280",
      };
    }
    return {
      name: "",
      description: "",
      isPublic: true,
      coverImage: "https://placehold.co/280",
    };
  }, [mode, initialData]);

  const form = useForm<PlaylistFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const isPending = isCreating || isUpdating || isCoverUploading;

  // Reset form when modal opens - only on state change from closed to open
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      // Modal is opening for the first time or reopening
      form.reset(defaultValues);
      resetUpload();
      setSelectedFile(null);
    }
    prevOpenRef.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues, resetUpload]); // 'form' intentionally excluded to prevent infinite loop

  const onSubmit = async (values: PlaylistFormValues) => {
    let finalCoverImage = values.coverImage;

    // If user selected a new image, upload it first
    if (selectedFile) {
      try {
        const uploadResult = await uploadCover(selectedFile, initialData?.id);
        if (uploadResult) {
          finalCoverImage = uploadResult.secure_url;
        } else {
          // Upload failed, don't proceed with save
          return;
        }
      } catch (error) {
        console.error("Failed to upload cover image:", error);
        toast.error("Failed to upload cover image. Please try again.");
        return;
      }
    }

    if (mode === "create") {
      createPlaylist({
        name: values.name,
        isPublic: values.isPublic,
        coverImage: finalCoverImage,
        description: values.description || "",
      });
    } else {
      updatePlaylist({
        playlistId: initialData!.id!,
        name: values.name,
        isPublic: values.isPublic,
        coverImage: finalCoverImage,
        description: values.description || "",
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      if (mode === "create") {
        form.reset();
      }
      resetUpload();
      setSelectedFile(null); // Clear selected file
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      clearError(); // Clear any previous upload errors
      setSelectedFile(file); // Store the file for upload on save
      setPreviewFromFile(file);
    }
  };

  const handleRemoveCover = () => {
    clearPreview();
    setSelectedFile(null); // Clear the selected file
    form.setValue("coverImage", "https://placehold.co/280");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getCurrentImageUrl = () => {
    // If we have a preview URL (user selected a new image), show that
    if (previewUrl) return previewUrl;
    // Otherwise show the current form value (existing image or placeholder)
    const currentCoverImage = form.getValues("coverImage");
    // Make sure we return a valid URL, fallback to placeholder if empty
    return currentCoverImage || "https://placehold.co/280";
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger}
      <DialogContent className="w-full sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{isEdit ? "Edit playlist" : "Create playlist"}</DialogTitle>
          <DialogDescription className="text-main-grey">
            {isEdit ? "Modify your playlist details" : "Create a playlist to save your favorite songs"}
          </DialogDescription>
        </DialogHeader>

        <Separator className="-mx-6 mb-4 bg-neutral-700 data-[orientation=horizontal]:w-[calc(100%+48px)]" />

        <Form {...form} key={`${mode}-${initialData?.id || "new"}`}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-y-4">
            {/* Hidden cover image field */}
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Cover Image Upload Section */}
            <div className="space-y-4">
              <FormLabel className="text-main-white text-sm">Cover Image</FormLabel>

              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Image Preview */}
                <div className="relative">
                  <div className="h-40 w-40 overflow-hidden rounded-lg border-2 border-dashed border-neutral-600 bg-neutral-800">
                    {isCoverUploading ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="space-y-2 text-center">
                          <Skeleton className="mx-auto h-16 w-16 rounded-full" />
                          <p className="text-sm text-neutral-400">Uploading...</p>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={getCurrentImageUrl()}
                        alt="Playlist cover"
                        className="h-full w-full object-cover"
                        width={160}
                        height={160}
                        unoptimized
                      />
                    )}
                  </div>

                  {(previewUrl || form.getValues("coverImage") !== "https://placehold.co/280") && !isCoverUploading && (
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="flex flex-1 flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCoverUploading}
                    className="w-full sm:w-auto"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Image
                  </Button>

                  {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}

                  <p className="text-xs text-neutral-400">
                    Recommended: 280x280px, Max 5MB
                    <br />
                    Formats: JPG, PNG, WEBP
                    <br />
                    {selectedFile ? "Image will be uploaded when you save the playlist" : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Playlist name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main-white text-sm">Name <span className="text-red-400">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Playlist name" {...field} minLength={3} maxLength={100} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Privacy toggle */}
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-3">
                      <div className="bg-main-card-bg flex size-9 items-center justify-center rounded-full">
                        <LockIcon className="text-main-white size-5" />
                      </div>

                      <div className="">
                        <FormLabel className="flex flex-col items-start gap-0 text-sm font-semibold">
                          <span>Private</span>
                          <span className="text-main-grey text-xs">Only you can access this playlist</span>
                        </FormLabel>
                      </div>
                    </div>

                    <FormControl>
                      <Switch checked={!field.value} onCheckedChange={(checked) => field.onChange(!checked)} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {/* Description field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main-white text-sm">
                    Description {!isEdit && <span className="text-red-400">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={isEdit ? "Playlist description (optional)" : "Playlist description"}
                      minLength={1}
                      maxLength={500}
                      className="h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="-mx-6 mt-4 bg-neutral-700 data-[orientation=horizontal]:w-[calc(100%+48px)]" />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"ghost"} type="button" onClick={() => mode === "create" && form.reset()}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-main-purple hover:bg-main-purple/90 text-main-white"
              >
                {isPending
                  ? isCoverUploading
                    ? "Uploading image..."
                    : isEdit
                      ? "Updating..."
                      : "Creating..."
                  : isEdit
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistManagementModal;
