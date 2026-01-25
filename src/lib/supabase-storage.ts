import { createServerClient } from './supabase';

/**
 * Upload an image to Supabase Storage
 */
export async function uploadImageToSupabase(
  file: File,
  folder: string = 'images',
  bucket: string = 'images'
): Promise<string> {
  const supabase = createServerClient();
  
  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExt = file.name.split('.').pop();
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase()
    .replace(/\.[^/.]+$/, ''); // Remove extension
  
  const filename = `${sanitizedName}-${timestamp}-${randomString}.${fileExt}`;
  
  // Create path with folder structure: folder/YYYY/MM/filename
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const filePath = `${folder}/${year}/${month}/${filename}`;
  
  // Convert File to ArrayBuffer then to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false, // Don't overwrite existing files
    });
  
  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  
  if (!urlData?.publicUrl) {
    throw new Error('Failed to get public URL for uploaded image');
  }
  
  return urlData.publicUrl;
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImageFromSupabase(
  filePath: string,
  bucket: string = 'images'
): Promise<void> {
  const supabase = createServerClient();
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);
  
  if (error) {
    console.error('Supabase delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

