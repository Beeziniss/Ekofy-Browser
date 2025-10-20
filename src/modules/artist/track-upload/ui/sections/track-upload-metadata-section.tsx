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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { toast } from "sonner";
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

const FormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  categoryIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isReleased: z.boolean(),
});

const categoriesList = [
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "hip-hop", label: "Hip-Hop" },
  { value: "electronic", label: "Electronic" },
  { value: "jazz", label: "Jazz" },
  { value: "blues", label: "Blues" },
  { value: "country", label: "Country" },
  { value: "classical", label: "Classical" },
  { value: "reggae", label: "Reggae" },
  { value: "folk", label: "Folk" },
  { value: "r&b", label: "R&B" },
  { value: "alternative", label: "Alternative" },
  { value: "indie", label: "Indie" },
  { value: "metal", label: "Metal" },
  { value: "funk", label: "Funk" },
];

const tagsList = [
  { value: "chill", label: "Chill" },
  { value: "party", label: "Party" },
];

const TrackUploadMetadataSection = () => {
  const { currentUpload, uploadedTracks } = useTrackUploadStore();
  const [displayTrack, setDisplayTrack] = useState(currentUpload);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      categoryIds: [],
      tags: [],
      isReleased: false,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
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

  // TODO: Need to modify with correct data
  // Reset form values when displayTrack changes
  useEffect(() => {
    if (displayTrack) {
      form.reset({
        title: displayTrack.metadata.title || "",
        categoryIds: [],
        tags: [],
        isReleased: false,
      });
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
          <span className="text-main-white flex-1 text-sm">Link</span>
          <Copy className="text-main-white hover:text-main-white/80 ml-2 size-4 cursor-pointer" />
        </div>
      </div>

      {/* Track Metadata */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-8 flex w-full items-start justify-between"
        >
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

            <div className="bg-main-dark-bg-1 rounded-md border border-white/30 px-3 pt-2 pb-1">
              <div className="flex items-center gap-x-1.5">
                <span className="text-sm font-medium">Main Artist(s)</span>
                <CircleQuestionMarkIcon className="size-3" />
              </div>

              <Input
                type="text"
                placeholder="Credit Main Artist of the track"
                className="mt-1 border-0 !bg-transparent px-0 text-sm font-semibold outline-none focus:ring-0 focus:outline-none focus-visible:ring-0"
              />
            </div>

            <div className="bg-main-dark-bg-1 rounded-md border border-white/30 px-3 pt-2 pb-1">
              <div className="flex items-center gap-x-1.5">
                <span className="text-sm font-medium">Description</span>
                <CircleQuestionMarkIcon className="size-3" />
              </div>

              <Textarea
                placeholder="Description will get you more views"
                className="mt-1 h-24 w-full resize-none border-0 !bg-transparent px-0 text-sm font-semibold outline-none focus:ring-0 focus:outline-none focus-visible:ring-0"
              />
            </div>

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
                        options={categoriesList}
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
              <FormField
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
              />
            </div>
          </div>

          {/* Track Cover Section */}
          <div className="w-full max-w-90 space-y-6">
            {/* Cover Image */}
            <div className="bg-main-dark-bg-1 flex size-90 flex-col items-center justify-center gap-y-4 rounded-md border border-dashed border-white/30">
              <ImageIcon className="text-main-white size-25 stroke-1" />
              <span className="text-main-white text-sm">Add track cover</span>
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
            className="primary_gradient text-main-white fixed right-8 bottom-[11px] z-10 h-[42px] rounded-full px-18 py-3 text-sm font-semibold hover:brightness-90"
          >
            Upload
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TrackUploadMetadataSection;
