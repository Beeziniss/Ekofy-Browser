import { formatDistanceToNow, parseISO } from "date-fns";

/**
 * Format a date string to a relative time string (e.g., "2 minutes ago")
 */
export const formatNotificationTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting notification time:", error);
    return "Unknown time";
  }
};

/**
 * Check if a notification is recent (less than 5 minutes old)
 */
export const isRecentNotification = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    return diffInMinutes < 5;
  } catch (error) {
    console.error("Error checking if notification is recent:", error);
    return false;
  }
};
