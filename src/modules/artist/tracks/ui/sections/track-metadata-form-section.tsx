"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import InputTags from "@/components/ui/tags-input";
import { Switch } from "@/components/ui/switch";
import { artistTrackDetailOptions, categoriesOptions } from "@/gql/options/artist-options";
import { updateTrackMetadataMutationOptions } from "@/gql/options/artist-mutation-options";
import { toast } from "sonner";
import { SaveIcon, XIcon, GlobeIcon, LockIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TrackMetadataFormSectionProps {
  trackId: string;
  isEditing: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const trackMetadataSchema = z.object({
  description: z.string().optional(),
  categoryIds: z.array(z.string()).min(1, "Please select at least one category"),
  tags: z.array(z.string()).min(1, "Please add at least one tag"),
  isPublic: z.boolean(),
});

type TrackMetadataFormData = z.infer<typeof trackMetadataSchema>;

const TrackMetadataFormSection = ({ trackId, isEditing, onCancel, onSuccess }: TrackMetadataFormSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch track details and categories
  const { data: track, isLoading: trackLoading } = useQuery(artistTrackDetailOptions(trackId));
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(categoriesOptions());

  // Mutation for updating track metadata
  const { mutateAsync: updateTrackMetadata } = useMutation(updateTrackMetadataMutationOptions);

  const form = useForm<TrackMetadataFormData>({
    resolver: zodResolver(trackMetadataSchema),
    defaultValues: {
      description: "",
      categoryIds: [],
      tags: [],
      isPublic: false,
    },
  });

  // Update form when track data loads
  useEffect(() => {
    if (track) {
      form.reset({
        description: track.description || "",
        categoryIds: track.categoryIds || [],
        tags: track.tags || [],
        isPublic: track.releaseInfo?.isRelease || false,
      });
    }
  }, [track, form]);

  const onSubmit = async (data: TrackMetadataFormData) => {
    setIsSubmitting(true);
    try {
      await updateTrackMetadata({
        trackId,
        categoryIds: data.categoryIds,
        description: data.description,
        tags: data.tags,
        isPublic: data.isPublic,
      });

      // Invalidate and refetch track data
      queryClient.invalidateQueries({ queryKey: ["artist-track-detail", trackId] });

      toast.success("Track metadata updated successfully!");
      onSuccess();
    } catch (error) {
      console.error("Failed to update track metadata:", error);
      toast.error("Failed to update track metadata. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (trackLoading || categoriesLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <Skeleton className="mb-2 h-4 w-1/4 rounded-md" />
          <Skeleton className="mb-4 h-10 rounded-md" />

          <Skeleton className="mb-2 h-4 w-1/4 rounded-md" />
          <Skeleton className="mb-4 h-10 rounded-md" />

          <Skeleton className="mb-2 h-4 w-1/4 rounded-md" />
          <Skeleton className="mb-4 h-24 rounded-md" />

          <div className="flex gap-2">
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  const categoryOptions =
    categoriesData?.categories?.items?.map((category) => ({
      value: category.id,
      label: category.name,
    })) || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Public/Private Switch */}
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="bg-muted/10 border-border/30 flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-main-white flex items-center gap-2 text-base">
                  {field.value ? (
                    <>
                      <GlobeIcon className="h-4 w-4" />
                      Public Track
                    </>
                  ) : (
                    <>
                      <LockIcon className="h-4 w-4" />
                      Private Track
                    </>
                  )}
                </FormLabel>
                <FormDescription>
                  {field.value
                    ? "Your track is visible to everyone and can be discovered by listeners."
                    : "Your track is private and only visible to you."}
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={!isEditing} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Categories Field */}
        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-main-white text-sm font-medium">
                Categories<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <MultiSelect
                  options={categoryOptions}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder="Choose music genres..."
                  maxCount={5}
                  resetOnDefaultValueChange={true}
                  disabled={!isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags Field */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-main-white text-sm font-medium">
                Tags<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <InputTags
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Add tags to help people discover your track..."
                  className="border-white/30 !bg-transparent"
                  disabled={!isEditing}
                />
              </FormControl>
              {isEditing && <FormDescription>Hint: Use , or Enter to add tags</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-main-white text-sm font-medium">Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Tell listeners about your track..."
                  className="text-main-white placeholder:text-muted-foreground h-24 resize-none border-white/30 !bg-transparent"
                  disabled={!isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" variant={"ekofy"} disabled={isSubmitting}>
              <SaveIcon className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>

            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              <XIcon className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}

        {/* Help Text */}
        {isEditing && (
          <div className="text-muted-foreground bg-muted/20 rounded-lg p-3 text-xs">
            <p className="mb-1 font-medium">Tips for better discovery:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Choose categories that best represent your music style</li>
              <li>Add relevant tags like mood, instruments, or themes</li>
              <li>Write a compelling description that tells your story</li>
            </ul>
          </div>
        )}
      </form>
    </Form>
  );
};

export default TrackMetadataFormSection;
