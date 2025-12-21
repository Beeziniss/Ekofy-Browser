"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { playlistBriefOptions, checkTrackInPlaylistOptions } from "@/gql/options/client-options";
import {
  addToPlaylistMutationOptions,
  removeFromPlaylistMutationOptions,
  createPlaylistMutationOptions,
} from "@/gql/options/client-mutation-options";
import { toast } from "sonner";
import { useProcessTrackEngagementPopularity } from "@/gql/client-mutation-options/popularity-mutation-option";
import { PopularityActionType } from "@/gql/graphql";
import { SearchIcon, PlusIcon, LockIcon, CheckIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { usePlaylistCoverUpload } from "../../hooks/use-playlist-cover-upload";
import Link from "next/link";

// Zod schema for create playlist form
const createPlaylistFormSchema = z.object({
  name: z.string().min(3, "Playlist name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  isPublic: z.boolean(),
  coverImage: z.string(),
});

type CreatePlaylistFormValues = z.infer<typeof createPlaylistFormSchema>;

interface PlaylistAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackId: string;
  trigger?: React.ReactNode;
}

const PlaylistAddModal = ({ open, onOpenChange, trackId, trigger }: PlaylistAddModalProps) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("add");
  const { user, isAuthenticated } = useAuthStore();
  const { mutate: trackEngagementPopularity } = useProcessTrackEngagementPopularity();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevOpenRef = useRef<boolean>(false);

  // Cover upload hook for create playlist
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: playlistsData, isLoading } = useQuery({
    ...playlistBriefOptions(user?.userId || ""),
    enabled: isAuthenticated && !!user?.userId,
  });
  const { data: trackInPlaylistsData } = useQuery({
    ...checkTrackInPlaylistOptions(trackId),
    enabled: isAuthenticated && !!user?.userId,
  });

  const { mutate: addToPlaylist, isPending: isAddingToPlaylist } = useMutation({
    ...addToPlaylistMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist-detail"] });
      queryClient.invalidateQueries({
        queryKey: ["playlist-detail-tracklist"],
      });
      queryClient.invalidateQueries({
        queryKey: ["check-track-in-playlist", trackId],
      });
      // Don't close modal after successful addition
      toast.success("Track added to playlist successfully!");
      // Track popularity for add to playlist
      trackEngagementPopularity({
        trackId,
        actionType: PopularityActionType.AddToPlaylist,
      });
    },
    onError: (error) => {
      console.error("Failed to add track to playlist:", error);
      toast.error("Failed to add track to playlist. Please try again.");
    },
  });

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

  const playlists = playlistsData?.playlists?.items || [];
  const trackInPlaylistsIds = trackInPlaylistsData?.playlists?.items?.map((p) => p.id) || [];

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isPending = isAddingToPlaylist || isRemovingFromPlaylist;

  const isTrackInPlaylist = (playlistId: string) => {
    return trackInPlaylistsIds.includes(playlistId);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addToPlaylist({
      playlistId,
      trackId,
    });
  };

  const handleRemoveFromPlaylist = (playlistId: string) => {
    removeFromPlaylist({
      playlistId,
      trackId,
    });
  };

  // Create playlist form
  const defaultValues = useMemo(
    () => ({
      name: "",
      description: "",
      isPublic: true,
      coverImage: "https://placehold.co/280",
    }),
    [],
  );

  const form = useForm<CreatePlaylistFormValues>({
    resolver: zodResolver(createPlaylistFormSchema),
    defaultValues,
  });

  // Create playlist mutation
  const { mutate: createPlaylist, isPending: isCreating } = useMutation({
    ...createPlaylistMutationOptions,
    onSuccess: async (data, variables) => {
      // Invalidate queries first to get fresh data
      await queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist-detail"] });
      queryClient.invalidateQueries({
        queryKey: ["check-track-in-playlist", trackId],
      });

      // Fetch the newly created playlist by querying playlists again
      // The new playlist should be the first one (most recent)
      try {
        const playlistsResult = await queryClient.fetchQuery({
          ...playlistBriefOptions(user?.userId || ""),
        });
        
        const newPlaylist = playlistsResult?.playlists?.items?.find(
          (p) => p.name === variables.name
        );

        if (newPlaylist?.id) {
          // Automatically add track to the newly created playlist
          addToPlaylist({
            playlistId: newPlaylist.id,
            trackId,
          });
        }
      } catch (error) {
        console.error("Failed to fetch new playlist:", error);
        // Still show success even if we can't auto-add
        toast.success("Playlist created successfully!");
      }

      // Reset form but keep modal open
      form.reset(defaultValues);
      resetUpload();
      setSelectedFile(null);
      
      // Switch to "Add to playlist" tab to show the new playlist
      setActiveTab("add");
    },
    onError: (error) => {
      console.error("Failed to create playlist:", error);
      toast.error("Failed to create playlist. Please try again.");
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      form.reset(defaultValues);
      resetUpload();
      setSelectedFile(null);
      setActiveTab("add");
    }
    prevOpenRef.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues, resetUpload]);

  const handleCreatePlaylist = async (values: CreatePlaylistFormValues) => {
    let finalCoverImage = values.coverImage;

    // If user selected a new image, upload it first
    if (selectedFile) {
      try {
        const uploadResult = await uploadCover(selectedFile);
        if (uploadResult) {
          finalCoverImage = uploadResult.secure_url;
        } else {
          return;
        }
      } catch (error) {
        console.error("Failed to upload cover image:", error);
        toast.error("Failed to upload cover image. Please try again.");
        return;
      }
    }

    createPlaylist({
      name: values.name,
      isPublic: values.isPublic,
      coverImage: finalCoverImage,
      description: values.description || "",
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      clearError();
      setSelectedFile(file);
      setPreviewFromFile(file);
    }
  };

  const handleRemoveCover = () => {
    clearPreview();
    setSelectedFile(null);
    form.setValue("coverImage", "https://placehold.co/280");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getCurrentImageUrl = () => {
    if (previewUrl) return previewUrl;
    const currentCoverImage = form.getValues("coverImage");
    return currentCoverImage || "https://placehold.co/280";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent className="w-full sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add to playlist</DialogTitle>
          <DialogDescription className="text-main-grey">
            Choose a playlist to add this track to or create a new one
          </DialogDescription>
        </DialogHeader>

        <Separator className="-mx-6 mb-4 bg-neutral-700 data-[orientation=horizontal]:w-[calc(100%+48px)]" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Add to Playlist</TabsTrigger>
            <TabsTrigger value="create">Create Playlist</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-4">
            {/* Search Bar */}
            <div className="relative mb-4">
              <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search playlists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Playlist List */}
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8 text-sm text-gray-400">Loading playlists...</div>
              ) : filteredPlaylists.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-sm text-gray-400">
                  {searchQuery ? "No playlists found" : "No playlists available"}
                </div>
              ) : (
                filteredPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-neutral-800"
                  >
                    <Link
                      href={`/playlists/${playlist.id}`}
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={(e) => {
                        // Only navigate if clicking on the playlist area, not on buttons
                        if ((e.target as HTMLElement).closest("button")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className="relative size-12 overflow-hidden rounded-md">
                        <Image
                          src={playlist.coverImage || "https://placehold.co/48"}
                          alt={playlist.name}
                          width={48}
                          height={48}
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{playlist.name}</span>
                        <div className="flex items-center gap-2">
                          {!playlist.isPublic && (
                            <Badge variant="secondary" className="flex items-center gap-1 px-1.5 py-0.5 text-xs">
                              <LockIcon className="size-3" />
                              Private
                            </Badge>
                          )}
                          {isTrackInPlaylist(playlist.id) && (
                            <Badge
                              variant="default"
                              className="bg-main-purple/20 text-main-purple flex items-center gap-1 px-1.5 py-0.5 text-xs"
                            >
                              <CheckIcon className="size-3" />
                              Added
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>

                    {isTrackInPlaylist(playlist.id) ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveFromPlaylist(playlist.id)}
                        disabled={isPending}
                        className="text-red-400 hover:bg-red-500/20 hover:text-red-500"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddToPlaylist(playlist.id)}
                        disabled={isPending}
                        className="hover:bg-main-purple/20 hover:text-main-purple"
                      >
                        <PlusIcon className="size-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreatePlaylist)} className="space-y-2">
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

                      {(previewUrl || form.getValues("coverImage") !== "https://placehold.co/280") &&
                        !isCoverUploading && (
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
                      <FormLabel className="text-main-white text-sm">
                        Name <span className="text-red-400">*</span>
                      </FormLabel>
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
                        Description <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Playlist description"
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

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      form.reset(defaultValues);
                      resetUpload();
                      setSelectedFile(null);
                    }}
                    disabled={isCreating || isCoverUploading}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating || isCoverUploading}
                    className="bg-main-purple hover:bg-main-purple/90 text-main-white"
                  >
                    {isCreating || isCoverUploading ? "Creating..." : "Create Playlist"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistAddModal;
