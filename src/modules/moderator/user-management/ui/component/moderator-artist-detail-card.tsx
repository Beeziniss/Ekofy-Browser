"use client";

import { Badge } from "@/components/ui/badge";
import { ModeratorArtistDetailResponse, ModeratorUser } from "@/types";

interface ModeratorArtistDetailCardProps {
  artist: ModeratorArtistDetailResponse;
  user: ModeratorUser;
}

export function ModeratorArtistDetailCard({ artist, user }: ModeratorArtistDetailCardProps) {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
      <div>
        <h3 className="mb-6 text-xl font-semibold text-white">Personal detail</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Email:</label>
            <span className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {artist?.email || "email"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Gender:</label>
            <span className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {artist?.identityCard.gender || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Date of birth:</label>
            <span className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {artist?.identityCard.dateOfBirth
                ? new Date(artist.identityCard.dateOfBirth).toLocaleDateString("en-GB")
                : "DD/MM/YYYY"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Phone Number:</label>
            <span className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {artist.user.phoneNumber || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Status:</label>
            <span className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {user?.status || "Status"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Place of origin:</label>
            <span className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {artist?.identityCard.placeOfOrigin || "N/A"}
            </span>
          </div>
          <div className="flex items-start gap-4">
            <label className="w-48 flex-shrink-0 pt-3 text-base text-gray-300">Place of residence:</label>
            <span className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 leading-relaxed text-gray-400">
              {artist?.identityCard.placeOfResidence
                ? `${artist.identityCard.placeOfResidence.addressLine}, ${artist.identityCard.placeOfResidence.ward}, ${artist.identityCard.placeOfResidence.province}`
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Date of expiration:</label>
            <span className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {artist?.identityCard.validUntil
                ? new Date(artist.identityCard.validUntil).toLocaleDateString("en-GB")
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-6 text-xl font-semibold text-white">Account detail</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Stage Name:</label>
            <span className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {artist?.stageName || "stagename"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Artist Type:</label>
            <span className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {artist?.artistType || "Band"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Category:</label>
            <div className="flex flex-1 gap-2 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3">
              <Badge className="rounded-full border-gray-600 bg-gray-700 px-3 py-1 text-xs text-gray-200 hover:bg-gray-600">
                Pop
              </Badge>
              <Badge className="rounded-full border-gray-600 bg-gray-700 px-3 py-1 text-xs text-gray-200 hover:bg-gray-600">
                Jazz
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 flex-shrink-0 text-base text-gray-300">Create At:</label>
            <span className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 text-gray-400">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB") : "DD/MM/YYYY"}
            </span>
          </div>
          <div className="flex items-start gap-4">
            <label className="w-48 flex-shrink-0 pt-3 text-base text-gray-300">Biography:</label>
            <p className="flex-1 rounded-xl border border-[#1F1F1F] bg-[#1A1A1A] p-3 leading-relaxed text-gray-400">
              {artist?.biography ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
