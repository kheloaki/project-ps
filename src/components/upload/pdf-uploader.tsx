"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Check, FileText } from "lucide-react";
import { toast } from "sonner";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface PdfUploaderProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  maxSize?: number; // in MB
  className?: string;
  currentPdf?: string;
}

export function PdfUploader({
  onUploadComplete,
  onUploadError,
  folder = "pdfs",
  maxSize = 10,
  className = "",
  currentPdf,
}: PdfUploaderProps) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentPdf || null);

  const handleUploadComplete = (res: any) => {
    if (res && res[0]?.url) {
      const url = res[0].url;
      setUploadedUrl(url);
      toast.success("PDF uploaded successfully!");
      onUploadComplete?.(url);
    }
  };

  const handleUploadError = (error: Error) => {
    const errorMessage = error.message || "Failed to upload PDF";
    toast.error(errorMessage);
    onUploadError?.(errorMessage);
  };

  const handleRemove = () => {
    setUploadedUrl(null);
    onUploadComplete?.("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <UploadButton<OurFileRouter>
          endpoint="pdfUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          content={{
            button: (
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {uploadedUrl ? "Change PDF" : "Upload PDF"}
              </span>
            ),
            allowedContent: `Max ${maxSize}MB (PDF only)`,
          }}
          appearance={{
            button: "ut-ready:bg-teal-600 ut-uploading:cursor-not-allowed rounded-lg bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100 px-4 py-2 text-sm font-medium transition-colors",
            allowedContent: "text-xs text-gray-500 mt-1",
          }}
        />
        {uploadedUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      {uploadedUrl && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                COA Document
              </p>
              <p className="text-xs text-gray-500 truncate">
                PDF uploaded successfully
              </p>
            </div>
            <div className="flex-shrink-0 bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Check className="w-3 h-3" />
              Uploaded
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <p className="font-medium mb-1">PDF URL:</p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all block">
              {uploadedUrl}
            </code>
          </div>
          <div className="mt-3">
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-teal-600 hover:text-teal-700 underline"
            >
              View PDF →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

