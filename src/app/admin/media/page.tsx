"use client";

import React, { useState, useEffect } from 'react';
import { Plus, X, Pencil, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  title?: string | null;
  alt?: string | null;
  caption?: string | null;
  description?: string | null;
  seoFilename?: string | null;
  width?: number | null;
  height?: number | null;
  size?: number | null;
  mimeType?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Fetch media
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      const response = await fetch(`/api/admin/media?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch media (${response.status})`);
      }
      
      setMedia(data.media || []);
    } catch (error: any) {
      console.error('Error fetching media:', error);
      toast.error(error.message || 'Failed to load media');
      setMedia([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [searchQuery]);

  // Handle image upload
  const handleUploadComplete = async (res: any) => {
    if (res && res[0]?.url) {
      setUploading(true);
      try {
        const file = res[0];
        const response = await fetch('/api/admin/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: file.url,
            filename: file.name,
            size: file.size,
            mimeType: file.type,
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to save media');
        }
        
        toast.success('Image uploaded successfully!');
        setShowUploadDialog(false);
        fetchMedia();
      } catch (error: any) {
        console.error('Upload error:', error);
        toast.error(error.message || 'Failed to save media');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleUploadError = (error: Error) => {
    toast.error(error.message || 'Failed to upload image');
    setUploading(false);
  };

  // Delete media
  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete media');
      toast.success('Image deleted successfully!');
      fetchMedia();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete media');
    }
  };

  // Save metadata
  const handleSaveMetadata = async (metadata: {
    title: string;
    alt: string;
    caption: string;
    description: string;
    seoFilename: string;
  }) => {
    if (!editingMedia) return;

    try {
      const response = await fetch(`/api/admin/media/${editingMedia.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) throw new Error('Failed to update metadata');
      toast.success('Metadata updated successfully!');
      setEditingMedia(null);
      fetchMedia();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update metadata');
    }
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-teal-700 mb-2">Media Library</h1>
          <p className="text-gray-600">Manage all uploaded images and their metadata</p>
        </div>
        <Button
          onClick={() => setShowUploadDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Upload Image
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search images by filename, title, or alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading media...</div>
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No images found</p>
          <Button onClick={() => setShowUploadDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Upload Your First Image
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square relative bg-gray-50 overflow-hidden">
                {imageErrors.has(item.id) ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-400 text-xs p-2">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-center">Failed to load</span>
                    <button
                      onClick={() => {
                        setImageErrors(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(item.id);
                          return newSet;
                        });
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-xs underline"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={item.url}
                      alt={item.alt || item.filename}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={() => {
                        console.error('Image load error:', item.filename, item.url?.substring(0, 100));
                        setImageErrors(prev => new Set(prev).add(item.id));
                      }}
                      onLoad={() => {
                        setImageErrors(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(item.id);
                          return newSet;
                        });
                      }}
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-opacity flex items-center justify-center gap-2 z-10 pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingMedia(item);
                    }}
                    className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all pointer-events-auto z-10"
                    title="Edit metadata"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id, item.url);
                    }}
                    className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-all pointer-events-auto z-10"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate" title={item.filename}>
                  {item.filename}
                </p>
                {item.title && (
                  <p className="text-xs text-gray-600 truncate mt-1" title={item.title}>
                    {item.title}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(item.size)}
                  {item.width && item.height && ` • ${item.width}×${item.height}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Upload a new image to the media library
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              {uploading ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600">Uploading image...</p>
                </div>
              ) : (
                <>
                  {/* @ts-ignore - UploadButton type issue */}
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    onUploadBegin={() => setUploading(true)}
                    content={{
                      button: (
                        <span className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                          <Plus className="w-4 h-4" />
                          Upload Image
                        </span>
                      ),
                    }}
                    appearance={{
                      button: "ut-ready:bg-teal-600 ut-uploading:cursor-not-allowed",
                    }}
                  />
                  <p className="text-xs text-gray-500 text-center">
                    PNG, JPG, GIF, WebP (max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Metadata Dialog */}
      {editingMedia && (
        <MediaMetadataDialog
          media={editingMedia}
          onSave={handleSaveMetadata}
          onClose={() => setEditingMedia(null)}
        />
      )}
    </div>
  );
}

// Media Metadata Dialog Component
function MediaMetadataDialog({
  media,
  onSave,
  onClose,
}: {
  media: MediaItem;
  onSave: (metadata: {
    title: string;
    alt: string;
    caption: string;
    description: string;
    seoFilename: string;
  }) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(media.title || '');
  const [alt, setAlt] = useState(media.alt || '');
  const [caption, setCaption] = useState(media.caption || '');
  const [description, setDescription] = useState(media.description || '');
  const [seoFilename, setSeoFilename] = useState(media.seoFilename || '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ title, alt, caption, description, seoFilename });
  };

  return (
    <Dialog open={!!media} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Image Metadata</DialogTitle>
          <DialogDescription>
            Add metadata to improve SEO and accessibility for this image.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="md:col-span-1">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={media.url}
                alt={media.alt || media.filename}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p><strong>Filename:</strong> {media.filename}</p>
              {media.width && media.height && (
                <p><strong>Dimensions:</strong> {media.width} × {media.height}px</p>
              )}
              {media.size && (
                <p><strong>Size:</strong> {(media.size / 1024).toFixed(1)} KB</p>
              )}
            </div>
          </div>
          <div className="md:col-span-1">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="media-title">Title</Label>
                <Input
                  id="media-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Image title"
                />
              </div>

              <div>
                <Label htmlFor="media-alt">Alt Text <span className="text-red-500">*</span></Label>
                <Input
                  id="media-alt"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Describe the image for accessibility"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Required for accessibility and SEO</p>
              </div>

              <div>
                <Label htmlFor="media-seo-filename">SEO-Friendly Filename</Label>
                <Input
                  id="media-seo-filename"
                  value={seoFilename}
                  onChange={(e) => setSeoFilename(e.target.value)}
                  placeholder="auto-generated-from-filename"
                />
                <p className="text-xs text-gray-500 mt-1">Improves Google Images ranking</p>
              </div>

              <div>
                <Label htmlFor="media-caption">Caption</Label>
                <Textarea
                  id="media-caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Caption text displayed below the image"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">Optional caption (HTML supported)</p>
              </div>

              <div>
                <Label htmlFor="media-description">Description</Label>
                <Textarea
                  id="media-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Image description (HTML supported)"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Detailed description for SEO (HTML supported, not visible on site)</p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Metadata
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

