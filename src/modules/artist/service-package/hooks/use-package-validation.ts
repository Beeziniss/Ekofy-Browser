import { useState, useMemo } from "react";
import { CreatePackageData, UpdatePackageData } from "./use-package-operations";

export interface ValidationError {
  field: string;
  message: string;
}

export interface PackageValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const usePackageValidation = () => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateCreatePackage = (data: Partial<CreatePackageData>): PackageValidationResult => {
    const validationErrors: ValidationError[] = [];

    // Package name validation
    if (!data.packageName?.trim()) {
      validationErrors.push({
        field: "packageName",
        message: "Package name is required"
      });
    } else if (data.packageName.length > 100) {
      validationErrors.push({
        field: "packageName",
        message: "Package name must be at most 100 characters"
      });
    }

    // Amount validation
    if (typeof data.amount !== "number" || data.amount <= 0) {
      validationErrors.push({
        field: "amount",
        message: "Amount must be a positive number"
      });
    } else if (data.amount > 1000000000) {
      validationErrors.push({
        field: "amount",
        message: "Amount is too large"
      });
    }

    // Delivery days validation
    if (typeof data.estimateDeliveryDays !== "number" || data.estimateDeliveryDays < 1) {
      validationErrors.push({
        field: "estimateDeliveryDays",
        message: "Delivery days must be at least 1"
      });
    } else if (data.estimateDeliveryDays > 365) {
      validationErrors.push({
        field: "estimateDeliveryDays",
        message: "Delivery days cannot exceed 365"
      });
    }

    // Max revisions validation
    if (typeof data.maxRevisions !== "number" || data.maxRevisions < 0) {
      validationErrors.push({
        field: "maxRevisions",
        message: "Max revisions must be at least 0"
      });
    } else if (data.maxRevisions > 100) {
      validationErrors.push({
        field: "maxRevisions",
        message: "Max revisions cannot exceed 100"
      });
    }

    // Description validation
    if (!data.description?.trim()) {
      validationErrors.push({
        field: "description",
        message: "Description is required"
      });
    } else if (data.description.length > 1000) {
      validationErrors.push({
        field: "description",
        message: "Description must be at most 1000 characters"
      });
    }

    // Service details validation
    if (!data.serviceDetails || data.serviceDetails.length === 0) {
      validationErrors.push({
        field: "serviceDetails",
        message: "At least one service detail is required"
      });
    } else {
      data.serviceDetails.forEach((detail, index) => {
        if (!detail.key?.trim()) {
          validationErrors.push({
            field: `serviceDetails[${index}].key`,
            message: `Service detail ${index + 1}: Key is required`
          });
        }
        if (!detail.value?.trim()) {
          validationErrors.push({
            field: `serviceDetails[${index}].value`,
            message: `Service detail ${index + 1}: Value is required`
          });
        }
        // Validate value contains only letters and spaces
        if (detail.value && !/^[A-Za-z\s]*$/.test(detail.value)) {
          validationErrors.push({
            field: `serviceDetails[${index}].value`,
            message: `Service detail ${index + 1}: Value must only contain letters and spaces`
          });
        }
      });
    }

    // Artist ID validation
    if (!data.artistId?.trim()) {
      validationErrors.push({
        field: "artistId",
        message: "Artist ID is required"
      });
    }

    setErrors(validationErrors);
    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
    };
  };

  const validateUpdatePackage = (data: Partial<UpdatePackageData>): PackageValidationResult => {
    const validationErrors: ValidationError[] = [];

    // Package ID validation
    if (!data.id?.trim()) {
      validationErrors.push({
        field: "id",
        message: "Package ID is required"
      });
    }

    // Package name validation
    if (!data.packageName?.trim()) {
      validationErrors.push({
        field: "packageName",
        message: "Package name is required"
      });
    } else if (data.packageName.length > 100) {
      validationErrors.push({
        field: "packageName",
        message: "Package name must be at most 100 characters"
      });
    }

    // Description validation (optional for update)
    if (data.description && data.description.length > 1000) {
      validationErrors.push({
        field: "description",
        message: "Description must be at most 1000 characters"
      });
    }

    setErrors(validationErrors);
    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
    };
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const hasErrors = useMemo(() => errors.length > 0, [errors]);

  return {
    validateCreatePackage,
    validateUpdatePackage,
    getFieldError,
    clearErrors,
    hasErrors,
    errors,
  };
};