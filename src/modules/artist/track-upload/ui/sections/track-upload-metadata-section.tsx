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
  FileTextIcon,
  UploadIcon,
  ExternalLink,
} from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { categoriesOptions, trackUploadArtistListOptions } from "@/gql/options/artist-options";
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
import { uploadLegalDocument, validateDocumentFile } from "@/utils/s3-upload-utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import InputTags from "@/components/ui/tags-input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import TrackUserCombobox from "../components/track-user-combobox";
import { TrackUploadArtist } from "../../types";
import { Alert, AlertDescription } from "@/components/ui/alert";

const FormSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required." }),
    description: z.string().optional(),
    mainArtistIds: z.array(z.string()).min(1, { message: "Please select at least one main artist." }),
    featuredArtistIds: z.array(z.string()),
    categoryIds: z.array(z.string()).min(1, { message: "Please select at least one category." }),
    tags: z.array(z.string()).min(1, { message: "Please add at least one tag." }),
    coverImage: z
      .instanceof(File, {
        message: "A cover image file is required.",
      })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Image size must be less than 5MB.",
      })
      .refine((file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type), {
        message: "Only JPEG, PNG, and WebP images are allowed.",
      }),
    isExplicit: z.boolean(),
    isReleased: z.boolean(),
    releaseDate: z.date().optional(),
    isOriginal: z.boolean(),
    isTesting: z.boolean(),
    legalDocuments: z.array(z.any()).optional(), // We'll validate this manually
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
          const total = splits.reduce((sum, split) => sum + split.percentage, 0);
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
          const total = splits.reduce((sum, split) => sum + split.percentage, 0);
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
  const remainingSplits = removedIndex !== undefined ? splits.filter((_, i) => i !== removedIndex) : splits;

  if (remainingSplits.length === 0) return [];

  const equalPercentage = Math.floor(100 / remainingSplits.length);
  const remainder = 100 - equalPercentage * remainingSplits.length;

  return remainingSplits.map((split, index) => ({
    ...split,
    percentage: index === 0 ? equalPercentage + remainder : equalPercentage,
  }));
};

// Helper function to get user display name
const getUserDisplayName = (userId: string, users: TrackUploadArtist[], currentUserId?: string) => {
  if (userId === currentUserId) return "You";
  const user = users?.find((u) => u.userId === userId);

  return user?.stageName || "Unknown User";
};

const TrackUploadMetadataSection = () => {
  // Subscribe to specific properties to avoid re-renders from progress updates
  const currentUploadId = useTrackUploadStore((state) => state.currentUpload?.id);
  const currentUploadFile = useTrackUploadStore((state) => state.currentUpload?.file);
  const currentUploadMetadata = useTrackUploadStore((state) => state.currentUpload?.metadata);
  const currentUploadDate = useTrackUploadStore((state) => state.currentUpload?.uploadedAt);
  const uploadedTracks = useTrackUploadStore((state) => state.uploadedTracks);
  const clearCurrentUpload = useTrackUploadStore((state) => state.clearCurrentUpload);
  const isUploading = useTrackUploadStore((state) => state.isUploading);
  const setUploading = useTrackUploadStore((state) => state.setUploading);

  // Memoize currentUpload object based on stable properties only
  const currentUpload = useMemo(() => {
    if (!currentUploadId || !currentUploadFile || !currentUploadMetadata) return null;

    return {
      id: currentUploadId,
      file: currentUploadFile,
      metadata: currentUploadMetadata,
      uploadedAt: currentUploadDate,
    };
  }, [currentUploadId, currentUploadFile, currentUploadMetadata, currentUploadDate]);
  const router = useRouter();
  const { user } = useAuthStore();
  const [displayTrack, setDisplayTrack] = useState(currentUpload);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  // const [trackUrl, setTrackUrl] = useState<string>("");
  const [workSplits, setWorkSplits] = useState<Array<{ userId: string; artistRole: ArtistRole; percentage: number }>>(
    [],
  );
  const [recordingSplits, setRecordingSplits] = useState<
    Array<{ userId: string; artistRole: ArtistRole; percentage: number }>
  >([]);
  const [legalDocuments, setLegalDocuments] = useState<
    {
      documentType: DocumentType;
      documentFile: File | null;
      name: string;
      note: string;
    }[]
  >([
    {
      documentType: DocumentType.License,
      documentFile: null,
      name: "",
      note: "",
    },
  ]);

  // Get minimum date (4 days from today) - memoized to prevent recreation
  const minDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date;
  }, []);

  const { data: artistsData } = useQuery(trackUploadArtistListOptions);
  const { data: categoriesData } = useQuery(categoriesOptions());
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
      isTesting: true,
      legalDocuments: [],
      workSplits: [],
      recordingSplits: [],
    },
  });

  // Helper function to check if an artist can be removed from splits
  const canRemoveArtistFromSplit = useCallback(
    (userId: string, splitType: "work" | "recording") => {
      if (!artistsData?.artists?.items) return true;

      const allSelectedArtistIds = [...form.watch("mainArtistIds"), ...form.watch("featuredArtistIds")];

      // Find the artist by userId
      const artist = artistsData.artists.items.find((a) => a.userId === userId);
      if (!artist || !allSelectedArtistIds.includes(artist.id)) return true; // Not a selected artist, can remove

      // Get current splits from both work and recording (excluding the one being removed)
      const currentWorkUserIds =
        splitType === "work"
          ? workSplits.filter((split) => split.userId !== userId).map((split) => split.userId)
          : workSplits.map((split) => split.userId);

      const currentRecordingUserIds =
        splitType === "recording"
          ? recordingSplits.filter((split) => split.userId !== userId).map((split) => split.userId)
          : recordingSplits.map((split) => split.userId);

      const allRemainingUserIds = [...currentWorkUserIds, ...currentRecordingUserIds];

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
        const artist = artistsData.artists?.items?.find((a) => a.id === artistId);
        const isMainArtist = mainArtistIds.includes(artistId);
        const isFeaturedArtist = featuredArtistIds.includes(artistId);

        return {
          userId: artist?.userId || artistId,
          artistRole: isMainArtist ? ArtistRole.Main : isFeaturedArtist ? ArtistRole.Featured : ArtistRole.Main,
          percentage: index === 0 ? equalPercentage + remainder : equalPercentage,
        };
      });

      // Create separate copies for work and recording splits to avoid reference sharing
      setWorkSplits(newSplits.map((split) => ({ ...split })));
      setRecordingSplits(newSplits.map((split) => ({ ...split })));
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
        if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
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

  // Handle document file upload
  const onDropDocument = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[], index: number) => {
      // Handle rejected files first
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors?.[0];
        if (error?.code === "file-too-large") {
          toast.error("Document size must be less than 20MB");
        } else if (error?.code === "file-invalid-type") {
          toast.error("Only PDF, DOC, DOCX, TXT, and image files are allowed");
        } else {
          toast.error("Invalid file selected");
        }
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        // Additional validation
        if (!validateDocumentFile(file)) {
          return;
        }

        // Update the document in state
        const newDocs = [...legalDocuments];
        newDocs[index].documentFile = file;
        setLegalDocuments(newDocs);
      }
    },
    [legalDocuments],
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

    // Validate legal documents manually
    const hasValidDocuments =
      legalDocuments.length > 0 && legalDocuments.every((doc) => doc.documentFile && doc.name.trim());

    if (!hasValidDocuments) {
      toast.error("Please ensure all legal documents have files uploaded and required fields filled.");
      return;
    }

    // Validate that all selected artists appear in at least one split
    const allSelectedArtistIds = [...data.mainArtistIds, ...data.featuredArtistIds];

    if (allSelectedArtistIds.length > 0 && artistsData?.artists?.items) {
      // Get all user IDs from both work and recording splits
      const allSplitUserIds = [
        ...workSplits.map((split) => split.userId),
        ...recordingSplits.map((split) => split.userId),
      ];

      // Check if every selected artist appears in at least one split
      const missingArtists = allSelectedArtistIds.filter((artistId) => {
        const artist = artistsData.artists?.items?.find((a) => a.id === artistId);
        return artist && !allSplitUserIds.includes(artist.userId);
      });

      if (missingArtists.length > 0) {
        const missingArtistNames = missingArtists.map((artistId) => {
          const artist = artistsData.artists?.items?.find((a) => a.id === artistId);
          return artist?.stageName || "Unknown Artist";
        });

        if (missingArtistNames.length === 1) {
          toast.error(`${missingArtistNames[0]} must appear in at least one work or recording split.`);
        } else {
          toast.error(
            `The following artists must appear in at least one work or recording split: ${missingArtistNames.join(", ")}`,
          );
        }
        return;
      }
    }

    // Start loading state for upload
    setUploading(true);

    try {
      // Proceed directly with upload since copyright check was done earlier
      await continueUploadProcess(data);
    } catch (error) {
      // Stop loading state on error
      setUploading(false);
      console.error("Upload failed:", error);
      toast.error("Failed to upload track. Please try again.");
    }
  }

  const continueUploadProcess = async (data: FormData) => {
    if (!displayTrack || !user?.userId) {
      toast.error("No track found or user not authenticated");
      return;
    }

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

      // Upload legal documents to S3
      const uploadedLegalDocuments = [];
      for (const doc of legalDocuments) {
        if (doc.documentFile && doc.name.trim()) {
          try {
            const uploadResult = await uploadLegalDocument(doc.documentFile);
            uploadedLegalDocuments.push({
              documentType: doc.documentType as DocumentType,
              documentUrl: uploadResult.fileKey,
              name: doc.name,
              note: doc.note || null,
            });
          } catch (error) {
            console.error("Failed to upload document:", error);
            toast.error(`Failed to upload document: ${doc.name}`);
          }
        }
      }

      // Prepare the mutation data
      const mutationData = {
        file: displayTrack.file,
        createTrackRequest: {
          name: data.title,
          description: data.description || null,
          categoryIds: data.categoryIds,
          coverImage: coverImageUrl,
          isRelease: data.isReleased,
          releaseDate: data.releaseDate ? data.releaseDate.toISOString() : null,
          releaseStatus: releaseStatus,
          isOriginal: data.isOriginal,
          mainArtistIds: data.mainArtistIds,
          featuredArtistIds: data.featuredArtistIds,
          tags: data.tags || [],
          isExplicit: data.isExplicit,
          legalDocuments: uploadedLegalDocuments,
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
        isTesting: data.isTesting,
      };

      // Execute the upload mutation
      await uploadTrackMutation.mutateAsync(mutationData);

      toast.success("Track uploaded successfully!");

      // Clear the loading state and current upload, then navigate back to tracks
      setUploading(false);
      clearCurrentUpload();

      if (data.isTesting) {
        router.push("/artist/studio/tracks");
      } else {
        router.push("/artist/track-uploading");
      }
    } catch (error) {
      // Clear loading state on upload error
      setUploading(false);
      console.error("Upload failed:", error);
      toast.error("Failed to upload track. Please try again.");
    }
  };

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
    if (!displayTrack) return;

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
      isTesting: true,
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
        documentFile: null,
        name: "",
        note: "",
      },
    ]);

    // Initialize current user as main artist after reset (only if Stripe account is set up)
    if (artistsData?.artists?.items && user?.userId) {
      const currentUserArtist = artistsData.artists.items.find((artist) => artist.userId === user.userId);
      if (currentUserArtist && currentUserArtist.user?.[0]?.stripeAccountId) {
        // Use setTimeout to ensure this runs after the reset has completed
        setTimeout(() => {
          form.setValue("mainArtistIds", [currentUserArtist.id], { shouldValidate: false });
          // Manually update splits to ensure they're populated
          updateSplitsFromArtists([currentUserArtist.id]);
        }, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayTrack?.id]);

  // Sync form with state variables for validation - consolidated to prevent cascading updates
  useEffect(() => {
    form.setValue("workSplits", workSplits, { shouldValidate: false, shouldDirty: false });
    form.setValue("recordingSplits", recordingSplits, { shouldValidate: false, shouldDirty: false });
  }, [workSplits, recordingSplits, form]);

  // Clear release date when isReleased is set to false
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (!data.isReleased && data.releaseDate) {
        form.setValue("releaseDate", undefined);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Ensure current user is set as main artist when artistsData becomes available (only if Stripe account is set up)
  useEffect(() => {
    if (!artistsData?.artists?.items || !user?.userId) return;

    const currentMainArtists = form.getValues("mainArtistIds");
    if (currentMainArtists.length > 0) return; // Already has artists, don't override

    const currentUserArtist = artistsData.artists.items.find((artist) => artist.userId === user.userId);
    if (currentUserArtist?.user?.[0]?.stripeAccountId) {
      form.setValue("mainArtistIds", [currentUserArtist.id], { shouldValidate: false });
      // Manually update splits to ensure they're populated
      updateSplitsFromArtists([currentUserArtist.id]);
    }
  }, [artistsData?.artists?.items, user?.userId, form, updateSplitsFromArtists]);

  // Watch for changes in artist selections and automatically update splits
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Only update if the changed field is actually artist-related
      if (name === "mainArtistIds" || name === "featuredArtistIds") {
        const mainIds: string[] = Array.isArray(value.mainArtistIds)
          ? value.mainArtistIds.filter((id): id is string => typeof id === "string")
          : [];
        const featuredIds: string[] = Array.isArray(value.featuredArtistIds)
          ? value.featuredArtistIds.filter((id): id is string => typeof id === "string")
          : [];
        const allSelectedArtists = [...mainIds, ...featuredIds];

        // Only update if we have artists selected
        if (allSelectedArtists.length > 0) {
          updateSplitsFromArtists(allSelectedArtists);
        } else {
          // Clear splits if no artists are selected
          setWorkSplits([]);
          setRecordingSplits([]);
        }
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSplitsFromArtists]);

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
            <p className="text-white/70">No track found. Please upload a track first.</p>
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
                        fieldState.error ? "border-destructive" : "border-white/30",
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
                            ?.filter((artist) => !form.watch("featuredArtistIds").includes(artist.id))
                            ?.map((artist) => ({
                              value: artist.id,
                              label: artist.user?.[0]?.stripeAccountId
                                ? artist.stageName
                                : `${artist.stageName} (Account Setup Required)`,
                              disabled: !artist.user?.[0]?.stripeAccountId,
                            })) || []
                        }
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Choose main artists..."
                        maxCount={5}
                        resetOnDefaultValueChange={true}
                        emptyIndicator={
                          <div className="p-4 text-center text-gray-400">
                            <p>No eligible main artists found.</p>
                            <p className="mt-1 text-xs">
                              Artists need to complete their Stripe account setup to be selectable.
                            </p>
                          </div>
                        }
                      />
                    </FormControl>

                    <FormMessage />
                    <p className="mt-1 text-xs text-gray-400">
                      💡 Artists without Stripe account setup are disabled and shown with &ldquo;(Account Setup
                      Required)&rdquo;
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featuredArtistIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Featured Artist(s)</FormLabel>

                    <FormControl>
                      <MultiSelect
                        options={
                          artistsData?.artists?.items
                            ?.filter((artist) => !form.watch("mainArtistIds").includes(artist.id))
                            ?.map((artist) => ({
                              value: artist.id,
                              label: artist.user?.[0]?.stripeAccountId
                                ? artist.stageName
                                : `${artist.stageName} (Account Setup Required)`,
                              disabled: !artist.user?.[0]?.stripeAccountId,
                            })) || []
                        }
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Choose featured artists..."
                        maxCount={5}
                        resetOnDefaultValueChange={true}
                        emptyIndicator={
                          <div className="p-4 text-center text-gray-400">
                            <p>No eligible featured artists found.</p>
                            <p className="mt-1 text-xs">
                              Artists need to complete their Stripe account setup to be selectable.
                            </p>
                          </div>
                        }
                      />
                    </FormControl>

                    <FormMessage />
                    <p className="mt-1 text-xs text-gray-400">
                      💡 Artists without Stripe account setup are disabled and shown with &ldquo;(Account Setup
                      Required)&rdquo;
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
                        fieldState.error ? "border-destructive" : "border-white/30",
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
                          categoriesData?.categories?.items?.map((category) => ({
                            value: category.id,
                            label: category.name,
                          })) || []
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
                      <InputTags value={field.value} onChange={field.onChange} placeholder="Add your desired tags..." />
                    </FormControl>
                    <FormDescription>Hint: Use , or Enter to add tags</FormDescription>
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
                              <span className="text-sm text-white">Click to change</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="text-main-white size-25 stroke-1" />
                            <span className="text-main-white text-sm">
                              {isCoverDragActive ? "Drop image here..." : "Add track cover"}
                            </span>
                            <span className="text-main-grey-dark-1 text-center text-xs">JPEG, PNG, WebP (max 5MB)</span>
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
                      <FormLabel className="text-sm font-medium">Privacy</FormLabel>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {field.value ? (
                              <EarthIcon className="text-main-white size-4" />
                            ) : (
                              <LockIcon className="text-main-white size-4" />
                            )}
                            <span className="text-sm font-medium">{field.value ? "Public" : "Private"}</span>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </div>

                        <FormDescription className="text-xs text-gray-400">
                          Public tracks can optionally set a release date (min. 4 days from today). Without a date, they
                          release immediately as Official. With a date, they remain as NotAnnounced until release.
                        </FormDescription>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* // TODO: Make this visible when the error about Privacy is fixed */}
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="releaseDate"
                  render={({ field }) => (
                    <FormItem className="hidden">
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
              {isUploading || uploadTrackMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>

          <div className="mt-20">
            <Accordion type="multiple">
              <AccordionItem value="advanced-settings">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <FileChartColumnIcon className="text-main-white mr-3 size-6" /> Legal Documents
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
                            <p className="text-main-white text-xs font-bold">Contain Explicit Content</p>
                            <p className="text-main-grey-dark-1 text-xs font-normal">
                              Please check this if your track contains explicit content. The badge will be displayed
                              next to your track title.
                            </p>

                            <div className="mt-2 flex items-center gap-x-4">
                              <FormControl>
                                <Checkbox
                                  id="explicit-content-checkbox"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <Label htmlFor="explicit-content-checkbox" className="text-sm font-bold">
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
                              Legal Documents <span className="text-red-500">*</span>
                            </p>
                            <p className="text-main-grey-dark-1 mb-4 text-xs font-normal">
                              Upload legal documents such as licenses, contracts, or other relevant files.
                            </p>

                            <div className="space-y-4">
                              {legalDocuments.map((doc, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "space-y-3 rounded-md border p-4 transition-colors",
                                    form.formState.isSubmitted &&
                                      (!doc.name.trim() || !doc.documentFile)
                                      ? "border-destructive/50 bg-destructive/5"
                                      : "border-white/20",
                                  )}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-sm font-medium text-white">Document {index + 1}</h4>
                                      {form.formState.isSubmitted && (!doc.name.trim() || !doc.documentFile) && (
                                        <span className="text-destructive text-xs font-medium">(Incomplete)</span>
                                      )}
                                    </div>
                                    {legalDocuments.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const newDocs = legalDocuments.filter((_, i) => i !== index);
                                          setLegalDocuments(newDocs);
                                        }}
                                      >
                                        <Trash2 className="size-4" />
                                      </Button>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <Label className="text-xs">Document Type</Label>
                                      <Select
                                        value={doc.documentType}
                                        onValueChange={(value) => {
                                          const newDocs = [...legalDocuments];
                                          newDocs[index].documentType = value as DocumentType;
                                          setLegalDocuments(newDocs);
                                        }}
                                      >
                                        <SelectTrigger size="sm">
                                          <SelectValue className="h-8" placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value={DocumentType.License}>License</SelectItem>
                                          <SelectItem value={DocumentType.Contract}>Contract</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-1">
                                      <Label className="text-xs">
                                        Document Name <span className="text-red-500">*</span>
                                      </Label>
                                      <Input
                                        placeholder="Enter document name"
                                        value={doc.name}
                                        onChange={(e) => {
                                          const newDocs = [...legalDocuments];
                                          newDocs[index].name = e.target.value;
                                          setLegalDocuments(newDocs);
                                          if (fieldState.error) {
                                            form.clearErrors("legalDocuments");
                                          }
                                        }}
                                        className={cn("h-8", fieldState.error ? "border-destructive" : "")}
                                      />
                                    </div>
                                  </div>

                                  {/* Document File Upload */}
                                  <div className="space-y-1">
                                    <Label className="text-xs">
                                      Document File <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                      <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt,.jpeg,.jpg,.png,.webp"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            onDropDocument([file], [], index);
                                          }
                                        }}
                                        className="sr-only"
                                        id={`document-upload-${index}`}
                                      />
                                      <label
                                        htmlFor={`document-upload-${index}`}
                                        className={cn(
                                          "block cursor-pointer rounded-md border-2 border-dashed p-4 text-center transition-colors",
                                          doc.documentFile
                                            ? "border-green-500 bg-green-500/10"
                                            : "border-gray-300 hover:border-gray-400",
                                          fieldState.error ? "border-destructive" : "",
                                        )}
                                      >
                                        {doc.documentFile ? (
                                          <div className="flex items-center justify-center gap-2">
                                            <FileTextIcon className="h-5 w-5 text-green-500" />
                                            <span className="text-sm text-green-500">{doc.documentFile.name}</span>
                                          </div>
                                        ) : (
                                          <div className="flex flex-col items-center justify-center gap-2">
                                            <UploadIcon className="h-8 w-8 text-gray-400" />
                                            <p className="text-sm text-gray-500">Click to upload document</p>
                                            <p className="text-xs text-gray-400">
                                              PDF, DOC, DOCX, TXT, or Images (max 20MB)
                                            </p>
                                          </div>
                                        )}
                                      </label>
                                    </div>

                                    {/* Document Preview */}
                                    {doc.documentFile &&
                                      (() => {
                                        const fileUrl = URL.createObjectURL(doc.documentFile);
                                        const isImage = doc.documentFile.type.startsWith("image/");

                                        return (
                                          <div className="mt-3 rounded-md border border-white/20 p-3">
                                            <p className="mb-2 text-xs font-medium text-white">Preview:</p>
                                            {isImage ? (
                                              <Zoom>
                                                <img
                                                  src={fileUrl}
                                                  alt={doc.documentFile.name}
                                                  className="h-auto w-full max-w-xs cursor-zoom-in rounded-md object-contain"
                                                />
                                              </Zoom>
                                            ) : (
                                              <div className="flex items-center gap-3">
                                                <FileTextIcon className="h-8 w-8 text-gray-400" />
                                                <div className="flex-1">
                                                  <p className="text-sm text-white">{doc.documentFile.name}</p>
                                                  <p className="text-xs text-gray-400">
                                                    {(doc.documentFile.size / 1024 / 1024).toFixed(2)} MB
                                                  </p>
                                                </div>
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => window.open(fileUrl, "_blank")}
                                                  className="flex items-center gap-2"
                                                >
                                                  <ExternalLink className="h-4 w-4" />
                                                  View
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })()}
                                  </div>

                                  <div className="space-y-1">
                                    <Label className="text-xs">Note (optional)</Label>
                                    <Input
                                      placeholder="Add a note about this document"
                                      value={doc.note}
                                      onChange={(e) => {
                                        const newDocs = [...legalDocuments];
                                        newDocs[index].note = e.target.value;
                                        setLegalDocuments(newDocs);
                                        if (fieldState.error) {
                                          form.clearErrors("legalDocuments");
                                        }
                                      }}
                                      className={cn("h-8", fieldState.error ? "border-destructive" : "")}
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
                            documentFile: null,
                            name: "",
                            note: "",
                          },
                        ];
                        setLegalDocuments(newDocs);
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
                    <CreativeCommonsIcon className="text-main-white mr-3 size-6" /> Royalty Splits
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-9">
                  <div className="flex w-full flex-col space-y-6">
                    {/* Warning Alert */}
                    <Alert className="border-red-500/30 bg-red-500/10">
                      <AlertTriangle className="h-4 w-4 stroke-red-500" />
                      <AlertDescription className="text-red-500">
                        Warning: Royalty Splits cannot be updated after the track is uploaded. Please double-check the information before proceeding.
                      </AlertDescription>
                    </Alert>
                    {/* Original Content */}
                    <FormField
                      control={form.control}
                      name="isOriginal"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <div>
                            <p className="text-main-white text-xs font-bold">Original Content</p>
                            <p className="text-main-grey-dark-1 text-xs font-normal">
                              Please check this if this track is your original content. This helps us protect your
                              rights as the content creator.
                            </p>

                            <div className="mt-2 flex items-center gap-x-4">
                              <FormControl>
                                <Checkbox
                                  id="original-content-checkbox"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <Label htmlFor="original-content-checkbox" className="text-sm font-bold">
                                Original Content
                              </Label>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Original Content */}
                    <FormField
                      control={form.control}
                      name="isTesting"
                      render={({ field }) => (
                        <FormItem>
                          <div>
                            <p className="text-main-white text-xs font-bold">Bypass Fingerprint</p>
                            <p className="text-main-grey-dark-1 text-xs font-normal">
                              Check this to bypass fingerprint matching for testing purposes. This should only be used
                            </p>

                            <div className="mt-2 flex items-center gap-x-4">
                              <FormControl>
                                <Checkbox
                                  id="bypass-fingerprint-checkbox"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <Label htmlFor="bypass-fingerprint-checkbox" className="text-sm font-bold">
                                Bypass Fingerprint
                              </Label>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Work Splits */}
                    <div>
                      <p className="text-main-white mb-2 text-xs font-bold">Work Splits (Songwriting)</p>
                      <p className="text-main-grey-dark-1 mb-4 text-xs font-normal">
                        Define how songwriting credits are split. Total must equal 100%.
                        <span className="text-yellow-400">
                          All selected artists must appear in at least one work or recording split.
                        </span>
                      </p>

                      <div className="space-y-3">
                        {workSplits.length === 0 ? (
                          <div className="rounded-md border border-white/20 p-4 text-center text-gray-400">
                            <p className="text-sm">
                              No artists selected yet. Please select main or featured artists above to see work splits.
                            </p>
                          </div>
                        ) : (
                          workSplits.map((split, index) => (
                            <div key={index} className="rounded-md border border-white/20 p-3">
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-white">
                                  {getUserDisplayName(split.userId, artistsData?.artists?.items || [], user?.userId)} -{" "}
                                  {split.percentage}%
                                </span>
                                {workSplits.length === 1 ? (
                                  <span className="text-xs text-gray-400">(Default - Read Only)</span>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={!canRemoveArtistFromSplit(split.userId, "work")}
                                    onClick={() => {
                                      const canRemove = canRemoveArtistFromSplit(split.userId, "work");

                                      if (!canRemove) {
                                        const artist = artistsData?.artists?.items?.find(
                                          (a) => a.userId === split.userId,
                                        );
                                        const artistName = artist?.stageName || "Artist";
                                        toast.error(
                                          `${artistName} must appear in at least one work or recording split since they are selected as an artist for this track.`,
                                        );
                                        return;
                                      }

                                      const newSplits = redistributePercentages(workSplits, index);
                                      setWorkSplits(newSplits);
                                    }}
                                    title={
                                      !canRemoveArtistFromSplit(split.userId, "work")
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
                                      (artistsData?.artists?.items?.filter((artist) => {
                                        // Only show artists that are selected in main/featured
                                        const isSelectedArtist = [
                                          ...form.watch("mainArtistIds"),
                                          ...form.watch("featuredArtistIds"),
                                        ].includes(artist.id);

                                        // Don't show artists that are already used in other splits (except current one)
                                        const isUsedInOtherSplits = workSplits.some(
                                          (otherSplit, otherIndex) =>
                                            otherIndex !== index && otherSplit.userId === artist.userId,
                                        );

                                        return isSelectedArtist && !isUsedInOtherSplits;
                                      }) as TrackUploadArtist[]) || []
                                    }
                                    value={split.userId}
                                    onChange={(value) => {
                                      const newSplits = [...workSplits];
                                      const selectedArtist = artistsData?.artists?.items?.find(
                                        (a) => a.userId === value,
                                      );
                                      if (selectedArtist) {
                                        newSplits[index].userId = value;
                                        // Auto-assign role based on main/featured selection
                                        const isMainArtist = form.watch("mainArtistIds").includes(selectedArtist.id);
                                        newSplits[index].artistRole = isMainArtist
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
                                      newSplits[index].artistRole = value as ArtistRole;
                                      setWorkSplits(newSplits);
                                    }}
                                    disabled={true}
                                  >
                                    <SelectTrigger size="sm" className="cursor-not-allowed opacity-50">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={ArtistRole.Main}>Main</SelectItem>
                                      <SelectItem value={ArtistRole.Featured}>Featured</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={split.percentage}
                                    onChange={(e) => {
                                      const newSplits = [...workSplits];
                                      newSplits[index].percentage = parseInt(e.target.value) || 0;
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
                              workSplits.reduce((sum, split) => sum + split.percentage, 0) === 100
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            Total: {workSplits.reduce((sum, split) => sum + split.percentage, 0)}%
                            {workSplits.reduce((sum, split) => sum + split.percentage, 0) !== 100 && " (Must be 100%)"}
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
                              const artist = artistsData?.artists?.items?.find((a) => a.userId === split.userId);
                              return artist?.id;
                            })
                            .filter(Boolean);
                          const availableArtists = allSelectedArtists.filter((id) => !usedArtistIds.includes(id));

                          return (
                            availableArtists.length > 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const nextArtistId = availableArtists[0];
                                  const nextArtist = artistsData?.artists?.items?.find((a) => a.id === nextArtistId);
                                  if (nextArtist) {
                                    const isMainArtist = form.watch("mainArtistIds").includes(nextArtistId);
                                    const newSplits = [
                                      ...workSplits,
                                      {
                                        userId: nextArtist.userId,
                                        artistRole: isMainArtist ? ArtistRole.Main : ArtistRole.Featured,
                                        percentage: 0,
                                      },
                                    ];
                                    // Auto-distribute percentages equally
                                    const redistributed = redistributePercentages(newSplits);
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
                      <p className="text-main-white mb-2 text-xs font-bold">Recording Splits (Performance)</p>
                      <p className="text-main-grey-dark-1 mb-4 text-xs font-normal">
                        Define how recording performance credits are split. Total must equal 100%.
                        <span className="text-yellow-400">
                          All selected artists must appear in at least one work or recording split.
                        </span>
                      </p>

                      <div className="space-y-3">
                        {recordingSplits.length === 0 ? (
                          <div className="rounded-md border border-white/20 p-4 text-center text-gray-400">
                            <p className="text-sm">
                              No artists selected yet. Please select main or featured artists above to see recording
                              splits.
                            </p>
                          </div>
                        ) : (
                          recordingSplits.map((split, index) => (
                            <div key={index} className="rounded-md border border-white/20 p-3">
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-white">
                                  {getUserDisplayName(split.userId, artistsData?.artists?.items || [], user?.userId)} -{" "}
                                  {split.percentage}%
                                </span>
                                {recordingSplits.length === 1 ? (
                                  <span className="text-xs text-gray-400">(Default - Read Only)</span>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={!canRemoveArtistFromSplit(split.userId, "recording")}
                                    onClick={() => {
                                      const canRemove = canRemoveArtistFromSplit(split.userId, "recording");

                                      if (!canRemove) {
                                        const artist = artistsData?.artists?.items?.find(
                                          (a) => a.userId === split.userId,
                                        );
                                        const artistName = artist?.stageName || "Artist";
                                        toast.error(
                                          `${artistName} must appear in at least one work or recording split since they are selected as an artist for this track.`,
                                        );
                                        return;
                                      }

                                      const newSplits = redistributePercentages(recordingSplits, index);
                                      setRecordingSplits(newSplits);
                                    }}
                                    title={
                                      !canRemoveArtistFromSplit(split.userId, "recording")
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
                                      (artistsData?.artists?.items?.filter((artist) => {
                                        // Only show artists that are selected in main/featured
                                        const isSelectedArtist = [
                                          ...form.watch("mainArtistIds"),
                                          ...form.watch("featuredArtistIds"),
                                        ].includes(artist.id);

                                        // Don't show artists that are already used in other splits (except current one)
                                        const isUsedInOtherSplits = recordingSplits.some(
                                          (otherSplit, otherIndex) =>
                                            otherIndex !== index && otherSplit.userId === artist.userId,
                                        );

                                        return isSelectedArtist && !isUsedInOtherSplits;
                                      }) as TrackUploadArtist[]) || []
                                    }
                                    value={split.userId}
                                    onChange={(value) => {
                                      const newSplits = [...recordingSplits];
                                      const selectedArtist = artistsData?.artists?.items?.find(
                                        (a) => a.userId === value,
                                      );
                                      if (selectedArtist) {
                                        newSplits[index].userId = value;
                                        // Auto-assign role based on main/featured selection
                                        const isMainArtist = form.watch("mainArtistIds").includes(selectedArtist.id);
                                        newSplits[index].artistRole = isMainArtist
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
                                      newSplits[index].artistRole = value as ArtistRole;
                                      setRecordingSplits(newSplits);
                                    }}
                                    disabled={true}
                                  >
                                    <SelectTrigger size="sm" className="cursor-not-allowed opacity-50">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={ArtistRole.Main}>Main</SelectItem>
                                      <SelectItem value={ArtistRole.Featured}>Featured</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={split.percentage}
                                    onChange={(e) => {
                                      const newSplits = [...recordingSplits];
                                      newSplits[index].percentage = parseInt(e.target.value) || 0;
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
                              recordingSplits.reduce((sum, split) => sum + split.percentage, 0) === 100
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            Total: {recordingSplits.reduce((sum, split) => sum + split.percentage, 0)}%
                            {recordingSplits.reduce((sum, split) => sum + split.percentage, 0) !== 100 &&
                              " (Must be 100%)"}
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
                              const artist = artistsData?.artists?.items?.find((a) => a.userId === split.userId);
                              return artist?.id;
                            })
                            .filter(Boolean);
                          const availableArtists = allSelectedArtists.filter((id) => !usedArtistIds.includes(id));

                          return (
                            availableArtists.length > 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const nextArtistId = availableArtists[0];
                                  const nextArtist = artistsData?.artists?.items?.find((a) => a.id === nextArtistId);
                                  if (nextArtist) {
                                    const isMainArtist = form.watch("mainArtistIds").includes(nextArtistId);
                                    const newSplits = [
                                      ...recordingSplits,
                                      {
                                        userId: nextArtist.userId,
                                        artistRole: isMainArtist ? ArtistRole.Main : ArtistRole.Featured,
                                        percentage: 0,
                                      },
                                    ];
                                    // Auto-distribute percentages equally
                                    const redistributed = redistributePercentages(newSplits);
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
