"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import {
  VerificationHeader,
  IDUploadComponent,
  PersonalInformationComponent,
} from "../components";
import { useArtistSignUpStore } from "@/store/stores/artist-signup-store";
import { useFPTAI } from "../../hooks/use-fpt-ai";
// import { isValidPhoneNumber, formatPhoneNumber } from "@/utils/signup-utils";
import { toast } from "sonner";
import { uploadImageToCloudinary, validateImageFile } from "@/utils/cloudinary-utils";
import { convertDateToISO, convertISOToDisplayDate } from "@/utils/signup-utils";

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
    isProcessingCCCD,
    setCCCDFrontProcessed,
    setCCCDBackProcessed
  } = useArtistSignUpStore();  // FPT AI hook
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
  const [frontIdPreview, setFrontIdPreview] = useState<string | null>(null);
  const [backIdPreview, setBackIdPreview] = useState<string | null>(null);
  const [citizenId, setCitizenId] = useState(
    initialData?.citizenId || formData.identityCard?.number || ""
  );
  const [fullName, setFullName] = useState(
    initialData?.fullName || formData.identityCard?.fullName || ""
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    initialData?.dateOfBirth || 
    (formData.identityCard?.dateOfBirth ? convertISOToDisplayDate(formData.identityCard.dateOfBirth) : "") ||
    (formData.birthDate ? convertISOToDisplayDate(formData.birthDate) : "") || ""
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
    initialData?.dateOfExpiration || 
    (formData.identityCard?.validUntil ? convertISOToDisplayDate(formData.identityCard.validUntil) : "") || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    initialData?.phoneNumber || formData.phoneNumber || ""
  );
  const [isManager, setIsManager] = useState(initialData?.hasManager || false);
  const [authorizationLetter, setAuthorizationLetter] = useState<File | null>(
    initialData?.authorizationLetter || null,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Phone number validation (must be exactly 10 digits)
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Date formatting function - keeps DD/MM/YYYY format
  const formatDate = (date: Date | string) => {
    if (date instanceof Date) {
      return format(date, "dd/MM/yyyy");
    }
    // If it's already a string, check if it's DD/MM/YYYY format or ISO format
    if (typeof date === 'string') {
      // If it's ISO format, convert back to DD/MM/YYYY
      if (date.includes('T') && date.includes('Z')) {
        const dateObj = new Date(date);
        return format(dateObj, "dd/MM/yyyy");
      }
      // If it's already DD/MM/YYYY format, keep it
      if (date.includes('/')) {
        return date;
      }
    }
    return date;
  };

  // Parse date from DD/MM/YYYY format
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const [day, month, year] = dateString.split('/');
    if (day && month && year) {
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return undefined;
  };

  // Save form data to global state on input change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFormData({ phoneNumber });
      updateIdentityCard({
        number: citizenId,
        fullName,
        dateOfBirth: dateOfBirth ? convertDateToISO(dateOfBirth) : "", // Convert DD/MM/YYYY to ISO for global state
        gender: gender as any,
        placeOfOrigin,
        placeOfResidence: { addressLine: placeOfResidence },
        validUntil: dateOfExpiration ? convertDateToISO(dateOfExpiration) : "", // Convert DD/MM/YYYY to ISO for global state
        // Only update image URLs if they are not blob URLs (to preserve Cloudinary URLs)
        ...(frontIdPreview && !frontIdPreview.startsWith('blob:') && { frontImage: frontIdPreview }),
        ...(backIdPreview && !backIdPreview.startsWith('blob:') && { backImage: backIdPreview }),
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [citizenId, fullName, dateOfBirth, gender, placeOfOrigin, placeOfResidence, dateOfExpiration, phoneNumber, frontIdPreview, backIdPreview, updateFormData, updateIdentityCard]);

  // Setup preview images for existing CCCD images when component mounts
  useEffect(() => {
    // Check if we have stored CCCD images from previous step navigation
    if (formData.identityCard?.frontImage && !frontId) {
      setFrontIdPreview(formData.identityCard.frontImage);
      // Mark as processed if we have stored image URL
      setCCCDFrontProcessed(true);
    } else if (frontId) {
      const url = URL.createObjectURL(frontId);
      setFrontIdPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [frontId, formData.identityCard?.frontImage, setCCCDFrontProcessed]);

  useEffect(() => {
    if (formData.identityCard?.backImage && !backId) {
      setBackIdPreview(formData.identityCard.backImage);
      // Mark as processed if we have stored image URL
      setCCCDBackProcessed(true);
    } else if (backId) {
      const url = URL.createObjectURL(backId);
      setBackIdPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [backId, formData.identityCard?.backImage, setCCCDBackProcessed]);

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
        birthDate: parsedData.dateOfBirth ? convertDateToISO(parsedData.dateOfBirth) : "", // Convert DD/MM/YYYY to ISO for global state
        gender: parsedData.sex as any,
      });
    }
  }, [parsedData, updateFormData]);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields with English messages
    // Check for front ID: either file, preview URL, or stored URL in global state
    if (!frontId && !frontIdPreview && !formData.identityCard?.frontImage) {
      newErrors.frontId = "Please upload the front side of your ID card";
    }
    
    // Check for back ID: either file, preview URL, or stored URL in global state
    if (!backId && !backIdPreview && !formData.identityCard?.backImage) {
      newErrors.backId = "Please upload the back side of your ID card";
    }
    
    if (!citizenId.trim()) {
      newErrors.citizenId = "Please enter your citizen ID number";
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
      newErrors.dateOfExpiration = "Please enter expiration date";
    }
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Please enter your phone number";
    } else if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }
    
    // Check if CCCD processing is still in progress
    if (isProcessingCCCD || isAnalyzing) {
      toast.error("ID card processing in progress, please wait...");
      return;
    }
    
    // Recommend completing FPT AI processing
    if (!cccdFrontProcessed || !cccdBackProcessed) {
      toast.warning("Recommendation: Please wait for the system to finish reading the ID card information for automatic completion");
    }
    
    // If user is manager, authorization letter is required
    if (isManager && !authorizationLetter) {
      newErrors.authorizationLetter = "Please upload authorization letter as you are acting as a manager";
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
        validUntil: dateOfExpiration ? convertDateToISO(dateOfExpiration) : "", // Convert DD/MM/YYYY to ISO for global state
        // Preserve existing images if they exist in store
        frontImage: formData.identityCard?.frontImage || "",
        backImage: formData.identityCard?.backImage || "",
      };
      
      // Auto-map data from CCCD to main form fields (this ensures required fields are not missing)
      const additionalData = {
        phoneNumber: phoneNumber, // Format phone number
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
        phoneNumber: phoneNumber,
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

    // Validate the file
    if (!validateImageFile(file, 10)) {
      return;
    }

    if (type === "front") {
      setFrontId(file);
      // Only call FPT AI analysis - it already handles Cloudinary upload
      try {
        await analyzeFrontSide(file);
        // Success message and state update are handled in the hook
      } catch (error) {
        console.error("Error processing front side:", error);
        toast.error("Error processing front side of ID card");
      }
    } else if (type === "back") {
      setBackId(file);
      // Only call FPT AI analysis - it already handles Cloudinary upload
      try {
        await analyzeBackSide(file);
        // Success message and state update are handled in the hook
      } catch (error) {
        console.error("Error processing back side:", error);
        toast.error("Error processing back side of ID card");
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
            frontPreview={frontIdPreview}
            backPreview={backIdPreview}
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
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCCCDVerificationSection;
