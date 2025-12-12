"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

export const useChangePassword = () => {
  const [isOpen, setIsOpen] = useState(false);
  const clearUserData = useAuthStore((state) => state.clearUserData);

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      return await authApi.general.changePassword(data.currentPassword, data.newPassword, data.confirmPassword);
    },
    onSuccess: () => {
      toast.success("Password changed successfully! Please login again.");
      setIsOpen(false);
      
      // Clear all authentication data (localStorage, cookies, zustand store)
      clearUserData();
      
      // Force redirect to listener login page using window.location to ensure clean state
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to change password");
    },
  });

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    await changePasswordMutation.mutateAsync({ currentPassword, newPassword, confirmPassword });
  };

  return {
    changePassword,
    isLoading: changePasswordMutation.isPending,
    isOpen,
    setIsOpen,
  };
};
