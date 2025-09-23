// Utility functions for sign up process
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push("Mật khẩu phải có ít nhất 6 ký tự");
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 chữ thường");
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 chữ hoa");
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất 1 số");
  }
  
  return errors;
};

export const handleAPIError = (error: any): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    // Just return detail if available, otherwise generic message
    return data?.detail || "Đã xảy ra lỗi. Vui lòng thử lại.";
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return "Đã xảy ra lỗi không xác định";
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

export const formatServiceError = (error: unknown): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    // Just return detail if available, otherwise generic message
    return data?.detail || "Đã xảy ra lỗi. Vui lòng thử lại.";
  }
  return "Đã xảy ra lỗi. Vui lòng thử lại.";
};

export const formatSimpleAPIError = (error: any): string => {
  if (isAxiosError(error)) {
    const response = error.response;
    const data = response?.data;
    
    // Use detail if available, otherwise fallback to generic message
    if (data?.detail) {
      return data.detail;
    }
    
    // Fallback based on status
    if (response?.status === 409) {
      return "Dữ liệu đã tồn tại trong hệ thống.";
    }
    
    return error.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "Đã xảy ra lỗi. Vui lòng thử lại.";
};