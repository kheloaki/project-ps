"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  productTitle: string;
}

const ProductImageGallery = ({ images, productTitle }: ProductImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [thumbnailScrollIndex, setThumbnailScrollIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const maxVisibleThumbnails = 4;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ensure we have at least one image
  const displayImages = images.length > 0 ? images : ['/placeholder.png'];
  const selectedImage = displayImages[selectedImageIndex] || displayImages[0];

  // Debug: log images for troubleshooting
  useEffect(() => {
    console.log('ProductImageGallery - Images received:', {
      imagesCount: images.length,
      images: images,
      displayImagesCount: displayImages.length,
      displayImages: displayImages,
      willShowThumbnails: displayImages.length > 1
    });
  }, [images, displayImages.length]);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  const scrollThumbnails = (direction: 'up' | 'down') => {
    if (direction === 'up' && thumbnailScrollIndex > 0) {
      setThumbnailScrollIndex(thumbnailScrollIndex - 1);
    } else if (direction === 'down' && thumbnailScrollIndex < Math.max(0, displayImages.length - maxVisibleThumbnails)) {
      setThumbnailScrollIndex(thumbnailScrollIndex + 1);
    }
  };

  // Update thumbnail scroll position when selected image changes
  useEffect(() => {
    if (!isMobile && displayImages.length > maxVisibleThumbnails) {
      const selectedIndex = selectedImageIndex;
      const visibleRange = maxVisibleThumbnails;
      
      // If selected image is outside visible range, scroll to show it
      if (selectedIndex < thumbnailScrollIndex) {
        setThumbnailScrollIndex(selectedIndex);
      } else if (selectedIndex >= thumbnailScrollIndex + visibleRange) {
        setThumbnailScrollIndex(Math.max(0, selectedIndex - visibleRange + 1));
      }
    }
  }, [selectedImageIndex, isMobile, displayImages.length]);

  const canScrollUp = thumbnailScrollIndex > 0;
  const canScrollDown = thumbnailScrollIndex < Math.max(0, displayImages.length - maxVisibleThumbnails);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Left: Thumbnail Carousel - Show if there are images */}
      {displayImages.length > 0 && (
        <div className="flex flex-row sm:flex-col gap-3 relative order-2 sm:order-1">
          {/* Scroll Up Button - Only visible on desktop when scrolling is needed */}
          {displayImages.length > maxVisibleThumbnails && canScrollUp && (
            <button
              onClick={() => scrollThumbnails('up')}
              className="hidden sm:flex absolute top-0 left-0 right-0 z-10 bg-white/95 hover:bg-white border border-gray-200 rounded-lg p-1.5 items-center justify-center transition-colors shadow-sm"
              aria-label="Scroll thumbnails up"
            >
              <ChevronUp className="w-4 h-4 text-[#09121F]" />
            </button>
          )}

          {/* Thumbnail Container */}
          <div 
            className="flex flex-row sm:flex-col gap-3 overflow-x-auto sm:overflow-x-hidden sm:overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" 
            style={{ 
              maxHeight: displayImages.length > 1 ? `${maxVisibleThumbnails * 88 + (maxVisibleThumbnails - 1) * 12}px` : 'auto',
              maxWidth: '100%'
            }}
          >
            <div 
              className="flex flex-row sm:flex-col gap-3 transition-transform duration-300 ease-in-out sm:translate-y-0"
              style={{ 
                transform: !isMobile 
                  ? `translateY(-${thumbnailScrollIndex * 100}px)` 
                  : 'none'
              }}
            >
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative w-20 h-20 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all bg-white ${
                    selectedImageIndex === index
                      ? 'border-[#8A773E] ring-2 ring-[#8A773E] ring-offset-1 shadow-md'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${productTitle} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Scroll Down Button - Only visible on desktop when scrolling is needed */}
          {displayImages.length > maxVisibleThumbnails && canScrollDown && (
            <button
              onClick={() => scrollThumbnails('down')}
              className="hidden sm:flex absolute bottom-0 left-0 right-0 z-10 bg-white/95 hover:bg-white border border-gray-200 rounded-lg p-1.5 items-center justify-center transition-colors shadow-sm"
              aria-label="Scroll thumbnails down"
            >
              <ChevronDown className="w-4 h-4 text-[#09121F]" />
            </button>
          )}
        </div>
      )}

      {/* Right: Main Image */}
      <div className="flex-1 relative aspect-square w-full max-w-[520px] mx-auto overflow-hidden rounded-2xl bg-white flex items-center justify-center p-4 order-1 sm:order-2 group">
        <div className="relative w-full h-full">
          <Image
            src={selectedImage}
            alt={productTitle}
            fill
            className="object-contain transition-opacity duration-300"
            priority
            sizes="(max-width: 768px) 100vw, 520px"
          />
        </div>

        {/* Navigation Arrows - Only show if more than one image */}
        {displayImages.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={handlePreviousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-[#09121F]" strokeWidth={2} />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-[#09121F]" strokeWidth={2} />
            </button>
          </>
        )}

        {/* Favorite Button */}
        <button
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 z-10"
          aria-label="Add to favorites"
        >
          <Heart className="w-5 h-5 text-[#09121F]" strokeWidth={2} fill="none" />
        </button>
      </div>
    </div>
  );
};

export default ProductImageGallery;

