"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  VerificationHeader,
  IDUploadComponent,
  PersonalInformationComponent,
} from "../components";
import { useArtistSignUpStore } from "@/store/stores/artist-signup-store";
import { useFPTAI } from "../../hooks/use-fpt-ai";
import { isValidPhoneNumber, formatPhoneNumber } from '@/utils/signup-utils';
import { toast } from "sonner";

interface ArtistCCCDVerificationSectionProps {
  onNext: (data?: any) => void;
  onBack: () => void;
  initialData?: {
    frontId: File | null;
    backId: File | null;
    authorizationLetter: File | null;
    citizenId: string;
    fullName: string;
    gender: string;
    placeOfOrigin: string;
    placeOfResidence: string;
    dateOfExpiration: string;
    phoneNumber: string;
    dateOfBirth: string;
    managerEmail: string;
    managerPassword: string;
    hasManager: boolean;
  };
}

const ArtistCCCDVerificationSection = ({ onNext, onBack, initialData }: ArtistCCCDVerificationSectionProps) => {
  // Get data from store
  const { 
    formData, 
    goToNextStep, 
    goToPreviousStep, 
    updateIdentityCard,
    updateFormData,
    isProcessingCCCD 
  } = useArtistSignUpStore();
  
  // FPT AI hook
  const {
    isAnalyzing,
    cccdFrontProcessed,
    cccdBackProcessed,
    analyzeFrontSide,
    analyzeBackSide,
    parsedData
  } = useFPTAI();

  const [frontId, setFrontId] = useState<File | null>(initialData?.frontId || null);
  const [backId, setBackId] = useState<File | null>(initialData?.backId || null);
  const [citizenId, setCitizenId] = useState(
    initialData?.citizenId || formData.identityCard?.number || ""
  );
  const [fullName, setFullName] = useState(
    initialData?.fullName || formData.identityCard?.fullName || ""
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    initialData?.dateOfBirth || formData.identityCard?.dateOfBirth || ""
  );
  const [gender, setGender] = useState(
    initialData?.gender || formData.identityCard?.gender || ""
  );
  const [placeOfOrigin, setPlaceOfOrigin] = useState(
    initialData?.placeOfOrigin || formData.identityCard?.placeOfOrigin || ""
  );
  const [placeOfResidence, setPlaceOfResidence] = useState(
    initialData?.placeOfResidence || formData.identityCard?.placeOfResidence?.addressLine || ""
  );
  const [dateOfExpiration, setDateOfExpiration] = useState(
    initialData?.dateOfExpiration || formData.identityCard?.validUntil || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    initialData?.phoneNumber || formData.phoneNumber || ""
  );
  const [isManager, setIsManager] = useState(initialData?.hasManager || false);
  const [authorizationLetter, setAuthorizationLetter] = useState<File | null>(
    initialData?.authorizationLetter || null,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-populate fields when FPT AI data is available
  useEffect(() => {
    if (parsedData) {
      setCitizenId(parsedData.id || "");
      setFullName(parsedData.name || "");
      setDateOfBirth(parsedData.dateOfBirth || "");
      setGender(parsedData.sex || "");
      setPlaceOfOrigin(parsedData.placeOfOrigin || "");
      setPlaceOfResidence(parsedData.address || "");
      setDateOfExpiration(parsedData.validUntil || "");
      updateFormData({
        fullName: parsedData.name || "",
        birthDate: parsedData.dateOfBirth || "",
        gender: parsedData.sex as any,
      });
    }
  }, [parsedData, updateFormData]);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (!frontId) {
      newErrors.frontId = "Vui lòng tải lên mặt trước của CCCD";
    }
    
    if (!backId) {
      newErrors.backId = "Vui lòng tải lên mặt sau của CCCD";
    }
    
    if (!citizenId.trim()) {
      newErrors.citizenId = "Vui lòng nhập số CCCD";
    }
    
    if (!fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
    }
    
    if (!dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Vui lòng nhập ngày sinh";
    }
    
    if (!gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }
    
    if (!placeOfOrigin.trim()) {
      newErrors.placeOfOrigin = "Vui lòng nhập quê quán";
    }
    
    if (!placeOfResidence.trim()) {
      newErrors.placeOfResidence = "Vui lòng nhập nơi thường trú";
    }
    
    if (!dateOfExpiration.trim()) {
      newErrors.dateOfExpiration = "Vui lòng nhập ngày hết hạn";
    }
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!isValidPhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không đúng định dạng. Sử dụng: 0xxxxxxxxx hoặc +84xxxxxxxxx";
    }
    
    // Check if CCCD processing is still in progress
    if (isProcessingCCCD || isAnalyzing) {
      toast.error("Đang xử lý CCCD, vui lòng đợi...");
      return;
    }
    
    // Recommend completing FPT AI processing
    if (!cccdFrontProcessed || !cccdBackProcessed) {
      toast.warning("Khuyến nghị: Hãy chờ hệ thống đọc xong thông tin CCCD để tự động điền thông tin");
    }
    
    // If user is manager, authorization letter is required
    if (isManager && !authorizationLetter) {
      newErrors.authorizationLetter = "Vui lòng tải lên giấy ủy quyền vì bạn đang thực hiện với tư cách quản lý";
    }
    
    // Update errors state
    setErrors(newErrors);
    
    // If there are no errors, proceed
    if (Object.keys(newErrors).length === 0) {
      // Update identity card data in store with current form values
      // This ensures any manual edits by user are preserved
      const identityCardData = {
        number: citizenId,
        fullName: fullName,
        dateOfBirth: dateOfBirth,
        gender: gender as any,
        placeOfOrigin: placeOfOrigin,
        nationality: "Việt Nam",
        placeOfResidence: {
          addressLine: placeOfResidence,
          street: parsedData?.addressEntities?.street || "",
          ward: parsedData?.addressEntities?.ward || "",
          province: parsedData?.addressEntities?.province || "",
        },
        validUntil: dateOfExpiration,
        // Preserve existing images if they exist in store
        frontImage: formData.identityCard?.frontImage || "",
        backImage: formData.identityCard?.backImage || "",
      };
      
      // Auto-map data from CCCD to main form fields (this ensures required fields are not missing)
      const additionalData = {
        phoneNumber: formatPhoneNumber(phoneNumber), // Format phone number
        birthDate: dateOfBirth, // Map CCCD dateOfBirth to main form birthDate
        fullName: fullName, // Map CCCD fullName to main form fullName  
        gender: gender as any, // Map CCCD gender to main form gender
      };
      // Update store with identity card data
      updateIdentityCard(identityCardData);
      
      // Navigate to next step using store
      goToNextStep(additionalData);
      
      // Also call the original onNext for component communication
      onNext({
        frontId,
        backId,
        citizenId,
        fullName,
        dateOfBirth,
        gender,
        placeOfOrigin,
        placeOfResidence,
        dateOfExpiration,
        phoneNumber: formatPhoneNumber(phoneNumber), // Format phone number
        isManager,
        authorizationLetter,
        managerEmail: "",
        managerPassword: "",
        hasManager: isManager
      });
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back" | "authorization",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "front") {
      setFrontId(file);
      // Automatically analyze with FPT AI
      try {
        await analyzeFrontSide(file);
      } catch (error) {
        console.error("Error analyzing front side:", error);
      }
    } else if (type === "back") {
      setBackId(file);
      // Automatically analyze with FPT AI
      try {
        await analyzeBackSide(file);
      } catch (error) {
        console.error("Error analyzing back side:", error);
      }
    } else {
      setAuthorizationLetter(file);
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

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            className="rounded-md primary_gradient px-8 py-3 font-medium text-white transition duration-300 ease-in-out hover:opacity-60"
            size="lg"
          >
            Continute
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCCCDVerificationSection;
