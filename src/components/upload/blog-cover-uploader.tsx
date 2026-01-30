"use client";

import { useState, useCallback } from "react";
import { Upload, X, Check, Cloud } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface BlogCoverUploaderProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
  currentImage?: string;
}

export function BlogCoverUploader({
  onUploadComplete,
  onUploadError,
  currentImage,
}: BlogCoverUploaderProps) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentImage || null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // UploadThing handles file uploads, so we'll rely on the button click
    // This is just for visual feedback
  }, []);

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging
            ? "border-teal-500 bg-teal-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
              src={preview}
              alt="Cover preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {uploadedUrl && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <Check className="w-3 h-3" />
                Uploaded
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Cloud className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF, WebP (max 10MB)
            </p>
            <div className="mt-4">
              <UploadButton<OurFileRouter>
                endpoint="imageUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                content={{
                  button: (
                    <span className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </span>
                  ),
                }}
                appearance={{
                  button: "ut-ready:bg-teal-600 ut-uploading:cursor-not-allowed",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

