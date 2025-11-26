import { useMemo } from "react";
import { ArtistPackage, ArtistPackageStatus } from "@/gql/graphql";

export const usePackageUtils = () => {
  const formattedPrice = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const formatDeliveryTime = (days: number): string => {
    if (days === 1) {
      return "1 day";
    } else if (days < 7) {
      return `${days} days`;
    } else if (days < 30) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      if (remainingDays === 0) {
        return `${weeks} week${weeks > 1 ? "s" : ""}`;
      } else {
        return `${weeks} week${weeks > 1 ? "s" : ""} ${remainingDays} day${remainingDays > 1 ? "s" : ""}`;
      }
    } else {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      if (remainingDays === 0) {
        return `${months} month${months > 1 ? "s" : ""}`;
      } else {
        return `${months} month${months > 1 ? "s" : ""} ${remainingDays} day${remainingDays > 1 ? "s" : ""}`;
      }
    }
  };

  const formatRevisionText = (maxRevision: number): string => {
    if (maxRevision === 0) {
      return "No revisions";
    } else if (maxRevision === 1) {
      return "1 revision";
    } else {
      return `${maxRevision} revisions`;
    }
  };

  const getStatusColor = (status: ArtistPackageStatus): string => {
    switch (status) {
      case ArtistPackageStatus.Enabled:
        return "bg-green-100 text-green-800 border-green-300";
      case ArtistPackageStatus.Disabled:
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status: ArtistPackageStatus): string => {
    switch (status) {
      case ArtistPackageStatus.Enabled:
        return "Active";
      case ArtistPackageStatus.Disabled:
        return "Inactive";
      default:
        return "Unknown";
    }
  };

  const isPackageEditable = (status: ArtistPackageStatus): boolean => {
    return status === ArtistPackageStatus.Enabled || status === ArtistPackageStatus.Disabled;
  };

  const canChangeStatus = (status: ArtistPackageStatus): boolean => {
    return status === ArtistPackageStatus.Enabled || status === ArtistPackageStatus.Disabled;
  };

  const getPackageDisplayData = useMemo(() => {
    return (pkg: ArtistPackage) => ({
      id: pkg.id,
      name: pkg.packageName,
      // formattedPrice: formatCurrency(pkg.amount),
      formattedDeliveryTime: formatDeliveryTime(pkg.estimateDeliveryDays),
      formattedRevisions: formatRevisionText(pkg.maxRevision || 0),
      statusColor: getStatusColor(pkg.status),
      statusText: getStatusText(pkg.status),
      description: pkg.description || "",
      serviceDetails: pkg.serviceDetails || [],
      isEditable: isPackageEditable(pkg.status),
      canChangeStatus: canChangeStatus(pkg.status),
      createdAt: new Date(pkg.createdAt).toLocaleDateString("vi-VN"),
      updatedAt: new Date(pkg.updatedAt).toLocaleDateString("vi-VN"),
    });
  }, []);

  const generateServiceDetailKey = (existingDetails: Array<{ key: string; value: string }>): string => {
    const maxKey = existingDetails.reduce((max, detail) => {
      const num = parseInt(detail.key, 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return (maxKey + 1).toString();
  };

  const validateServiceDetailValue = (value: string): boolean => {
    return /^[A-Za-z\s]*$/.test(value);
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };

  return {
    formattedPrice,
    formatDeliveryTime,
    formatRevisionText,
    getStatusColor,
    getStatusText,
    isPackageEditable,
    canChangeStatus,
    getPackageDisplayData,
    generateServiceDetailKey,
    validateServiceDetailValue,
    truncateText,
  };
};