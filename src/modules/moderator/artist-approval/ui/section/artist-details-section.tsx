"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArtistInfoCard, BandMembersCard, ArtistActionsCard } from "../component";
import { moderatorArtistDetailsQueryOptions } from "@/gql/options/moderator-options";
import { ArtistType } from "@/gql/graphql";
import { ArrowLeft } from "lucide-react";

interface ArtistDetailsSectionProps {
  userId: string;
}

export function ArtistDetailsSection({ userId }: ArtistDetailsSectionProps) {
  const router = useRouter();
  
  const {
    data: artist,
    isLoading,
    error,
  } = useQuery(moderatorArtistDetailsQueryOptions(userId));

  const handleApprove = async () => {
    try {
      router.push("/moderator/artist-approval");
    } catch (error) {
      console.error("Failed to approve artist:", error);
    }
  };

  const handleReject = async () => {
    try {
      router.push("/moderator/artist-approval");
    } catch (error) {
      console.error("Failed to reject artist:", error);
    }
  };

  const handleCancel = () => {
    router.push("/moderator/artist-approval");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading artist details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error loading artist details: {error.message}</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Artist not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <button
          onClick={handleCancel}
          className="mb-8 flex items-center text-white transition-colors hover:text-blue-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>

      {/* Artist Information Card */}
      <ArtistInfoCard artist={artist as any} />

      {/* Band Members Card (only show if artist type is BAND or GROUP) */}
      {(artist.artistType === ArtistType.Band || artist.artistType === ArtistType.Group) && 
       artist.members && artist.members.length > 0 && (
        <BandMembersCard members={artist.members} />
      )}

      {/* Action Buttons */}
      <ArtistActionsCard
        artistName={artist.stageName}
        userId={userId}
        onApprove={handleApprove}
        onReject={handleReject}
        // onCancel={handleCancel}
      />
    </div>
  );
}