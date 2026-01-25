import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/hero-images
 * Get all active hero images (public endpoint)
 */
export async function GET() {
  try {
    const heroImages = await prisma.heroImage.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    return NextResponse.json({ images: heroImages });
  } catch (error: any) {
    console.error('Error fetching hero images:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

