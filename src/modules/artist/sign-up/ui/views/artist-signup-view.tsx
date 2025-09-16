"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export type ArtistSignUpStep = 'signup' | 'otp' | 'cccd' | 'artistType' | 'identity' | 'addMembers';
export type ArtistType = 'solo' | 'group' | null;

// Data interfaces for storing form data
interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface OTPData {
  otp: string[];
}

interface CCCDData {
  frontId: File | null;
  backId: File | null;
  citizenId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  placeOfOrigin: string;
  placeOfResidence: string;
  dateOfExpiration: string;
  phoneNumber: string;
  isManager: boolean;
  authorizationLetter: File | null;
  managerEmail: string;
  managerPassword: string;
  hasManager: boolean;
}

interface IdentityData {
  stageName: string;
  coverImage: File | null;
}

interface MemberData {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
}

const ArtistSignUpView = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ArtistSignUpStep>('signup');
  const [artistType, setArtistType] = useState<ArtistType>(null);
  
  // Store form data for each step
  const [signUpData, setSignUpData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [otpData, setOTPData] = useState<OTPData>({
    otp: ['', '', '', '', '', '']
  });
  
  const [cccdData, setCCCDData] = useState<CCCDData>({
    frontId: null,
    backId: null,
    citizenId: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    placeOfOrigin: '',
    placeOfResidence: '',
    dateOfExpiration: '',
    phoneNumber: '',
    isManager: false,
    authorizationLetter: null,
    managerEmail: '',
    managerPassword: '',
    hasManager: false
  });
  
  const [identityData, setIdentityData] = useState<IdentityData>({
    stageName: '',
    coverImage: null
  });
  
  const [membersData, setMembersData] = useState<MemberData[]>([]);

  const showSuccessAndRedirect = () => {
    // Show success message (you can use a toast library here)
    alert('Đăng ký tài khoản thành công!');
    
    // Redirect to login page
    router.push('/artist/login');
  };

  const handleNext = (data?: any) => {
    switch (currentStep) {
      case 'signup':
        if (data) setSignUpData(data);
        setCurrentStep('otp');
        break;
      case 'otp':
        if (data) setOTPData(data);
        setCurrentStep('cccd');
        break;
      case 'cccd':
        if (data) setCCCDData(data);
        setCurrentStep('artistType');
        break;
      case 'artistType':
        if (data) setArtistType(data.type);
        setCurrentStep('identity');
        break;
      case 'identity':
        if (data) setIdentityData(data);
        // Check artist type to decide next step
        if (artistType === 'solo') {
          // Solo artist - registration complete
          showSuccessAndRedirect();
        } else if (artistType === 'group') {
          // Group/Band - go to members section
          setCurrentStep('addMembers');
        }
        break;
      case 'addMembers':
        if (data) setMembersData(data);
        // Group registration complete
        showSuccessAndRedirect();
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
      case 'artistType':
        setCurrentStep('cccd');
        break;
      case 'identity':
        setCurrentStep('artistType');
        break;
      case 'addMembers':
        setCurrentStep('identity');
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'signup':
        return (
          <ArtistAuthLayout>
            <ArtistSignUpFormSection 
              onNext={handleNext} 
              initialData={signUpData}
            />
            <ArtistImageSection />
          </ArtistAuthLayout>
        );
      case 'otp':
        return (
          <ArtistOTPVerificationSection 
            onNext={handleNext} 
            onBack={handleBack}
            initialData={otpData}
          />
        );
      case 'cccd':
        return (
          <ArtistCCCDVerificationSection 
            onNext={handleNext} 
            onBack={handleBack}
            initialData={cccdData}
          />
        );
      case 'artistType':
        return (
          <ArtistTypeSelectionSection 
            onNext={handleNext} 
            onBack={handleBack}
            initialData={{ type: artistType }}
          />
        );
      case 'identity':
        return (
          <ArtistIdentitySection 
            onNext={handleNext} 
            onBack={handleBack}
            initialData={identityData}
          />
        );
      case 'addMembers':
        return (
          <ArtistMembersSection 
            onNext={handleNext} 
            onBack={handleBack}
            initialData={membersData}
          />
        );
      default:
        return (
          <ArtistAuthLayout>
            <ArtistSignUpFormSection 
              onNext={handleNext}
              initialData={signUpData}
            />
            <ArtistImageSection />
          </ArtistAuthLayout>
        );
    }
  };

  return renderCurrentStep();
};

export default ArtistSignUpView;
