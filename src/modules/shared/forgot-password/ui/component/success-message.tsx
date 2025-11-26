"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";

interface SuccessMessageProps {
  title?: string;
  message?: string;
  onBackToLogin?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title = "Password Reset Successfully",
  message = "Your password has been reset successfully. You can now log in with your new password.",
  onBackToLogin,
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-main-dark-1 rounded-xl p-8 shadow-xl text-center">
        {/* Success Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="p-4 bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-green-400 mb-3">
          {title}
        </h2>
        
        {/* Message */}
        <p className="text-gray-400 text-sm mb-6">
          {message}
        </p>
        
        {/* Back to Login Button */}
        {onBackToLogin && (
          <Button 
            onClick={onBackToLogin} 
            className="primary_gradient w-full h-12 text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;