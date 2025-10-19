
"use client";

import React from "react";
import DetailItem from "../components/detail-item";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useClientProfile } from "../../hook/use-client-profile";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateListenerProfileMutationOptions } from "@/gql/options/client-mutation-options";
import { toast } from "sonner";

const PersonalDetailSection = () => {
  const queryClient = useQueryClient();
  const { personal } = useClientProfile();
  const [isEditing, setIsEditing] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const formSchema = z.object({
    displayName: z.string().min(1, "Display name is required").max(100),
    // Email is immutable here; keep for display only
    email: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER", "NOT_SPECIFIED"]).optional(),
    birthDate: z.string().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: personal.displayName || "",
      email: personal.email || "",
      birthDate: personal.birthDate || "",
      gender: (personal.gender ?? "NOT_SPECIFIED") as FormValues["gender"],
    },
  });

  React.useEffect(() => {
    // keep defaults in sync when profile loads/changes
    form.reset({
      displayName: personal.displayName || "",
      email: personal.email || "",
      birthDate: personal.birthDate || "",
      gender: (personal.gender ?? "NOT_SPECIFIED") as FormValues["gender"],
    });
  }, [form, personal.displayName, personal.email, personal.birthDate, personal.gender]);

  const { mutate: updateProfile, isPending } = useMutation({
    ...updateListenerProfileMutationOptions,
    onSuccess: () => {
      toast.success("Profile updated");
      setConfirmOpen(false);
      setIsEditing(false);
      // Refresh listener profile query
      queryClient.invalidateQueries({ queryKey: ["listener-profile"] });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to update profile. Please try again.");
    },
  });

  const onSubmit = () => {
    // Only displayName is updated; confirm before saving
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    const values = form.getValues();
    updateProfile({
      displayName: values.displayName,
      // Email cannot be changed in this flow
      // Gender and birthDate aren’t part of UpdateListenerRequestInput; backend handles those on User.
    });
  };
  return (
    <div className="w-full ">
      <div className="flex items-end gap-x-3 justify-between">
        <h2 className="text-xl font-bold">Personal Details</h2>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                form.reset();
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  className="bg-main-purple hover:bg-main-purple/90"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm update</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to update your personal details?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
                    {isPending ? "Updating..." : "Confirm"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="iconSm"
            aria-label="Edit personal details"
            title="Edit personal details"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="size-4" />
          </Button>
        )}
      </div>

      <div className="w-full mt-6 md:mt-12 md:mb-12">
        {/* Display name row: editable */}
        <div className="py-2">
          {isEditing ? (
            <Form {...form}>
              <form className="grid grid-cols-1 gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your display name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          ) : (
            <DetailItem title="Display name" value={personal.displayName || "-"} />
          )}
        </div>

        {/* Read-only rows */}
        <DetailItem title="Email" value={personal.email || "-"} />
        <DetailItem title="Date of Birth" value={personal.birthDate || "-"} />
        <DetailItem title="Gender" value={personal.gender || "-"} />
      </div>
    </div>
  );
};

export default PersonalDetailSection;
