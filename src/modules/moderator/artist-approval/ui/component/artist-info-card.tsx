"use client";

import { Input } from "@/components/ui/input";
import { DotIcon } from "lucide-react";
import Image from "next/image";
import { UserManagementArtist } from "@/types/user-management";

// Extended artist interface for approval process with additional ID card properties
interface ArtistApprovalData extends UserManagementArtist {
  frontImageUrl?: string;
  backImageUrl?: string;
  identityCardNumber?: string;
  identityCardFullName?: string;
  identityCardDateOfBirth?: string;
  gender?: string;
  placeOfOrigin?: string;
  placeOfResidence?: string;
  phoneNumber?: string;
}

interface ArtistInfoCardProps {
  artist: ArtistApprovalData;
}

export function ArtistInfoCard({ artist }: ArtistInfoCardProps) {
  return (
    <div className="space-y-4">
      {/* Header with Avatar and Info */}
      <div className="mx-auto w-full rounded-lg bg-[#121212] pt-6 pb-16">
        <div className="primary_gradient h-60 w-full rounded-lg relative">
          {/* Avatar positioned inside/overlapping the gradient rectangle */}
          <div className="absolute bottom-0 left-6 transform translate-y-1/2">
            <div className="primary_gradient h-36 w-36 rounded-full border-4 border-black overflow-hidden flex-shrink-0">
              {artist.avatarImage ? (
                <Image
                  src={artist.avatarImage}
                  alt="Artist Avatar"
                  width={144}
                  height={144}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
          </div>
        </div>

        {/* Artist name and type positioned below, aligned with avatar */}
        <div className="mt-5 flex items-center gap-4 px-6">
          {/* Spacing to align with avatar */}
          <div className="w-36"></div>
          
          {/* Artist info next to avatar */}
          <div className="flex items-center gap-3 text-lg font-semibold text-white">
            <span className="text-[20px]">{artist.stageName}</span>
            <DotIcon className="size-8"/>
            <span className="text-[20px]">Artist</span>
          </div>
        </div>
      </div>

      {/* Identity Card Information */}
        <div className="border-gray-400 border-solid transparent rounded-xl border-2 bg-black/40 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Identity card information
          </h3>

          <div className="grid grid-cols-[280px_1fr] gap-6">
            {/* LEFT SIDE: Images */}
            <div className="space-y-4">
              {/* Front Image */}
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Front Image
                </label>
                <div className="border-gray-400 border-2 border-solid transparent flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-blue-600">
                  {artist.frontImageUrl ? (
                    <Image
                      src={artist.frontImageUrl}
                      alt="ID Front"
                      width={280}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-blue-600 to-blue-400"></div>
                  )}
                </div>
              </div>

              {/* Back Image */}
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Back Image
                </label>
                <div className="border-gray-400 border-2 border-solid transparent flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-blue-600">
                  {artist.backImageUrl ? (
                    <Image
                      src={artist.backImageUrl}
                      alt="ID Back"
                      width={280}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-blue-600 to-blue-400"></div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm text-gray-300">
                  Number of Citizen
                </label>
                <Input
                  value={artist.identityCardNumber || "Number of Citizen"}
                  readOnly
                  className="border-gray-400 border-2 border-solid transparent h-9 bg-transparent text-white"
                  placeholder="Number of Citizen"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-300">
                  Full Name
                </label>
                <Input
                  value={artist.identityCardFullName || "Full Name"}
                  readOnly
                  className="border-gray-400 border-2 border-solid transparent h-9 bg-transparent text-white"
                  placeholder="Full Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-300">
                    Date of birth
                  </label>
                  <Input
                    value={
                      artist.identityCardDateOfBirth
                        ? new Date(
                            artist.identityCardDateOfBirth,
                          ).toLocaleDateString("en-GB")
                        : "dd/mm/yyyy"
                    }
                    readOnly
                    className="border-gray-400 border-2 border-solid transparent h-9 bg-transparent text-white"
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-gray-300">
                    Gender
                  </label>
                  <Input
                    value={artist.gender || "Gender"}
                    readOnly
                    className="border-gray-400 border-2 border-solid transparent h-9 bg-transparent text-white"
                    placeholder="Gender"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-300">
                  Place of origin
                </label>
                <Input
                  value={artist.placeOfOrigin || "Place of origin"}
                  readOnly
                  className="border-gray-400 border-2 border-solid transparent h-9 bg-transparent text-white"
                  placeholder="Place of origin"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-300">
                  Place of residence
                </label>
                <Input
                  value={
                    artist.placeOfResidence ||
                    "Place of residence"
                  }
                  readOnly
                  className="border-gray-400 border-2 border-solid transparent h-9 bg-transparent text-white"
                  placeholder="Place of residence"
                />
              </div>

              {/* <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-300">
                    Date of Expiry
                  </label>
                  <Input
                    value={
                      artist.identityCard.validUntil
                        ? new Date(
                            artist.identityCard.validUntil,
                          ).toLocaleDateString("en-GB")
                        : "dd/mm/yyyy"
                    }
                    readOnly
                    className="border-gradient-input h-9 bg-transparent text-white"
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-gray-300">
                    Nationality
                  </label>
                  <Input
                    value={artist.identityCard.nationality || "Nationality"}
                    readOnly
                    className="border-gradient-input h-9 bg-transparent text-white"
                    placeholder="Nationality"
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <div className="border-gray-400 border-2 border-solid transparent rounded-lg bg-[#121212] p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Email</label>
              <Input
                value={artist.email || "Email Artist"}
                readOnly
                className="border-gray-400 border-2 border-solid transparent bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">
                Phone Number
              </label>
              <Input
                value={artist.phoneNumber || "Phone Number"}
                readOnly
                className="border-gray-400 border-2 border-solid transparent bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">
                Artist Type
              </label>
              <Input
                value={artist.artistType}
                readOnly
                className="border-gray-400 border-2 border-solid transparent bg-gray-700 text-white"
              />
            </div>
            {/* <div>
              <label className="mb-1 block text-sm text-gray-300">
                Is Verified
              </label>
              <Input
                value={artist.isVerified ? "Verified" : "Not Verified"}
                readOnly
                className="border-gradient-input bg-gray-700 text-white"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
