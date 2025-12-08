"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { toast } from "sonner";

export const useChangePassword = () => {
  const [isOpen, setIsOpen] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      return await authApi.general.changePassword(data.currentPassword, data.newPassword, data.confirmPassword);
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setIsOpen(false);
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
