"use client";

import React, { useEffect } from 'react';
import SignUpLayout from '../layouts/signup-layout';
import { 
  SignUpImageSection, 
  SignUpFormSection, 
  OTPVerificationSection, 
  ProfileCompletionSection 
} from '../sections';
import { useSignUpStore } from '../../../../../../store/stores/listener-signup-store';

const SignUpView = () => {
  const { currentStep, formData } = useSignUpStore();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'form':
        return (
          <SignUpLayout>
            <SignUpFormSection 
              onNext={() => {}}
              initialData={{
                email: formData.email || '',
                // password: formData.password || ''
              }}
            />
            <SignUpImageSection />
          </SignUpLayout>
        );
      case 'profile':
        return (
          <ProfileCompletionSection 
            onNext={() => {}}
            onBack={() => {}}
            initialData={{
              displayName: formData.displayName || '',
              dateOfBirth: formData.birthDate,
              gender: formData.gender || '',
              avatar: null
            }}
          />
        );
      case 'otp':
        return (
          <OTPVerificationSection 
            onNext={() => {}}
            onBack={() => {}}
            initialData={{
              otp: formData.otp || ''
            }}
          />
        );
      default:
        return (
          <SignUpLayout>
            <SignUpFormSection 
              onNext={() => {}}
              initialData={{
                email: formData.email || '',
                // password: formData.password || ''
              }}
            />
            <SignUpImageSection />
          </SignUpLayout>
        );
    }
  };

  return renderCurrentStep();
};

export default SignUpView;