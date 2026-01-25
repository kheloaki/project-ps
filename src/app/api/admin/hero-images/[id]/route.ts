import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

/**
 * PUT /api/admin/hero-images/[id]
 * Update a hero image
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();
    const { url, title, alt, position, order, isActive } = body;

    const heroImage = await prisma.heroImage.update({
      where: { id },
      data: {
        ...(url && { url }),
        ...(title !== undefined && { title }),
        ...(alt !== undefined && { alt }),
        ...(position && { position }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ image: heroImage });
  } catch (error: any) {
    console.error('Error updating hero image:', error);
    
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Hero image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/hero-images/[id]
 * Delete a hero image
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    await prisma.heroImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting hero image:', error);
    
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Hero image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

