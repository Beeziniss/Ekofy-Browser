import { format } from "date-fns";

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  } catch {
    return "Invalid date";
  }
};
