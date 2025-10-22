"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTrackUploadStore } from "@/store";
import {
  CircleQuestionMarkIcon,
  Copy,
  EarthIcon,
  FileAudioIcon,
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
import { categoriesOptions } from "@/gql/options/artist-options";
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
import { useDropzone } from "react-dropzone";
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

const FormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  mainArtist: z.string().optional(),
  categoryIds: z
    .array(z.string())
    .min(1, { message: "Please select at least one category." }),
  tags: z.array(z.string()).optional(),
  isReleased: z.boolean(),
  coverImage: z.instanceof(File).optional(),
});

const tagsList = [
  { value: "chill", label: "Chill" },
  { value: "party", label: "Party" },
  { value: "romantic", label: "Romantic" },
  { value: "energetic", label: "Energetic" },
  { value: "relaxing", label: "Relaxing" },
  { value: "upbeat", label: "Upbeat" },
  { value: "emotional", label: "Emotional" },
  { value: "instrumental", label: "Instrumental" },
];

const TrackUploadMetadataSection = () => {
  const router = useRouter();
  const { currentUpload, uploadedTracks, clearCurrentUpload } =
    useTrackUploadStore();
  const { user } = useAuthStore();
  const [displayTrack, setDisplayTrack] = useState(currentUpload);
  const [isUploading, setIsUploading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null,
  );
  const [trackUrl, setTrackUrl] = useState<string>("");

  // Copy track URL to clipboard
  const handleCopyUrl = async () => {
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
  };

  // Fetch categories from the backend
  const { data: categoriesData } = useQuery(categoriesOptions);

  // Upload track mutation
  const uploadTrackMutation = useMutation(trackUploadMutationOptions);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      mainArtist: "",
      categoryIds: [],
      tags: [],
      isReleased: false,
      coverImage: undefined,
    },
  });

  // Handle cover image upload
  const onDropCoverImage = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        form.setValue("coverImage", file);

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
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!displayTrack || !user?.userId) {
      toast.error("No track found or user not authenticated");
      return;
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

      // Prepare the mutation data based on your example
      const mutationData = {
        file: displayTrack.file,
        createTrackRequest: {
          name: data.title,
          description: data.description || null,
          categoryIds: data.categoryIds,
          coverImage: coverImageUrl,
          isReleased: data.isReleased,
          releaseStatus: ReleaseStatus.NotAnnounced,
          isOriginal: true,
          mainArtistIds: [], // Empty for now as per your example
          featuredArtistIds: [], // Empty for now as per your example
          tags: data.tags || [],
          isExplicit: false,
          legalDocuments: [
            {
              documentType: DocumentType.License,
              documentUrl:
                "https://drive.google.com/file/d/1byNXcSn88agBVnEVIp6anLcDjPbvuUIb/view?usp=sharing", // Hardcoded as per your example
              name: "test license",
              note: "empty",
            },
          ],
        } as CreateTrackRequestInput,
        createWorkRequest: {
          description: null,
          workSplits: [
            {
              userId: user.userId,
              artistRole: ArtistRole.Main,
              percentage: 100,
            },
          ],
        } as CreateWorkRequestInput,
        createRecordingRequest: {
          description: null,
          recordingSplits: [
            {
              userId: user.userId,
              artistRole: ArtistRole.Main,
              percentage: 100,
            },
          ],
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
        mainArtist: "",
        categoryIds: [],
        tags: [],
        isReleased: false,
        coverImage: undefined,
      });
      setCoverImagePreview(null);
      // Set a placeholder URL based on track name
      if (typeof window !== "undefined") {
        setTrackUrl(
          `${window.location.origin}/track/${displayTrack.id || "pending"}`,
        );
      }
    }
  }, [displayTrack, form]);

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
      <div className="primary_gradient w-full rounded-lg p-0.5">
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
      </div>

      {/* Track Metadata */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
          <div className="flex w-full items-start justify-between">
            <div className="w-full max-w-[598px] space-y-6">
              <div className="bg-main-dark-bg-1 rounded-md border border-white/30 px-3 pt-2 pb-1">
                <div className="flex items-center gap-x-1.5"></div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="gap-1">
                      <FormLabel className="flex items-center gap-x-1.5">
                        <span className="text-sm font-medium">Title</span>
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
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mainArtist"
                render={({ field }) => (
                  <FormItem>
                    <div className="bg-main-dark-bg-1 rounded-md border border-white/30 px-3 pt-2 pb-1">
                      <div className="flex items-center gap-x-1.5">
                        <span className="text-sm font-medium">
                          Main Artist(s)
                        </span>
                        <CircleQuestionMarkIcon className="size-3" />
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Credit Main Artist of the track"
                          className="mt-1 border-0 !bg-transparent px-0 text-sm font-semibold outline-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="bg-main-dark-bg-1 rounded-md border border-white/30 px-3 pt-2 pb-1">
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

              <div>
                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Categories
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
              </div>

              <div>
                {/* <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Tags</FormLabel>
  
                      <FormControl>
                        <MultiSelect
                          options={tagsList}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder="Add your desired tags..."
                          maxCount={5}
                          resetOnDefaultValueChange={true}
                        />
                      </FormControl>
  
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Tags
                      </FormLabel>

                      <FormControl>
                        <InputTags
                          value={field.value!}
                          onChange={field.onChange}
                          placeholder="Add your desired tags..."
                        />
                        {/* <MultiSelect
                          options={tagsList}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder="Add your desired tags..."
                          maxCount={5}
                          resetOnDefaultValueChange={true}
                        /> */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Track Cover Section */}
            <div className="w-full max-w-90 space-y-6">
              {/* Cover Image */}
              <div
                {...getCoverRootProps()}
                className={`bg-main-dark-bg-1 flex size-90 cursor-pointer flex-col items-center justify-center gap-y-4 rounded-md border border-dashed transition-colors ${
                  isCoverDragActive
                    ? "border-blue-400 bg-blue-50/10"
                    : "border-white/30"
                }`}
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
                  </>
                )}
              </div>

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

          <div className="mt-32">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
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
