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
import { uploadImageToCloudinary, validateImageFile } from '@/utils/cloudinary-utils';
import { useRouter } from 'next/navigation';

interface ArtistIdentitySectionProps {
  onNext: (data?: any) => void;
  onBack: () => void;
  initialData?: {
    // coverImage: File | null;
    stageName: string;
    avatarImage?: File | null;
  };
}

const ArtistIdentitySection = ({ onNext, onBack, initialData }: ArtistIdentitySectionProps) => {
  const router = useRouter();
  const { formData, sessionData, updateFormData, goToNextStep } = useArtistSignUpStore();
  
  // Handle navigation to login after successful registration
  const handleNavigateToLogin = () => {
    router.push('/artist/login');
  };
  
  const { signUp, isLoading } = useArtistSignUp(handleNavigateToLogin);
  
  // Initialize state from global store or initial data
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<File | null>(initialData?.avatarImage || null);
  const [avatarImagePreview, setAvatarImagePreview] = useState<string | null>(null);
  const [stageName, setStageName] = useState(initialData?.stageName || formData.stageName || '');
  const [coverUploading, setCoverUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(formData.avatarImage || null);
  const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(formData.avatarImage || null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load data from global state when component mounts or store updates
  useEffect(() => {
    if (formData.stageName) setStageName(formData.stageName);
    if (formData.avatarImage) {
      setAvatarImageUrl(formData.avatarImage);
      setAvatarImagePreview(formData.avatarImage);
    }
  }, [formData]);

  // Save form data to global state on input change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFormData({ 
        stageName,
        avatarImage: avatarImageUrl || undefined 
      });
    }, 300); // Debounce to avoid too many updates

    return () => clearTimeout(timeoutId);
  }, [stageName, avatarImageUrl, updateFormData]);

  useEffect(() => {
    if (avatarImage) {
      const url = URL.createObjectURL(avatarImage);
      setAvatarImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (avatarImageUrl && !avatarImage) {
      // Show stored URL if no new file is selected
      setAvatarImagePreview(avatarImageUrl);
    } else {
      setAvatarImagePreview(null);
    }
  }, [avatarImage, avatarImageUrl]);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    // if (!coverImage) {
    //   newErrors.coverImage = "Vui lòng tải lên ảnh bìa";
    // }
    
    if (!stageName.trim()) {
      newErrors.stageName = "Please enter your stage name";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Update store with identity data
      const identityData = {
        stageName: stageName.trim(),
        avatarImage: avatarImageUrl || undefined, // Add avatar image URL to store
      };
      
      updateFormData(identityData);
      
      // Check artist type to determine next action
      if (formData.artistType === "INDIVIDUAL") {
        try {
          // Combine current formData with new identity data and session data (including password)
          const combinedData = {
            ...formData,
            ...sessionData, // Include password from session data
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
          console.log("- avatarImage:", combinedData.avatarImage ? "✅" : "❌");
          console.log("- identityCard:", combinedData.identityCard ? "✅" : "❌");
          
          // Convert store data to API format for registration
          const registrationData = convertArtistStoreDataToAPIFormat({
            ...combinedData,
            avatarImage: avatarImageUrl || undefined // Add avatar image URL
          });
          
          // Debug: Log the registration data
          console.log("🚀 Registration Data:", registrationData);
          
          // Call registration API
          signUp(registrationData);
          
          // Registration will redirect to login on success via hook
          
        } catch (error) {
          console.error("❌ Registration error:", error);
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An error occurred. Please try again.");
          }
        }
      } else {
        goToNextStep(identityData);
      }
      
      // Also call the original onNext for backward compatibility
      onNext({
        // coverImage,
        stageName,
        avatarImage
      });
    }
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file
    if (!validateImageFile(file, 5)) {
      return;
    }

    // setCoverImage(file);
    setCoverUploading(true);

    try {
      // Upload to Cloudinary
      const uploadResult = await uploadImageToCloudinary(file, {
        folder: 'artist-covers',
        tags: ['artist', 'cover']
      });

      setCoverImageUrl(uploadResult.secure_url);
      toast.success('Tải ảnh bìa lên thành công!');
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast.error('Error uploading cover image. Please try again.');
      // setCoverImage(null);
      setCoverImageUrl(null);
    } finally {
      setCoverUploading(false);
    }
  };

  const handleAvatarImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file
    if (!validateImageFile(file, 5)) {
      return;
    }

    setAvatarImage(file);
    setAvatarUploading(true);

    try {
      // Upload to Cloudinary
      const uploadResult = await uploadImageToCloudinary(file, {
        folder: 'artist-avatars',
        tags: ['artist', 'avatar']
      });

      setAvatarImageUrl(uploadResult.secure_url);
      toast.success('Tải ảnh đại diện lên thành công!');
      
      // Store avatar URL in form data immediately
      updateFormData({ avatarImage: uploadResult.secure_url });
      console.log("✅ Avatar uploaded and stored:", uploadResult.secure_url);
    } catch (error) {
      console.error('Error uploading avatar image:', error);
      toast.error('Error uploading profile image. Please try again.');
      setAvatarImage(null);
      setAvatarImageUrl(null);
    } finally {
      setAvatarUploading(false);
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Avatar Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-4">Add avatar image</label>
            <div className="relative w-full">
              <div className={`w-full h-64 border-2 border-dashed ${errors.avatarImage ? 'border-red-500' : 'border-gray-600'} rounded-lg flex flex-col items-center justify-center bg-gray-800/30 cursor-pointer hover:border-gray-500 transition-colors`}>
                {avatarImagePreview ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={avatarImagePreview}
                      width={1000}
                      height={1000}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {avatarUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="text-white text-sm">Uploading...</div>
                      </div>
                    )}
                    {/* Clear button */}
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarImage(null);
                        setAvatarImageUrl(null);
                        setAvatarImagePreview(null);
                        updateFormData({ avatarImage: undefined });
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-white text-sm font-medium mb-2">Add avatar image</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarImageUpload}
                disabled={avatarUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
            {errors.avatarImage && (
              <p className="mt-2 text-sm text-red-400">{errors.avatarImage}</p>
            )}
            <p className="text-gray-400 text-xs mt-3">
              Upload your profile picture. Recommended size 500×500px, JPG or PNG, under 5MB
            </p>
          </div>

          {/* Middle - Cover Image Upload */}
          {/* <div>
            <label className="block text-sm font-medium text-white mb-4">Add cover image</label>
            <div className="relative w-full">
              <div className={`w-full h-64 border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-gray-600'} rounded-lg flex flex-col items-center justify-center bg-gray-800/30 cursor-pointer hover:border-gray-500 transition-colors`}>
                {coverImagePreview ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={coverImagePreview}
                      width={1000}
                      height={1000}
                      alt="Cover Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {coverUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="text-white text-sm">Uploading...</div>
                      </div>
                    )}
                  </div>
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
                onChange={handleCoverImageUpload}
                disabled={coverUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
            {errors.coverImage && (
              <p className="mt-2 text-sm text-red-400">{errors.coverImage}</p>
            )}
            <p className="text-gray-400 text-xs mt-3">
              Upload a high-quality cover image. Recommended size 1500×600px, JPG or PNG, under 5MB
            </p>
          </div> */}

          {/* Right Side - Stage Name */}
          <div className="flex flex-col justify-center h-64">
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
            disabled={isLoading || coverUploading || avatarUploading}
          >
            {coverUploading || avatarUploading ? 'Uploading images...' : isLoading ? 'Processing...' : (formData.artistType === "INDIVIDUAL" ? 'Register' : 'Continue')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistIdentitySection;