"use client";
import { UserManagementListener, UserManagementUser } from "@/types";
interface ListenerDetailCardProps {
  listener: UserManagementListener;
  user: UserManagementUser;
}

export function ListenerDetailCard({ listener, user }: ListenerDetailCardProps) {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
      <div className="flex items-center gap-4">
        <label className="w-48 flex-shrink-0 text-base text-gray-300">Full Name:</label>
        <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
          {user?.fullName || "full name"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <label className="w-48 flex-shrink-0 text-base text-gray-300">Display Name:</label>
        <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
          {listener.displayName || "full name"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <label className="w-48 flex-shrink-0 text-base text-gray-300">Date of birth:</label>
        <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
          {user?.birthDate ? new Date(user.birthDate).toLocaleDateString("en-GB") : "DD/MM/YYYY"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <label className="w-48 flex-shrink-0 text-base text-gray-300">Email:</label>
        <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
          {user?.email || "email"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <label className="w-48 flex-shrink-0 text-base text-gray-300">Phone Number:</label>
        <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
          {user?.phoneNumber || "0987654321"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <label className="w-48 flex-shrink-0 text-base text-gray-300">Gender:</label>
        <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
          {user?.gender || "gender"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <label className="w-48 flex-shrink-0 text-base text-gray-300">Status:</label>
        <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
          {user?.status || "Active"}
        </p>
      </div>
    </div>
  );
}
