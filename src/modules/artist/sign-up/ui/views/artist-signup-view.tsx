"use client";

import React, { useState } from 'react';
import { 
  ArtistSignUpFormSection,
  ArtistOTPVerificationSection,
  ArtistCCCDVerificationSection,
  ArtistIdentitySection,
  ArtistTypeSelectionSection,
  ArtistMembersSection,
  ArtistImageSection
} from '../sections';

import ArtistAuthLayout from '../layouts/artist-signup-layout';
export type ArtistSignUpStep = 'signup' | 'otp' | 'cccd' | 'identity' | 'artistType' | 'addMembers';

const ArtistSignUpView = () => {
  const [currentStep, setCurrentStep] = useState<ArtistSignUpStep>('signup');

  const handleNext = () => {
    switch (currentStep) {
      case 'signup':
        setCurrentStep('otp');
        break;
      case 'otp':
        setCurrentStep('cccd');
        break;
      case 'cccd':
        setCurrentStep('identity');
        break;
      case 'identity':
        setCurrentStep('artistType');
        break;
      case 'artistType':
        setCurrentStep('addMembers');
        break;
      case 'addMembers':
        console.log('Registration completed!');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'otp':
        setCurrentStep('signup');
        break;
      case 'cccd':
        setCurrentStep('otp');
        break;
      case 'identity':
        setCurrentStep('cccd');
        break;
      case 'artistType':
        setCurrentStep('identity');
        break;
      case 'addMembers':
        setCurrentStep('artistType');
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'signup':
        return (
          <ArtistAuthLayout>
            <ArtistSignUpFormSection onNext={handleNext} />
            <ArtistImageSection />
          </ArtistAuthLayout>
        );
      case 'otp':
        return <ArtistOTPVerificationSection onNext={handleNext} onBack={handleBack} />;
      case 'cccd':
        return <ArtistCCCDVerificationSection onNext={handleNext} onBack={handleBack} />;
      case 'identity':
        return <ArtistIdentitySection onNext={handleNext} onBack={handleBack} />;
      case 'artistType':
        return <ArtistTypeSelectionSection onNext={handleNext} onBack={handleBack} />;
      case 'addMembers':
        return <ArtistMembersSection onNext={handleNext} onBack={handleBack} />;
      default:
        return (
          <ArtistAuthLayout>
            <ArtistImageSection />
            <ArtistSignUpFormSection onNext={handleNext} />
          </ArtistAuthLayout>
        );
    }
  };

  return renderCurrentStep();
};

export default ArtistSignUpView;
