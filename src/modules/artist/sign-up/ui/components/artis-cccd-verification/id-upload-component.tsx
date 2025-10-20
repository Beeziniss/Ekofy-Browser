"use client";

import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import Image from "next/image";

interface IDUploadComponentProps {
  frontId: File | null;
  backId: File | null;
  frontPreview?: string | null; // Add preview URL prop
  backPreview?: string | null; // Add preview URL prop
  errors: Record<string, string>;
  onFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back"
  ) => void;
}

const IDUploadComponent = ({
  frontId,
  backId,
  frontPreview: frontPreviewProp,
  backPreview: backPreviewProp,
  errors,
  onFileUpload,
}: IDUploadComponentProps) => {
  const [frontPreview, setFrontPreview] = useState<string | null>(frontPreviewProp || null);
  const [backPreview, setBackPreview] = useState<string | null>(backPreviewProp || null);

  // Create preview URLs when files change
  useEffect(() => {
    if (frontId) {
      const url = URL.createObjectURL(frontId);
      setFrontPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (frontPreviewProp) {
      setFrontPreview(frontPreviewProp);
    } else {
      setFrontPreview(null);
    }
  }, [frontId, frontPreviewProp]);

  useEffect(() => {
    if (backId) {
      const url = URL.createObjectURL(backId);
      setBackPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (backPreviewProp) {
      setBackPreview(backPreviewProp);
    } else {
      setBackPreview(null);
    }
  }, [backId, backPreviewProp]);
  return (
    <div>
      <h3 className="mb-6 text-lg font-medium text-white">
        Upload your citizen identification card.
      </h3>

      {/* Front Side Upload */}
      <div className="mb-6">
        <label className="mb-2 flex items-center text-sm font-medium text-white">
          Front side* <Info className="ml-1 h-4 w-4 text-gray-400" />
        </label>
        <div className="relative">
          <div className={`flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${errors.frontId ? 'border-red-500' : 'border-gray-600'} bg-gray-800/30 transition-colors hover:border-gray-500 overflow-hidden`}>
            {frontPreview ? (
              <div className="relative w-full h-full">
                <Image
                  src={frontPreview}
                  width={1000}
                  height={1000}
                  alt="Front ID Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm">Click to change</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-white">
                  Click to upload
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileUpload(e, "front")}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        {errors.frontId && (
          <p className="mt-2 text-sm text-red-400">{errors.frontId}</p>
        )}
      </div>

      {/* Back Side Upload */}
      <div className="mb-6">
        <label className="mb-2 flex items-center text-sm font-medium text-white">
          Back side* <Info className="ml-1 h-4 w-4 text-gray-400" />
        </label>
        <div className="relative">
          <div className={`flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${errors.backId ? 'border-red-500' : 'border-gray-600'} bg-gray-800/30 transition-colors hover:border-gray-500 overflow-hidden`}>
            {backPreview ? (
              <div className="relative w-full h-full">
                <Image
                  src={backPreview}
                  width={1000}
                  height={1000}
                  alt="Back ID Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm">Click to change</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-white">
                  Click to upload
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileUpload(e, "back")}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        {errors.backId && (
          <p className="mt-2 text-sm text-red-400">{errors.backId}</p>
        )}
      </div>
    </div>
  );
};

export default IDUploadComponent;