"use client";

import React, { useState } from 'react';
import SignUpLayout from '../layouts';
import { 
  SignUpImageSection, 
  SignUpFormSection, 
  OTPVerificationSection, 
  ProfileCompletionSection 
} from '../sections';

export type SignUpStep = 'signup' | 'otp' | 'profile';

const SignUpView = () => {
  const [currentStep, setCurrentStep] = useState<SignUpStep>('signup');

  const handleNextStep = () => {
    if (currentStep === 'signup') {
      setCurrentStep('otp');
    } else if (currentStep === 'otp') {
      setCurrentStep('profile');
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'otp') {
      setCurrentStep('signup');
    } else if (currentStep === 'profile') {
      setCurrentStep('otp');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'signup':
        return (
          <SignUpLayout>
            <SignUpFormSection onNext={handleNextStep} />
            <SignUpImageSection />
          </SignUpLayout>
        );
      case 'otp':
        return <OTPVerificationSection onNext={handleNextStep} onBack={handlePrevStep} />;
      case 'profile':
        return <ProfileCompletionSection onBack={handlePrevStep} />;
      default:
        return (
          <SignUpLayout>
            <SignUpFormSection onNext={handleNextStep} />
            <SignUpImageSection />
          </SignUpLayout>
        );
    }
  };

  return renderCurrentStep();
};

export default SignUpView;