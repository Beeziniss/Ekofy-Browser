"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { moderatorArtistDetailOptions, moderatorListenerDetailOptions } from "@/gql/options/moderator-options";
import { ArtistType, UserRole, UserStatus, UserGender } from "@/gql/graphql";
import { ModeratorArtistDetailCard, ModeratorListenerDetailCard, ModeratorArtistTeamMembers } from "../component";
import { 
  ModeratorArtist, 
  ModeratorListener, 
  ModeratorUser,
  ModeratorArtistDetailResponse,
  ModeratorListenerDetailResponse,
  ModeratorUserBasic
} from "@/types";
import { useState } from "react";
import Image from "next/image";

interface ModeratorUserDetailSectionProps {
  userId: string;
}

// Helper functions to transform GraphQL response to component types
const transformToModeratorUser = (userData: ModeratorUserBasic, userId: string): ModeratorUser => ({
  id: userId,
  email: "", // Not available in basic user data from GraphQL response
  fullName: userData?.fullName || "",
  role: userData?.role || UserRole.Listener,
  status: UserStatus.Active, // Default status as not available in GraphQL response
  createdAt: new Date().toISOString(), // Default as not available in GraphQL response
  updatedAt: undefined,
});

const transformToModeratorArtist = (artistData: any): ModeratorArtistDetailResponse => ({
  id: artistData?.id || "",
  userId: artistData?.userId || "",
  stageName: artistData?.stageName || "",
  email: artistData?.email || "",
  artistType: artistData?.artistType || ArtistType.Individual,
  members: artistData?.members?.map((member: any) => ({
    fullName: member.fullName,
    email: member.email,
    phoneNumber: member.phoneNumber,
    isLeader: member.isLeader,
    gender: member.gender,
  })) || [],
  categoryIds: artistData?.categoryIds || [],
  biography: artistData?.biography,
  followerCount: artistData?.followerCount || 0,
  popularity: artistData?.popularity || 0,
  avatarImage: artistData?.avatarImage,
  bannerImage: artistData?.bannerImage,
  isVerified: artistData?.isVerified || false,
  verifiedAt: artistData?.verifiedAt,
  identityCard: artistData?.identityCard || {
    number: "",
    fullName: "",
    dateOfBirth: "",
    gender: UserGender.Male,
    placeOfOrigin: "",
    nationality: "",
    validUntil: "",
    placeOfResidence: {
      street: "",
      ward: "",
      province: "",
      oldDistrict: "",
      oldWard: "",
      oldProvince: "",
      addressLine: "",
    },
  },
  createdAt: artistData?.createdAt || new Date().toISOString(),
  user: artistData?.user || { fullName: "", role: UserRole.Artist },
});

const transformToModeratorListener = (listenerData: any): ModeratorListenerDetailResponse => ({
  id: listenerData?.id || "",
  userId: listenerData?.userId || "",
  displayName: listenerData?.displayName || "",
  bannerImage: listenerData?.bannerImage,
  avatarImage: listenerData?.avatarImage,
  followerCount: listenerData?.followerCount || 0,
  followingCount: listenerData?.followingCount || 0,
    email: listenerData?.email || "",
    isVerified: listenerData?.isVerified || false,
    verifiedAt: listenerData?.verifiedAt,
  createdAt: listenerData?.createdAt || new Date().toISOString(),
  user: listenerData?.user || { fullName: "", role: UserRole.Listener },
});

export function ModeratorUserDetailSection({ userId }: ModeratorUserDetailSectionProps) {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") as UserRole;
  const [activeTab, setActiveTab] = useState<"overview" | "team">("overview");

  // Use different queries based on role
  const artistQuery = useQuery({
    ...moderatorArtistDetailOptions(userId),
    enabled: role === UserRole.Artist,
  });

  const listenerQuery = useQuery({
    ...moderatorListenerDetailOptions(userId),
    enabled: role === UserRole.Listener,
  });

  const isLoading = artistQuery.isLoading || listenerQuery.isLoading;
  const error = artistQuery.error || listenerQuery.error;

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

  const artist = artistQuery.data;
  const listener = listenerQuery.data;

  // Transform data to component-compatible types
  const transformedUser = artist?.user ? transformToModeratorUser(artist.user as ModeratorUserBasic, userId) : 
                         listener?.user ? transformToModeratorUser(listener.user as ModeratorUserBasic, userId) : null;
  const transformedArtist = artist ? transformToModeratorArtist(artist) : null;
  const transformedListener = listener ? transformToModeratorListener(listener) : null;
  
  if (role === UserRole.Artist && !transformedArtist) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-400">Artist not found</div>
      </div>
    );
  }

  if (role === UserRole.Listener && !transformedListener) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-400">Listener not found</div>
      </div>
    );
  }

// Render Artist Detail
  if (role === UserRole.Artist && transformedArtist && transformedUser) {
    const showTeamTab =
      transformedArtist.artistType === ArtistType.Band ||
      transformedArtist.artistType === ArtistType.Group;

    return (
      <div className="space-y-6">
        {/* Banner Background */}
        <div className="relative">
          {/* Banner Image */}
          <div className="primary_gradient h-64 w-full overflow-hidden rounded-xl">
            {transformedArtist.bannerImage ? (
              <Image
                src={transformedArtist.bannerImage}
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
              {transformedArtist.avatarImage ? (
                <Image
                  src={transformedArtist.avatarImage}
                  alt="Avatar"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">
                  {transformedArtist.stageName?.charAt(0).toUpperCase() || "A"}
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
              {transformedArtist.stageName || "Artist Name"} •{" "}
              <span className="text-white">Artist</span>
            </h2>
            <p className="text-lg text-gray-300">
              <span className="font-medium">{transformedArtist.followerCount || 100}</span>{" "}
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
          <ModeratorArtistDetailCard artist={transformedArtist} user={transformedUser} />
        ) : (
          <ModeratorArtistTeamMembers members={transformedArtist.members || []} />
        )}
      </div>
    );
  }

 // Render Listener Detail
   if (role === UserRole.Listener && transformedListener && transformedUser) {
     return (
       <div className="space-y-6">
         {/* Banner Background */}
         <div className="relative">
           {/* Banner Image */}
           <div className="primary_gradient h-64 w-full overflow-hidden rounded-xl">
             {transformedListener.bannerImage ? (
               <Image
                 src={transformedListener.bannerImage}
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
               {transformedListener.avatarImage ? (
                 <Image
                   src={transformedListener.avatarImage}
                   alt="Avatar"
                   width={128}
                   height={128}
                   className="h-full w-full object-cover"
                 />
               ) : (
                 <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">
                   {transformedListener.displayName?.charAt(0).toUpperCase() ||
                     transformedUser.fullName?.charAt(0).toUpperCase() ||
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
               {transformedListener.displayName || transformedUser.fullName || "Display Name"} •{" "}
               <span className="text-white">Listener</span>
             </h2>
             <p className="text-lg text-gray-300">
               <span className="font-medium">
                 {transformedListener.followerCount || 100}
               </span>{" "}
               followers •{" "}
               <span className="font-medium">
                 {transformedListener.followingCount || 100}
               </span>{" "}
               following
             </p>
           </div>
         </div>
 
         {/* Content */}
         <ModeratorListenerDetailCard listener={transformedListener} user={transformedUser} />
       </div>
     );
   }

  // Fallback for other roles or missing data
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-gray-400">No role-specific data found</div>
    </div>
  );
}
