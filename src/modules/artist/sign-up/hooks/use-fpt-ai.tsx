import { useState } from "react";
import { fptAIService, FPTAIResponse, ParsedCCCDData } from "@/services/fpt-ai-service";
import { useArtistSignUpStore } from "@/store/stores/artist-signup-store";
import { useCloudinaryUpload } from "./use-cloudinary-upload";
import { toast } from "sonner";

export const useFPTAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [frontResponse, setFrontResponse] = useState<FPTAIResponse | null>(null);
  const [backResponse, setBackResponse] = useState<FPTAIResponse | null>(null);
  const [parsedData, setParsedData] = useState<ParsedCCCDData | null>(null);

  const {
    setProcessingCCCD,
    setCCCDFrontProcessed,
    setCCCDBackProcessed,
    updateIdentityCard,
    cccdFrontProcessed,
    cccdBackProcessed,
  } = useArtistSignUpStore();

  // Cloudinary upload hook
  const { 
    uploadCCCD, 
    isUploading: isUploadingToCloudinary,
    uploadProgress,
    error: uploadError 
  } = useCloudinaryUpload();

  const analyzeFrontSide = async (imageFile: File): Promise<void> => {
    if (!imageFile) {
      toast.error("Please select an image file");
      return;
    }

    setIsAnalyzing(true);
    setProcessingCCCD(true);

    try {      
      // Start both FPT AI analysis and Cloudinary upload in parallel
      const [fptResponse, cloudinaryResult] = await Promise.all([
        fptAIService.analyzeCCCD(imageFile),
        uploadCCCD(imageFile, "front") // Upload to Cloudinary
      ]);
      
      if (fptResponse.errorCode !== 0) {
        throw new Error(fptResponse.errorMessage || "Unable to read ID card information");
      }

      if (!cloudinaryResult?.secure_url) {
        throw new Error("Unable to upload image to Cloudinary");
      }

      setFrontResponse(fptResponse);
      setCCCDFrontProcessed(true);
      
      // Use Cloudinary URL
      const frontImageUrl = cloudinaryResult.secure_url;
      
      
      toast.success("Successfully read and uploaded front side of ID card!");
      
      // If we have both sides, parse the data
      if (cccdBackProcessed && backResponse) {
        // Get existing back image if already stored
        const existingBackImage = useArtistSignUpStore.getState().formData.identityCard?.backImage;
        await parseCompleteData(fptResponse, backResponse, frontImageUrl, existingBackImage);
      } else {
        // Store just the front image for now
        updateIdentityCard({ frontImage: frontImageUrl });
      }
      
    } catch (error) {
      console.error("Error analyzing front side:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred while processing ID card");
      setCCCDFrontProcessed(false);
    } finally {
      setIsAnalyzing(false);
      setProcessingCCCD(false);
    }
  };

  const analyzeBackSide = async (imageFile: File): Promise<void> => {
    if (!imageFile) {
      toast.error("Please select an image file");
      return;
    }

    setIsAnalyzing(true);
    setProcessingCCCD(true);

    try {
      
      // Start both FPT AI analysis and Cloudinary upload in parallel
      const [fptResponse, cloudinaryResult] = await Promise.all([
        fptAIService.analyzeCCCD(imageFile),
        uploadCCCD(imageFile, "back") // Upload to Cloudinary
      ]);
      
      if (fptResponse.errorCode !== 0) {
        throw new Error(fptResponse.errorMessage || "Unable to read ID card information");
      }

      if (!cloudinaryResult?.secure_url) {
        throw new Error("Unable to upload image to Cloudinary");
      }

      setBackResponse(fptResponse);
      setCCCDBackProcessed(true);
      
      // Use Cloudinary URL
      const backImageUrl = cloudinaryResult.secure_url;
      
      toast.success("Successfully read and uploaded back side of ID card!");
      
      // If we have both sides, parse the data
      if (cccdFrontProcessed && frontResponse) {
        // Get existing front image if already stored
        const existingFrontImage = useArtistSignUpStore.getState().formData.identityCard?.frontImage;
        await parseCompleteData(frontResponse, fptResponse, existingFrontImage, backImageUrl);
      } else {
        updateIdentityCard({ backImage: backImageUrl });
      }
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred while processing ID card");
      setCCCDBackProcessed(false);
    } finally {
      setIsAnalyzing(false);
      setProcessingCCCD(false);
    }
  };

  const parseCompleteData = async (
    frontResp: FPTAIResponse,
    backResp: FPTAIResponse,
    frontImageUrl?: string,
    backImageUrl?: string
  ): Promise<void> => {
    try {
      const parsed = fptAIService.parseCCCDResponse(frontResp, backResp);
      
      if (!parsed) {
        throw new Error("Unable to process ID card data");
      }

      setParsedData(parsed);
      
      // Get current stored images to preserve them
      const currentIdentityCard = useArtistSignUpStore.getState().formData.identityCard;
      const preservedFrontImage = frontImageUrl || currentIdentityCard?.frontImage || "";
      const preservedBackImage = backImageUrl || currentIdentityCard?.backImage || "";
      
      // Convert to format expected by API
      const identityCardData = {
        number: parsed.id,
        fullName: parsed.name,
        dateOfBirth: parsed.dateOfBirth,
        gender: parsed.sex as any, // Will be converted properly
        placeOfOrigin: parsed.placeOfOrigin,
        nationality: parsed.nationality,
        placeOfResidence: {
          street: parsed.addressEntities.street,
          ward: parsed.addressEntities.ward,
          province: parsed.addressEntities.province,
          addressLine: parsed.address,
        },
        frontImage: preservedFrontImage,
        backImage: preservedBackImage,
        validUntil: parsed.validUntil,
      };

      updateIdentityCard(identityCardData);
      
      // Also update main form data with CCCD info to ensure required fields are not missing
      const { updateFormData } = useArtistSignUpStore.getState();
      updateFormData({
        fullName: parsed.name, // Auto-map CCCD fullName to main form fullName
        birthDate: parsed.dateOfBirth, // Auto-map CCCD dateOfBirth to main form birthDate
        gender: parsed.sex as any, // Auto-map CCCD gender to main form gender
      });
      
      toast.success("ID card information processing completed!");
    } catch (error) {
      toast.error("An error occurred while processing ID card data");
    }
  };

  const resetCCCDData = () => {
    setFrontResponse(null);
    setBackResponse(null);
    setParsedData(null);
    setCCCDFrontProcessed(false);
    setCCCDBackProcessed(false);
    setProcessingCCCD(false);
  };

  return {
    // States
    isAnalyzing: isAnalyzing || isUploadingToCloudinary, // Include Cloudinary upload state
    frontResponse,
    backResponse,
    parsedData,
    cccdFrontProcessed,
    cccdBackProcessed,
    uploadProgress,
    uploadError,
    
    // Actions
    analyzeFrontSide,
    analyzeBackSide,
    resetCCCDData,
  };
};
