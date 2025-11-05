"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, Upload, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useSignUpStore } from "@/store/stores";
import useSignUp from "../../hook/use-sign-up";
import { formatDate } from "@/utils/signup-utils";
import { toast } from "sonner";
import {
  uploadImageToCloudinary,
  validateImageFile,
} from "@/utils/cloudinary-utils";
import { ClientProfileCompletionSectionProps } from "@/types/listener-auth";
import { EkofyLogo } from "@/assets/icons";

const ProfileCompletionSection = ({
  onNext,
  onBack,
  initialData,
}: ClientProfileCompletionSectionProps) => {
  const {
    goToPreviousStep,
    // goToNextStep,
    formData,
    updateFormData,
  } = useSignUpStore();

  // Helper function to normalize date from store
  const normalizeDateFromStore = (
    dateValue: Date | string | undefined,
  ): Date | undefined => {
    if (!dateValue) return undefined;
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === "string") {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
  };

  // Initialize state from global store or initial data
  const [displayName, setDisplayName] = useState(
    initialData?.displayName || formData.displayName || "",
  );
  const [fullName, setFullName] = useState(
    initialData?.fullName || formData.fullName || "",
  );
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    initialData?.dateOfBirth || normalizeDateFromStore(formData.birthDate),
  );
  const [gender, setGender] = useState<"Male" | "Female" | "Other">(
    (initialData?.gender as "Male" | "Female" | "Other") ||
      (formData.gender as "Male" | "Female" | "Other") ||
      "Male",
  );
  const [avatar, setAvatar] = useState<File | null>(
    initialData?.avatar || null,
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    formData.avatarImage || null,
  );
  const [dateError, setDateError] = useState("");

  // Use the signup hook for API calls with auto-navigation to OTP step
  const { signUp, isLoading: isRegistering } = useSignUp(() => {
    // This callback is called when navigation happens automatically
    if (dateOfBirth) {
      onNext({ displayName, fullName, dateOfBirth, gender, avatar });
    }
  });

  // Load data from global state when component mounts or store updates
  useEffect(() => {
    if (formData.displayName) setDisplayName(formData.displayName);
    if (formData.fullName) setFullName(formData.fullName);
    if (formData.birthDate) {
      // Handle both Date objects and string dates from localStorage
      const dateValue = normalizeDateFromStore(formData.birthDate);
      if (dateValue) {
        setDateOfBirth(dateValue);
      }
    }
    if (formData.gender)
      setGender(formData.gender as "Male" | "Female" | "Other");
    // Set avatar URL if exists in store
    if (formData.avatarImage) {
      setAvatarUrl(formData.avatarImage);
      setAvatarPreview(formData.avatarImage);
    }
  }, [formData]);

  // Save profile data to global state on input change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFormData({
        displayName,
        fullName: fullName || displayName,
        birthDate: dateOfBirth,
        gender,
        avatarImage: avatarUrl || undefined,
      });
    }, 300); // Debounce to avoid too many updates

    return () => clearTimeout(timeoutId);
  }, [displayName, fullName, dateOfBirth, gender, avatarUrl, updateFormData]);

  useEffect(() => {
    if (avatar) {
      const url = URL.createObjectURL(avatar);
      setAvatarPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (avatarUrl && !avatar) {
      // Show stored URL if no new file is selected
      setAvatarPreview(avatarUrl);
    } else {
      setAvatarPreview(null);
    }
  }, [avatar, avatarUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate date of birth
    if (!dateOfBirth) {
      setDateError("Date of birth is required");
      return;
    }

    if (dateOfBirth > new Date()) {
      setDateError("Date of birth cannot be in the future");
      return;
    }

    // Check if user is at least 13 years old
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    const dayDiff = today.getDate() - dateOfBirth.getDate();

    // Calculate exact age
    let exactAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      exactAge--;
    }

    if (exactAge < 13) {
      setDateError("You must be at least 13 years old to register");
      return;
    }

    // Clear any previous errors
    setDateError("");

    // Update form data with profile information
    const profileData = {
      displayName,
      fullName: fullName || displayName, // Use displayName as fallback
      birthDate: dateOfBirth,
      gender,
      avatarImage: avatarUrl || undefined, // Add avatar URL to store
    };

    updateFormData(profileData);

    // Prepare complete registration data
    const completeData = { ...formData, ...profileData };

    // Validate required fields
    if (
      !completeData.email ||
      !completeData.password ||
      !completeData.confirmPassword
    ) {
      toast.error("Email and password are required");
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(completeData.fullName)) {
      toast.error("Full name can only contain letters and spaces");
      return;
    }
    if (!completeData.fullName || !completeData.displayName) {
      toast.error("Full name is required");
      return;
    }

    if (!completeData.birthDate || !completeData.gender) {
      toast.error("Date of birth and gender are required");
      return;
    }

    // Additional validation for birthDate to ensure it's a valid Date object
    if (
      !(completeData.birthDate instanceof Date) ||
      isNaN(completeData.birthDate.getTime())
    ) {
      toast.error("Please select a valid date of birth");
      return;
    }

    // Format data for API
    const registerData = {
      email: completeData.email,
      password: completeData.password,
      confirmPassword: completeData.confirmPassword,
      fullName: completeData.fullName,
      birthDate: formatDate(completeData.birthDate),
      gender: completeData.gender,
      displayName: completeData.displayName,
      avatarImage: avatarUrl, // Add avatar image URL
    };

    try {
      await signUp(registerData);
      // Success handling is done in useEffect
    } catch (error) {
      // Error handling is done in useEffect
      // console.error("Registration failed:", error);
      // Error handling is done by the hook
      if (error instanceof Error) {
        toast.error(error.message || "Registration failed. Please try again.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && date > new Date()) {
      setDateError("Date of birth cannot be in the future");
      return;
    }

    // Check age validation on date selection
    if (date) {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const dayDiff = today.getDate() - date.getDate();

      // Calculate exact age
      let exactAge = age;
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        exactAge--;
      }

      if (exactAge < 13) {
        setDateError("You must be at least 13 years old to register");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }

    setDateOfBirth(date);
  };

  const handleBack = () => {
    // Use hook to go back
    goToPreviousStep();
    // Also call the original onBack for component communication
    onBack();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file
    if (!validateImageFile(file, 5)) {
      return;
    }

    setAvatar(file);
    setAvatarUploading(true);

    try {
      // Upload to Cloudinary
      const uploadResult = await uploadImageToCloudinary(file, {
        folder: "listener-avatars",
        tags: ["listener", "avatar"],
      });

      setAvatarUrl(uploadResult.secure_url);
      toast.success("Image uploaded successfully!");

      // Store avatar URL in form data immediately
      updateFormData({ avatarImage: uploadResult.secure_url });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar. Please try again.");
      setAvatar(null);
      setAvatarUrl(null);
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-8 flex items-center text-white transition-colors hover:text-blue-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        {/* Logo and Title - Centered */}
        <div className="mb-12 text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="mr-3 flex items-center justify-center rounded-full">
              <EkofyLogo className="size-[60px]" />
            </div>
            <h1 className="text-primary-gradient text-4xl font-bold">Ekofy</h1>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">Welcome</h2>
          <p className="text-sm text-gray-300">
            We need further information to complete the registration process.
          </p>
        </div>

        <div className="flex items-start justify-center gap-16">
          {/* Avatar Upload Section */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="flex h-64 w-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/30">
                {avatarPreview ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={avatarPreview}
                      width={1000}
                      height={1000}
                      alt="Avatar preview"
                      className="h-full w-full rounded-lg object-cover"
                    />
                    {avatarUploading && (
                      <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black">
                        <div className="text-sm text-white">Uploading...</div>
                      </div>
                    )}
                    {/* Clear button */}
                    <button
                      type="button"
                      onClick={() => {
                        setAvatar(null);
                        setAvatarUrl(null);
                        setAvatarPreview(null);
                        updateFormData({ avatarImage: undefined });
                      }}
                      className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-white">
                      Add avatar image
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={avatarUploading}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              />
            </div>
            <p className="mt-3 max-w-64 text-center text-xs text-gray-400">
              Upload a high-quality image that represents you.
              <br />
              Recommended size 1500x1500px, JPG or PNG, under 5MB
            </p>
          </div>

          {/* Form Section */}
          <div className="max-w-sm flex-1">
            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Full name*
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  maxLength={50}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 50) {
                      setFullName(value);
                    }
                  }}
                  placeholder="Enter your full name"
                  required
                  className="border-gradient-input h-12 w-full text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50"
                />
              </div>

              {/* Display Name Field */}
              <div>
                <label
                  htmlFor="displayName"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Display name*
                </label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  maxLength={50}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 50) {
                      setDisplayName(value);
                    }
                  }}
                  placeholder="Enter your display name"
                  required
                  className="border-gradient-input h-12 w-full text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50"
                />
              </div>

              {/* Date of Birth Field */}
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Date of Birth*
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`border-gradient-input h-12 w-full justify-start text-left font-normal text-white hover:bg-gray-800 ${
                        !dateOfBirth && "text-gray-400"
                      } ${dateError && "border-red-500"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth
                        ? format(dateOfBirth, "dd/MM/yyyy")
                        : "DD/MM/YYYY"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="border-gradient-input w-auto p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={handleDateSelect}
                      disabled={(date) => date > new Date()}
                      captionLayout="dropdown"
                      fromYear={1700}
                      toYear={new Date().getFullYear()}
                      className="rounded-md"
                      classNames={{
                        months: "text-white",
                        month: "space-y-4",
                        caption:
                          "text-white flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium text-white hidden",
                        caption_dropdowns: "flex justify-center gap-2",
                        vhidden: "hidden",
                        dropdown:
                          "bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600",
                        dropdown_month:
                          "bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm min-w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600",
                        dropdown_year:
                          "bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white hover:bg-gray-700 rounded",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1 mt-4",
                        head_row: "flex",
                        head_cell:
                          "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-1",
                        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal text-white hover:bg-gray-700 rounded-md transition-colors cursor-pointer flex items-center justify-center",
                        day_range_end: "day-range-end",
                        day_selected:
                          "bg-blue-600 text-white hover:bg-blue-500",
                        day_today: "bg-gray-700 text-white font-semibold",
                        day_outside: "text-gray-500 opacity-50",
                        day_disabled:
                          "text-gray-500 opacity-30 cursor-not-allowed hover:bg-transparent",
                        day_range_middle:
                          "aria-selected:bg-gray-700 aria-selected:text-white",
                        day_hidden: "invisible",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {dateError && (
                  <p className="mt-1 text-xs text-red-400">{dateError}</p>
                )}
              </div>

              {/* Gender Field */}
              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Gender*
                </label>
                <Select
                  value={gender}
                  onValueChange={(value) =>
                    setGender(value as "Male" | "Female" | "Other")
                  }
                  required
                >
                  <SelectTrigger className="border-gradient-input h-12 w-full text-white">
                    <SelectValue
                      placeholder="Gender"
                      className="text-gray-400"
                    />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem
                      value="Male"
                      className="text-white hover:bg-gray-700"
                    >
                      Male
                    </SelectItem>
                    <SelectItem
                      value="Female"
                      className="text-white hover:bg-gray-700"
                    >
                      Female
                    </SelectItem>
                    <SelectItem
                      value="Other"
                      className="text-white hover:bg-gray-700"
                    >
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Continue Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isRegistering || avatarUploading}
                  className="primary_gradient w-full rounded-md px-4 py-3 font-medium text-white transition duration-300 ease-in-out hover:opacity-90 disabled:opacity-50"
                  size="lg"
                >
                  {avatarUploading
                    ? "Uploading avatar..."
                    : isRegistering
                      ? "Creating Account..."
                      : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionSection;
