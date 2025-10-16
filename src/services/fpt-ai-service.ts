import axios from "axios";

// FPT AI Response interfaces
export interface FPTAIResponse {
  errorCode: number;
  errorMessage: string;
  data: FPTAIData[];
}

export interface FPTAIData {
  // Front side data
  id?: string;
  id_prob?: string;
  name?: string;
  name_prob?: string;
  dob?: string;
  dob_prob?: string;
  sex?: string;
  sex_prob?: string;
  nationality?: string;
  nationality_prob?: string;
  home?: string;
  home_prob?: string;
  address?: string;
  address_prob?: string;
  doe?: string;
  doe_prob?: string;
  overall_score?: string;
  number_of_name_lines?: string;
  address_entities?: {
    province?: string;
    district?: string;
    ward?: string;
    street?: string;
  };
  type_new?: string;
  type?: string;
  
  // Back side data
  features?: string;
  features_prob?: string;
  issue_date?: string;
  issue_date_prob?: string;
  mrz?: string[];
  mrz_prob?: string;
  issue_loc?: string;
  issue_loc_prob?: string;
  mrz_details?: {
    id?: string;
    name?: string;
    doe?: string;
    dob?: string;
    nationality?: string;
    sex?: string;
  };
  pob?: string;
  pob_prob?: string;
}

export interface ParsedCCCDData {
  // Basic info from front
  id: string;
  name: string;
  dateOfBirth: string;
  sex: string;
  nationality: string;
  placeOfOrigin: string;
  address: string;
  validUntil: string;
  
  // Address breakdown
  addressEntities: {
    province: string;
    district: string;
    ward: string;
    street: string;
  };
  
  // Back side info
  issueDate?: string;
  issueLocation?: string;
  features?: string;
}

const FPT_AI_URL = "https://api.fpt.ai/vision/idr/vnm/";
const API_KEY = process.env.NEXT_PUBLIC_KEY_FPT_AI;

export const fptAIService = {
  /**
   * Analyze CCCD image using FPT AI
   * @param imageFile - The image file to analyze
   * @returns Parsed CCCD data
   */
  analyzeCCCD: async (imageFile: File): Promise<FPTAIResponse> => {
    if (!API_KEY) {
      throw new Error("FPT AI API key not configured");
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(FPT_AI_URL, formData, {
        headers: {
          "api_key": API_KEY,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("FPT AI Error:", error);
      throw new Error("Unable to read ID card information. Please try again.");
    }
  },

  /**
   * Parse FPT AI response to structured data
   * @param frontResponse - Response from front side analysis
   * @param backResponse - Response from back side analysis (optional)
   * @returns Structured CCCD data
   */
  parseCCCDResponse: (
    frontResponse?: FPTAIResponse,
    backResponse?: FPTAIResponse
  ): ParsedCCCDData | null => {
    if (!frontResponse?.data?.[0]) {
      return null;
    }

    const frontData = frontResponse.data[0];
    const backData = backResponse?.data?.[0];

    // Convert sex format
    const convertSex = (sex: string): string => {
      if (sex === "NAM" || sex === "M") return "Male";
      if (sex === "NỮ" || sex === "F") return "Female";
      return "Other";
    };

    // Format date to keep DD/MM/YYYY format (no conversion to ISO)
    const formatDate = (dateStr: string): string => {
      if (!dateStr) return "";
      // Keep original DD/MM/YYYY format instead of converting to ISO
      return dateStr;
    };

    return {
      id: frontData.id || "",
      name: frontData.name || "",
      dateOfBirth: formatDate(frontData.dob || ""),
      sex: convertSex(frontData.sex || ""),
      nationality: frontData.nationality || "",
      placeOfOrigin: frontData.home || "",
      address: frontData.address || "",
      validUntil: formatDate(frontData.doe || ""),
      addressEntities: {
        province: frontData.address_entities?.province || "",
        district: frontData.address_entities?.district || "",
        ward: frontData.address_entities?.ward || "",
        street: frontData.address_entities?.street || "",
      },
      issueDate: backData?.issue_date || "",
      issueLocation: backData?.issue_loc || "",
      features: backData?.features || "",
    };
  },

  /**
   * Convert image file to base64 string
   * @param file - Image file
   * @returns Base64 string
   */
  convertToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/...;base64, prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  },
};