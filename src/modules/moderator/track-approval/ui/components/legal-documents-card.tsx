"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink } from "lucide-react";
import { TrackUploadRequest } from "@/types/approval-track";

interface LegalDocumentsCardProps {
  track: TrackUploadRequest;
}

export function LegalDocumentsCard({ track }: LegalDocumentsCardProps) {
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
            <FileText className="text-muted-foreground h-6 w-6" />
            <div className="flex-1">
              <p className="font-medium">{doc.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary" className={getDocumentTypeColor(doc.documentType)}>
                  {doc.documentType}
                </Badge>
              </div>
              {doc.note && <p className="text-muted-foreground mt-1 text-sm">{doc.note}</p>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.open(doc.documentUrl, "_blank")}>
                <ExternalLink className="mr-1 h-4 w-4" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = doc.documentUrl;
                  link.download = doc.name;
                  link.click();
                }}
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
