"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface ArtistInfoCardProps {
  artist: any; // Using any for now to work with GraphQL response
}

export function ArtistInfoCard({ artist }: ArtistInfoCardProps) {
  return (
    <div className="space-y-4">
      {/* Header with Avatar and Info */}
      <div className="mx-auto w-full rounded-lg bg-[#121212] pt-6 pb-6">
        <div className="primary_gradient h-32 w-full rounded-lg"></div>

        <div className="relative">
          <div className="primary_gradient absolute -top-12 left-6 h-24 w-24 rounded-full border-2 border-black"></div>
        </div>

        <div className="mt-16 flex items-center gap-3 px-6 text-lg font-semibold text-white">
          <span>{artist.stageName}</span>
          <span className="text-white/60">•</span>
          <span>{artist.email}</span>
        </div>
      </div>

      {/* Identity Card Information */}
      {artist.identityCard && (
        <div className="border-gradient-input rounded-xl border-2 bg-black/40 p-6">
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
                <div className="border-gradient-input flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-blue-600">
                  {artist.identityCard.frontImage ? (
                    <Image
                      src={artist.identityCard.frontImage}
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
                <div className="border-gradient-input flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-blue-600">
                  {artist.identityCard.backImage ? (
                    <Image
                      src={artist.identityCard.backImage}
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
                  value={artist.identityCard.number || "Number of Citizen"}
                  readOnly
                  className="border-gradient-input h-9 bg-transparent text-white"
                  placeholder="Number of Citizen"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-300">
                  Full Name
                </label>
                <Input
                  value={artist.identityCard.fullName || "Full Name"}
                  readOnly
                  className="border-gradient-input h-9 bg-transparent text-white"
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
                      artist.identityCard.dateOfBirth
                        ? new Date(
                            artist.identityCard.dateOfBirth,
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
                    Gender
                  </label>
                  <Input
                    value={artist.identityCard.gender || "Gender"}
                    readOnly
                    className="border-gradient-input h-9 bg-transparent text-white"
                    placeholder="Gender"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-300">
                  Place of origin
                </label>
                <Input
                  value={artist.identityCard.placeOfOrigin || "Place of origin"}
                  readOnly
                  className="border-gradient-input h-9 bg-transparent text-white"
                  placeholder="Place of origin"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-300">
                  Place of residence
                </label>
                <Input
                  value={
                    artist.identityCard.placeOfResidence?.addressLine ||
                    "Place of residence"
                  }
                  readOnly
                  className="border-gradient-input h-9 bg-transparent text-white"
                  placeholder="Place of residence"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="space-y-4">
        <div className="border-gradient-input rounded-lg border bg-[#121212] p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Email</label>
              <Input
                value={artist.email || "Email Artist"}
                readOnly
                className="border-gradient-input bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">
                Phone Number
              </label>
              <Input
                value={artist.user?.phoneNumber || "Phone Number"}
                readOnly
                className="border-gradient-input bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">
                Artist Type
              </label>
              <Input
                value={artist.artistType}
                readOnly
                className="border-gradient-input bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">
                Is Verified
              </label>
              <Input
                value={artist.isVerified ? "Verified" : "Not Verified"}
                readOnly
                className="border-gradient-input bg-gray-700 text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
