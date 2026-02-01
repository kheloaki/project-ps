import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

/**
 * GET /api/admin/media/[id]
 * Get a media item by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const media = await (prisma as any).media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ media });
  } catch (error: any) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/media/[id]
 * Update media metadata
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const {
      title,
      alt,
      caption,
      description,
      seoFilename,
    } = body;

    const media = await (prisma as any).media.update({
      where: { id },
      data: {
        title: title !== undefined ? title : null,
        alt: alt !== undefined ? alt : null,
        caption: caption !== undefined ? caption : null,
        description: description !== undefined ? description : null,
        seoFilename: seoFilename !== undefined ? seoFilename : null,
      },
    });

    return NextResponse.json({ media });
  } catch (error: any) {
    console.error('Error updating media:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update media' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/media/[id]
 * Delete a media item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const media = await (prisma as any).media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    // Delete from database
    await (prisma as any).media.delete({
      where: { id },
    });

    // Note: The actual file deletion from storage should be handled separately
    // if you want to delete the file from UploadThing/S3/etc.

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete media' },
      { status: 500 }
    );
  }
}

