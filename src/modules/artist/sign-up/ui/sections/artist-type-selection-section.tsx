"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useArtistSignUpStore } from "@/store/stores/artist-signup-store";
import { ArtistType } from "@/gql/graphql";
import { EkofyLogo } from "@/assets/icons";

interface ArtistTypeSelectionSectionProps {
  onNext: (data: { type: "INDIVIDUAL" | "BAND" }) => void;
  onBack: () => void;
  initialData?: { type: "INDIVIDUAL" | "BAND" | null };
}

const ArtistTypeSelectionSection = ({ onNext, onBack, initialData }: ArtistTypeSelectionSectionProps) => {
  const { formData, updateFormData, goToNextStep } = useArtistSignUpStore();

  const [artistType, setArtistType] = useState<"INDIVIDUAL" | "BAND" | null>(
    initialData?.type ||
      (formData.artistType === "INDIVIDUAL" ? "INDIVIDUAL" : formData.artistType === "BAND" ? "BAND" : null),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    if (!artistType) {
      setErrors({ artistType: "Please select an artist type" });
      return;
    }

    setErrors({});
    // Convert UI type to GraphQL enum
    const graphQLArtistType: ArtistType = artistType === "INDIVIDUAL" ? ArtistType.Individual : ArtistType.Band;

    // Update store with artist type
    const typeData = {
      artistType: graphQLArtistType,
    };

    updateFormData(typeData);

    // Navigate to next step using store
    goToNextStep(typeData);

    // Also call the original onNext for backward compatibility
    onNext({ type: artistType });
  };

  // Custom SVG Components with Gradient
  const UserRoundGradient = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient-user" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B54EA" />
          <stop offset="100%" stopColor="#AB4EE5" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="8"
        r="5"
        stroke="url(#gradient-user)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 21a8 8 0 0 0-16 0"
        stroke="url(#gradient-user)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const UsersGradient = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient-users" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B54EA" />
          <stop offset="100%" stopColor="#AB4EE5" />
        </linearGradient>
      </defs>
      <path
        d="M18 21a8 8 0 0 0-16 0"
        stroke="url(#gradient-users)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="10"
        cy="8"
        r="5"
        stroke="url(#gradient-users)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"
        stroke="url(#gradient-users)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <button onClick={onBack} className="mb-8 flex items-center text-white transition-colors hover:text-blue-400">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        {/* Logo and Title */}
        <div className="mb-12 text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="mr-3 flex items-center justify-center rounded-full">
              <EkofyLogo className="size-[60px]" />
            </div>
            <h1 className="text-primary-gradient text-4xl font-bold">Ekofy</h1>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">Choose Your Artist Type</h2>
          <p className="mb-8 text-sm text-gray-300">Tell us how you bring your music to the stage.</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Solo Artist Option */}
          <div
            className={`relative cursor-pointer rounded-lg border-2 p-8 transition-all hover:scale-105 ${
              artistType === "INDIVIDUAL"
                ? "border-gray-600 bg-gray-800/30 hover:border-gray-500"
                : "border-gradient-input"
            }`}
            onClick={() => {
              setArtistType("INDIVIDUAL");
              setErrors({});
            }}
          >
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <UserRoundGradient />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Solo Artist</h3>
              <p className="text-sm text-gray-400">Perform and share your music as an individual creator</p>
            </div>
          </div>

          {/* Band Option */}
          <div
            className={`relative cursor-pointer rounded-lg border-2 p-8 transition-all hover:scale-105 ${
              artistType === "BAND" ? "border-gray-600 bg-gray-800/30 hover:border-gray-500" : "border-gradient-input"
            }`}
            onClick={() => {
              setArtistType("BAND");
              setErrors({});
            }}
          >
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <UsersGradient />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Band</h3>
              <p className="text-sm text-gray-400">
                Collaborate with your members, release music together, and connect with fans as one.
              </p>
            </div>
          </div>
        </div>

        {errors.artistType && <p className="mb-4 text-center text-sm text-red-400">{errors.artistType}</p>}
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            className="primary_gradient rounded-md px-8 py-3 font-medium text-white transition duration-300 ease-in-out hover:opacity-60"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistTypeSelectionSection;
