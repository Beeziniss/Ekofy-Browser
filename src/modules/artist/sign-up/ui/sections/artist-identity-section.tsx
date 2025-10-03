"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import EkofyLogo from '../../../../../../public/ekofy-logo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useArtistSignUpStore } from '@/store/stores/artist-signup-store';
import useArtistSignUp from '../../hooks/use-artist-sign-up';
import { convertArtistStoreDataToAPIFormat } from '@/utils/signup-utils';
import { toast } from 'sonner';

interface ArtistIdentitySectionProps {
  onNext: (data?: any) => void;
  onBack: () => void;
  initialData?: {
    coverImage: File | null;
    stageName: string;
  };
}

const ArtistIdentitySection = ({ onNext, onBack, initialData }: ArtistIdentitySectionProps) => {
  const { formData, updateFormData, goToNextStep, proceedToRegistration } = useArtistSignUpStore();
  const { signUp, isLoading } = useArtistSignUp();
  
  const [coverImage, setCoverImage] = useState<File | null>(initialData?.coverImage || null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [stageName, setStageName] = useState(initialData?.stageName || formData.stageName || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (coverImage) {
      const url = URL.createObjectURL(coverImage);
      setCoverImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [coverImage]);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!coverImage) {
      newErrors.coverImage = "Vui lòng tải lên ảnh bìa";
    }
    
    if (!stageName.trim()) {
      newErrors.stageName = "Vui lòng nhập nghệ danh";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Update store with identity data
      const identityData = {
        stageName: stageName.trim(),
      };
      
      updateFormData(identityData);
      
      // Check artist type to determine next action
      if (formData.artistType === "INDIVIDUAL") {
        try {
          // Combine current formData with new identity data
          const combinedData = {
            ...formData,
            ...identityData
          };
          
          // Debug: Log the combined data
          console.log("🔍 Combined Data before API call:", combinedData);
          console.log("📋 Required fields check:");
          console.log("- email:", combinedData.email ? "✅" : "❌");
          console.log("- password:", combinedData.password ? "✅" : "❌");
          console.log("- confirmPassword:", combinedData.confirmPassword ? "✅" : "❌");
          console.log("- fullName:", combinedData.fullName ? "✅" : "❌");
          console.log("- phoneNumber:", combinedData.phoneNumber ? "✅" : "❌");
          console.log("- stageName:", combinedData.stageName ? "✅" : "❌");
          console.log("- identityCard:", combinedData.identityCard ? "✅" : "❌");
          
          // Convert store data to API format for registration
          const registrationData = convertArtistStoreDataToAPIFormat(combinedData);
          
          // Debug: Log the registration data
          console.log("🚀 Registration Data:", registrationData);
          
          // Call registration API
          signUp(registrationData);
          
          // Move to OTP step after API call
          proceedToRegistration();
          
        } catch (error) {
          console.error("❌ Registration error:", error);
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
          }
        }
      } else {
        goToNextStep(identityData);
      }
      
      // Also call the original onNext for backward compatibility
      onNext({
        coverImage,
        stageName
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] px-6 py-12">
      <div className="w-full max-w-6xl">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center text-white hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full flex items-center justify-center mr-3">
              <Image src={EkofyLogo} alt="Logo" width={60} height={60} />
            </div>
            <h1 className="text-4xl font-bold text-primary-gradient">Ekofy</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Define Your Identity</h2>
          <p className="text-gray-300 text-sm mb-8">
            Choose a stage name that represents you or your band.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-4">Add cover image</label>
            <div className="relative w-full">
              <div className={`w-full h-80 border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-gray-600'} rounded-lg flex flex-col items-center justify-center bg-gray-800/30 cursor-pointer hover:border-gray-500 transition-colors`}>
                {coverImagePreview ? (
                  <Image
                    src={coverImagePreview}
                    width={1000}
                    height={1000}
                    alt="Cover Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-white text-sm font-medium mb-2">Add cover image</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            {errors.coverImage && (
              <p className="mt-2 text-sm text-red-400">{errors.coverImage}</p>
            )}
            <p className="text-gray-400 text-xs mt-3">
              Upload a high-quality image that represents your band/artist. Recommended size 1500×600px, JPG or PNG, under 5MB
            </p>
          </div>

          {/* Right Side - Stage Name */}
          <div className="flex flex-col justify-center h-80">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Stage Name*</label>
              <Input
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="Enter stage name"
                className={`w-full ${errors.stageName ? 'border-gradient-input-error' : 'border-gradient-input'} text-white placeholder-gray-400 h-12`}
              />
              {errors.stageName && (
                <p className="mt-2 text-sm text-red-400">{errors.stageName}</p>
              )}
              <p className="text-gray-400 text-xs mt-2">
                Your stage name will appear on your profile and tracks. Make sure it's unique and easy to recognize.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            className="primary_gradient hover:opacity-90 text-white font-medium py-3 px-8 rounded-md transition duration-300 ease-in-out"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : (formData.artistType === "INDIVIDUAL" ? 'Tiếp tục' : 'Tiếp tục và Đăng ký')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistIdentitySection;