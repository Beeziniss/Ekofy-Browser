import { useState } from "react";
import { fptAIService, FPTAIResponse, ParsedCCCDData } from "@/services/fpt-ai-service";
import { useArtistSignUpStore } from "@/store/stores/artist-signup-store";
import { useS3Upload } from "./use-s3-upload";
import { toast } from "sonner";
import { UserGender } from "@/gql/graphql";
import { FilePath } from "@/types/file";
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

  // S3 upload hook
  const { uploadFile, isUploading: isUploadingToS3 } = useS3Upload();

  const analyzeFrontSide = async (imageFile: File): Promise<void> => {
    if (!imageFile) {
      toast.error("Please select an image file");
      return;
    }

    setIsAnalyzing(true);
    setProcessingCCCD(true);

    try {
      // Start both FPT AI analysis and S3 upload in parallel
      const [fptResponse, s3Result] = await Promise.all([
        fptAIService.analyzeCCCD(imageFile),
        uploadFile(imageFile, FilePath.NATIONS), // Upload to S3
      ]);

      if (fptResponse.errorCode !== 0) {
        throw new Error(fptResponse.errorMessage || "Unable to read ID card information");
      }

      if (!s3Result?.fileKey) {
        throw new Error("Unable to upload image to S3");
      }

      setFrontResponse(fptResponse);
      setCCCDFrontProcessed(true);

      // Use S3 fileKey
      const frontImageKey = s3Result.fileKey;

      toast.success("Successfully read and uploaded front side of ID card!");

      // Parse data immediately from front side (don't wait for back side)
      const parsed = fptAIService.parseCCCDResponse(fptResponse);
      if (parsed) {
        setParsedData(parsed);
      }

      // If we have both sides, parse the complete data
      const currentState = useArtistSignUpStore.getState();
      if (currentState.cccdBackProcessed && backResponse) {
        // Get existing back image if already stored
        const existingBackImage = currentState.formData.identityCard?.backImage;
        await parseCompleteData(fptResponse, backResponse, frontImageKey, existingBackImage);
      } else {
        // Store just the front image key for now
        updateIdentityCard({ frontImage: frontImageKey });
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
      // Start both FPT AI analysis and S3 upload in parallel
      const [fptResponse, s3Result] = await Promise.all([
        fptAIService.analyzeCCCD(imageFile),
        uploadFile(imageFile, FilePath.NATIONS), // Upload to S3
      ]);

      if (fptResponse.errorCode !== 0) {
        throw new Error(fptResponse.errorMessage || "Unable to read ID card information");
      }

      if (!s3Result?.fileKey) {
        throw new Error("Unable to upload image to S3");
      }

      setBackResponse(fptResponse);
      setCCCDBackProcessed(true);

      // Use S3 fileKey
      const backImageKey = s3Result.fileKey;

      toast.success("Successfully read and uploaded back side of ID card!");

      // If we have both sides, parse the data
      const currentState = useArtistSignUpStore.getState();
      if (currentState.cccdFrontProcessed && frontResponse) {
        // Get existing front image if already stored
        const existingFrontImage = currentState.formData.identityCard?.frontImage;
        await parseCompleteData(frontResponse, fptResponse, existingFrontImage, backImageKey);
      } else {
        updateIdentityCard({ backImage: backImageKey });
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
    backImageUrl?: string,
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
        gender: parsed.sex as UserGender, // Will be converted properly
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
      const formDataUpdate = {
        fullName: parsed.name, // Auto-map CCCD fullName to main form fullName
        birthDate: parsed.dateOfBirth, // Auto-map CCCD dateOfBirth to main form birthDate
        gender: parsed.sex as UserGender, // Auto-map CCCD gender to main form gender
      };

      updateFormData(formDataUpdate);

      toast.success("ID card information processing completed!");
    } catch (error) {
      console.error("Error parsing complete CCCD data:", error);
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
    isAnalyzing: isAnalyzing || isUploadingToS3, // Include S3 upload state
    frontResponse,
    backResponse,
    parsedData,
    cccdFrontProcessed,
    cccdBackProcessed,

    // Actions
    analyzeFrontSide,
    analyzeBackSide,
    resetCCCDData,
  };
};
