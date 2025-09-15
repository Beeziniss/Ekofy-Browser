"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  VerificationHeader,
  IDUploadComponent,
  PersonalInformationComponent,
  ManagerAuthorizationComponent,
} from "../components";

interface ArtistCCCDVerificationSectionProps {
  onNext: () => void;
  onBack: () => void;
}

const ArtistCCCDVerificationSection = ({ onNext, onBack }: ArtistCCCDVerificationSectionProps) => {
  const [frontId, setFrontId] = useState<File | null>(null);
  const [backId, setBackId] = useState<File | null>(null);
  const [citizenId, setCitizenId] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [placeOfOrigin, setPlaceOfOrigin] = useState("");
  const [placeOfResidence, setPlaceOfResidence] = useState("");
  const [dateOfExpiration, setDateOfExpiration] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isManager, setIsManager] = useState(false);
  const [authorizationLetter, setAuthorizationLetter] = useState<File | null>(
    null,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (!frontId) {
      newErrors.frontId = "Please upload the front side of your ID card";
    }
    
    if (!backId) {
      newErrors.backId = "Please upload the back side of your ID card";
    }
    
    if (!citizenId.trim()) {
      newErrors.citizenId = "Please enter your Citizen ID";
    }
    
    if (!fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    }
    
    if (!dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Please enter your date of birth";
    }
    
    if (!gender) {
      newErrors.gender = "Please select your gender";
    }
    
    if (!placeOfOrigin.trim()) {
      newErrors.placeOfOrigin = "Please enter your place of origin";
    }
    
    if (!placeOfResidence.trim()) {
      newErrors.placeOfResidence = "Please enter your place of residence";
    }
    
    if (!dateOfExpiration.trim()) {
      newErrors.dateOfExpiration = "Please enter the date of expiration";
    }
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Please enter your phone number";
    }
    
    // If user is manager, authorization letter is required
    if (isManager && !authorizationLetter) {
      newErrors.authorizationLetter = "Please upload the authorization letter as you indicated you are acting as a manager";
    }
    
    // Update errors state
    setErrors(newErrors);
    
    // If there are no errors, proceed
    if (Object.keys(newErrors).length === 0) {
      console.log("CCCD verification:", {
        frontId,
        backId,
        citizenId,
        fullName,
        dateOfBirth,
        gender,
        placeOfOrigin,
        placeOfResidence,
        dateOfExpiration,
        phoneNumber,
        isManager,
        authorizationLetter,
      });
      onNext();
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back" | "authorization",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "front") setFrontId(file);
      else if (type === "back") setBackId(file);
      else setAuthorizationLetter(file);
    }
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    switch (field) {
      case 'citizenId':
        setCitizenId(value);
        break;
      case 'fullName':
        setFullName(value);
        break;
      case 'dateOfBirth':
        setDateOfBirth(value);
        break;
      case 'gender':
        setGender(value);
        break;
      case 'placeOfOrigin':
        setPlaceOfOrigin(value);
        break;
      case 'placeOfResidence':
        setPlaceOfResidence(value);
        break;
      case 'dateOfExpiration':
        setDateOfExpiration(value);
        break;
      case 'phoneNumber':
        setPhoneNumber(value);
        break;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] px-6 py-12">
      <div className="w-full max-w-6xl">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-white transition-colors hover:text-blue-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        {/* Header */}
        <VerificationHeader />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Side - ID Upload */}
          <IDUploadComponent
            frontId={frontId}
            backId={backId}
            errors={errors}
            onFileUpload={handleFileUpload}
          />

          {/* Right Side - Personal Information */}
          <PersonalInformationComponent
            citizenId={citizenId}
            fullName={fullName}
            dateOfBirth={dateOfBirth}
            gender={gender}
            placeOfOrigin={placeOfOrigin}
            placeOfResidence={placeOfResidence}
            dateOfExpiration={dateOfExpiration}
            phoneNumber={phoneNumber}
            errors={errors}
            onChange={handlePersonalInfoChange}
          />
        </div>

        {/* Manager Authorization */}
        <ManagerAuthorizationComponent
          isManager={isManager}
          authorizationLetter={authorizationLetter}
          errors={errors}
          onManagerChange={setIsManager}
          onFileUpload={handleFileUpload}
        />

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            className="rounded-md primary_gradient px-8 py-3 font-medium text-white transition duration-300 ease-in-out hover:opacity-60"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCCCDVerificationSection;
