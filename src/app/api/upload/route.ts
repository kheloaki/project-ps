import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToSupabase } from '@/lib/supabase-storage';
import { requireAuth } from '@/lib/clerk';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

/**
 * POST /api/upload
 * Upload an image to Supabase Storage
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'images';
    const bucket = formData.get('bucket') as string || 'images';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const url = await uploadImageToSupabase(file, folder, bucket);

    // Save to Media table
    try {
      const { userId } = await auth();
      await (prisma as any).media.upsert({
        where: { url },
        update: {},
        create: {
          url,
          filename: file.name,
          size: file.size,
          mimeType: file.type,
          uploadedBy: userId || null,
        },
      });
    } catch (error) {
      console.error('Error saving media to database:', error);
      // Don't fail the upload if database save fails
    }

    return NextResponse.json({
      success: true,
      url,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

