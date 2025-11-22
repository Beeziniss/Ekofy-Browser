import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SimulatedUploadTestProps {
  onProgressUpdate?: (percent: number, stepDescription: string) => void;
  onCompleted?: () => void;
  onFailed?: (errorMessage: string) => void;
}

export const SimulatedUploadTest: React.FC<SimulatedUploadTestProps> = ({
  onProgressUpdate,
  onCompleted,
  onFailed,
}) => {
  const simulateUpload = () => {
    const steps = [
      { percent: 10, description: "Validating file..." },
      { percent: 25, description: "Uploading to server..." },
      { percent: 50, description: "Processing audio..." },
      { percent: 75, description: "Generating metadata..." },
      { percent: 90, description: "Finalizing upload..." },
      { percent: 100, description: "Upload complete!" },
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        onProgressUpdate?.(step.percent, step.description);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onCompleted?.();
        }, 500);
      }
    }, 1000);
  };

  const simulateError = () => {
    onProgressUpdate?.(30, "Processing file...");
    setTimeout(() => {
      onFailed?.("Failed to process audio file: Invalid format detected");
    }, 2000);
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Test Upload Progress</CardTitle>
        <CardDescription>Use these buttons to simulate SignalR events for testing the progress bar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={simulateUpload} className="w-full">
          Simulate Successful Upload
        </Button>
        <Button onClick={simulateError} variant="destructive" className="w-full">
          Simulate Upload Error
        </Button>
      </CardContent>
    </Card>
  );
};
