"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Check } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface ImageUploaderProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  maxSize?: number; // in MB
  accept?: string;
  className?: string;
  currentImage?: string;
}

export function ImageUploader({
  onUploadComplete,
  onUploadError,
  folder = "images",
  maxSize = 10,
  accept = "image/*",
  className = "",
  currentImage,
}: ImageUploaderProps) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentImage || null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleUploadComplete = (res: any) => {
    if (res && res[0]?.url) {
      const url = res[0].url;
      setUploadedUrl(url);
      setPreview(url);
      toast.success("Image uploaded successfully!");
      onUploadComplete?.(url);
    }
  };

  const handleUploadError = (error: Error) => {
    const errorMessage = error.message || "Failed to upload image";
    toast.error(errorMessage);
    onUploadError?.(errorMessage);
  };

  const handleRemove = () => {
    setPreview(null);
    setUploadedUrl(null);
    onUploadComplete?.("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <UploadButton<OurFileRouter>
          endpoint="imageUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          content={{
            button: (
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {uploadedUrl ? "Change Image" : "Upload Image"}
              </span>
            ),
            allowedContent: `Max ${maxSize}MB`,
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

      {preview && (
        <div className="relative w-full h-64 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain"
          />
          {uploadedUrl && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Check className="w-3 h-3" />
              Uploaded
            </div>
          )}
        </div>
      )}

      {uploadedUrl && (
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-1">Image URL:</p>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">
            {uploadedUrl}
          </code>
        </div>
      )}
    </div>
  );
}

