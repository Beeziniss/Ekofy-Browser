"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { 
  ArtistDetailCard, 
  ArtistTeamMembers, 
  ListenerDetailCard 
} from "../component";
import { adminUserDetailOptions } from "@/gql/options/admin-options";
import { UserRole, ArtistType } from "@/gql/graphql";

interface UserDetailSectionProps {
  userId: string;
}

export function UserDetailSection({ userId }: UserDetailSectionProps) {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") as UserRole;
  const [activeTab, setActiveTab] = useState<"overview" | "team">("overview");

  const {
    data,
    isLoading,
    error,
  } = useQuery(adminUserDetailOptions(userId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading user details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error loading user details: {error.message}</div>
      </div>
    );
  }

  const user = data?.user;
  const artist = data?.artists?.[0];
  const listener = data?.listeners?.[0];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">User not found</div>
      </div>
    );
  }

  // Render Artist Detail
  if (role === UserRole.Artist && artist) {
    const showTeamTab = artist.artistType === ArtistType.Band || artist.artistType === ArtistType.Group;
    
    return (
      <div className="space-y-6">
        {/* Banner Background */}
        <div className="relative">
          {/* Banner Image */}
          <div className="h-64 w-full rounded-xl overflow-hidden primary_gradient">
            {artist.bannerImage ? (
              <Image
                src={artist.bannerImage}
                alt="Banner"
                width={1200}
                height={256}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full primary_gradient" />
            )}
          </div>
          
          {/* Avatar positioned over banner */}
          <div className="absolute left-8 bottom-0 transform translate-y-1/2">
            <div className="w-52 h-52 rounded-full border-4 border-black overflow-hidden primary_gradient">
              {artist.avatarImage ? (
                <Image
                  src={artist.avatarImage}
                  alt="Avatar"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-4xl">
                  {artist.stageName?.charAt(0).toUpperCase() || 'A'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Artist Info positioned next to avatar, outside banner */}
        <div className="flex items-center space-x-6 pl-28">
          {/* Spacer for avatar */}
          <div className="w-32"></div>
          
          {/* Artist Info */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">
              {artist.stageName || "Artist Name"} • <span className="text-white">Artist</span>
            </h2>
            <p className="text-lg text-gray-300">
              <span className="font-medium">{artist.followers || 100}</span> followers
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`pb-3 border-b-2 font-medium ${
                activeTab === "overview" 
                  ? "border-blue-500 text-primary-gradient" 
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Over View
            </button>
            {showTeamTab && (
              <button 
                onClick={() => setActiveTab("team")}
                className={`pb-3 border-b-2 font-medium ${
                  activeTab === "team" 
                    ? "border-blue-500 text-primary-gradient" 
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Team Member
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" ? (
          <ArtistDetailCard artist={artist} user={user} />
        ) : (
          <ArtistTeamMembers members={artist.members || []} />
        )}
      </div>
    );
  }

  // Render Listener Detail
  if (role === UserRole.Listener && listener) {
    return (
      <div className="space-y-6">
        {/* Banner Background */}
        <div className="relative">
          {/* Banner Image */}
          <div className="h-64 w-full rounded-xl overflow-hidden primary_gradient">
            {listener.bannerImage ? (
              <Image
                src={listener.bannerImage}
                alt="Banner"
                width={1200}
                height={256}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full primary_gradient" />
            )}
          </div>
          
          {/* Avatar positioned over banner */}
          <div className="absolute left-8 bottom-0 transform translate-y-1/2">
            <div className="w-52 h-52 rounded-full border-4 border-black overflow-hidden primary_gradient">
              {listener.avatarImage ? (
                <Image
                  src={listener.avatarImage}
                  alt="Avatar"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-4xl">
                  {listener.displayName?.charAt(0).toUpperCase() || user.fullName?.charAt(0).toUpperCase() || 'L'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Listener Info positioned next to avatar, outside banner */}
        <div className="flex items-center space-x-6 pl-28">
          {/* Spacer for avatar */}
          <div className="w-32"></div>
          
          {/* Listener Info */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">
              {listener.displayName || user.fullName || "Display Name"} • <span className="text-white">Listener</span>
            </h2>
            <p className="text-lg text-gray-300">
              <span className="font-medium">{listener.followerCount || 100}</span> followers • <span className="font-medium">{listener.followingCount || 100}</span> following
            </p>
          </div>
        </div>

        {/* Content */}
        <ListenerDetailCard listener={listener} user={user} />
      </div>
    );
  }  // Fallback for other roles or missing data
  return (
    // admin, moderator, other roles
    <div className="space-y-6">
      {/* Banner Background */}
      <div className="relative">
        {/* Banner Image */}
        <div className="h-64 w-full rounded-xl overflow-hidden primary_gradient">
          <div className="w-full h-full primary_gradient" />
        </div>
        
        {/* Avatar positioned over banner */}
        <div className="absolute left-8 bottom-0 transform translate-y-1/2">
          <div className="w-52 h-52 rounded-full border-4 border-black overflow-hidden primary_gradient">
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-4xl">
              {user.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>

      {/* User Info positioned next to avatar, outside banner */}
      <div className="flex items-center space-x-6 pl-28">
        {/* Spacer for avatar */}
        <div className="w-32"></div>
        
        {/* User Info */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">
            {user.fullName || "User Name"} • <span className="text-white">{role || "User"}</span>
          </h2>
          <p className="text-lg text-gray-300">
            General user information
          </p>
        </div>
      </div>

      {/* User Details Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex items-center gap-4">
          <label className="text-base text-gray-300 w-48 flex-shrink-0">Full Name:</label>
          <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">{user.fullName || "N/A"}</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-base text-gray-300 w-48 flex-shrink-0">Email:</label>
          <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">{user.email || "N/A"}</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-base text-gray-300 w-48 flex-shrink-0">Role:</label>
          <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">{user.role || "N/A"}</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-base text-gray-300 w-48 flex-shrink-0">Status:</label>
          <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">{user.status || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}