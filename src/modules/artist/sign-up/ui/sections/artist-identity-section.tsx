"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useArtistSignUpStore } from "@/store/stores/artist-signup-store";
import useArtistSignUp from "../../hooks/use-artist-sign-up";
import { convertArtistStoreDataToAPIFormat } from "@/utils/signup-utils";
import { toast } from "sonner";
import {
  uploadImageToCloudinary,
  validateImageFile,
} from "@/utils/cloudinary-utils";
import { useRouter } from "next/navigation";
import {
  ArtistIdentityData,
  ArtistSignUpSectionProps,
} from "@/types/artist_type";
import { EkofyLogo } from "@/assets/icons";

type ArtistIdentitySectionProps =
  ArtistSignUpSectionProps<ArtistIdentityData> & {
    onBack: () => void;
  };

const ArtistIdentitySection = ({
  onNext,
  onBack,
  initialData,
}: ArtistIdentitySectionProps) => {
  const router = useRouter();
  const {
    formData,
    sessionData,
    updateFormData,
    goToNextStep,
    resetForm,
    clearSessionData,
  } = useArtistSignUpStore();

  // Handle navigation to login after successful registration
  const handleNavigateToLogin = () => {
    // Clear all global state data after successful registration
    resetForm();
    clearSessionData();
    router.push("/artist/login");
  };

  const { signUp, isLoading } = useArtistSignUp(handleNavigateToLogin);

  // Initialize state from global store or initial data
  // const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<File | null>(
    initialData?.avatarImage || null,
  );
  const [avatarImagePreview, setAvatarImagePreview] = useState<string | null>(
    null,
  );
  const [stageName, setStageName] = useState(
    initialData?.stageName || formData.stageName || "",
  );
  // const [coverUploading, setCoverUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  // const [coverImageUrl, setCoverImageUrl] = useState<string | null>(formData.avatarImage || null);
  const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(
    formData.avatarImage || null,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load data from global state when component mounts or store updates
  useEffect(() => {
    if (formData.stageName) setStageName(formData.stageName);
    if (formData.avatarImage) {
      setAvatarImageUrl(formData.avatarImage);
      setAvatarImagePreview(formData.avatarImage);
    }
  }, [formData]);

  // Save form data to global state on input change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFormData({
        stageName,
        avatarImage: avatarImageUrl || undefined,
      });
    }, 300); // Debounce to avoid too many updates

    return () => clearTimeout(timeoutId);
  }, [stageName, avatarImageUrl, updateFormData]);

  useEffect(() => {
    if (avatarImage) {
      const url = URL.createObjectURL(avatarImage);
      setAvatarImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (avatarImageUrl && !avatarImage) {
      // Show stored URL if no new file is selected
      setAvatarImagePreview(avatarImageUrl);
    } else {
      setAvatarImagePreview(null);
    }
  }, [avatarImage, avatarImageUrl]);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    // if (!coverImage) {
    //   newErrors.coverImage = "Vui lòng tải lên ảnh bìa";
    // }

    if (!stageName.trim()) {
      newErrors.stageName = "Please enter your stage name";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Update store with identity data
      const identityData = {
        stageName: stageName.trim(),
        avatarImage: avatarImageUrl || undefined, // Add avatar image URL to store
      };

      updateFormData(identityData);

      // Check artist type to determine next action
      if (formData.artistType === "INDIVIDUAL") {
        // Check if password exists in session data before attempting registration
        if (!sessionData.password || !sessionData.confirmPassword) {
          toast.error(
            "Password information is missing. Please go back to the first step and re-enter your password.",
          );
          // Navigate back to form step to re-enter password
          // router.push('/artist/sign-up');
          return;
        }

        try {
          // Combine current formData with new identity data and session data (including password)
          const combinedData = {
            ...formData,
            ...sessionData, // Include password from session data
            ...identityData,
          };
          // Convert store data to API format for registration
          const registrationData = convertArtistStoreDataToAPIFormat({
            ...combinedData,
            avatarImage: avatarImageUrl || undefined, // Add avatar image URL
          });

          // Call registration API
          signUp(registrationData);

          // Registration will redirect to login on success via hook
        } catch (error) {
          console.error("❌ Registration error:", error);
          if (error instanceof Error) {
            // Check if error is related to missing password and redirect accordingly
            if (error.message.includes("password")) {
              toast.error(
                "Password information is missing. Please go back to the first step and re-enter your password.",
              );
              // router.push('/artist/sign-up');
              return;
            }
            toast.error(error.message);
          } else {
            toast.error("An error occurred. Please try again.");
          }
        }
      } else {
        goToNextStep(identityData);
      }

      // Also call the original onNext for backward compatibility
      onNext({
        // coverImage,
        stageName,
        avatarImage,
      });
    }
  };

  // const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   // Validate the file
  //   if (!validateImageFile(file, 5)) {
  //     return;
  //   }

  //   // setCoverImage(file);
  //   setCoverUploading(true);

  //   try {
  //     // Upload to Cloudinary
  //     const uploadResult = await uploadImageToCloudinary(file, {
  //       folder: 'artist-covers',
  //       tags: ['artist', 'cover']
  //     });

  //     setCoverImageUrl(uploadResult.secure_url);
  //     toast.success('Tải ảnh bìa lên thành công!');
  //   } catch (error) {
  //     console.error('Error uploading cover image:', error);
  //     toast.error('Error uploading cover image. Please try again.');
  //     // setCoverImage(null);
  //     setCoverImageUrl(null);
  //   } finally {
  //     setCoverUploading(false);
  //   }
  // };

  const handleAvatarImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file
    if (!validateImageFile(file, 5)) {
      return;
    }

    setAvatarImage(file);
    setAvatarUploading(true);

    try {
      // Upload to Cloudinary
      const uploadResult = await uploadImageToCloudinary(file, {
        folder: "artist-avatars",
        tags: ["artist", "avatar"],
      });

      setAvatarImageUrl(uploadResult.secure_url);
      toast.success("Profile picture uploaded successfully!");

      // Store avatar URL in form data immediately
      updateFormData({ avatarImage: uploadResult.secure_url });
    } catch (error) {
      console.error("Error uploading avatar image:", error);
      toast.error("Error uploading profile image. Please try again.");
      setAvatarImage(null);
      setAvatarImageUrl(null);
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] px-6 py-12">
      <div className="w-full max-w-6xl">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-white transition-colors hover:text-blue-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="mr-3 flex items-center justify-center rounded-full">
              <EkofyLogo className="size-[60px]" />
            </div>
            <h1 className="text-primary-gradient text-4xl font-bold">Ekofy</h1>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">
            Define Your Identity
          </h2>
          <p className="mb-8 text-sm text-gray-300">
            Choose a stage name that represents you or your band.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Left Side - Avatar Image Upload */}
          <div>
            <label className="mb-4 block text-sm font-medium text-white">
              Add avatar image
            </label>
            <div className="relative w-full">
              <div
                className={`h-64 w-full border-2 border-dashed ${errors.avatarImage ? "border-red-500" : "border-gray-600"} flex cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-800/30 transition-colors hover:border-gray-500`}
              >
                {avatarImagePreview ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={avatarImagePreview}
                      width={1000}
                      height={1000}
                      alt="Avatar Preview"
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
                        setAvatarImage(null);
                        setAvatarImageUrl(null);
                        setAvatarImagePreview(null);
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
                      <svg
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <p className="mb-2 text-sm font-medium text-white">
                      Add avatar image
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarImageUpload}
                disabled={avatarUploading}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              />
            </div>
            {errors.avatarImage && (
              <p className="mt-2 text-sm text-red-400">{errors.avatarImage}</p>
            )}
            <p className="mt-3 text-xs text-gray-400">
              Upload your profile picture. Recommended size 500×500px, JPG or
              PNG, under 5MB
            </p>
          </div>

          {/* Middle - Cover Image Upload */}
          {/* <div>
            <label className="block text-sm font-medium text-white mb-4">Add cover image</label>
            <div className="relative w-full">
              <div className={`w-full h-64 border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-gray-600'} rounded-lg flex flex-col items-center justify-center bg-gray-800/30 cursor-pointer hover:border-gray-500 transition-colors`}>
                {coverImagePreview ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={coverImagePreview}
                      width={1000}
                      height={1000}
                      alt="Cover Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {coverUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="text-white text-sm">Uploading...</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-white text-sm font-medium mb-2">Add cover image</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                disabled={coverUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
            {errors.coverImage && (
              <p className="mt-2 text-sm text-red-400">{errors.coverImage}</p>
            )}
            <p className="text-gray-400 text-xs mt-3">
              Upload a high-quality cover image. Recommended size 1500×600px, JPG or PNG, under 5MB
            </p>
          </div> */}

          {/* Right Side - Stage Name */}
          <div className="flex h-64 flex-col justify-center">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Stage Name*
              </label>
              <Input
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="Enter stage name"
                className={`w-full ${errors.stageName ? "border-gradient-input-error" : "border-gradient-input"} h-12 text-white placeholder-gray-400`}
              />
              {errors.stageName && (
                <p className="mt-2 text-sm text-red-400">{errors.stageName}</p>
              )}
              <p className="mt-2 text-xs text-gray-400">
                Your stage name will appear on your profile and tracks. Make
                sure it is unique and easy to recognize.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            className="primary_gradient rounded-md px-8 py-3 font-medium text-white transition duration-300 ease-in-out hover:opacity-90"
            size="lg"
            disabled={isLoading || avatarUploading}
          >
            {avatarUploading
              ? "Uploading images..."
              : isLoading
                ? "Processing..."
                : formData.artistType === "INDIVIDUAL"
                  ? "Register"
                  : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistIdentitySection;
