"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateListenerProfileMutationOptions } from "@/gql/options/client-mutation-options";
import { uploadImageToCloudinary, validateImageFile } from "@/utils/cloudinary-utils";

export function useProfileImageUpload(userId: string) {
  const queryClient = useQueryClient();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);

  const updateProfileMutation = useMutation({
    ...updateListenerProfileMutationOptions,
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["listener-profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["listener", userId] });
      toast.success("Avatar updated!");
    },
    onError: (error) => {
      console.error("Update profile error:", error);
      toast.error("Error updating avatar. Please try again.");
    },
  });

  const uploadAvatar = async (file: File) => {
    if (!userId) {
      toast.error("User information not found");
      return;
    }

    // Validate file
    if (!validateImageFile(file, 5)) {
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Upload to Cloudinary
      const uploadResult = await uploadImageToCloudinary(file, {
        folder: `listener-profiles/${userId}`,
        tags: ["listener", "profile", "avatar"],
        resourceType: "image",
      });

      // Update profile with new avatar URL
      await updateProfileMutation.mutateAsync({
        avatarImage: uploadResult.secure_url,
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("An error occurred while uploading the avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const uploadBackground = async (file: File) => {
    if (!userId) {
      toast.error("User information not found");
      return;
    }

    // Validate file
    if (!validateImageFile(file, 10)) {
      return;
    }

    setIsUploadingBackground(true);

    try {
      // Upload to Cloudinary
      const uploadResult = await uploadImageToCloudinary(file, {
        folder: `listener-profiles/${userId}`,
        tags: ["listener", "profile", "banner"],
        resourceType: "image",
      });

      // Update profile with new banner URL
      await updateProfileMutation.mutateAsync({
        bannerImage: uploadResult.secure_url,
      });
    } catch (error) {
      console.error("Background upload error:", error);
      toast.error("An error occurred while uploading the banner");
    } finally {
      setIsUploadingBackground(false);
    }
  };

  return {
    uploadAvatar,
    uploadBackground,
    isUploadingAvatar,
    isUploadingBackground,
    isUploading: isUploadingAvatar || isUploadingBackground,
  };
}
