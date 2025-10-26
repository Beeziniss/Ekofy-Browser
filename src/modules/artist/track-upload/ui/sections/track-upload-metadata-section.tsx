"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTrackUploadStore } from "@/store";
import {
  CircleQuestionMarkIcon,
  Copy,
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
  userLicenseOptions,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Plus,
  Trash2,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  mainArtist: z.string().optional(),
  categoryIds: z
    .array(z.string())
    .min(1, { message: "Please select at least one category." }),
  tags: z.array(z.string()).optional(),
  isReleased: z.boolean(),
  releaseDate: z.date().optional(),
  coverImage: z.instanceof(File).optional(),
  isExplicit: z.boolean(),
  isOriginal: z.boolean(),
  legalDocuments: z.array(
    z.object({
      documentType: z.string(),
      documentUrl: z.string(),
      name: z.string(),
      note: z.string().optional(),
    }),
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
});

type FormData = z.infer<typeof FormSchema>;

interface User {
  id: string;
  fullName: string;
}

interface UserComboboxProps {
  users: User[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const UserCombobox = ({
  users,
  value,
  onChange,
  placeholder = "Select user...",
}: UserComboboxProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-8 w-full justify-between"
        >
          {value
            ? users?.find((user) => user.id === value)?.fullName ||
              "Unknown User"
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search users..." className="h-9" />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users?.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {user.fullName}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === user.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

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
  users: User[],
  currentUserId?: string,
) => {
  if (userId === currentUserId) return "You";
  const user = users?.find((u) => u.id === userId);
  return user?.fullName || "Unknown User";
};

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
  const [workSplits, setWorkSplits] = useState([
    {
      userId: user?.userId || "",
      artistRole: ArtistRole.Main,
      percentage: 100,
    },
  ]);
  const [recordingSplits, setRecordingSplits] = useState([
    {
      userId: user?.userId || "",
      artistRole: ArtistRole.Main,
      percentage: 100,
    },
  ]);
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
  minDate.setDate(minDate.getDate() + 3);

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

  // Fetch users for splits selection
  const { data: usersData } = useQuery(userLicenseOptions);

  // Upload track mutation
  const uploadTrackMutation = useMutation(trackUploadMutationOptions);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      mainArtist: "",
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

  async function onSubmit(data: FormData) {
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
          releaseStatus: ReleaseStatus.NotAnnounced,
          isOriginal: data.isOriginal,
          mainArtistIds: [], // Empty for now as per your example
          featuredArtistIds: [], // Empty for now as per your example
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
        mainArtist: "",
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
      // Reset splits to default
      setWorkSplits([
        {
          userId: user?.userId || "",
          artistRole: ArtistRole.Main,
          percentage: 100,
        },
      ]);
      setRecordingSplits([
        {
          userId: user?.userId || "",
          artistRole: ArtistRole.Main,
          percentage: 100,
        },
      ]);
      setLegalDocuments([
        {
          documentType: DocumentType.License,
          documentUrl: "",
          name: "",
          note: "",
        },
      ]);
      // Set a placeholder URL based on track name
      if (typeof window !== "undefined") {
        setTrackUrl(
          `${window.location.origin}/track/${displayTrack.id || "pending"}`,
        );
      }
    }
  }, [displayTrack, form, user]);

  // Sync form with state variables for validation
  useEffect(() => {
    form.setValue("workSplits", workSplits);
  }, [workSplits, form]);

  useEffect(() => {
    form.setValue("recordingSplits", recordingSplits);
  }, [recordingSplits, form]);

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

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="releaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Release Date
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                field.value.toLocaleDateString()
                              ) : (
                                <span>Pick a release date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < minDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
                    <div>
                      <p className="text-main-white mb-2 text-xs font-bold">
                        Legal Documents
                      </p>
                      <p className="text-main-grey-dark-1 mb-4 text-xs font-normal">
                        Upload legal documents such as licenses, contracts, or
                        other relevant files.
                      </p>

                      <div className="space-y-4">
                        {legalDocuments.map((doc, index) => (
                          <div
                            key={index}
                            className="space-y-3 rounded-md border border-white/20 p-4"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-white">
                                Document {index + 1}
                              </h4>
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
                                    newDocs[index].documentType =
                                      value as DocumentType;
                                    setLegalDocuments(newDocs);
                                  }}
                                >
                                  <SelectTrigger size="sm">
                                    <SelectValue
                                      className="h-8"
                                      placeholder="Select type"
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={DocumentType.License}>
                                      License
                                    </SelectItem>
                                    <SelectItem value={DocumentType.Contract}>
                                      Contract
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs">Document Name</Label>
                                <Input
                                  placeholder="Enter document name"
                                  value={doc.name}
                                  onChange={(e) => {
                                    const newDocs = [...legalDocuments];
                                    newDocs[index].name = e.target.value;
                                    setLegalDocuments(newDocs);
                                  }}
                                  className="h-8"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs">Document URL</Label>
                              <Input
                                placeholder="Enter document URL"
                                value={doc.documentUrl}
                                onChange={(e) => {
                                  const newDocs = [...legalDocuments];
                                  newDocs[index].documentUrl = e.target.value;
                                  setLegalDocuments(newDocs);
                                }}
                                className="h-8"
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs">Note (Optional)</Label>
                              <Input
                                placeholder="Add a note about this document"
                                value={doc.note}
                                onChange={(e) => {
                                  const newDocs = [...legalDocuments];
                                  newDocs[index].note = e.target.value;
                                  setLegalDocuments(newDocs);
                                }}
                                className="h-8"
                              />
                            </div>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setLegalDocuments([
                              ...legalDocuments,
                              {
                                documentType: DocumentType.License,
                                documentUrl: "",
                                name: "",
                                note: "",
                              },
                            ]);
                          }}
                          className="w-full"
                        >
                          <Plus className="mr-2 size-4" />
                          Add Document
                        </Button>
                      </div>
                    </div>
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
                      </p>

                      <div className="space-y-3">
                        {workSplits.map((split, index) => (
                          <div
                            key={index}
                            className="rounded-md border border-white/20 p-3"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-white">
                                {getUserDisplayName(
                                  split.userId,
                                  usersData?.users?.items || [],
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
                                  onClick={() => {
                                    const newSplits = redistributePercentages(
                                      workSplits,
                                      index,
                                    );
                                    setWorkSplits(newSplits);
                                  }}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              )}
                            </div>
                            {workSplits.length > 1 && (
                              <div className="grid grid-cols-3 gap-2">
                                <UserCombobox
                                  users={usersData?.users?.items || []}
                                  value={split.userId}
                                  onChange={(value) => {
                                    const newSplits = [...workSplits];
                                    newSplits[index].userId = value;
                                    setWorkSplits(newSplits);
                                  }}
                                  placeholder="Select user"
                                />
                                <Select
                                  value={split.artistRole}
                                  onValueChange={(value) => {
                                    const newSplits = [...workSplits];
                                    newSplits[index].artistRole =
                                      value as ArtistRole;
                                    setWorkSplits(newSplits);
                                  }}
                                >
                                  <SelectTrigger size="sm">
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
                        ))}

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

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newSplits = [
                              ...workSplits,
                              {
                                userId: "",
                                artistRole: ArtistRole.Featured,
                                percentage: 0,
                              },
                            ];
                            // Auto-distribute percentages equally
                            const redistributed =
                              redistributePercentages(newSplits);
                            setWorkSplits(redistributed);
                          }}
                          className="w-full"
                        >
                          <Plus className="mr-2 size-4" />
                          Add Work Split
                        </Button>
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
                      </p>

                      <div className="space-y-3">
                        {recordingSplits.map((split, index) => (
                          <div
                            key={index}
                            className="rounded-md border border-white/20 p-3"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-white">
                                {getUserDisplayName(
                                  split.userId,
                                  usersData?.users?.items || [],
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
                                  onClick={() => {
                                    const newSplits = redistributePercentages(
                                      recordingSplits,
                                      index,
                                    );
                                    setRecordingSplits(newSplits);
                                  }}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              )}
                            </div>
                            {recordingSplits.length > 1 && (
                              <div className="grid grid-cols-3 gap-2">
                                <UserCombobox
                                  users={usersData?.users?.items || []}
                                  value={split.userId}
                                  onChange={(value) => {
                                    const newSplits = [...recordingSplits];
                                    newSplits[index].userId = value;
                                    setRecordingSplits(newSplits);
                                  }}
                                  placeholder="Select user"
                                />
                                <Select
                                  value={split.artistRole}
                                  onValueChange={(value) => {
                                    const newSplits = [...recordingSplits];
                                    newSplits[index].artistRole =
                                      value as ArtistRole;
                                    setRecordingSplits(newSplits);
                                  }}
                                >
                                  <SelectTrigger size="sm">
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
                        ))}

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

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newSplits = [
                              ...recordingSplits,
                              {
                                userId: "",
                                artistRole: ArtistRole.Featured,
                                percentage: 0,
                              },
                            ];
                            // Auto-distribute percentages equally
                            const redistributed =
                              redistributePercentages(newSplits);
                            setRecordingSplits(redistributed);
                          }}
                          className="w-full"
                        >
                          <Plus className="mr-2 size-4" />
                          Add Recording Split
                        </Button>
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
