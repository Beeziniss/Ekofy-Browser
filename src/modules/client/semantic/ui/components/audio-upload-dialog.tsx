"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileMusic, Upload, X, Loader2 } from "lucide-react";

interface AudioUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
}

const AudioUploadDialog = ({ open, onOpenChange, onFileSelect, isProcessing = false }: AudioUploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Reset selected file when dialog closes or when processing completes
  useEffect(() => {
    if (!open || (!isProcessing && selectedFile)) {
      // Small delay to allow smooth transition before resetting
      const timer = setTimeout(() => {
        if (!open) {
          setSelectedFile(null);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, isProcessing, selectedFile]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      console.log(acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".webm", ".ogg", ".m4a", ".flac"],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const handleSubmit = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleClose = () => {
    setSelectedFile(null);
    onOpenChange(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-main-dark-bg border-main-grey max-w-md">
        <DialogHeader>
          <DialogTitle className="text-main-white text-2xl">Upload Audio File</DialogTitle>
          <DialogDescription className="text-main-grey">Upload an audio file to identify the song</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Dropzone */}
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`border-main-grey hover:border-main-purple hover:bg-main-grey/5 cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
                isDragActive ? "border-main-purple bg-main-purple/10" : ""
              } ${isProcessing ? "pointer-events-none opacity-50" : ""}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="bg-main-grey/20 flex size-20 items-center justify-center rounded-full">
                  <Upload className="text-main-grey size-10" />
                </div>

                {isDragActive ? (
                  <p className="text-main-white text-lg font-medium">Drop the audio file here</p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <p className="text-main-white text-lg font-medium">Drop audio file here</p>
                      <p className="text-main-grey text-sm">or click to browse</p>
                    </div>
                    <p className="text-main-grey text-xs">Supported formats: MP3, WAV, WEBM, OGG, M4A, FLAC</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            // Selected File Display
            <div className="bg-main-grey/10 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="bg-main-purple/20 flex size-14 shrink-0 items-center justify-center rounded-lg">
                  <FileMusic className="text-main-purple size-7" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-main-white line-clamp-1 font-medium">{selectedFile.name}</p>
                  <p className="text-main-grey text-sm">{formatFileSize(selectedFile.size)}</p>
                  <p className="text-main-grey text-xs">{selectedFile.type || "audio file"}</p>
                </div>

                {!isProcessing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="hover:bg-main-grey/20 text-main-grey hover:text-main-white shrink-0"
                  >
                    <X className="size-5" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleClose} variant="outline" className="flex-1" disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || isProcessing}
              className="bg-main-purple hover:bg-main-purple/90 flex-1 gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Identifying...
                </>
              ) : (
                <>
                  <FileMusic className="size-4" />
                  Identify Song
                </>
              )}
            </Button>
          </div>

          {/* Info Section */}
          <div className="bg-main-grey/10 rounded-lg p-4 text-xs">
            <p className="text-main-grey">
              <strong className="text-main-white">Note:</strong> For best results, upload a clear audio recording with
              minimal background noise. The file should contain at least 10-15 seconds of the song.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AudioUploadDialog;
