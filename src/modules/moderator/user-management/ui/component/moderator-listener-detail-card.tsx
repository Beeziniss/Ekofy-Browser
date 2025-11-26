"use client";

import { ModeratorListenerDetailResponse, ModeratorUser } from "@/types";

interface ModeratorListenerDetailCardProps {
  listener: ModeratorListenerDetailResponse;
  user: ModeratorUser;
}

export function ModeratorListenerDetailCard({ listener, user }: ModeratorListenerDetailCardProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Personal Information Column */}
        <div className="space-y-6">
          <h3 className="mb-4 text-xl font-semibold text-white">Personal Information</h3>

          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Full Name:</label>
            <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {user?.fullName || "full name"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Display Name:</label>
            <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {listener?.displayName || "display name"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Date of birth:</label>
            <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {listener?.user?.birthDate ? new Date(listener.user.birthDate).toLocaleDateString("en-GB") : "DD/MM/YYYY"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Gender:</label>
            <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {listener?.user?.gender || "N/A"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Phone Number:</label>
            <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {listener?.user?.phoneNumber || "N/A"}
            </p>
          </div>
        </div>

        {/* Account Information Column */}
        <div className="space-y-6">
          <h3 className="mb-4 text-xl font-semibold text-white">Account Information</h3>

          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Email:</label>
            <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {listener?.email || "email"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Join Date:</label>
            <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {listener?.createdAt ? new Date(listener.createdAt).toLocaleDateString("en-GB") : "DD/MM/YYYY"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Followers:</label>
            <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {listener?.followerCount || 0}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Following:</label>
            <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {listener?.followingCount || 0}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
