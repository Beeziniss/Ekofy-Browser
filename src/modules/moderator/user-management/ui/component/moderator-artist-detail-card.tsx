"use client";

import { Badge } from "@/components/ui/badge";
import { ModeratorArtistDetailResponse, ModeratorUser } from "@/types";

interface ModeratorArtistDetailCardProps {
  artist: ModeratorArtistDetailResponse;
  user: ModeratorUser;
}

export function ModeratorArtistDetailCard({ artist, user }: ModeratorArtistDetailCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Personal detail</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Email:</label>
            <span className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {artist?.email || "email"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Gender:</label>
            <span className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {artist?.identityCard.gender || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Date of birth:</label>
            <span className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {artist?.identityCard.dateOfBirth ?
                new Date(artist.identityCard.dateOfBirth).toLocaleDateString('en-GB') :
                "DD/MM/YYYY"
}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Phone Number:</label>
            <span className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {artist.user.phoneNumber|| "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Status:</label>
            <span className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {user?.status || "Status"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Place of origin:</label>
            <span className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {artist?.identityCard.placeOfOrigin || "N/A"}
            </span>
          </div>
            <div className="flex items-start gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0 pt-3">Place of residence:</label>
            <span className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 leading-relaxed">
              {artist?.identityCard.placeOfResidence
              ? `${artist.identityCard.placeOfResidence.addressLine}, ${artist.identityCard.placeOfResidence.ward}, ${artist.identityCard.placeOfResidence.province}`
              : "N/A"}
            </span>
            </div>
          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Date of expiration:</label>
            <span className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {artist?.identityCard.validUntil ?
                new Date(artist.identityCard.validUntil).toLocaleDateString('en-GB') :
                "N/A"
              }
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Account detail</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Stage Name:</label>
            <span className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {artist?.stageName || "stagename"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Artist Type:</label>
            <span className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {artist?.artistType || "Band"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Category:</label>
            <div className="flex gap-2 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              <Badge className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 px-3 py-1 rounded-full text-xs">
                Pop
              </Badge>
              <Badge className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 px-3 py-1 rounded-full text-xs">
                Jazz
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0">Create At:</label>
            <span className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              {user?.createdAt ? 
                new Date(user.createdAt).toLocaleDateString('en-GB') : 
                "DD/MM/YYYY"
              }
            </span>
          </div>
          <div className="flex items-start gap-4">
            <label className="text-base text-gray-300 w-48 flex-shrink-0 pt-3">Biography:</label>
            <p className="text-gray-400 flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 leading-relaxed">
              {artist?.biography || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}