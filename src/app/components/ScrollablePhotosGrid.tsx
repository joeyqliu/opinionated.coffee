'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Coffee images from public/images directory
const coffeeImages = [
{
    id: 1,
    src: '/images/DSCF1746.JPG',
    alt: 'Coffee beans being roasted',
},
{
    id: 2,
    src: '/images/DSCF1750.JPG',
    alt: 'Pour over coffee brewing',
},
{
    id: 3,
    src: '/images/DSCF1751.JPG',
    alt: 'Espresso shot',
},
{
    id: 4,
    src: '/images/DSCF1752.JPG',
    alt: 'Coffee plantation',
},
{
    id: 5,
    src: '/images/DSCF1754.JPG',
    alt: 'Latte art',
}
];

export default function ScrollablePhotosGrid() {
const containerRef = useRef<HTMLDivElement>(null);
const [activeIndex, setActiveIndex] = useState(0);
const [scrollProgress, setScrollProgress] = useState(0);
const [imageTransforms, setImageTransforms] = useState<Array<{ scale: number; y: number; }>>(coffeeImages.map(() => ({ scale: 1, y: 0 })));

useEffect(() => {
  let rafId: number;

  const handleScroll = () => {
    rafId = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate the scrollable distance based on the container's full height relative to the document
      const scrollableDistance = container.offsetTop + container.scrollHeight - windowHeight;
      
      const scrolled = Math.max(0, Math.min(scrollableDistance, scrollPosition - container.offsetTop));
      const progress = Math.min(1, scrolled / scrollableDistance);
      
      setScrollProgress(progress * 100);
      
      // Calculate transforms for each image
      const imageElements = container.querySelectorAll('.photo-item');
      let maxVisibility = 0;
      let mostVisibleIndex = 0;
      
      const newTransforms = Array(coffeeImages.length).fill(null).map((_, index) => {
        const image = imageElements[index] as HTMLElement;
        if (!image) return { scale: 1, y: 0 };
        
        const rect = image.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visibility = visibleHeight > 0 ? visibleHeight / rect.height : 0;
        
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleIndex = index;
        }
        
        const viewportCenter = windowHeight / 2;
        const imageCenter = rect.top + rect.height / 2;
        const positionRatio = (imageCenter - viewportCenter) / viewportCenter;
        
        return {
          scale: 1 + (visibility * 0.02 - 0.01),
          y: scrolled * 0.15 * (index % 2 === 0 ? -0.03 : 0.03) + (positionRatio * windowHeight * 0.05)
        };
      });
      
      setImageTransforms(newTransforms);
      setActiveIndex(mostVisibleIndex);
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial call

  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (rafId) cancelAnimationFrame(rafId);
  };
}, []);

  const scrollToImage = (index: number) => {
    const imageElements = containerRef.current?.querySelectorAll('.photo-item');
    if (!imageElements || !imageElements[index]) return;
    
    const imageElement = imageElements[index] as HTMLElement;
    const offset = imageElement.offsetTop - 100; // Offset to account for header
    
    window.scrollTo({
      top: offset,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative flex" ref={containerRef}>
    {/* Main content - vertically stacked images */}
    <div className="flex-grow mx-auto max-w-4xl px-4 py-12">
    <div className="flex flex-col space-y-10">
        {coffeeImages.map((image, index) => (
            <motion.div 
            key={image.id}
            className={`photo-item relative w-full mx-auto ${
              Math.abs(index - activeIndex) > 1 ? 'opacity-90' : 'opacity-100'
            }`}
            style={{
              marginTop: index === 0 ? '0' : '-2vh',
              zIndex: coffeeImages.length - index,
              transform: `scale(${imageTransforms[index]?.scale || 1}) translateY(${(index * 5) + (imageTransforms[index]?.y || 0)}px)`,
              transformOrigin: 'center',
              willChange: 'transform',
              transition: 'transform 0.3s ease-out'
            }}
          >
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 border-flowing-gradient"></div>
              <div className="relative rounded-3xl overflow-hidden" style={{ padding: 'var(--border-width)' }}>
                <div className="overflow-hidden bg-background" style={{ borderRadius: 'calc(1.5rem - var(--border-width))' }}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={2400}
                    height={1600}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full h-auto object-cover"
                    style={{
                      borderRadius: 'calc(1.5rem - var(--border-width))',
                      transform: `translateY(${index % 2 === 0 ? -1 : 1}px) scale(${1 + (Math.abs(index - activeIndex) * 0.003)})`,
                      transition: 'transform 0.3s ease-out'
                    }}
                    priority={index < 3}
                  />
                </div>
              </div>
            </div>
          </motion.div>
          ))}
        </div>
      </div>
      
    {/* Thumbnail progress bar on the right */}
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 h-auto flex flex-col items-center">
      <div className="h-auto py-4 flex flex-col space-y-4 items-center relative">
        {/* Thumbnails */}
        {coffeeImages.map((image, index) => {
          // Calculate if this thumbnail should be "passed" based on scroll progress
          const thumbnailPosition = (index / (coffeeImages.length - 1)) * 100;
          const isPassed = scrollProgress >= thumbnailPosition;
          
          return (
            <button
              key={index}
              onClick={() => scrollToImage(index)}
              className={`relative w-14 h-14 rounded-lg overflow-hidden transition-all duration-300 
                ${index === activeIndex 
                  ? 'scale-110 z-10' 
                  : `scale-100 hover:scale-105 ${isPassed ? 'opacity-90' : 'opacity-50'} hover:opacity-90`
                }`}
              aria-label={`Scroll to ${image.alt}`}
            >
              {index === activeIndex && (
                <div className="absolute inset-0 border-flowing-gradient" style={{ 
                  '--border-width': '2px',
                  '--border-radius': '0.5rem'
                } as React.CSSProperties}></div>
              )}
              <div className="relative h-full w-full overflow-hidden rounded-lg" style={{ 
                padding: index === activeIndex ? '2px' : '0px'
              }}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="56px"
                  className="object-cover rounded-[calc(0.5rem-2px)]"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </div>)} 
  