"use client";

import React, { useState } from 'react';
import SignUpLayout from '../layouts/signup-layout';
import { 
  SignUpImageSection, 
  SignUpFormSection, 
  OTPVerificationSection, 
  ProfileCompletionSection 
} from '../sections';

export type SignUpStep = 'signup' | 'otp' | 'profile';

// Data interfaces for storing form data
interface SignUpFormData {
  email: string;
  password: string;
}

interface OTPData {
  otp: string;
}

interface ProfileData {
  displayName: string;
  dateOfBirth: Date | undefined;
  gender: string;
  avatar: File | null;
}

const SignUpView = () => {
  const [currentStep, setCurrentStep] = useState<SignUpStep>('signup');
  
  // Store form data for each step
  const [signUpData, setSignUpData] = useState<SignUpFormData>({
    email: '',
    password: ''
  });
  
  const [otpData, setOTPData] = useState<OTPData>({
    otp: ''
  });
  
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: '',
    dateOfBirth: undefined,
    gender: '',
    avatar: null
  });

  const handleNextStep = (data?: any) => {
    switch (currentStep) {
      case 'signup':
        if (data) setSignUpData(data);
        setCurrentStep('otp');
        break;
      case 'otp':
        if (data) setOTPData(data);
        setCurrentStep('profile');
        break;
      case 'profile':
        if (data) setProfileData(data);
        // Registration complete, handle success
        console.log('Registration complete:', { signUpData, otpData, profileData: data });
        break;
    }
  };

  const handlePrevStep = () => {
    switch (currentStep) {
      case 'otp':
        setCurrentStep('signup');
        break;
      case 'profile':
        setCurrentStep('otp');
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'signup':
        return (
          <SignUpLayout>
            <SignUpFormSection 
              onNext={handleNextStep} 
              initialData={signUpData}
            />
            <SignUpImageSection />
          </SignUpLayout>
        );
      case 'otp':
        return (
          <OTPVerificationSection 
            onNext={handleNextStep} 
            onBack={handlePrevStep}
            initialData={otpData}
          />
        );
      case 'profile':
        return (
          <ProfileCompletionSection 
            onNext={handleNextStep}
            onBack={handlePrevStep}
            initialData={profileData}
          />
        );
      default:
        return (
          <SignUpLayout>
            <SignUpFormSection 
              onNext={handleNextStep}
              initialData={signUpData}
            />
            <SignUpImageSection />
          </SignUpLayout>
        );
    }
  };

  return renderCurrentStep();
};

export default SignUpView;