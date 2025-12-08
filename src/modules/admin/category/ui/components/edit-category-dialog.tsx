"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, X } from "lucide-react";
import { useUpdateCategoryMutation } from "@/gql/client-mutation-options/category-mutation-options";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/category";
import { CategoryType } from "@/gql/graphql";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required").max(100, "Name is too long"),
  slug: z.string().optional(),
  type: z.string().min(1, "Category type is required"),
  description: z.string().optional(),
  isVisible: z.boolean(),
  aliases: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSuccess?: () => void;
}

export function EditCategoryDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: EditCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aliasInput, setAliasInput] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      type: "GENRE",
      description: "",
      isVisible: true,
      aliases: [],
    },
  });

  const updateMutation = useUpdateCategoryMutation();

  // Update form when category changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug || "",
        type: category.type,
        description: category.description || "",
        isVisible: category.isVisible,
        aliases: category.aliases || [],
      });
    }
  }, [category, form]);

  const onSubmit = async (values: FormValues) => {
    if (!category) return;

    setIsSubmitting(true);

    // Map string type to CategoryType enum
    const getCategoryType = (type: string): CategoryType | undefined => {
      if (type === "GENRE") return CategoryType.Genre;
      if (type === "MOOD") return CategoryType.Mood;
      return undefined;
    };

    updateMutation.mutate(
      {
        categoryId: category.id,
        name: values.name !== category.name ? values.name : undefined,
        description: values.description !== category.description ? values.description : undefined,
        type: values.type !== category.type ? getCategoryType(values.type) : undefined,
        isVisible: values.isVisible !== category.isVisible ? values.isVisible : undefined,
        aliases: JSON.stringify(values.aliases) !== JSON.stringify(category.aliases) ? values.aliases : undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleAddAlias = () => {
    if (aliasInput.trim()) {
      const currentAliases = form.getValues("aliases");
      if (!currentAliases.includes(aliasInput.trim())) {
        form.setValue("aliases", [...currentAliases, aliasInput.trim()]);
        setAliasInput("");
      }
    }
  };

  const handleRemoveAlias = (alias: string) => {
    const currentAliases = form.getValues("aliases");
    form.setValue(
      "aliases",
      currentAliases.filter((a) => a !== alias)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAlias();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category information below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category Name<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Rock, Pop, Jazz" {...field} />
                  </FormControl>
                  <FormDescription>
                    The display name for this category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="URL-friendly version" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL-friendly version of the name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category Type<span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GENRE">Genre</SelectItem>
                      <SelectItem value="MOOD">Mood</SelectItem>
                      <SelectItem value="ACTIVITY">Activity</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type classification for this category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this category..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description for this category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aliases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aliases</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an alias and press Enter"
                      value={aliasInput}
                      onChange={(e) => setAliasInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAddAlias}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((alias) => (
                        <Badge key={alias} variant="secondary" className="gap-1">
                          {alias}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => handleRemoveAlias(alias)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                  <FormDescription>
                    Alternative names for this category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Visibility</FormLabel>
                    <FormDescription>
                      Make this category visible to users
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Category
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
