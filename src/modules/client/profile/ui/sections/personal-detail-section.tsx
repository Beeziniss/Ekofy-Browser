"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, differenceInYears } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateListenerProfileMutationOptions } from "@/gql/options/client-mutation-options";
import { toast } from "sonner";
import type { UserGender } from "@/gql/graphql";
import DetailItem from "../components/detail-item";

interface PersonalDetailSectionProps {
  personal: {
    readonly displayName: string;
    readonly email: string;
    readonly birthDate: string | undefined;
    readonly gender: UserGender | undefined;
  };
  userId?: string;
}

const PersonalDetailSection = ({ personal, userId }: PersonalDetailSectionProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const formSchema = z
    .object({
      displayName: z.string().min(1, "Display name is required").max(100),
      // Email is immutable here; keep for display only
      email: z.string().optional(),
      // Only allow explicit gender options; omit NOT_SPECIFIED from choices
      gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
      birthDate: z.date(),
    })
    // Must not be in the future
    .refine((data) => !data.birthDate || data.birthDate <= new Date(), {
      message: "Birthdate cannot be in the future",
      path: ["birthDate"],
    })
    // Must be at least 13 years old (same rule as sign up)
    .refine((data) => !data.birthDate || differenceInYears(new Date(), data.birthDate) >= 13, {
      message: "You must be at least 13 years old",
      path: ["birthDate"],
    });

  type FormValues = z.infer<typeof formSchema>;

  const isExplicitGender = (g?: UserGender | string | undefined): g is "MALE" | "FEMALE" | "OTHER" =>
    g === "MALE" || g === "FEMALE" || g === "OTHER";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: personal.displayName || "",
      email: personal.email || "",
      birthDate: personal.birthDate ? new Date(personal.birthDate) : undefined,
      gender: isExplicitGender(personal.gender) ? (personal.gender as FormValues["gender"]) : undefined,
    },
  });

  React.useEffect(() => {
    // keep defaults in sync when profile loads/changes
    form.reset({
      displayName: personal.displayName || "",
      email: personal.email || "",
      birthDate: personal.birthDate ? new Date(personal.birthDate) : undefined,
      gender: isExplicitGender(personal.gender) ? (personal.gender as FormValues["gender"]) : undefined,
    });
  }, [form, personal.displayName, personal.email, personal.birthDate, personal.gender]);

  const { mutate: updateProfile, isPending } = useMutation({
    ...updateListenerProfileMutationOptions,
    onSuccess: (_data, variables) => {
      toast.success("Profile updated");
      setConfirmOpen(false);
      setIsEditing(false);
      // Optimistically update the listener profile cache for immediate UI reflection
      if (userId) {
        type ListenerCache = {
          displayName?: string;
          user?: Array<{ birthDate?: string; gender?: UserGender }> | null;
          [k: string]: unknown;
        } | null;
        queryClient.setQueryData<ListenerCache>(["listener-profile", userId], (old) => {
          if (!old) return old;
          return {
            ...old,
            displayName: variables.displayName ?? old.displayName,
            user:
              Array.isArray(old.user) && old.user.length > 0
                ? [
                    {
                      ...old.user[0],
                      birthDate: (variables.birthDate as string | undefined) ?? old.user[0]?.birthDate,
                      gender: (variables.gender as UserGender | undefined) ?? old.user[0]?.gender,
                    },
                  ]
                : old.user,
          } as ListenerCache;
        });
      }
      // Refresh listener profile query
      queryClient.invalidateQueries({ queryKey: ["listener-profile", userId] });
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
    // Ensure DateTime is sent as full ISO string at UTC midnight to avoid timezone shifting
    const birthDateIso = values.birthDate
      ? new Date(
          Date.UTC(values.birthDate.getFullYear(), values.birthDate.getMonth(), values.birthDate.getDate()),
        ).toISOString()
      : undefined;
    updateProfile({
      displayName: values.displayName,
      // Newly supported fields on backend
      gender: values.gender as unknown as UserGender,
      birthDate: birthDateIso,
    });
  };
  // Read-only display helpers: humanize gender and format birthdate in DD-MM-YYYY.
  const readOnlyGenderLabel = (() => {
    switch (personal.gender as unknown as string) {
      case "MALE":
        return "Male";
      case "FEMALE":
        return "Female";
      case "OTHER":
        return "Other";
      default:
        return "-";
    }
  })();

  const readOnlyBirthDateLabel: string = (() => {
    if (!personal.birthDate) return "-";
    try {
      return format(new Date(personal.birthDate), "dd-MM-yyyy");
    } catch {
      return "-";
    }
  })();

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-x-3">
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

      <div className="mt-6 w-full md:mt-12 md:mb-12">
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

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Birthdate */}
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "dd-MM-yyyy") : <span>DD-MM-YYYY</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            captionLayout="dropdown"
                            startMonth={new Date(1900, 0)}
                            endMonth={new Date(new Date().getFullYear(), 0)}
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
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

        {/* Read-only rows when not editing; when editing, fields above */}
        {!isEditing && (
          <>
            <DetailItem title="Email" value={personal.email || "-"} />
            <DetailItem title="Date of Birth" value={readOnlyBirthDateLabel} />
            <DetailItem title="Gender" value={readOnlyGenderLabel} />
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalDetailSection;
