'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Fallback images - using provided URLs only
const fallbackImages = [
  {
    id: 'fallback-1',
    title: 'CAGRI-SEMA',
    image: 'https://zhi52hg7v8.ufs.sh/f/2Om2Ppf6miXTpjhev3YS3TLs1f5IOgyVciDHzwA0R8WQnCFe',
    handle: 'cagri-sema',
    position: 'back' as 'back' | 'center' | 'front',
    alt: 'CAGRI-SEMA Research Peptide',
  },
  {
    id: 'fallback-2',
    title: 'NAD+',
    image: 'https://zhi52hg7v8.ufs.sh/f/2Om2Ppf6miXTMqzLEU7w3yFortmnh5ZsuQWkHaC4RVU96EIc',
    handle: 'nad',
    position: 'center' as 'back' | 'center' | 'front',
    alt: 'NAD+ Research Peptide',
  },
  {
    id: 'fallback-3',
    title: 'Sermorelin',
    image: 'https://zhi52hg7v8.ufs.sh/f/2Om2Ppf6miXTPt1KI53GwceL9grbjJEt1327qWhV546mNfSo',
    handle: 'sermorelin',
    position: 'back' as 'back' | 'center' | 'front',
    alt: 'Sermorelin Research Peptide',
  },
];

const HeroSection = () => {
  // Always use the provided URLs - no API calls
  // Group images by position and order them: back, center, front
  const orderedImages = [...fallbackImages].slice(0, 3);
  return (
    <section className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px] overflow-hidden">
      {/* New Background - Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0a1a1f] via-[#0d2a33] to-[#10869c]">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        {/* Additional gradient layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-black/30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-0 pb-16 md:pb-24 lg:pb-32">
          {/* Left Content - Show first on mobile, first on desktop */}
          <div className="max-w-3xl order-1 lg:order-1">
          {/* Badge/Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8A773E]/90 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Science-Backed Peptide Solutions
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
            High-Purity Research
            <span className="block text-[#8A773E] mt-2">Peptides & Bulk Synthesis</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed animate-slide-up-delay">
            Discover premium quality peptides backed by rigorous research and cutting-edge synthesis technology.
          </p>

          {/* Mobile Products - Show after subheading on mobile, hidden on desktop */}
          {orderedImages.length > 0 && (
            <div className="flex lg:hidden flex-row gap-1 sm:gap-2 items-center justify-center relative py-0 mb-2">
              {orderedImages.map((product, index) => {
                const isCenter = product.position === 'center';
                const isBack = product.position === 'back';
                
                return (
                  <div
                    key={product.id}
                    className={`group relative animate-float cursor-pointer ${
                      isCenter 
                        ? 'w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[28rem] z-20' 
                        : 'w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-96 z-10 opacity-70'
                    }`}
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      animationDuration: '3s',
                      transform: isBack ? `translateY(${index === 0 ? '-20px' : '20px'}) scale(0.92)` : 'none',
                      marginLeft: index === 1 ? '-40px' : index === 2 ? '-40px' : '0',
                      marginRight: index === 0 ? '-40px' : index === 1 ? '-40px' : '0',
                    }}
                  >
                    <div className={`relative w-full h-full transition-all duration-500 ${
                      isCenter ? 'hover:scale-110' : 'hover:scale-105'
                    }`}>
                      <Image
                        src={product.image}
                        alt={product.alt || product.title || 'Hero image'}
                        fill
                        className="object-contain drop-shadow-2xl group-hover:drop-shadow-[0_0_30px_rgba(138,119,62,0.5)] transition-all duration-500 product-vial-image"
                        sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
                        style={{
                          mixBlendMode: 'lighten',
                        }}
                        unoptimized
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-delay-2">
            <Button
              asChild
              size="lg"
              className="bg-[#8A773E] hover:bg-[#6B5E2F] text-white px-8 py-6 text-base font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/collections/all" className="flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 px-8 py-6 text-base font-semibold rounded-md transition-all duration-300"
            >
              <Link href="/pages/about-us">Learn More</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center gap-6 text-white/80 text-sm animate-fade-in-delay">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#8A773E]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Lab Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#8A773E]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>99%+ Purity</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#8A773E]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Research Grade</span>
            </div>
          </div>
          </div>

          {/* Right Side - Floating Product Vials - Desktop only */}
          {orderedImages.length > 0 && (
            <div className="hidden lg:flex flex-row gap-0 items-center justify-center relative order-2">
              {orderedImages.map((product, index) => {
                const isCenter = product.position === 'center';
                const isBack = product.position === 'back';
                
                return (
                  <div
                    key={product.id}
                    className={`group relative animate-float cursor-pointer ${
                      isCenter 
                        ? 'w-[28rem] h-[36rem] md:w-[36rem] md:h-[44rem] lg:w-[44rem] lg:h-[52rem] z-20' 
                        : 'w-[24rem] h-[32rem] md:w-[32rem] md:h-[40rem] lg:w-[36rem] lg:h-[44rem] z-10 opacity-70'
                    }`}
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      animationDuration: '3s',
                      transform: isBack ? `translateY(${index === 0 ? '-15px' : '15px'}) scale(0.85)` : 'none',
                      marginLeft: index === 1 ? '-100px' : index === 2 ? '-100px' : '0',
                      marginRight: index === 0 ? '-100px' : index === 1 ? '-100px' : '0',
                    }}
                  >
                    <div className={`relative w-full h-full transition-all duration-500 ${
                      isCenter ? 'hover:scale-110' : 'hover:scale-105'
                    }`}>
                      <Image
                        src={product.image}
                        alt={product.alt || product.title || 'Hero image'}
                        fill
                        className="object-contain drop-shadow-2xl group-hover:drop-shadow-[0_0_30px_rgba(138,119,62,0.5)] transition-all duration-500 product-vial-image"
                        sizes={isCenter ? "(max-width: 704px) 100vw, 704px" : "(max-width: 576px) 100vw, 576px"}
                        style={{
                          mixBlendMode: 'lighten',
                        }}
                        unoptimized
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;