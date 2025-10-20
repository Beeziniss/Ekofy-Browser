"use client";
import { UserManagementListener, UserManagementUser } from "@/types";
interface ListenerDetailCardProps {
  listener: UserManagementListener;
  user: UserManagementUser;
}

export function ListenerDetailCard({ listener, user }: ListenerDetailCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="flex items-center gap-4">
        <label className="text-base text-gray-300 w-48 flex-shrink-0">Full Name:</label>
        <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">{user?.fullName || "full name"}</p>
      </div>
      <div className="flex items-center gap-4">
        <label className="text-base text-gray-300 w-48 flex-shrink-0">Display Name:</label>
        <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">{listener.displayName || "full name"}</p>
      </div>
      <div className="flex items-center gap-4">
        <label className="text-base text-gray-300 w-48 flex-shrink-0">Date of birth:</label>
        <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
          {user?.birthDate ? new Date(user.birthDate).toLocaleDateString('en-GB') : "DD/MM/YYYY"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <label className="text-base text-gray-300 w-48 flex-shrink-0">Email:</label>
        <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">{user?.email || "email"}</p>
      </div>
      <div className="flex items-center gap-4">
        <label className="text-base text-gray-300 w-48 flex-shrink-0">Phone Number:</label>
        <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">{user?.phoneNumber || "0987654321"}</p>
      </div>
      <div className="flex items-center gap-4">
        <label className="text-base text-gray-300 w-48 flex-shrink-0">Gender:</label>
        <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">{user?.gender || "gender"}</p>
      </div>
      <div className="flex items-center gap-4">
        <label className="text-base text-gray-300 w-48 flex-shrink-0">Status:</label>
        <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">{user?.status || "Active"}</p>
      </div>
    </div>
  );
}