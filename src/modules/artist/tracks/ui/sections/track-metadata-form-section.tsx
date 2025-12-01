"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import InputTags from "@/components/ui/tags-input";
import { artistTrackDetailOptions, categoriesOptions } from "@/gql/options/artist-options";
import { updateTrackMetadataMutationOptions } from "@/gql/options/artist-mutation-options";
import { toast } from "sonner";
import { SaveIcon, XIcon } from "lucide-react";

interface TrackMetadataFormSectionProps {
  trackId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const trackMetadataSchema = z.object({
  description: z.string().optional(),
  categoryIds: z.array(z.string()).min(1, "Please select at least one category"),
  tags: z.array(z.string()).min(1, "Please add at least one tag"),
});

type TrackMetadataFormData = z.infer<typeof trackMetadataSchema>;

const TrackMetadataFormSection = ({ trackId, onCancel, onSuccess }: TrackMetadataFormSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch track details and categories
  const { data: track, isLoading: trackLoading } = useQuery(artistTrackDetailOptions(trackId));
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(categoriesOptions);

  // Mutation for updating track metadata
  const { mutateAsync: updateTrackMetadata } = useMutation(updateTrackMetadataMutationOptions);

  const form = useForm<TrackMetadataFormData>({
    resolver: zodResolver(trackMetadataSchema),
    defaultValues: {
      description: "",
      categoryIds: [],
      tags: [],
    },
  });

  // Update form when track data loads
  useEffect(() => {
    if (track) {
      form.reset({
        description: track.description || "",
        categoryIds: track.categoryIds || [],
        tags: track.tags || [],
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
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2" />
          <div className="h-10 bg-gray-300 rounded mb-4" />
          
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2" />
          <div className="h-10 bg-gray-300 rounded mb-4" />
          
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2" />
          <div className="h-24 bg-gray-300 rounded mb-4" />
          
          <div className="flex gap-2">
            <div className="h-10 bg-gray-300 rounded w-20" />
            <div className="h-10 bg-gray-300 rounded w-20" />
          </div>
        </div>
      </div>
    );
  }

  const categoryOptions = categoriesData?.categories?.items?.map((category) => ({
    value: category.id,
    label: category.name,
  })) || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Categories Field */}
        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-main-white">
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
                  className="bg-transparent border-white/30"
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
              <FormLabel className="text-sm font-medium text-main-white">
                Tags<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <InputTags
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Add tags to help people discover your track..."
                />
              </FormControl>
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
              <FormLabel className="text-sm font-medium text-main-white">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Tell listeners about your track..."
                  className="h-24 resize-none bg-transparent border-white/30 text-main-white placeholder:text-muted-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            <SaveIcon className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            <XIcon className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
          <p className="font-medium mb-1">Tips for better discovery:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Choose categories that best represent your music style</li>
            <li>Add relevant tags like mood, instruments, or themes</li>
            <li>Write a compelling description that tells your story</li>
          </ul>
        </div>
      </form>
    </Form>
  );
};

export default TrackMetadataFormSection;