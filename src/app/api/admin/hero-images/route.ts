import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

/**
 * GET /api/admin/hero-images
 * Get all hero images (admin only)
 */
export async function GET() {
  try {
    await requireAdmin();

    const heroImages = await prisma.heroImage.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    return NextResponse.json({ images: heroImages });
  } catch (error: any) {
    console.error('Error fetching hero images:', error);
    
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/hero-images
 * Create a new hero image
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { url, title, alt, position, order, isActive } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const heroImage = await prisma.heroImage.create({
      data: {
        url,
        title: title || null,
        alt: alt || null,
        position: position || 'back',
        order: order ?? 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ image: heroImage });
  } catch (error: any) {
    console.error('Error creating hero image:', error);
    
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

