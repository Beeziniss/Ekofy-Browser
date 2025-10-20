"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ArtistDetailCard,
  ArtistTeamMembers,
  ListenerDetailCard,
} from "../component";
import { 
  adminUserDetailOptions, 
  adminArtistDetailOptions, 
  adminListenerDetailOptions 
} from "@/gql/options/admin-options";
import { UserRole, ArtistType } from "@/gql/graphql";
import { UserManagementArtist, UserManagementUser, UserManagementListener } from "@/types/user-management";

interface UserDetailSectionProps {
  userId: string;
}

export function UserDetailSection({ userId }: UserDetailSectionProps) {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") as UserRole;
  const [activeTab, setActiveTab] = useState<"overview" | "team">("overview");

  // Fetch user basic info
  const { data: user, isLoading: userLoading, error: userError } = useQuery(adminUserDetailOptions(userId));
  
  // Conditionally fetch role-specific data
  const { data: artist, isLoading: artistLoading, error: artistError } = useQuery({
    ...adminArtistDetailOptions(userId),
    enabled: role === UserRole.Artist,
  });
  
  const { data: listener, isLoading: listenerLoading, error: listenerError } = useQuery({
    ...adminListenerDetailOptions(userId),
    enabled: role === UserRole.Listener,
  });

  const isLoading = userLoading || (role === UserRole.Artist ? artistLoading : listenerLoading);
  const error = userError || (role === UserRole.Artist ? artistError : listenerError);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-400">Loading user details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-red-400">
          Error loading user details: {error.message}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-400">User not found</div>
      </div>
    );
  }

  // Render Artist Detail
  if (role === UserRole.Artist && artist) {
    const showTeamTab =
      artist.artistType === ArtistType.Band ||
      artist.artistType === ArtistType.Group;

    // Transform artist data to match UserManagementArtist interface
    const transformedArtist: UserManagementArtist = {
      id: artist.id,
      userId: artist.userId,
      stageName: artist.stageName,
      email: artist.email,
      artistType: artist.artistType,
      categoryIds: artist.categoryIds || [],
      biography: artist.biography || undefined,
      followers: artist.followerCount || 0, // Map followerCount to followers
      popularity: artist.popularity || 0,
      avatarImage: artist.avatarImage || undefined,
      bannerImage: artist.bannerImage || undefined,
      isVerified: artist.isVerified,
      verifiedAt: artist.verifiedAt,
      createdAt: artist.createdAt,
      updatedAt: artist.createdAt, // Use createdAt as updatedAt fallback
      members: artist.members,
      identityCard: artist.identityCard ? {
        number: artist.identityCard.number,
        fullName: artist.identityCard.fullName,
        dateOfBirth: artist.identityCard.dateOfBirth,
        gender: artist.identityCard.gender,
        placeOfOrigin: artist.identityCard.placeOfOrigin,
        nationality: artist.identityCard.nationality,
        validUntil: artist.identityCard.validUntil || "",
        placeOfResidence: {
          street: artist.identityCard.placeOfResidence?.street || "",
          ward: artist.identityCard.placeOfResidence?.ward || "",
          province: artist.identityCard.placeOfResidence?.province || "",
          oldDistrict: artist.identityCard.placeOfResidence?.oldDistrict || "",
          oldWard: artist.identityCard.placeOfResidence?.oldWard || "",
          oldProvince: artist.identityCard.placeOfResidence?.oldProvince || "",
          addressLine: artist.identityCard.placeOfResidence?.addressLine || "",
        },
      } : undefined,
    };

    // Transform user data to match UserManagementUser interface
    const transformedUser: UserManagementUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      gender: user.gender,
      birthDate: user.birthDate,
      role: user.role,
      phoneNumber: user.phoneNumber || "",
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt || user.createdAt,
      isLinkedWithGoogle: false, // Default value for missing property
    };

    return (
      <div className="space-y-6">
        {/* Banner Background */}
        <div className="relative">
          {/* Banner Image */}
          <div className="primary_gradient h-64 w-full overflow-hidden rounded-xl">
            {artist.bannerImage ? (
              <Image
                src={artist.bannerImage}
                alt="Banner"
                width={1200}
                height={256}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="primary_gradient h-full w-full" />
            )}
          </div>

          {/* Avatar positioned over banner */}
          <div className="absolute bottom-0 left-8 translate-y-1/2 transform">
            <div className="primary_gradient h-52 w-52 overflow-hidden rounded-full border-4 border-black">
              {artist.avatarImage ? (
                <Image
                  src={artist.avatarImage}
                  alt="Avatar"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">
                  {artist.stageName?.charAt(0).toUpperCase() || "A"}
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
            <h2 className="mb-1 text-3xl font-bold text-white">
              {artist.stageName || "Artist Name"} •{" "}
              <span className="text-white">Artist</span>
            </h2>
            <p className="text-lg text-gray-300">
              <span className="font-medium">{artist.followerCount || 100}</span>{" "}
              followers
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`border-b-2 pb-3 font-medium ${
                activeTab === "overview"
                  ? "text-primary-gradient border-blue-500"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Over View
            </button>
            {showTeamTab && (
              <button
                onClick={() => setActiveTab("team")}
                className={`border-b-2 pb-3 font-medium ${
                  activeTab === "team"
                    ? "text-primary-gradient border-blue-500"
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
          <ArtistDetailCard artist={transformedArtist} user={transformedUser} />
        ) : (
          <ArtistTeamMembers members={transformedArtist.members || []} />
        )}
      </div>
    );
  }

  // Render Listener Detail
  if (role === UserRole.Listener && listener) {
    // Transform listener data to match UserManagementListener interface
    const transformedListener: UserManagementListener = {
      id: listener.id,
      userId: listener.userId,
      displayName: listener.displayName,
      email: listener.email,
      avatarImage: listener.avatarImage || undefined,
      bannerImage: listener.bannerImage || undefined,
      isVerified: listener.isVerified,
      verifiedAt: listener.verifiedAt,
      followerCount: listener.followerCount,
      followingCount: listener.followingCount,
      lastFollowers: [], // Default empty array for missing property
      lastFollowings: [], // Default empty array for missing property
      createdAt: listener.createdAt,
      updatedAt: listener.updatedAt || listener.createdAt,
    };

    // Transform user data to match UserManagementUser interface
    const transformedUser: UserManagementUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      gender: user.gender,
      birthDate: user.birthDate,
      role: user.role,
      phoneNumber: user.phoneNumber || "",
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt || user.createdAt,
      isLinkedWithGoogle: false, // Default value for missing property
    };
    return (
      <div className="space-y-6">
        {/* Banner Background */}
        <div className="relative">
          {/* Banner Image */}
          <div className="primary_gradient h-64 w-full overflow-hidden rounded-xl">
            {listener.bannerImage ? (
              <Image
                src={listener.bannerImage}
                alt="Banner"
                width={1200}
                height={256}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="primary_gradient h-full w-full" />
            )}
          </div>

          {/* Avatar positioned over banner */}
          <div className="absolute bottom-0 left-8 translate-y-1/2 transform">
            <div className="primary_gradient h-52 w-52 overflow-hidden rounded-full border-4 border-black">
              {listener.avatarImage ? (
                <Image
                  src={listener.avatarImage}
                  alt="Avatar"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">
                  {listener.displayName?.charAt(0).toUpperCase() ||
                    user.fullName?.charAt(0).toUpperCase() ||
                    "L"}
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
            <h2 className="mb-1 text-3xl font-bold text-white">
              {listener.displayName || user.fullName || "Display Name"} •{" "}
              <span className="text-white">Listener</span>
            </h2>
            <p className="text-lg text-gray-300">
              <span className="font-medium">
                {listener.followerCount || 100}
              </span>{" "}
              followers •{" "}
              <span className="font-medium">
                {listener.followingCount || 100}
              </span>{" "}
              following
            </p>
          </div>
        </div>

        {/* Content */}
        <ListenerDetailCard listener={transformedListener} user={transformedUser} />
      </div>
    );
  } // Fallback for other roles or missing data
  return (
    // admin, moderator, other roles
    <div className="space-y-6">
      {/* Banner Background */}
      <div className="relative">
        {/* Banner Image */}
        <div className="primary_gradient h-64 w-full overflow-hidden rounded-xl">
          <div className="primary_gradient h-full w-full" />
        </div>

        {/* Avatar positioned over banner */}
        <div className="absolute bottom-0 left-8 translate-y-1/2 transform">
          <div className="primary_gradient h-52 w-52 overflow-hidden rounded-full border-4 border-black">
            <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">
              {user.fullName?.charAt(0).toUpperCase() || "U"}
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
          <h2 className="mb-1 text-3xl font-bold text-white">
            {user.fullName || "User Name"} •{" "}
            <span className="text-white">{role || "User"}</span>
          </h2>
          <p className="text-lg text-gray-300">General user information</p>
        </div>
      </div>

      {/* User Details Content */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="flex items-center gap-4">
          <label className="w-48 flex-shrink-0 text-base text-gray-300">
            Full Name:
          </label>
          <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
            {user.fullName || "N/A"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-48 flex-shrink-0 text-base text-gray-300">
            Email:
          </label>
          <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
            {user.email || "N/A"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-48 flex-shrink-0 text-base text-gray-300">
            Role:
          </label>
          <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
            {user.role || "N/A"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-48 flex-shrink-0 text-base text-gray-300">
            Status:
          </label>
          <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
            {user.status || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
