import { LockIcon } from "lucide-react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlaylistMutationOptions } from "@/gql/options/client-mutation-options";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

// Zod schema for form validation
const createPlaylistFormSchema = z.object({
  name: z
    .string()
    .min(3, "Playlist name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  isPublic: z.boolean(),
  coverImage: z.string(),
});

const editPlaylistFormSchema = z.object({
  name: z
    .string()
    .min(3, "Playlist name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
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

  // TODO: Add update playlist mutation when available
  // const { mutate: updatePlaylist, isPending: isUpdating } = useMutation({
  //   ...updatePlaylistMutationOptions,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["playlists"] });
  //     queryClient.invalidateQueries({ queryKey: ["playlist-detail", initialData?.id] });
  //     onOpenChange(false);
  //     onSuccess?.();
  //     toast.success("Playlist updated successfully!");
  //   },
  //   onError: (error) => {
  //     console.error("Failed to update playlist:", error);
  //     toast.error("Failed to update playlist. Please try again.");
  //   },
  // });

  const form = useForm<PlaylistFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      isPublic: initialData?.isPublic ?? true,
      coverImage: initialData?.coverImage || "https://placehold.co/280",
    },
  });

  const isPending = isCreating; // || isUpdating when update is available

  const onSubmit = (values: PlaylistFormValues) => {
    if (mode === "create") {
      createPlaylist({
        name: values.name,
        isPublic: values.isPublic,
        coverImage: values.coverImage,
        description: values.description || "",
      });
    } else {
      // TODO: Implement update when mutation is available
      // updatePlaylist({
      //   id: initialData?.id,
      //   name: values.name,
      //   isPublic: values.isPublic,
      //   coverImage: values.coverImage,
      //   description: values.description || "",
      // });
      toast.info("Update functionality will be available soon!");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen && mode === "create") {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger}
      <DialogContent className="w-full sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEdit ? "Edit playlist" : "Create playlist"}
          </DialogTitle>
          <DialogDescription className="text-main-grey">
            {isEdit
              ? "Modify your playlist details"
              : "Create a playlist to save your favorite songs"}
          </DialogDescription>
        </DialogHeader>

        <Separator className="-mx-6 mb-4 bg-neutral-700 data-[orientation=horizontal]:w-[calc(100%+48px)]" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-y-4"
          >
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

            {/* Playlist name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main-white text-sm">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Playlist name" {...field} />
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
                          <span className="text-main-grey text-xs">
                            Only you can access this playlist
                          </span>
                        </FormLabel>
                      </div>
                    </div>

                    <FormControl>
                      <Switch
                        checked={!field.value}
                        onCheckedChange={(checked) => field.onChange(!checked)}
                      />
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
                    Description{" "}
                    {!isEdit && <span className="text-red-400">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        isEdit
                          ? "Playlist description (optional)"
                          : "Playlist description"
                      }
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
                <Button
                  variant={"ghost"}
                  type="button"
                  onClick={() => mode === "create" && form.reset()}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-main-purple hover:bg-main-purple/90 text-main-white"
              >
                {isPending
                  ? isEdit
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
