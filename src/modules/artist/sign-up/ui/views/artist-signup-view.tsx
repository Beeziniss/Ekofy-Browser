"use client";

import React from "react";
// import { useRouter } from 'next/navigation';
import { useArtistSignUpStore } from "@/store/stores/artist-signup-store";
import {
  ArtistSignUpFormSection,
  // ArtistOTPVerificationSection, // Commented out as OTP is no longer used
  ArtistCCCDVerificationSection,
  ArtistIdentitySection,
  ArtistTypeSelectionSection,
  ArtistMembersSection,
  ArtistImageSection,
} from "../sections";

import ArtistAuthLayout from "../layouts/artist-signup-layout";

const ArtistSignUpView = () => {
  // const router = useRouter();
  const { currentStep, goToPreviousStep } = useArtistSignUpStore();

  // Navigation after successful registration completion
  // const handleRegistrationSuccess = () => {
  //   // Navigate to artist dashboard or success page
  //   setTimeout(() => {
  //     router.push('/artist/login'); // or wherever you want to redirect after successful registration
  //   }, 1500);
  // };

  // Handle back navigation
  const handleBack = () => {
    goToPreviousStep();
  };

  // Render component based on current step
  const renderStepComponent = () => {
    switch (currentStep) {
      case "form":
        return (
          <ArtistAuthLayout>
            <ArtistSignUpFormSection
              onNext={() => {}} // Handled by store
            />
            <ArtistImageSection />
          </ArtistAuthLayout>
        );

      case "cccd":
        return (
          <ArtistCCCDVerificationSection
            onNext={() => {}} // Handled by store
            onBack={handleBack}
          />
        );

      case "type":
        return (
          <ArtistTypeSelectionSection
            onNext={() => {}} // Handled by store
            onBack={handleBack}
          />
        );

      case "identity":
        return (
          <ArtistIdentitySection
            onNext={() => {}} // Handled by store
            onBack={handleBack}
          />
        );

      case "members":
        return (
          <ArtistMembersSection
            onNext={() => {}} // Handled by store
            onBack={handleBack}
          />
        );

      // OTP step is no longer used
      // case 'otp':
      //   return (
      //     <ArtistOTPVerificationSection
      //       onNext={handleRegistrationSuccess} // Final step navigation
      //       onBack={handleBack}
      //     />
      //   );

      default:
        return (
          <ArtistAuthLayout>
            <ArtistSignUpFormSection
              onNext={() => {}} // Handled by store
            />
            <ArtistImageSection />
          </ArtistAuthLayout>
        );
    }
  };

  return <>{renderStepComponent()}</>;
};

export default ArtistSignUpView;
