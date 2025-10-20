"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import EkofyLogo from '../../../../../../public/ekofy-logo.svg';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useArtistSignUpStore } from '@/store/stores/artist-signup-store';
import { ArtistType } from '@/gql/graphql';

interface ArtistTypeSelectionSectionProps {
  onNext: (data: { type: 'INDIVIDUAL' | 'BAND' }) => void;
  onBack: () => void;
  initialData?: { type: 'INDIVIDUAL' | 'BAND' | null };
}

const ArtistTypeSelectionSection = ({ onNext, onBack, initialData }: ArtistTypeSelectionSectionProps) => {
  const { formData, updateFormData, goToNextStep } = useArtistSignUpStore();
  
  const [artistType, setArtistType] = useState<'INDIVIDUAL' | 'BAND' | null>(
    initialData?.type || 
    (formData.artistType === "INDIVIDUAL" ? "INDIVIDUAL" : 
     formData.artistType === "BAND" ? "BAND" : null)
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
      <circle cx="12" cy="8" r="5" stroke="url(#gradient-user)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 21a8 8 0 0 0-16 0" stroke="url(#gradient-user)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
      <path d="M18 21a8 8 0 0 0-16 0" stroke="url(#gradient-users)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10" cy="8" r="5" stroke="url(#gradient-users)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" stroke="url(#gradient-users)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center text-white hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full flex items-center justify-center mr-3">
              <Image src={EkofyLogo} alt="Logo" width={60} height={60} />
            </div>
            <h1 className="text-4xl font-bold text-primary-gradient">Ekofy</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Artist Type</h2>
          <p className="text-gray-300 text-sm mb-8">
            Tell us how you bring your music to the stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Solo Artist Option */}
          <div 
            className={`relative p-8 border-2 rounded-lg cursor-pointer transition-all hover:scale-105 ${
              artistType === 'INDIVIDUAL'
                ? 'border-gray-600 hover:border-gray-500 bg-gray-800/30' 
                : 'border-gradient-input'
            }`}
            onClick={() => {
              setArtistType('INDIVIDUAL');
              setErrors({});
            }}
          >
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <UserRoundGradient />
              </div>
              <h3 className="text-white text-xl font-semibold mb-3">Solo Artist</h3>
              <p className="text-gray-400 text-sm"> 
                Perform and share your music as an individual creator
              </p>
            </div>
          </div>

          {/* Band Option */}
          <div 
            className={`relative p-8 border-2 rounded-lg cursor-pointer transition-all hover:scale-105 ${
              artistType === 'BAND'
                ? 'border-gray-600 hover:border-gray-500 bg-gray-800/30' 
                : 'border-gradient-input'
            }`}
            onClick={() => {
              setArtistType('BAND');
              setErrors({});
            }}
          >
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <UsersGradient />
              </div>
              <h3 className="text-white text-xl font-semibold mb-3">Band</h3>
              <p className="text-gray-400 text-sm">
                Collaborate with your members, release music together, and connect with fans as one.
              </p>
            </div>
          </div>
        </div>

        {errors.artistType && (
          <p className="text-center text-sm text-red-400 mb-4">{errors.artistType}</p>
        )}
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            className="primary_gradient hover:opacity-60 text-white font-medium py-3 px-8 rounded-md transition duration-300 ease-in-out"
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