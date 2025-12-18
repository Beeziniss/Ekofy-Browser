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
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { createAlbumMutationOptions } from "@/gql/options/client-mutation-options";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { usePlaylistCoverUpload } from "@/modules/client/playlist/hooks/use-playlist-cover-upload";
import { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { trackUploadArtistListOptions } from "@/gql/options/artist-options";
import { artistTracksInfiniteOptions } from "@/gql/options/client-options";
import { MultiSelect } from "@/components/ui/multi-select";
import { useAuthStore } from "@/store";
import {
  AlbumType,
  ReleaseStatus,
  ArtistRole,
  ContributingArtistInput,
  ReleaseInfoInput,
} from "@/gql/graphql";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Zod schema for form validation
const createAlbumFormSchema = z.object({
  name: z.string().min(3, "Album name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  isVisible: z.boolean(),
  coverImage: z.string(),
  thumbnailImage: z.string().optional(),
  type: z.nativeEnum(AlbumType),
  artistInfos: z.array(z.object({
    artistId: z.string(),
    role: z.nativeEnum(ArtistRole),
  })).min(1, "At least one artist is required"),
  trackIds: z.array(z.string()).min(1, "At least one track is required"),
});

type CreateAlbumFormValues = z.infer<typeof createAlbumFormSchema>;

export interface AlbumData {
  id?: string;
  name: string;
  description?: string;
  isVisible: boolean;
  coverImage: string;
  thumbnailImage?: string;
  type: AlbumType;
  artistInfos: ContributingArtistInput[];
  trackIds: string[];
}

interface AlbumManagementModalProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  initialData?: AlbumData;
  onSuccess?: () => void;
}

const AlbumManagementModal = ({
  mode,
  open,
  onOpenChange,
  trigger,
  initialData,
  onSuccess,
}: AlbumManagementModalProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const artistId = user?.artistId || "";

  const isEdit = mode === "edit";
  const formSchema = createAlbumFormSchema;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevOpenRef = useRef<boolean>(false);

  // Cover upload hook (reusing playlist hook)
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

  // Fetch artists data
  const { data: artistsData } = useQuery(trackUploadArtistListOptions);

  // Fetch artist's tracks
  const {
    data: tracksData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(artistTracksInfiniteOptions(artistId));

  // For create mode
  const { mutate: createAlbum, isPending: isCreating } = useMutation({
    ...createAlbumMutationOptions,
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      onOpenChange(false);
      onSuccess?.();
      toast.success("Album created successfully!");
    },
    onError: (error) => {
      console.error("Failed to create album:", error);
      toast.error("Failed to create album. Please try again.");
    },
  });

  // Create stable default values
  const defaultValues = useMemo(() => {
    if (mode === "edit" && initialData) {
      return {
        name: initialData.name || "",
        description: initialData.description || "",
        isVisible: initialData.isVisible ?? true,
        coverImage: initialData.coverImage || "https://placehold.co/280",
        thumbnailImage: initialData.thumbnailImage || "",
        type: initialData.type || AlbumType.Album,
        artistInfos: initialData.artistInfos || [],
        trackIds: initialData.trackIds || [],
      };
    }

    // Auto-assign current user as main artist
    const currentUserArtist = artistsData?.artists?.items?.find(
      (artist) => artist.userId === user?.userId
    );

    return {
      name: "",
      description: "",
      isVisible: true,
      coverImage: "https://placehold.co/280",
      thumbnailImage: "",
      type: AlbumType.Album,
      artistInfos: currentUserArtist ? [{ artistId: currentUserArtist.id, role: ArtistRole.Main }] : [],
      trackIds: [],
    };
  }, [mode, initialData, artistsData?.artists?.items, user?.userId]);

  const form = useForm<CreateAlbumFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const isPending = isCreating || isCoverUploading;

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
  }, [open, defaultValues, resetUpload]);

  const onSubmit = async (values: CreateAlbumFormValues) => {
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
      const releaseInfo: ReleaseInfoInput = {
        isRelease: true,
        releaseStatus: ReleaseStatus.Official,
        releaseDate: new Date().toISOString(),
        releasedAt: new Date().toISOString(),
      };

      createAlbum({
        name: values.name,
        isVisible: values.isVisible,
        coverImage: finalCoverImage,
        thumbnailImage: values.thumbnailImage || finalCoverImage,
        description: values.description || "",
        type: values.type,
        artistInfos: values.artistInfos,
        trackIds: values.trackIds,
        releaseInfo,
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
      setSelectedFile(null);
    }
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

  // Prepare artist options for multiselect
  const artistOptions = useMemo(() => {
    return artistsData?.artists?.items?.map((artist) => ({
      value: artist.id,
      label: artist.stageName,
    })) || [];
  }, [artistsData?.artists?.items]);

  // Prepare track options for multiselect
  const trackOptions = useMemo(() => {
    if (!tracksData?.pages) return [];

    const allTracks = tracksData.pages.flatMap((page) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageData = page as any;
      return pageData.tracks?.items || [];
    });

    return allTracks.map((track) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trackData = track as any;
      return {
        value: trackData.id as string,
        label: trackData.name as string,
      };
    });
  }, [tracksData]);

  // Handle artist selection changes to maintain artistInfos structure
  const handleArtistChange = (selectedArtistIds: string[]) => {
    const currentArtistInfos = form.getValues("artistInfos");

    // Create new artistInfos based on selection
    const newArtistInfos = selectedArtistIds.map((artistId) => {
      const existing = currentArtistInfos.find((info) => info.artistId === artistId);
      return existing || { artistId, role: ArtistRole.Main };
    });

    form.setValue("artistInfos", newArtistInfos);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger}
      <DialogContent className="w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{isEdit ? "Edit album" : "Create album"}</DialogTitle>
          <DialogDescription className="text-main-grey">
            {isEdit ? "Modify your album details" : "Create an album to organize your tracks"}
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
                        alt="Album cover"
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
                    {selectedFile ? "Image will be uploaded when you save the album" : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Album name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main-white text-sm">Name <span className="text-red-400">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Album name" {...field} minLength={3} maxLength={100} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Album Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main-white text-sm">Album Type <span className="text-red-400">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select album type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={AlbumType.Album}>Album</SelectItem>
                      <SelectItem value={AlbumType.Single}>Single</SelectItem>
                      <SelectItem value={AlbumType.Ep}>EP</SelectItem>
                      <SelectItem value={AlbumType.Compilation}>Compilation</SelectItem>
                      <SelectItem value={AlbumType.Live}>Live</SelectItem>
                      <SelectItem value={AlbumType.Remix}>Remix</SelectItem>
                      <SelectItem value={AlbumType.Soundtrack}>Soundtrack</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Artists MultiSelect */}
            <FormField
              control={form.control}
              name="artistInfos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main-white text-sm">
                    Contributing Artists <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={artistOptions}
                      defaultValue={field.value.map((info) => info.artistId)}
                      onValueChange={handleArtistChange}
                      placeholder="Choose contributing artists..."
                      maxCount={5}
                      resetOnDefaultValueChange={true}
                      emptyIndicator={
                        <div className="p-4 text-center text-gray-400">
                          <p>No artists found.</p>
                        </div>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="mt-1 text-xs text-gray-400">
                    💡 Your artist account is automatically included as the main artist
                  </p>
                </FormItem>
              )}
            />

            {/* Tracks MultiSelect */}
            <FormField
              control={form.control}
              name="trackIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main-white text-sm">
                    Tracks <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={trackOptions}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Choose tracks for this album..."
                      maxCount={10}
                      resetOnDefaultValueChange={true}
                      emptyIndicator={
                        <div className="p-4 text-center text-gray-400">
                          <p>No tracks found.</p>
                          <p className="mt-1 text-xs">
                            Only tracks where you are a main or featured artist are shown.
                          </p>
                        </div>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  {hasNextPage && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="mt-2"
                    >
                      {isFetchingNextPage ? "Loading more..." : "Load more tracks"}
                    </Button>
                  )}
                </FormItem>
              )}
            />

            {/* Privacy toggle - now represents Public/Private */}
            <FormField
              control={form.control}
              name="isVisible"
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
                          <span className="text-main-grey text-xs">Only you can access this album</span>
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
                      placeholder="Album description"
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
                    : "Creating..."
                  : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AlbumManagementModal;
