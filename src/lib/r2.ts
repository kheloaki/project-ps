import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// R2 is S3-compatible, so we use AWS SDK
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

if (!BUCKET_NAME || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  console.warn('⚠️  R2 configuration is incomplete. Image uploads will not work.');
}

/**
 * Upload a file to R2
 */
export async function uploadToR2(
  file: Buffer | Uint8Array,
  key: string,
  contentType: string
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await r2Client.send(command);

    // Return public URL
    if (PUBLIC_URL) {
      return `${PUBLIC_URL}/${key}`;
    }

    // Fallback to signed URL if no public URL configured
    return await getSignedUrl(r2Client, new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }), { expiresIn: 31536000 }); // 1 year
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw new Error('Failed to upload file to R2');
  }
}

/**
 * Upload an image file to R2
 */
export async function uploadImage(
  file: File | Buffer,
  folder: string = 'images',
  filename?: string
): Promise<string> {
  const isFile = file instanceof File;
  const buffer = isFile ? Buffer.from(await file.arrayBuffer()) : file;
  const contentType = isFile ? file.type : 'image/jpeg';
  
  // Generate filename if not provided
  const finalFilename = filename || (isFile ? file.name : `image-${Date.now()}.jpg`);
  
  // Sanitize filename
  const sanitizedFilename = finalFilename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();
  
  // Create key with folder structure: folder/YYYY/MM/filename
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const key = `${folder}/${year}/${month}/${sanitizedFilename}`;

  return uploadToR2(buffer, key, contentType);
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('Error deleting from R2:', error);
    throw new Error('Failed to delete file from R2');
  }
}

/**
 * Get a signed URL for private files
 */
export async function getSignedUrlForR2(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(r2Client, command, { expiresIn });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate signed URL');
  }
}

/**
 * Extract key from R2 URL
 */
export function extractKeyFromUrl(url: string): string | null {
  if (!PUBLIC_URL) return null;
  
  if (url.startsWith(PUBLIC_URL)) {
    return url.replace(PUBLIC_URL + '/', '');
  }
  
  return null;
}

export { r2Client, BUCKET_NAME };

