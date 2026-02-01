import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { auth } from '@clerk/nextjs/server';

/**
 * GET /api/admin/media
 * Get all media items
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const where: any = {};
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [media, total] = await Promise.all([
      (prisma as any).media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit ? parseInt(limit) : undefined,
        skip: offset ? parseInt(offset) : undefined,
      }),
      (prisma as any).media.count({ where }),
    ]);

    return NextResponse.json({
      media,
      total,
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
    });
  } catch (error: any) {
    console.error('Error fetching media:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    // Handle authentication errors
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required', media: [], total: 0 },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch media', media: [], total: 0 },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/media
 * Create a new media item (after upload)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const { userId } = await auth();

    const body = await request.json();
    const {
      url,
      filename,
      title,
      alt,
      caption,
      description,
      seoFilename,
      width,
      height,
      size,
      mimeType,
    } = body;

    if (!url || !filename) {
      return NextResponse.json(
        { error: 'URL and filename are required' },
        { status: 400 }
      );
    }

    // Use upsert instead of create to handle cases where uploadthing already saved it
    // Build update object with only provided fields
    const updateData: any = {};
    if (filename) updateData.filename = filename;
    if (title !== undefined) updateData.title = title || null;
    if (alt !== undefined) updateData.alt = alt || null;
    if (caption !== undefined) updateData.caption = caption || null;
    if (description !== undefined) updateData.description = description || null;
    if (seoFilename !== undefined) updateData.seoFilename = seoFilename || null;
    if (width !== undefined) updateData.width = width || null;
    if (height !== undefined) updateData.height = height || null;
    if (size !== undefined) updateData.size = size || null;
    if (mimeType !== undefined) updateData.mimeType = mimeType || null;
    if (userId) updateData.uploadedBy = userId;

    const media = await (prisma as any).media.upsert({
      where: { url },
      update: updateData,
      create: {
        url,
        filename,
        title: title || null,
        alt: alt || null,
        caption: caption || null,
        description: description || null,
        seoFilename: seoFilename || null,
        width: width || null,
        height: height || null,
        size: size || null,
        mimeType: mimeType || null,
        uploadedBy: userId || null,
      },
    });

    return NextResponse.json({ media }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating media:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create media' },
      { status: 500 }
    );
  }
}

