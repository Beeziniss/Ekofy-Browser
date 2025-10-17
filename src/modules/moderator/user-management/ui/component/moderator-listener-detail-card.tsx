"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeratorListener, ModeratorListenerDetailResponse, ModeratorUser } from "@/types";
import { useDeActiveUser, useReActiveUser } from "@/gql/client-mutation-options/moderator-mutation";
import { ModeratorStatusConfirmModal } from "./moderator-status-confirm-modal";

interface ModeratorListenerDetailCardProps {
  listener: ModeratorListenerDetailResponse;
  user: ModeratorUser;
}

export function ModeratorListenerDetailCard({ listener, user }: ModeratorListenerDetailCardProps) {
  const [modalAction, setModalAction] = useState<"ban" | "reactivate" | null>(null);
  
  const banUserMutation = useDeActiveUser();
  const reactivateUserMutation = useReActiveUser();

  const confirmStatusChange = async () => {
    if (!modalAction) return;

    try {
      if (modalAction === "ban") {
        await banUserMutation.mutateAsync(user.id);
      } else {
        await reactivateUserMutation.mutateAsync(user.id);
      }
      setModalAction(null);
    } catch (error) {
      console.error("Error changing user status:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Personal Information Column */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
          
          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Full Name:</label>
            <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {user?.fullName || "full name"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Display Name:</label>
            <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {listener?.displayName || "display name"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Date of birth:</label>
            <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {listener?.user?.birthDate
                ? new Date(listener.user.birthDate).toLocaleDateString('en-GB')
                : "DD/MM/YYYY"
              }
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Gender:</label>
            <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {listener?.user?.gender || "N/A"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Phone Number:</label>
            <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
            {listener?.user?.phoneNumber || "N/A"}
            </p>
          </div>
        </div>

        {/* Account Information Column */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
          
          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Email:</label>
            <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {listener?.email || "email"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Join Date:</label>
            <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {listener?.createdAt ? new Date(listener.createdAt).toLocaleDateString('en-GB') : "DD/MM/YYYY"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Followers:</label>
            <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {listener?.followerCount || 0}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Following:</label>
            <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {listener?.followingCount || 0}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}