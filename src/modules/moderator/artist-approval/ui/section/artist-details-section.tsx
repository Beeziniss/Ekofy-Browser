"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ArtistInfoCard, BandMembersCard, ArtistActionsCard } from "../component";
import { 
  moderatorArtistDetailsQueryOptions, 
} from "@/gql/options/moderator-options";
import {  
  useApproveArtistRegistration, 
  useRejectArtistRegistration 
} from "@/gql/client-mutation-options/moderator-mutation";
import { ArtistType } from "@/gql/graphql";
import { ArrowLeft } from "lucide-react";

interface ArtistDetailsSectionProps {
  userId: string;
}

export function ArtistDetailsSection({ userId }: ArtistDetailsSectionProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    data: artist,
    isLoading,
    error,
  } = useQuery(moderatorArtistDetailsQueryOptions(userId));

  const approveArtistMutation = useApproveArtistRegistration();
  const rejectArtistMutation = useRejectArtistRegistration();

  const handleApprove = async () => {
    if (!artist || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await approveArtistMutation.mutateAsync({
        userId: artist.id,
        email: artist.email,
        fullName: artist.fullName,
      });
      
      toast.success("Artist registration approved successfully!");
      router.push("/moderator/artist-approval");
    } catch (error) {
      console.error("Failed to approve artist:", error);
      toast.error("Failed to approve artist registration. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (rejectionReason: string) => {
    if (!artist || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await rejectArtistMutation.mutateAsync({
        userId: artist.id,
        email: artist.email,
        fullName: artist.fullName,
        rejectionReason,
      });
      
      toast.success("Artist registration rejected successfully!");
      router.push("/moderator/artist-approval");
    } catch (error) {
      console.error("Failed to reject artist:", error);
      toast.error("Failed to reject artist registration. Please try again.");
    } finally {
      setIsProcessing(false);
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

  // Transform pending artist registration data to match ArtistApprovalData interface
  const transformedArtist = {
    id: artist.id,
    userId: artist.id, // Use id as userId for pending registrations
    email: artist.email,
    stageName: artist.stageName,
    artistType: artist.artistType,
    categoryIds: [], // Not available in pending registration
    followers: 0, // Not available in pending registration
    popularity: 0, // Not available in pending registration
    avatarImage: artist.avatarImage || undefined,
    bannerImage: undefined, // Not available in pending registration
    isVerified: false, // Not verified yet
    verifiedAt: undefined,
    createdAt: artist.requestedAt || new Date().toISOString(),
    updatedAt: artist.requestedAt || new Date().toISOString(),
    user: {
      id: artist.id,
      fullName: artist.fullName,
      email: artist.email,
      gender: artist.gender,
      phoneNumber: artist.phoneNumber,
      birthDate: artist.birthDate,
      status: "ACTIVE" as const,
      role: "ARTIST" as const,
      createdAt: artist.requestedAt || new Date().toISOString(),
      updatedAt: undefined,
    },
    members: artist.members || [],
    // Additional properties for approval process
    frontImageUrl: artist.frontImageUrl || undefined,
    backImageUrl: artist.backImageUrl || undefined,
    identityCardNumber: artist.identityCardNumber || undefined,
    identityCardFullName: artist.identityCardFullName || undefined,
    identityCardDateOfBirth: artist.identityCardDateOfBirth || undefined,
    gender: artist.gender,
    placeOfOrigin: artist.placeOfOrigin || undefined,
    placeOfResidence: artist.placeOfResidence || undefined,
    phoneNumber: artist.phoneNumber || undefined,
  };

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
      <ArtistInfoCard artist={transformedArtist} />

      {/* Band Members Card (only show if artist type is BAND or GROUP) */}
      {(transformedArtist.artistType === ArtistType.Band || transformedArtist.artistType === ArtistType.Group) && 
       transformedArtist.members && transformedArtist.members.length > 0 && (
        <BandMembersCard members={transformedArtist.members} />
      )}

      {/* Action Buttons */}
      <ArtistActionsCard
        artistName={transformedArtist.stageName}
        userId={userId}
        onApprove={handleApprove}
        onReject={handleReject}
        isLoading={isProcessing}
        // onCancel={handleCancel}
      />
    </div>
  );
}