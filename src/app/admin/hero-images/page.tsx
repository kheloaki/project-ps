'use client';

import { useState, useEffect } from 'react';
import { ImageUploader } from '@/components/upload/image-uploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, Save, Plus, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface HeroImage {
  id: string;
  url: string;
  title: string | null;
  alt: string | null;
  position: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HeroImagesPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null);
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    alt: '',
    position: 'back',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/hero-images');
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data.images || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load hero images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, url }));
  };

  const handleSave = async () => {
    try {
      if (!formData.url) {
        toast.error('Please upload an image first');
        return;
      }

      if (editingImage) {
        // Update existing image
        const response = await fetch(`/api/admin/hero-images/${editingImage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to update image');
        toast.success('Hero image updated successfully');
      } else {
        // Create new image
        const response = await fetch('/api/admin/hero-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to create image');
        toast.success('Hero image created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchImages();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save hero image');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero image?')) return;

    try {
      const response = await fetch(`/api/admin/hero-images/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete image');
      toast.success('Hero image deleted successfully');
      fetchImages();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete hero image');
    }
  };

  const handleEdit = (image: HeroImage) => {
    setEditingImage(image);
    setFormData({
      url: image.url,
      title: image.title || '',
      alt: image.alt || '',
      position: image.position,
      order: image.order,
      isActive: image.isActive,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingImage(null);
    setFormData({
      url: '',
      title: '',
      alt: '',
      position: 'back',
      order: 0,
      isActive: true,
    });
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading hero images...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Images</h1>
          <p className="text-gray-600">Manage images displayed in the home page hero section</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hero Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingImage ? 'Edit Hero Image' : 'Add Hero Image'}</DialogTitle>
              <DialogDescription>
                Upload and configure an image for the hero section
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div>
                <Label>Image</Label>
                <ImageUploader
                  onUploadComplete={handleImageUpload}
                  currentImage={formData.url}
                />
              </div>

              <div>
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Product title or description"
                />
              </div>

              <div>
                <Label htmlFor="alt">Alt Text (optional)</Label>
                <Input
                  id="alt"
                  value={formData.alt}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                  placeholder="Alternative text for accessibility"
                />
              </div>

              <div>
                <Label htmlFor="position">Position</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="back">Back (behind center)</SelectItem>
                    <SelectItem value="center">Center (main focus)</SelectItem>
                    <SelectItem value="front">Front (in front of center)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingImage ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {images.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">No hero images yet</p>
            <p className="text-sm text-gray-500 mb-4">Add your first hero image to get started</p>
            <Button onClick={openNewDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hero Image
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image.id}>
              <CardHeader>
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={image.url}
                    alt={image.alt || image.title || 'Hero image'}
                    fill
                    className="object-contain"
                  />
                  {!image.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Inactive</span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg">{image.title || 'Untitled'}</CardTitle>
                <CardDescription>
                  Position: {image.position} • Order: {image.order}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(image)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

