"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTrackUploadStore } from "@/store";
import {
  CircleQuestionMarkIcon,
  // Copy,
  CreativeCommonsIcon,
  EarthIcon,
  FileAudioIcon,
  FileChartColumnIcon,
  ImageIcon,
  LockIcon,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  categoriesOptions,
  trackUploadArtistListOptions,
} from "@/gql/options/artist-options";
import { trackUploadMutationOptions } from "@/gql/options/artist-mutation-options";
import {
  ArtistRole,
  DocumentType,
  ReleaseStatus,
  CreateTrackRequestInput,
  CreateWorkRequestInput,
  CreateRecordingRequestInput,
} from "@/gql/graphql";
import { useAuthStore } from "@/store";
import { useDropzone, FileRejection } from "react-dropzone";
import { uploadImageToCloudinary } from "@/utils/cloudinary-utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import InputTags from "@/components/ui/tags-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import TrackUserCombobox from "../components/track-user-combobox";
import { TrackUploadArtist } from "../../types";

const FormSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required." }),
    description: z.string().optional(),
    mainArtistIds: z
      .array(z.string())
      .min(1, { message: "Please select at least one main artist." }),
    featuredArtistIds: z.array(z.string()),
    categoryIds: z
      .array(z.string())
      .min(1, { message: "Please select at least one category." }),
    tags: z
      .array(z.string())
      .min(1, { message: "Please add at least one tag." }),
    coverImage: z
      .instanceof(File, {
        message: "A cover image file is required.",
      })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Image size must be less than 5MB.",
      })
      .refine(
        (file) =>
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type,
          ),
        {
          message: "Only JPEG, PNG, and WebP images are allowed.",
        },
      ),
    isExplicit: z.boolean(),
    isReleased: z.boolean(),
    releaseDate: z.date().optional(),
    isOriginal: z.boolean(),
    legalDocuments: z
      .array(
        z.object({
          documentType: z.string(),
          documentUrl: z.url({
            error: "Please enter a valid URL (e.g., https://example.com)",
          }),
          name: z.string().min(1, { message: "Document name is required." }),
          note: z.string().min(1, { message: "Note is required." }),
        }),
      )
      .min(1, { message: "At least one legal document is required." })
      .refine(
        (documents) =>
          documents.every(
            (doc) =>
              doc.name.trim() !== "" &&
              doc.documentUrl.trim() !== "" &&
              doc.note.trim() !== "",
          ),
        {
          message: "At least one document must have all fields completed.",
        },
      ),
    workSplits: z
      .array(
        z.object({
          userId: z.string(),
          artistRole: z.string(),
          percentage: z.number().min(0).max(100),
        }),
      )
      .optional()
      .refine(
        (splits) => {
          if (!splits || splits.length === 0) return true;
          const total = splits.reduce(
            (sum, split) => sum + split.percentage,
            0,
          );
          return total === 100;
        },
        {
          message: "Work splits must total exactly 100%",
        },
      ),
    recordingSplits: z
      .array(
        z.object({
          userId: z.string(),
          artistRole: z.string(),
          percentage: z.number().min(0).max(100),
        }),
      )
      .optional()
      .refine(
        (splits) => {
          if (!splits || splits.length === 0) return true;
          const total = splits.reduce(
            (sum, split) => sum + split.percentage,
            0,
          );
          return total === 100;
        },
        {
          message: "Recording splits must total exactly 100%",
        },
      ),
  })
  .superRefine((data, ctx) => {
    // Validate release date logic
    if (data.isReleased && data.releaseDate) {
      // If released and date is provided, it must be at least 4 days from now
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 4);

      if (data.releaseDate < minDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["releaseDate"],
          message: "Release date must be at least 4 days from today",
        });
      }
    }

    // If not released, release date should not be set
    if (!data.isReleased && data.releaseDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["releaseDate"],
        message: "Release date cannot be set when track is not released",
      });
    }
  });

type FormData = z.infer<typeof FormSchema>;

// Helper function to redistribute percentages evenly
const redistributePercentages = (
  splits: Array<{ userId: string; artistRole: ArtistRole; percentage: number }>,
  removedIndex?: number,
) => {
  const remainingSplits =
    removedIndex !== undefined
      ? splits.filter((_, i) => i !== removedIndex)
      : splits;

  if (remainingSplits.length === 0) return [];

  const equalPercentage = Math.floor(100 / remainingSplits.length);
  const remainder = 100 - equalPercentage * remainingSplits.length;

  return remainingSplits.map((split, index) => ({
    ...split,
    percentage: index === 0 ? equalPercentage + remainder : equalPercentage,
  }));
};

// Helper function to get user display name
const getUserDisplayName = (
  userId: string,
  users: TrackUploadArtist[],
  currentUserId?: string,
) => {
  if (userId === currentUserId) return "You";
  const user = users?.find((u) => u.userId === userId);

  return user?.stageName || "Unknown User";
};

const TrackUploadMetadataSection = () => {
  const { currentUpload, uploadedTracks, clearCurrentUpload } =
    useTrackUploadStore();
  const router = useRouter();
  const { user } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [displayTrack, setDisplayTrack] = useState(currentUpload);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null,
  );

  // const [trackUrl, setTrackUrl] = useState<string>("");
  const [workSplits, setWorkSplits] = useState<
    Array<{ userId: string; artistRole: ArtistRole; percentage: number }>
  >([]);
  const [recordingSplits, setRecordingSplits] = useState<
    Array<{ userId: string; artistRole: ArtistRole; percentage: number }>
  >([]);
  const [legalDocuments, setLegalDocuments] = useState<
    {
      documentType: DocumentType;
      documentUrl: string;
      name: string;
      note: string;
    }[]
  >([
    {
      documentType: DocumentType.License,
      documentUrl: "",
      name: "",
      note: "",
    },
  ]);

  // Get minimum date (3 days from today)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 4);

  const { data: artistsData } = useQuery(trackUploadArtistListOptions);
  const { data: categoriesData } = useQuery(categoriesOptions);
  const uploadTrackMutation = useMutation(trackUploadMutationOptions);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      mainArtistIds: [],
      featuredArtistIds: [],
      categoryIds: [],
      tags: [],
      isReleased: false,
      releaseDate: undefined,
      coverImage: undefined,
      isExplicit: false,
      isOriginal: true,
      legalDocuments: [],
      workSplits: [],
      recordingSplits: [],
    },
  });

  // Helper function to check if an artist can be removed from splits
  const canRemoveArtistFromSplit = useCallback(
    (userId: string, splitType: "work" | "recording") => {
      if (!artistsData?.artists?.items) return true;

      const allSelectedArtistIds = [
        ...form.watch("mainArtistIds"),
        ...form.watch("featuredArtistIds"),
      ];

      // Find the artist by userId
      const artist = artistsData.artists.items.find((a) => a.userId === userId);
      if (!artist || !allSelectedArtistIds.includes(artist.id)) return true; // Not a selected artist, can remove

      // Get current splits from both work and recording (excluding the one being removed)
      const currentWorkUserIds =
        splitType === "work"
          ? workSplits
              .filter((split) => split.userId !== userId)
              .map((split) => split.userId)
          : workSplits.map((split) => split.userId);

      const currentRecordingUserIds =
        splitType === "recording"
          ? recordingSplits
              .filter((split) => split.userId !== userId)
              .map((split) => split.userId)
          : recordingSplits.map((split) => split.userId);

      const allRemainingUserIds = [
        ...currentWorkUserIds,
        ...currentRecordingUserIds,
      ];

      // Check if the artist would still appear in at least one split after removal
      return allRemainingUserIds.includes(userId);
    },
    [artistsData?.artists?.items, form, workSplits, recordingSplits],
  );

  // Helper function to update splits based on selected artists
  const updateSplitsFromArtists = useCallback(
    (artistIds: string[]) => {
      if (!artistsData?.artists?.items) return;

      // If no artists selected, reset splits to empty
      if (artistIds.length === 0) {
        setWorkSplits([]);
        setRecordingSplits([]);
        return;
      }

      const mainArtistIds = form.watch("mainArtistIds");
      const featuredArtistIds = form.watch("featuredArtistIds");

      // Create new splits with equal percentages for ALL selected artists
      const equalPercentage = Math.floor(100 / artistIds.length);
      const remainder = 100 - equalPercentage * artistIds.length;

      const newSplits = artistIds.map((artistId, index) => {
        const artist = artistsData.artists?.items?.find(
          (a) => a.id === artistId,
        );
        const isMainArtist = mainArtistIds.includes(artistId);
        const isFeaturedArtist = featuredArtistIds.includes(artistId);

        return {
          userId: artist?.userId || artistId,
          artistRole: isMainArtist
            ? ArtistRole.Main
            : isFeaturedArtist
              ? ArtistRole.Featured
              : ArtistRole.Main,
          percentage:
            index === 0 ? equalPercentage + remainder : equalPercentage,
        };
      });

      setWorkSplits(newSplits);
      setRecordingSplits(newSplits);
    },
    [artistsData?.artists?.items, form],
  );

  // Handle cover image upload
  const onDropCoverImage = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files first
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors?.[0];
        if (error?.code === "file-too-large") {
          toast.error("Image size must be less than 5MB");
        } else if (error?.code === "file-invalid-type") {
          toast.error("Only JPEG, PNG, and WebP images are allowed");
        } else {
          toast.error("Invalid file selected");
        }
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        // Additional size validation (belt and suspenders)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size must be less than 5MB");
          return;
        }

        // Additional type validation
        if (
          !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type,
          )
        ) {
          toast.error("Only JPEG, PNG, and WebP images are allowed");
          return;
        }

        form.setValue("coverImage", file);
        form.clearErrors("coverImage"); // Clear any previous errors

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setCoverImagePreview(previewUrl);
      }
    },
    [form],
  );

  const {
    getRootProps: getCoverRootProps,
    getInputProps: getCoverInputProps,
    isDragActive: isCoverDragActive,
  } = useDropzone({
    onDrop: onDropCoverImage,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  async function onSubmit(data: FormData) {
    if (!displayTrack || !user?.userId) {
      toast.error("No track found or user not authenticated");
      return;
    }

    // Validate that all selected artists appear in at least one split
    const allSelectedArtistIds = [
      ...data.mainArtistIds,
      ...data.featuredArtistIds,
    ];

    if (allSelectedArtistIds.length > 0 && artistsData?.artists?.items) {
      // Get all user IDs from both work and recording splits
      const allSplitUserIds = [
        ...workSplits.map((split) => split.userId),
        ...recordingSplits.map((split) => split.userId),
      ];

      // Check if every selected artist appears in at least one split
      const missingArtists = allSelectedArtistIds.filter((artistId) => {
        const artist = artistsData.artists?.items?.find(
          (a) => a.id === artistId,
        );
        return artist && !allSplitUserIds.includes(artist.userId);
      });

      if (missingArtists.length > 0) {
        const missingArtistNames = missingArtists.map((artistId) => {
          const artist = artistsData.artists?.items?.find(
            (a) => a.id === artistId,
          );
          return artist?.stageName || "Unknown Artist";
        });

        if (missingArtistNames.length === 1) {
          toast.error(
            `${missingArtistNames[0]} must appear in at least one work or recording split.`,
          );
        } else {
          toast.error(
            `The following artists must appear in at least one work or recording split: ${missingArtistNames.join(", ")}`,
          );
        }
        return;
      }
    }

    setIsUploading(true);

    try {
      // Upload cover image to Cloudinary first
      let coverImageUrl = "default-cover.jpg"; // Default cover image

      if (data.coverImage) {
        const uploadResult = await uploadImageToCloudinary(data.coverImage, {
          folder: `track-covers/${user.userId}`,
          tags: ["track", "cover", "music"],
        });
        coverImageUrl = uploadResult.secure_url;
      }

      // Determine release status based on business logic
      let releaseStatus = ReleaseStatus.NotAnnounced;

      if (data.isReleased) {
        if (data.releaseDate) {
          // If released and date is set, status is NotAnnounced
          releaseStatus = ReleaseStatus.NotAnnounced;
        } else {
          // If released but no date selected, status is Official
          releaseStatus = ReleaseStatus.Official;
        }
      } else {
        // If not released, status is NotAnnounced
        releaseStatus = ReleaseStatus.NotAnnounced;
      }

      // Prepare the mutation data
      const mutationData = {
        file: displayTrack.file,
        createTrackRequest: {
          name: data.title,
          description: data.description || null,
          categoryIds: data.categoryIds,
          coverImage: coverImageUrl,
          isReleased: data.isReleased,
          releaseDate: data.releaseDate ? data.releaseDate.toISOString() : null,
          releaseStatus: releaseStatus,
          isOriginal: data.isOriginal,
          mainArtistIds: data.mainArtistIds,
          featuredArtistIds: data.featuredArtistIds,
          tags: data.tags || [],
          isExplicit: data.isExplicit,
          legalDocuments: legalDocuments
            .filter((doc) => doc.documentUrl && doc.name)
            .map((doc) => ({
              documentType: doc.documentType as DocumentType,
              documentUrl: doc.documentUrl,
              name: doc.name,
              note: doc.note || "",
            })),
        } as CreateTrackRequestInput,
        createWorkRequest: {
          description: null,
          workSplits: workSplits.map((split) => ({
            userId: split.userId,
            artistRole: split.artistRole as ArtistRole,
            percentage: split.percentage,
          })),
        } as CreateWorkRequestInput,
        createRecordingRequest: {
          description: null,
          recordingSplits: recordingSplits.map((split) => ({
            userId: split.userId,
            artistRole: split.artistRole as ArtistRole,
            percentage: split.percentage,
          })),
        } as CreateRecordingRequestInput,
      };

      // Execute the upload mutation
      await uploadTrackMutation.mutateAsync(mutationData);

      toast.success("Track uploaded successfully!");

      // Clear the current upload and navigate back to tracks
      clearCurrentUpload();
      router.push("/artist/studio/tracks");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload track. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    // If there's a current upload, show it
    if (currentUpload) {
      setDisplayTrack(currentUpload);
    }
    // Otherwise, show the most recent uploaded track
    else if (uploadedTracks.length > 0) {
      setDisplayTrack(uploadedTracks[uploadedTracks.length - 1]);
    }
  }, [currentUpload, uploadedTracks]);

  // Reset form values when displayTrack changes
  useEffect(() => {
    if (displayTrack) {
      form.reset({
        title: displayTrack.metadata.title || "",
        description: "",
        mainArtistIds: [],
        featuredArtistIds: [],
        categoryIds: [],
        tags: [],
        isReleased: false,
        releaseDate: undefined,
        coverImage: undefined,
        isExplicit: false,
        isOriginal: true,
        legalDocuments: [],
        workSplits: [],
        recordingSplits: [],
      });
      setCoverImagePreview(null);
      setWorkSplits([]);
      setRecordingSplits([]);
      setLegalDocuments([
        {
          documentType: DocumentType.License,
          documentUrl: "",
          name: "",
          note: "",
        },
      ]);
      // Set a placeholder URL based on track name
      /* if (typeof window !== "undefined") {
        setTrackUrl(
          `${window.location.origin}/track/${displayTrack.id || "pending"}`,
        );
      } */
    }
  }, [displayTrack, form, user]);

  // Sync form with state variables for validation
  useEffect(() => {
    form.setValue("workSplits", workSplits);
  }, [workSplits, form]);

  useEffect(() => {
    form.setValue("recordingSplits", recordingSplits);
  }, [recordingSplits, form]);

  useEffect(() => {
    form.setValue("legalDocuments", legalDocuments);
  }, [legalDocuments, form]);

  // Clear release date when isReleased is set to false
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (!data.isReleased && data.releaseDate) {
        form.setValue("releaseDate", undefined);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Initialize current user as main artist by default
  useEffect(() => {
    if (
      artistsData?.artists?.items &&
      user?.userId &&
      form.watch("mainArtistIds").length === 0
    ) {
      const currentUserArtist = artistsData.artists.items.find(
        (artist) => artist.userId === user.userId,
      );
      if (currentUserArtist) {
        form.setValue("mainArtistIds", [currentUserArtist.id]);
      }
    }
  }, [artistsData, user, form]);

  // Watch for changes in artist selections and automatically update splits
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "mainArtistIds" || name === "featuredArtistIds") {
        const mainIds: string[] = Array.isArray(value.mainArtistIds)
          ? value.mainArtistIds.filter(
              (id): id is string => typeof id === "string",
            )
          : [];
        const featuredIds: string[] = Array.isArray(value.featuredArtistIds)
          ? value.featuredArtistIds.filter(
              (id): id is string => typeof id === "string",
            )
          : [];
        const allSelectedArtists = [...mainIds, ...featuredIds];

        if (allSelectedArtists.length > 0) {
          updateSplitsFromArtists(allSelectedArtists);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, updateSplitsFromArtists]);

  // Copy track URL to clipboard
  /* const handleCopyUrl = async () => {
    if (trackUrl) {
      try {
        await navigator.clipboard.writeText(trackUrl);
        toast.success("Track URL copied to clipboard!");
      } catch {
        toast.error("Failed to copy URL");
      }
    } else {
      toast.error("No track URL available yet");
    }
  }; */

  if (!displayTrack) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-white/20 bg-gray-900/50">
          <CardContent className="p-8 text-center">
            <FileAudioIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-white/70">
              No track found. Please upload a track first.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Track Link */}
      {/* <div className="primary_gradient w-full rounded-lg p-0.5">
        <div className="bg-main-dark-bg flex w-full items-center rounded-md px-2.5 py-1">
          <span className="primary_gradient mr-2 bg-clip-text text-base text-transparent">
            Track Link |
          </span>
          <span className="text-main-white flex-1 text-sm">
            {trackUrl || "Track URL will be available after upload"}
          </span>
          <Copy
            className="text-main-white hover:text-main-white/80 ml-2 size-4 cursor-pointer"
            onClick={handleCopyUrl}
          />
        </div>
      </div> */}

      {/* Track Metadata */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
          <div className="flex w-full items-start justify-between">
            <div className="w-full max-w-[598px] space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <FormItem className="gap-1">
                    <div
                      className={cn(
                        "bg-main-dark-bg-1 rounded-md border px-3 pt-2 pb-1 transition-colors",
                        fieldState.error
                          ? "border-destructive"
                          : "border-white/30",
                      )}
                    >
                      <FormLabel className="flex items-center gap-x-1.5">
                        <span className="text-sm font-medium">Title</span>
                        <span className="text-red-500">*</span>
                        <CircleQuestionMarkIcon className="size-3" />
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Track with title will get more people attention"
                          className="border-0 !bg-transparent px-0 text-sm font-semibold outline-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mainArtistIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Main Artist(s)<span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <MultiSelect
                        options={
                          artistsData?.artists?.items
                            ?.filter(
                              (artist) =>
                                !form
                                  .watch("featuredArtistIds")
                                  .includes(artist.id),
                            )
                            ?.map((artist) => ({
                              value: artist.id,
                              label: artist.user?.[0]?.stripeAccountId
                                ? artist.stageName
                                : `${artist.stageName} (Account Setup Required)`,
                              disabled: !artist.user?.[0]?.stripeAccountId,
                            })) || []
                        }
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Update work and recording splits when main artists change
                          updateSplitsFromArtists([
                            ...value,
                            ...form.watch("featuredArtistIds"),
                          ]);
                        }}
                        placeholder="Choose main artists..."
                        maxCount={5}
                        resetOnDefaultValueChange={true}
                        emptyIndicator={
                          <div className="p-4 text-center text-gray-400">
                            <p>No eligible main artists found.</p>
                            <p className="mt-1 text-xs">
                              Artists need to complete their Stripe account
                              setup to be selectable.
                            </p>
                          </div>
                        }
                      />
                    </FormControl>

                    <FormMessage />
                    <p className="mt-1 text-xs text-gray-400">
                      💡 Artists without Stripe account setup are disabled and
                      shown with &ldquo;(Account Setup Required)&rdquo;
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featuredArtistIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Featured Artist(s)
                    </FormLabel>

                    <FormControl>
                      <MultiSelect
                        options={
                          artistsData?.artists?.items
                            ?.filter(
                              (artist) =>
                                !form
                                  .watch("mainArtistIds")
                                  .includes(artist.id),
                            )
                            ?.map((artist) => ({
                              value: artist.id,
                              label: artist.user?.[0]?.stripeAccountId
                                ? artist.stageName
                                : `${artist.stageName} (Account Setup Required)`,
                              disabled: !artist.user?.[0]?.stripeAccountId,
                            })) || []
                        }
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Update work and recording splits when featured artists change
                          updateSplitsFromArtists([
                            ...form.watch("mainArtistIds"),
                            ...value,
                          ]);
                        }}
                        placeholder="Choose featured artists..."
                        maxCount={5}
                        resetOnDefaultValueChange={true}
                        emptyIndicator={
                          <div className="p-4 text-center text-gray-400">
                            <p>No eligible featured artists found.</p>
                            <p className="mt-1 text-xs">
                              Artists need to complete their Stripe account
                              setup to be selectable.
                            </p>
                          </div>
                        }
                      />
                    </FormControl>

                    <FormMessage />
                    <p className="mt-1 text-xs text-gray-400">
                      💡 Artists without Stripe account setup are disabled and
                      shown with &ldquo;(Account Setup Required)&rdquo;
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div
                      className={cn(
                        "bg-main-dark-bg-1 rounded-md border px-3 pt-2 pb-1 transition-colors",
                        fieldState.error
                          ? "border-destructive"
                          : "border-white/30",
                      )}
                    >
                      <div className="flex items-center gap-x-1.5">
                        <span className="text-sm font-medium">Description</span>
                        <CircleQuestionMarkIcon className="size-3" />
                      </div>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Description will get you more views"
                          className="mt-1 h-24 w-full resize-none border-0 !bg-transparent px-0 text-sm font-semibold outline-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Categories<span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <MultiSelect
                        options={
                          categoriesData?.categories?.items?.map(
                            (category) => ({
                              value: category.id,
                              label: category.name,
                            }),
                          ) || []
                        }
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Choose music genres..."
                        maxCount={5}
                        resetOnDefaultValueChange={true}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Tags<span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <InputTags
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Add your desired tags..."
                      />
                    </FormControl>
                    <FormDescription>
                      Hint: Use , or Enter to add tags
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Track Cover Section */}
            <div className="w-full max-w-90 space-y-6">
              {/* Cover Image */}
              <FormField
                control={form.control}
                name="coverImage"
                render={({ fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Track Cover<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div
                        {...getCoverRootProps()}
                        className={cn(
                          "bg-main-dark-bg-1 flex size-90 cursor-pointer flex-col items-center justify-center gap-y-4 rounded-md border border-dashed transition-colors",
                          isCoverDragActive
                            ? "border-blue-400 bg-blue-50/10"
                            : fieldState.error
                              ? "border-destructive"
                              : "border-white/30",
                        )}
                      >
                        <input {...getCoverInputProps()} />
                        {coverImagePreview ? (
                          <div className="relative h-full w-full">
                            <Image
                              src={coverImagePreview}
                              alt="Track cover preview"
                              fill
                              className="rounded-md object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                              <span className="text-sm text-white">
                                Click to change
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="text-main-white size-25 stroke-1" />
                            <span className="text-main-white text-sm">
                              {isCoverDragActive
                                ? "Drop image here..."
                                : "Add track cover"}
                            </span>
                            <span className="text-main-grey-dark-1 text-center text-xs">
                              JPEG, PNG, WebP (max 5MB)
                            </span>
                          </>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="isReleased"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Privacy
                      </FormLabel>

                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
                          value={field.value ? "true" : "false"}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select privacy setting" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">
                              <EarthIcon className="mr-2 size-4" /> Public
                            </SelectItem>
                            <SelectItem value="false">
                              <LockIcon className="mr-2 size-4" /> Private
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormDescription className="text-xs text-gray-400">
                        Public tracks can optionally set a release date (min. 4
                        days from today). Without a date, they release
                        immediately as Official. With a date, they remain as
                        NotAnnounced until release.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="releaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Release Date {!form.watch("isReleased") && "(Optional)"}
                      </FormLabel>

                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                              disabled={!form.watch("isReleased")}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                field.value.toLocaleDateString()
                              ) : (
                                <span>
                                  {!form.watch("isReleased")
                                    ? "Release must be enabled to set date"
                                    : "Pick a release date"}
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < minDate}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormDescription className="text-xs text-gray-400">
                        {form.watch("isReleased")
                          ? "Optional: Set a future release date (min. 4 days from today) or leave empty for immediate release"
                          : "Only available for public tracks"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isUploading || uploadTrackMutation.isPending}
              className="primary_gradient text-main-white fixed right-8 bottom-[11px] z-10 h-[42px] rounded-full px-18 py-3 text-sm font-semibold hover:brightness-90 disabled:opacity-50"
            >
              {isUploading || uploadTrackMutation.isPending
                ? "Uploading..."
                : "Upload"}
            </Button>
          </div>

          <div className="mt-20">
            <Accordion type="multiple">
              <AccordionItem value="advanced-settings">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <FileChartColumnIcon className="text-main-white mr-3 size-6" />{" "}
                    Advanced Settings
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-9">
                  <div className="flex w-full flex-col space-y-6">
                    {/* Explicit Content */}
                    <FormField
                      control={form.control}
                      name="isExplicit"
                      render={({ field }) => (
                        <FormItem>
                          <div>
                            <p className="text-main-white text-xs font-bold">
                              Contain Explicit Content
                            </p>
                            <p className="text-main-grey-dark-1 text-xs font-normal">
                              Please check this if your track contains explicit
                              content. The badge will be displayed next to your
                              track title.
                            </p>

                            <div className="mt-2 flex items-center gap-x-4">
                              <FormControl>
                                <Checkbox
                                  id="explicit-content-checkbox"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <Label
                                htmlFor="explicit-content-checkbox"
                                className="text-sm font-bold"
                              >
                                Explicit Content
                              </Label>
                              <div className="bg-main-white flex size-4 items-center justify-center rounded-xs text-xs font-bold text-black">
                                E
                              </div>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Legal Documents */}
                    <FormField
                      control={form.control}
                      name="legalDocuments"
                      render={({ fieldState }) => (
                        <FormItem>
                          <div>
                            <p className="text-main-white mb-2 text-xs font-bold">
                              Legal Documents{" "}
                              <span className="text-red-500">*</span>
                            </p>
                            <p className="text-main-grey-dark-1 mb-4 text-xs font-normal">
                              Upload legal documents such as licenses,
                              contracts, or other relevant files.
                            </p>

                            <div className="space-y-4">
                              {legalDocuments.map((doc, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "space-y-3 rounded-md border p-4 transition-colors",
                                    form.formState.isSubmitted &&
                                      (!doc.name.trim() ||
                                        !doc.documentUrl.trim() ||
                                        !doc.note.trim() ||
                                        !/^https?:\/\/.+/.test(doc.documentUrl))
                                      ? "border-destructive/50 bg-destructive/5"
                                      : "border-white/20",
                                  )}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-sm font-medium text-white">
                                        Document {index + 1}
                                      </h4>
                                      {form.formState.isSubmitted &&
                                        (!doc.name.trim() ||
                                          !doc.documentUrl.trim() ||
                                          !doc.note.trim() ||
                                          !/^https?:\/\/.+/.test(
                                            doc.documentUrl,
                                          )) && (
                                          <span className="text-destructive text-xs font-medium">
                                            (Incomplete)
                                          </span>
                                        )}
                                    </div>
                                    {legalDocuments.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const newDocs = legalDocuments.filter(
                                            (_, i) => i !== index,
                                          );
                                          setLegalDocuments(newDocs);
                                          form.setValue(
                                            "legalDocuments",
                                            newDocs,
                                          );
                                        }}
                                      >
                                        <Trash2 className="size-4" />
                                      </Button>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <Label className="text-xs">
                                        Document Type
                                      </Label>
                                      <Select
                                        value={doc.documentType}
                                        onValueChange={(value) => {
                                          const newDocs = [...legalDocuments];
                                          newDocs[index].documentType =
                                            value as DocumentType;
                                          setLegalDocuments(newDocs);
                                          form.setValue(
                                            "legalDocuments",
                                            newDocs,
                                          );
                                        }}
                                      >
                                        <SelectTrigger size="sm">
                                          <SelectValue
                                            className="h-8"
                                            placeholder="Select type"
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem
                                            value={DocumentType.License}
                                          >
                                            License
                                          </SelectItem>
                                          <SelectItem
                                            value={DocumentType.Contract}
                                          >
                                            Contract
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-1">
                                      <Label className="text-xs">
                                        Document Name{" "}
                                        <span className="text-red-500">*</span>
                                      </Label>
                                      <Input
                                        placeholder="Enter document name"
                                        value={doc.name}
                                        onChange={(e) => {
                                          const newDocs = [...legalDocuments];
                                          newDocs[index].name = e.target.value;
                                          setLegalDocuments(newDocs);
                                          form.setValue(
                                            "legalDocuments",
                                            newDocs,
                                          );
                                          if (fieldState.error) {
                                            form.clearErrors("legalDocuments");
                                          }
                                        }}
                                        className={cn(
                                          "h-8",
                                          fieldState.error
                                            ? "border-destructive"
                                            : "",
                                        )}
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <Label className="text-xs">
                                      Document URL{" "}
                                      <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      placeholder="Enter document URL (https://example.com)"
                                      value={doc.documentUrl}
                                      onChange={(e) => {
                                        const newDocs = [...legalDocuments];
                                        newDocs[index].documentUrl =
                                          e.target.value;
                                        setLegalDocuments(newDocs);
                                        form.setValue(
                                          "legalDocuments",
                                          newDocs,
                                        );
                                        if (fieldState.error) {
                                          form.clearErrors("legalDocuments");
                                        }
                                      }}
                                      className={cn(
                                        "h-8",
                                        fieldState.error
                                          ? "border-destructive"
                                          : "",
                                      )}
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <Label className="text-xs">
                                      Note{" "}
                                      <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      placeholder="Add a note about this document"
                                      value={doc.note}
                                      onChange={(e) => {
                                        const newDocs = [...legalDocuments];
                                        newDocs[index].note = e.target.value;
                                        setLegalDocuments(newDocs);
                                        form.setValue(
                                          "legalDocuments",
                                          newDocs,
                                        );
                                        if (fieldState.error) {
                                          form.clearErrors("legalDocuments");
                                        }
                                      }}
                                      className={cn(
                                        "h-8",
                                        fieldState.error
                                          ? "border-destructive"
                                          : "",
                                      )}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDocs = [
                          ...legalDocuments,
                          {
                            documentType: DocumentType.License,
                            documentUrl: "",
                            name: "",
                            note: "",
                          },
                        ];
                        setLegalDocuments(newDocs);
                        form.setValue("legalDocuments", newDocs);
                      }}
                      className="w-full"
                    >
                      <Plus className="mr-2 size-4" />
                      Add Document
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="copyright">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <CreativeCommonsIcon className="text-main-white mr-3 size-6" />{" "}
                    Copyright
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-9">
                  <div className="flex w-full flex-col space-y-6">
                    {/* Original Content */}
                    <FormField
                      control={form.control}
                      name="isOriginal"
                      render={({ field }) => (
                        <FormItem>
                          <div>
                            <p className="text-main-white text-xs font-bold">
                              Original Content
                            </p>
                            <p className="text-main-grey-dark-1 text-xs font-normal">
                              Please check this if this track is your original
                              content. This helps us protect your rights as the
                              content creator.
                            </p>

                            <div className="mt-2 flex items-center gap-x-4">
                              <FormControl>
                                <Checkbox
                                  id="original-content-checkbox"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <Label
                                htmlFor="original-content-checkbox"
                                className="text-sm font-bold"
                              >
                                Original Content
                              </Label>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Work Splits */}
                    <div>
                      <p className="text-main-white mb-2 text-xs font-bold">
                        Work Splits (Songwriting)
                      </p>
                      <p className="text-main-grey-dark-1 mb-4 text-xs font-normal">
                        Define how songwriting credits are split. Total must
                        equal 100%.
                        <span className="text-yellow-400">
                          All selected artists must appear in at least one work
                          or recording split.
                        </span>
                      </p>

                      <div className="space-y-3">
                        {workSplits.length === 0 ? (
                          <div className="rounded-md border border-white/20 p-4 text-center text-gray-400">
                            <p className="text-sm">
                              No artists selected yet. Please select main or
                              featured artists above to see work splits.
                            </p>
                          </div>
                        ) : (
                          workSplits.map((split, index) => (
                            <div
                              key={index}
                              className="rounded-md border border-white/20 p-3"
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-white">
                                  {getUserDisplayName(
                                    split.userId,
                                    artistsData?.artists?.items || [],
                                    user?.userId,
                                  )}{" "}
                                  - {split.percentage}%
                                </span>
                                {workSplits.length === 1 ? (
                                  <span className="text-xs text-gray-400">
                                    (Default - Read Only)
                                  </span>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={
                                      !canRemoveArtistFromSplit(
                                        split.userId,
                                        "work",
                                      )
                                    }
                                    onClick={() => {
                                      const canRemove =
                                        canRemoveArtistFromSplit(
                                          split.userId,
                                          "work",
                                        );

                                      if (!canRemove) {
                                        const artist =
                                          artistsData?.artists?.items?.find(
                                            (a) => a.userId === split.userId,
                                          );
                                        const artistName =
                                          artist?.stageName || "Artist";
                                        toast.error(
                                          `${artistName} must appear in at least one work or recording split since they are selected as an artist for this track.`,
                                        );
                                        return;
                                      }

                                      const newSplits = redistributePercentages(
                                        workSplits,
                                        index,
                                      );
                                      setWorkSplits(newSplits);
                                    }}
                                    title={
                                      !canRemoveArtistFromSplit(
                                        split.userId,
                                        "work",
                                      )
                                        ? "This artist must appear in at least one split"
                                        : "Remove from work splits"
                                    }
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                )}
                              </div>
                              {workSplits.length > 1 && (
                                <div className="grid grid-cols-3 gap-2">
                                  <TrackUserCombobox
                                    users={
                                      (artistsData?.artists?.items?.filter(
                                        (artist) => {
                                          // Only show artists that are selected in main/featured
                                          const isSelectedArtist = [
                                            ...form.watch("mainArtistIds"),
                                            ...form.watch("featuredArtistIds"),
                                          ].includes(artist.id);

                                          // Don't show artists that are already used in other splits (except current one)
                                          const isUsedInOtherSplits =
                                            workSplits.some(
                                              (otherSplit, otherIndex) =>
                                                otherIndex !== index &&
                                                otherSplit.userId ===
                                                  artist.userId,
                                            );

                                          return (
                                            isSelectedArtist &&
                                            !isUsedInOtherSplits
                                          );
                                        },
                                      ) as TrackUploadArtist[]) || []
                                    }
                                    value={split.userId}
                                    onChange={(value) => {
                                      const newSplits = [...workSplits];
                                      const selectedArtist =
                                        artistsData?.artists?.items?.find(
                                          (a) => a.userId === value,
                                        );
                                      if (selectedArtist) {
                                        newSplits[index].userId = value;
                                        // Auto-assign role based on main/featured selection
                                        const isMainArtist = form
                                          .watch("mainArtistIds")
                                          .includes(selectedArtist.id);
                                        newSplits[index].artistRole =
                                          isMainArtist
                                            ? ArtistRole.Main
                                            : ArtistRole.Featured;
                                      }
                                      setWorkSplits(newSplits);
                                    }}
                                    placeholder="Select user"
                                    // isArtist={true}
                                  />
                                  <Select
                                    value={split.artistRole}
                                    onValueChange={(value) => {
                                      const newSplits = [...workSplits];
                                      newSplits[index].artistRole =
                                        value as ArtistRole;
                                      setWorkSplits(newSplits);
                                    }}
                                    disabled={true}
                                  >
                                    <SelectTrigger
                                      size="sm"
                                      className="cursor-not-allowed opacity-50"
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={ArtistRole.Main}>
                                        Main
                                      </SelectItem>
                                      <SelectItem value={ArtistRole.Featured}>
                                        Featured
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={split.percentage}
                                    onChange={(e) => {
                                      const newSplits = [...workSplits];
                                      newSplits[index].percentage =
                                        parseInt(e.target.value) || 0;
                                      setWorkSplits(newSplits);
                                    }}
                                    className="h-8"
                                  />
                                </div>
                              )}
                            </div>
                          ))
                        )}

                        <div className="text-right text-xs">
                          <span
                            className={`${
                              workSplits.reduce(
                                (sum, split) => sum + split.percentage,
                                0,
                              ) === 100
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            Total:{" "}
                            {workSplits.reduce(
                              (sum, split) => sum + split.percentage,
                              0,
                            )}
                            %
                            {workSplits.reduce(
                              (sum, split) => sum + split.percentage,
                              0,
                            ) !== 100 && " (Must be 100%)"}
                          </span>
                        </div>

                        {/* Form validation for work splits */}
                        <FormField
                          control={form.control}
                          name="workSplits"
                          render={() => (
                            <FormItem>
                              <FormControl>
                                <input type="hidden" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {(() => {
                          const allSelectedArtists = [
                            ...form.watch("mainArtistIds"),
                            ...form.watch("featuredArtistIds"),
                          ];
                          const usedArtistIds = workSplits
                            .map((split) => {
                              const artist = artistsData?.artists?.items?.find(
                                (a) => a.userId === split.userId,
                              );
                              return artist?.id;
                            })
                            .filter(Boolean);
                          const availableArtists = allSelectedArtists.filter(
                            (id) => !usedArtistIds.includes(id),
                          );

                          return (
                            availableArtists.length > 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const nextArtistId = availableArtists[0];
                                  const nextArtist =
                                    artistsData?.artists?.items?.find(
                                      (a) => a.id === nextArtistId,
                                    );
                                  if (nextArtist) {
                                    const isMainArtist = form
                                      .watch("mainArtistIds")
                                      .includes(nextArtistId);
                                    const newSplits = [
                                      ...workSplits,
                                      {
                                        userId: nextArtist.userId,
                                        artistRole: isMainArtist
                                          ? ArtistRole.Main
                                          : ArtistRole.Featured,
                                        percentage: 0,
                                      },
                                    ];
                                    // Auto-distribute percentages equally
                                    const redistributed =
                                      redistributePercentages(newSplits);
                                    setWorkSplits(redistributed);
                                  }
                                }}
                                className="w-full"
                              >
                                <Plus className="mr-2 size-4" />
                                Add Work Split
                              </Button>
                            )
                          );
                        })()}
                      </div>
                    </div>

                    {/* Recording Splits */}
                    <div>
                      <p className="text-main-white mb-2 text-xs font-bold">
                        Recording Splits (Performance)
                      </p>
                      <p className="text-main-grey-dark-1 mb-4 text-xs font-normal">
                        Define how recording performance credits are split.
                        Total must equal 100%.
                        <span className="text-yellow-400">
                          All selected artists must appear in at least one work
                          or recording split.
                        </span>
                      </p>

                      <div className="space-y-3">
                        {recordingSplits.length === 0 ? (
                          <div className="rounded-md border border-white/20 p-4 text-center text-gray-400">
                            <p className="text-sm">
                              No artists selected yet. Please select main or
                              featured artists above to see recording splits.
                            </p>
                          </div>
                        ) : (
                          recordingSplits.map((split, index) => (
                            <div
                              key={index}
                              className="rounded-md border border-white/20 p-3"
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-white">
                                  {getUserDisplayName(
                                    split.userId,
                                    artistsData?.artists?.items || [],
                                    user?.userId,
                                  )}{" "}
                                  - {split.percentage}%
                                </span>
                                {recordingSplits.length === 1 ? (
                                  <span className="text-xs text-gray-400">
                                    (Default - Read Only)
                                  </span>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={
                                      !canRemoveArtistFromSplit(
                                        split.userId,
                                        "recording",
                                      )
                                    }
                                    onClick={() => {
                                      const canRemove =
                                        canRemoveArtistFromSplit(
                                          split.userId,
                                          "recording",
                                        );

                                      if (!canRemove) {
                                        const artist =
                                          artistsData?.artists?.items?.find(
                                            (a) => a.userId === split.userId,
                                          );
                                        const artistName =
                                          artist?.stageName || "Artist";
                                        toast.error(
                                          `${artistName} must appear in at least one work or recording split since they are selected as an artist for this track.`,
                                        );
                                        return;
                                      }

                                      const newSplits = redistributePercentages(
                                        recordingSplits,
                                        index,
                                      );
                                      setRecordingSplits(newSplits);
                                    }}
                                    title={
                                      !canRemoveArtistFromSplit(
                                        split.userId,
                                        "recording",
                                      )
                                        ? "This artist must appear in at least one split"
                                        : "Remove from recording splits"
                                    }
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                )}
                              </div>
                              {recordingSplits.length > 1 && (
                                <div className="grid grid-cols-3 gap-2">
                                  <TrackUserCombobox
                                    users={
                                      (artistsData?.artists?.items?.filter(
                                        (artist) => {
                                          // Only show artists that are selected in main/featured
                                          const isSelectedArtist = [
                                            ...form.watch("mainArtistIds"),
                                            ...form.watch("featuredArtistIds"),
                                          ].includes(artist.id);

                                          // Don't show artists that are already used in other splits (except current one)
                                          const isUsedInOtherSplits =
                                            recordingSplits.some(
                                              (otherSplit, otherIndex) =>
                                                otherIndex !== index &&
                                                otherSplit.userId ===
                                                  artist.userId,
                                            );

                                          return (
                                            isSelectedArtist &&
                                            !isUsedInOtherSplits
                                          );
                                        },
                                      ) as TrackUploadArtist[]) || []
                                    }
                                    value={split.userId}
                                    onChange={(value) => {
                                      const newSplits = [...recordingSplits];
                                      const selectedArtist =
                                        artistsData?.artists?.items?.find(
                                          (a) => a.userId === value,
                                        );
                                      if (selectedArtist) {
                                        newSplits[index].userId = value;
                                        // Auto-assign role based on main/featured selection
                                        const isMainArtist = form
                                          .watch("mainArtistIds")
                                          .includes(selectedArtist.id);
                                        newSplits[index].artistRole =
                                          isMainArtist
                                            ? ArtistRole.Main
                                            : ArtistRole.Featured;
                                      }
                                      setRecordingSplits(newSplits);
                                    }}
                                    placeholder="Select user"
                                    // isArtist={true}
                                  />
                                  <Select
                                    value={split.artistRole}
                                    onValueChange={(value) => {
                                      const newSplits = [...recordingSplits];
                                      newSplits[index].artistRole =
                                        value as ArtistRole;
                                      setRecordingSplits(newSplits);
                                    }}
                                    disabled={true}
                                  >
                                    <SelectTrigger
                                      size="sm"
                                      className="cursor-not-allowed opacity-50"
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={ArtistRole.Main}>
                                        Main
                                      </SelectItem>
                                      <SelectItem value={ArtistRole.Featured}>
                                        Featured
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={split.percentage}
                                    onChange={(e) => {
                                      const newSplits = [...recordingSplits];
                                      newSplits[index].percentage =
                                        parseInt(e.target.value) || 0;
                                      setRecordingSplits(newSplits);
                                    }}
                                    className="h-8"
                                  />
                                </div>
                              )}
                            </div>
                          ))
                        )}

                        <div className="text-right text-xs">
                          <span
                            className={`${
                              recordingSplits.reduce(
                                (sum, split) => sum + split.percentage,
                                0,
                              ) === 100
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            Total:{" "}
                            {recordingSplits.reduce(
                              (sum, split) => sum + split.percentage,
                              0,
                            )}
                            %
                            {recordingSplits.reduce(
                              (sum, split) => sum + split.percentage,
                              0,
                            ) !== 100 && " (Must be 100%)"}
                          </span>
                        </div>

                        {/* Form validation for recording splits */}
                        <FormField
                          control={form.control}
                          name="recordingSplits"
                          render={() => (
                            <FormItem>
                              <FormControl>
                                <input type="hidden" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {(() => {
                          const allSelectedArtists = [
                            ...form.watch("mainArtistIds"),
                            ...form.watch("featuredArtistIds"),
                          ];
                          const usedArtistIds = recordingSplits
                            .map((split) => {
                              const artist = artistsData?.artists?.items?.find(
                                (a) => a.userId === split.userId,
                              );
                              return artist?.id;
                            })
                            .filter(Boolean);
                          const availableArtists = allSelectedArtists.filter(
                            (id) => !usedArtistIds.includes(id),
                          );

                          return (
                            availableArtists.length > 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const nextArtistId = availableArtists[0];
                                  const nextArtist =
                                    artistsData?.artists?.items?.find(
                                      (a) => a.id === nextArtistId,
                                    );
                                  if (nextArtist) {
                                    const isMainArtist = form
                                      .watch("mainArtistIds")
                                      .includes(nextArtistId);
                                    const newSplits = [
                                      ...recordingSplits,
                                      {
                                        userId: nextArtist.userId,
                                        artistRole: isMainArtist
                                          ? ArtistRole.Main
                                          : ArtistRole.Featured,
                                        percentage: 0,
                                      },
                                    ];
                                    // Auto-distribute percentages equally
                                    const redistributed =
                                      redistributePercentages(newSplits);
                                    setRecordingSplits(redistributed);
                                  }
                                }}
                                className="w-full"
                              >
                                <Plus className="mr-2 size-4" />
                                Add Recording Split
                              </Button>
                            )
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TrackUploadMetadataSection;
