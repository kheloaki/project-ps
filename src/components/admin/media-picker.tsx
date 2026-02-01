"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Upload, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface MediaItem {
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

export interface MediaPickerResult {
  url: string;
  title?: string;
  alt?: string;
  caption?: string;
  description?: string;
  seoFilename?: string;
}

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: MediaPickerResult) => void;
  currentMedia?: MediaPickerResult | null;
  title?: string;
  description?: string;
}

export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  currentMedia,
  title = "Select or Upload Media",
  description = "Choose an image from your media library or upload a new one.",
}: MediaPickerProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const selectedMediaRef = useRef<HTMLDivElement>(null);
  const [editingMetadata, setEditingMetadata] = useState<{
    title: string;
    alt: string;
    caption: string;
    description: string;
    seoFilename: string;
  } | null>(null);
  const [savingMetadata, setSavingMetadata] = useState(false);

  // Fetch media from library
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
        throw new Error(data.error || 'Failed to fetch media');
      }
      
      setMedia(data.media || []);
    } catch (error: any) {
      console.error('Error fetching media:', error);
      toast.error(error.message || 'Failed to load media');
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && activeTab === 'library') {
      fetchMedia();
    }
  }, [open, activeTab, searchQuery]);

  // Set selected media when currentMedia changes
  useEffect(() => {
    if (currentMedia && open) {
      const found = media.find(m => m.url === currentMedia.url);
      if (found) {
        setSelectedMediaId(found.id);
        setEditingMetadata({
          title: found.title || '',
          alt: found.alt || '',
          caption: found.caption || '',
          description: found.description || '',
          seoFilename: found.seoFilename || '',
        });
      }
    }
  }, [currentMedia, media, open]);

  const handleSelectMedia = (item: MediaItem) => {
    setSelectedMediaId(item.id);
    // Initialize editing metadata with current values
    setEditingMetadata({
      title: item.title || '',
      alt: item.alt || '',
      caption: item.caption || '',
      description: item.description || '',
      seoFilename: item.seoFilename || '',
    });
    // Scroll to selected item after a brief delay to ensure it's rendered
    setTimeout(() => {
      selectedMediaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleSaveMetadata = async () => {
    if (!selectedMediaId || !editingMetadata) return;

    setSavingMetadata(true);
    try {
      const response = await fetch(`/api/admin/media/${selectedMediaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMetadata),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save metadata');
      }

      // Update the media item in the local state
      setMedia(prev => prev.map(item => 
        item.id === selectedMediaId 
          ? { ...item, ...editingMetadata }
          : item
      ));

      toast.success('Metadata saved successfully!');
    } catch (error: any) {
      console.error('Error saving metadata:', error);
      toast.error(error.message || 'Failed to save metadata');
    } finally {
      setSavingMetadata(false);
    }
  };

  const handleConfirmSelection = async () => {
    const selected = media.find(m => m.id === selectedMediaId);
    if (selected) {
      // Save metadata if it was edited
      if (editingMetadata) {
        const hasChanges = 
          editingMetadata.title !== (selected.title || '') ||
          editingMetadata.alt !== (selected.alt || '') ||
          editingMetadata.caption !== (selected.caption || '') ||
          editingMetadata.description !== (selected.description || '') ||
          editingMetadata.seoFilename !== (selected.seoFilename || '');

        if (hasChanges) {
          await handleSaveMetadata();
        }
      }

      // Use the latest metadata (either from editingMetadata or selected)
      const finalMetadata = editingMetadata || {
        title: selected.title || '',
        alt: selected.alt || '',
        caption: selected.caption || '',
        description: selected.description || '',
        seoFilename: selected.seoFilename || '',
      };

      onSelect({
        url: selected.url,
        title: finalMetadata.title || undefined,
        alt: finalMetadata.alt || undefined,
        caption: finalMetadata.caption || undefined,
        description: finalMetadata.description || undefined,
        seoFilename: finalMetadata.seoFilename || undefined,
      });
      onOpenChange(false);
      toast.success('Media selected');
    }
  };

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
        
        // Refresh media library and select the newly uploaded media
        if (data.media) {
          await fetchMedia(); // Refresh the library
          // Wait a bit for the media to be in the list
          setTimeout(() => {
            setSelectedMediaId(data.media.id);
            setEditingMetadata({
              title: data.media.title || '',
              alt: data.media.alt || '',
              caption: data.media.caption || '',
              description: data.media.description || '',
              seoFilename: data.media.seoFilename || '',
            });
            setActiveTab('library'); // Switch to library tab to show the uploaded image
            toast.success('Image uploaded! Review details and click "Select Media" to use it.');
          }, 300);
        }
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

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'library' | 'upload')} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-1 flex flex-col overflow-hidden mt-4">
            <div className="flex-1 flex gap-4 overflow-hidden">
              {/* Left: Media Grid */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search */}
                <div className="mb-4">
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
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : media.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No images found</p>
                      <Button onClick={() => setActiveTab('upload')} variant="outline">
                        Upload New Image
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {media.map((item) => (
                        <div
                          key={item.id}
                          ref={selectedMediaId === item.id ? selectedMediaRef : null}
                          onClick={() => handleSelectMedia(item)}
                          className={`group relative bg-white border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                            selectedMediaId === item.id
                              ? 'border-teal-600 ring-2 ring-teal-200 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="aspect-square relative bg-gray-100">
                            <img
                              src={item.url}
                              alt={item.alt || item.filename}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {selectedMediaId === item.id && (
                              <div className="absolute inset-0 bg-teal-600 bg-opacity-30 flex items-center justify-center">
                                <div className="bg-teal-600 text-white rounded-full p-2 shadow-lg">
                                  <Check className="w-5 h-5" />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <p className="text-xs font-medium text-gray-900 truncate" title={item.filename}>
                              {item.filename}
                            </p>
                            {item.title && (
                              <p className="text-xs text-gray-600 truncate mt-1" title={item.title}>
                                {item.title}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {formatFileSize(item.size)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Image Details Sidebar (WordPress style) */}
              {selectedMediaId && (
                <div className="w-80 border-l border-gray-200 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900">Attachment Details</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    {(() => {
                      const selected = media.find(m => m.id === selectedMediaId);
                      if (!selected) return null;
                      
                      return (
                        <div className="space-y-4">
                          {/* Image Preview */}
                          <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={selected.url}
                              alt={selected.alt || selected.filename}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          {/* Image Info */}
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs font-medium text-gray-700 mb-1 block">File Name</Label>
                              <p className="text-sm text-gray-900 break-all">{selected.filename}</p>
                            </div>

                            <div>
                              <Label className="text-xs font-medium text-gray-700 mb-1 block">File Type</Label>
                              <p className="text-sm text-gray-900">{selected.mimeType || '—'}</p>
                            </div>

                            <div>
                              <Label className="text-xs font-medium text-gray-700 mb-1 block">File Size</Label>
                              <p className="text-sm text-gray-900">{formatFileSize(selected.size)}</p>
                            </div>

                            {selected.width && selected.height && (
                              <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1 block">Dimensions</Label>
                                <p className="text-sm text-gray-900">{selected.width} × {selected.height} pixels</p>
                              </div>
                            )}

                            <div>
                              <Label className="text-xs font-medium text-gray-700 mb-1 block">URL</Label>
                              <p className="text-xs text-gray-600 break-all bg-gray-50 p-2 rounded">{selected.url}</p>
                            </div>

                            {/* Editable Metadata Fields */}
                            <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
                              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Image Metadata</h4>
                              
                              <div>
                                <Label htmlFor="metadata-title" className="text-xs font-medium text-gray-700 mb-1 block">
                                  Title
                                </Label>
                                <Input
                                  id="metadata-title"
                                  type="text"
                                  value={editingMetadata?.title || ''}
                                  onChange={(e) => setEditingMetadata(prev => prev ? { ...prev, title: e.target.value } : null)}
                                  placeholder="Image title"
                                  className="text-sm"
                                />
                              </div>

                              <div>
                                <Label htmlFor="metadata-alt" className="text-xs font-medium text-gray-700 mb-1 block">
                                  Alt Text <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="metadata-alt"
                                  type="text"
                                  value={editingMetadata?.alt || ''}
                                  onChange={(e) => setEditingMetadata(prev => prev ? { ...prev, alt: e.target.value } : null)}
                                  placeholder="Describe the image for accessibility"
                                  className="text-sm"
                                  required
                                />
                                <p className="text-xs text-gray-500 mt-1">Required for accessibility and SEO</p>
                              </div>

                              <div>
                                <Label htmlFor="metadata-caption" className="text-xs font-medium text-gray-700 mb-1 block">
                                  Caption
                                </Label>
                                <Textarea
                                  id="metadata-caption"
                                  value={editingMetadata?.caption || ''}
                                  onChange={(e) => setEditingMetadata(prev => prev ? { ...prev, caption: e.target.value } : null)}
                                  placeholder="Caption text displayed below the image"
                                  rows={2}
                                  className="text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">Optional caption (HTML supported)</p>
                              </div>

                              <div>
                                <Label htmlFor="metadata-description" className="text-xs font-medium text-gray-700 mb-1 block">
                                  Description
                                </Label>
                                <Textarea
                                  id="metadata-description"
                                  value={editingMetadata?.description || ''}
                                  onChange={(e) => setEditingMetadata(prev => prev ? { ...prev, description: e.target.value } : null)}
                                  placeholder="Image description (HTML supported)"
                                  rows={3}
                                  className="text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">Detailed description for SEO (HTML supported, not visible on site)</p>
                              </div>

                              <div>
                                <Label htmlFor="metadata-seo-filename" className="text-xs font-medium text-gray-700 mb-1 block">
                                  SEO-Friendly Filename
                                </Label>
                                <Input
                                  id="metadata-seo-filename"
                                  type="text"
                                  value={editingMetadata?.seoFilename || ''}
                                  onChange={(e) => setEditingMetadata(prev => prev ? { ...prev, seoFilename: e.target.value } : null)}
                                  placeholder="auto-generated-from-filename"
                                  className="text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">Improves Google Images ranking</p>
                              </div>

                              <Button
                                onClick={handleSaveMetadata}
                                disabled={savingMetadata}
                                className="w-full bg-teal-600 hover:bg-teal-700"
                                size="sm"
                              >
                                {savingMetadata ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  'Save Metadata'
                                )}
                              </Button>
                            </div>

                            <div>
                              <Label className="text-xs font-medium text-gray-700 mb-1 block">Uploaded</Label>
                              <p className="text-sm text-gray-900">
                                {new Date(selected.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSelection}
                disabled={!selectedMediaId}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Select Media
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="flex-1 flex flex-col overflow-hidden mt-4">
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              {uploading ? (
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">Uploading image...</p>
                </div>
              ) : (
                <>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-6 bg-gray-50">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, WebP (max 10MB)
                    </p>
                  </div>
                  {/* @ts-ignore - UploadButton type issue */}
                  <UploadButton<OurFileRouter>
                    endpoint="imageUploader"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    onUploadBegin={() => setUploading(true)}
                    content={{
                      button: (
                        <span className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                          <Upload className="w-5 h-5" />
                          Upload Image
                        </span>
                      ),
                    }}
                    appearance={{
                      button: "ut-ready:bg-teal-600 ut-uploading:cursor-not-allowed",
                    }}
                  />
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

