"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import RecordRTC from "recordrtc";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2, RotateCcw, Send } from "lucide-react";

interface AudioRecorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordingComplete: (audioFile: File) => void;
}

const AudioRecorderDialog = ({ open, onOpenChange, onRecordingComplete }: AudioRecorderDialogProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<{ file: File; url: string } | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && isRecording) {
      setIsProcessing(true);

      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current?.getBlob();
        if (blob) {
          const file = new File([blob], `recording-${Date.now()}.webm`, {
            type: "audio/webm",
          });
          const url = URL.createObjectURL(blob);
          setRecordedAudio({ file, url });
        }

        // Cleanup stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        setIsRecording(false);
        setIsProcessing(false);
      });
    }
  }, [isRecording]);

  useEffect(() => {
    // Cleanup on unmount only
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recordedAudio?.url) {
        URL.revokeObjectURL(recordedAudio.url);
      }
    };
  }, [recordedAudio]);

  // Reset recording state when dialog closes
  useEffect(() => {
    if (!open) {
      setRecordingTime(0);
      setIsProcessing(false);
      setRecordedAudio(null);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [open]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
      });

      recorder.startRecording();
      recorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Failed to access microphone. Please ensure you've granted permission.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProcess = () => {
    if (recordedAudio) {
      onRecordingComplete(recordedAudio.file);
      onOpenChange(false);
    }
  };

  const handleReRecord = () => {
    if (recordedAudio?.url) {
      URL.revokeObjectURL(recordedAudio.url);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setRecordedAudio(null);
    setRecordingTime(0);
  };

  const handleClose = () => {
    if (isRecording) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRecording(false);
      setRecordingTime(0);
    }
    if (recordedAudio?.url) {
      URL.revokeObjectURL(recordedAudio.url);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setRecordedAudio(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-main-dark-bg border-main-grey max-w-md">
        <DialogHeader>
          <DialogTitle className="text-main-white text-2xl">Record Audio</DialogTitle>
          <DialogDescription className="text-main-grey">
            Record a sample of the song you want to identify (minimum 10 seconds recommended)
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-8">
          {/* Recording Visualization */}
          <div className="relative flex size-40 items-center justify-center">
            {/* Pulse animation */}
            {isRecording && (
              <>
                <div className="bg-main-purple/20 absolute inset-0 animate-ping rounded-full" />
                <div className="bg-main-purple/30 absolute inset-4 animate-pulse rounded-full" />
              </>
            )}

            {/* Mic Icon */}
            <div
              className={`relative z-10 flex size-24 items-center justify-center rounded-full transition-colors ${
                isRecording ? "bg-main-purple" : "bg-main-grey/20"
              }`}
            >
              <Mic className={`size-12 ${isRecording ? "text-white" : "text-main-grey"}`} />
            </div>
          </div>

          {/* Timer */}
          <div className="text-main-white text-4xl font-bold tabular-nums">{formatTime(recordingTime)}</div>

          {/* Status Text */}
          <p className="text-main-grey text-sm">
            {isRecording
              ? "Recording in progress..."
              : recordedAudio
                ? "Preview your recording below"
                : "Click the button below to start recording"}
          </p>

          {/* Control Buttons */}
          <div className="flex w-full flex-col gap-4">
            {!isRecording && !recordedAudio ? (
              <Button
                onClick={startRecording}
                disabled={isProcessing}
                size="lg"
                className="bg-main-purple hover:bg-main-purple/90 text-main-white w-full gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Mic className="text-main-white size-5" />
                    Start Recording
                  </>
                )}
              </Button>
            ) : isRecording ? (
              <Button
                onClick={stopRecording}
                disabled={isProcessing}
                size="lg"
                className="w-full gap-2 bg-red-600 hover:bg-red-700"
              >
                <Square className="size-5" />
                Stop Recording
              </Button>
            ) : (
              <div className="flex w-full flex-col gap-3">
                {/* Native Audio Player */}
                <div className="bg-main-grey/10 w-full rounded-lg p-4">
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-main-white font-medium">Recorded Audio</span>
                  </div>
                  {recordedAudio && (
                    <audio
                      ref={audioRef}
                      src={recordedAudio.url}
                      controls
                      className="w-full"
                      controlsList="nodownload"
                    />
                  )}
                </div>

                {/* Action Buttons Row */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleReRecord}
                    size="lg"
                    variant="outline"
                    className="border-main-grey hover:bg-main-grey/10 flex-1 gap-2"
                  >
                    <RotateCcw className="size-5" />
                    Re-record
                  </Button>
                  <Button
                    onClick={handleProcess}
                    size="lg"
                    className="bg-main-purple hover:bg-main-purple/90 text-main-white flex-1 gap-2"
                  >
                    <Send className="text-main-white size-5" />
                    Process
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-main-grey/10 rounded-lg p-4 text-xs">
            <p className="text-main-grey">
              <strong className="text-main-white">Tips:</strong> Make sure you&apos;re in a quiet environment and the
              song is playing clearly. Recording 15-30 seconds usually gives the best results.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AudioRecorderDialog;
