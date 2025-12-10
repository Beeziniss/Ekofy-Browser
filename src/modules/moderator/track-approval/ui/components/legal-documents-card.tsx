"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink } from "lucide-react";
import { TrackUploadRequest } from "@/types/approval-track";
import { toast } from "sonner";
import React from "react";

interface LegalDocumentsCardProps {
  track: TrackUploadRequest;
}

export function LegalDocumentsCard({ track }: LegalDocumentsCardProps) {
  const [documentUrls, setDocumentUrls] = React.useState<Record<number, string>>({});

  // Function to get presigned URL for S3 files
  const getFileUrl = async (fileKey: string): Promise<string> => {
    try {
      // If it's already a full URL, return as is
      if (fileKey.startsWith("http://") || fileKey.startsWith("https://")) {
        return fileKey;
      }

      // Otherwise, get presigned URL from API
      const response = await fetch(`/api/s3/presign?key=${encodeURIComponent(fileKey)}`);

      if (!response.ok) {
        throw new Error("Failed to get file URL");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error getting file URL:", error);
      toast.error("Failed to access file. Please try again.");
      throw error;
    }
  };

  // Fetch presigned URLs for all documents
  React.useEffect(() => {
    const fetchDocumentUrls = async () => {
      if (!track.track.legalDocuments) return;

      const urls: Record<number, string> = {};
      await Promise.all(
        track.track.legalDocuments.map(async (doc, index) => {
          try {
            const url = await getFileUrl(doc.documentUrl);
            urls[index] = url;
          } catch (error) {
            console.error(`Error fetching URL for document ${index}:`, error);
          }
        })
      );
      setDocumentUrls(urls);
    };

    fetchDocumentUrls();
  }, [track.track.legalDocuments]);

  // Function to handle file viewing
  const handleViewDocument = async (documentUrl: string, index: number) => {
    try {
      const url = documentUrls[index] || (await getFileUrl(documentUrl));
      window.open(url, "_blank");
    } catch {
      // Error already handled in getFileUrl
    }
  };

  // Function to handle file download
  const handleDownloadDocument = async (documentUrl: string, fileName: string, index: number) => {
    try {
      const url = documentUrls[index] || (await getFileUrl(documentUrl));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
    } catch {
      // Error already handled in getFileUrl
    }
  };
  if (!track.track.legalDocuments || track.track.legalDocuments.length === 0) {
    return null;
  }

  const getDocumentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "contract":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "license":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "copyright":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "agreement":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Legal Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {track.track.legalDocuments.map((doc, index) => (
          <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{doc.name}</p>
                <Badge variant="secondary" className={getDocumentTypeColor(doc.documentType)}>
                  {doc.documentType}
                </Badge>
              </div>
              {doc.note && <p className="text-muted-foreground mt-1 text-sm">{doc.note}</p>}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDocument(doc.documentUrl, index)}
              >
                <ExternalLink className="mr-1 h-4 w-4" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadDocument(doc.documentUrl, doc.name, index)}
              >
                <Download className="mr-1 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
