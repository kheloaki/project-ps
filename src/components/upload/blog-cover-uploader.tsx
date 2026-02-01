"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Upload, X, Check, Cloud, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaPicker, type MediaPickerResult } from "@/components/admin/media-picker";

export interface BlogImageMetadata {
  url: string;
  title?: string;
  alt?: string;
  caption?: string;
  description?: string;
  seoFilename?: string;
}

interface BlogCoverUploaderProps {
  onMetadataChange?: (metadata: BlogImageMetadata) => void;
  onUploadError?: (error: string) => void;
  currentMetadata?: BlogImageMetadata;
}

export function BlogCoverUploader({
  onMetadataChange,
  onUploadError,
  currentMetadata,
}: BlogCoverUploaderProps) {
  const [metadata, setMetadata] = useState<BlogImageMetadata>(
    currentMetadata || { url: '' }
  );
  const [preview, setPreview] = useState<string | null>(currentMetadata?.url || null);
  const [isDragging, setIsDragging] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const isInitialMount = useRef(true);
  const prevCurrentMetadataRef = useRef(currentMetadata);

  // Update metadata when currentMetadata prop changes (only if different and not from our own update)
  useEffect(() => {
    if (isInitialMount.current) {
      // On initial mount, set metadata from prop
      if (currentMetadata) {
        setMetadata(currentMetadata);
        setPreview(currentMetadata.url || null);
      }
      isInitialMount.current = false;
      prevCurrentMetadataRef.current = currentMetadata;
      return;
    }

    // Only update if currentMetadata changed from outside (not from our callback)
    if (currentMetadata && 
        prevCurrentMetadataRef.current &&
        (prevCurrentMetadataRef.current.url !== currentMetadata.url ||
         prevCurrentMetadataRef.current.alt !== currentMetadata.alt ||
         prevCurrentMetadataRef.current.caption !== currentMetadata.caption ||
         prevCurrentMetadataRef.current.seoFilename !== currentMetadata.seoFilename)) {
      // Check if this is actually a different value
      if (metadata.url !== currentMetadata.url || 
          metadata.alt !== currentMetadata.alt ||
          metadata.caption !== currentMetadata.caption ||
          metadata.seoFilename !== currentMetadata.seoFilename) {
        setMetadata(currentMetadata);
        setPreview(currentMetadata.url || null);
      }
    } else if (!currentMetadata && metadata.url) {
      // Reset if currentMetadata is cleared
      setMetadata({ url: '' });
      setPreview(null);
    }
    
    prevCurrentMetadataRef.current = currentMetadata;
  }, [currentMetadata]);

  const handleMediaSelect = (media: MediaPickerResult) => {
    const newMetadata: BlogImageMetadata = {
      url: media.url,
      title: media.title,
      alt: media.alt,
      caption: media.caption,
      description: media.description,
      seoFilename: media.seoFilename,
    };
    
    setMetadata(newMetadata);
    setPreview(media.url);
    if (onMetadataChange) {
      onMetadataChange(newMetadata);
    }
  };

  const handleRemove = () => {
    setMetadata({ url: '' });
    setPreview(null);
  };

  const updateMetadataField = (field: keyof BlogImageMetadata, value: string) => {
    setMetadata(prev => {
      const newMetadata = { ...prev, [field]: value };
      // Notify parent of change immediately when user types
      if (onMetadataChange) {
        onMetadataChange(newMetadata);
      }
      return newMetadata;
    });
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
              alt={metadata.alt || "Cover preview"}
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
            {metadata.url && (
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
              Select from media library or upload new image
            </p>
            <p className="text-xs text-gray-500 mb-4">
              PNG, JPG, GIF, WebP (max 10MB)
            </p>
            <Button
              type="button"
              onClick={() => setShowMediaPicker(true)}
              className="flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              Select or Upload Image
            </Button>
          </div>
        )}
      </div>

      {/* Image Metadata Fields - Only show when image is uploaded */}
      {preview && metadata.url && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Image Metadata</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="image-title" className="text-xs font-medium text-gray-700 mb-1">
                Title
              </Label>
              <Input
                id="image-title"
                type="text"
                value={metadata.title || ''}
                onChange={(e) => updateMetadataField('title', e.target.value)}
                className="w-full text-sm"
                placeholder="Image title"
              />
            </div>

            <div>
              <Label htmlFor="image-alt" className="text-xs font-medium text-gray-700 mb-1">
                Alt Text <span className="text-red-500">*</span>
              </Label>
              <Input
                id="image-alt"
                type="text"
                value={metadata.alt || ''}
                onChange={(e) => updateMetadataField('alt', e.target.value)}
                className="w-full text-sm"
                placeholder="Alternative text for accessibility"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Critical for accessibility and SEO</p>
            </div>
          </div>

          <div>
            <Label htmlFor="image-seo-filename" className="text-xs font-medium text-gray-700 mb-1">
              SEO-Friendly Filename
            </Label>
            <Input
              id="image-seo-filename"
              type="text"
              value={metadata.seoFilename || ''}
              onChange={(e) => updateMetadataField('seoFilename', e.target.value)}
              className="w-full text-sm"
              placeholder="auto-generated-from-filename"
            />
            <p className="text-xs text-gray-500 mt-1">Improves Google Images ranking</p>
          </div>

          <div>
            <Label htmlFor="image-caption" className="text-xs font-medium text-gray-700 mb-1">
              Caption
            </Label>
            <Textarea
              id="image-caption"
              value={metadata.caption || ''}
              onChange={(e) => updateMetadataField('caption', e.target.value)}
              rows={2}
              className="w-full text-sm"
              placeholder="Caption text displayed below the cover image"
            />
            <p className="text-xs text-gray-500 mt-1">Optional caption displayed below the cover image (HTML supported)</p>
          </div>

          <div>
            <Label htmlFor="image-description" className="text-xs font-medium text-gray-700 mb-1">
              Description
            </Label>
            <Textarea
              id="image-description"
              value={metadata.description || ''}
              onChange={(e) => updateMetadataField('description', e.target.value)}
              rows={3}
              className="w-full text-sm"
              placeholder="Image description (HTML supported)"
            />
            <p className="text-xs text-gray-500 mt-1">Detailed description for SEO (HTML supported, not visible on site)</p>
          </div>
        </div>
      )}

      {/* Media Picker Dialog */}
      <MediaPicker
        open={showMediaPicker}
        onOpenChange={setShowMediaPicker}
        onSelect={handleMediaSelect}
        currentMedia={metadata.url ? {
          url: metadata.url,
          title: metadata.title,
          alt: metadata.alt,
          caption: metadata.caption,
          description: metadata.description,
          seoFilename: metadata.seoFilename,
        } : null}
        title="Select Cover Image"
        description="Choose an image from your media library or upload a new one for the blog post cover."
      />
    </div>
  );
}

