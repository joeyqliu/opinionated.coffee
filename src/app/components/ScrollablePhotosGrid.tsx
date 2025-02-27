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
    aspectRatio: '3/2', // Landscape
},
{
    id: 2,
    src: '/images/DSCF1750.JPG',
    alt: 'Pour over coffee brewing',
    aspectRatio: '2/3', // Portrait
},
{
    id: 3,
    src: '/images/DSCF1751.JPG',
    alt: 'Espresso shot',
    aspectRatio: '3/2', // Landscape
},
{
    id: 4,
    src: '/images/DSCF1752.JPG',
    alt: 'Coffee plantation',
    aspectRatio: '2/3', // Portrait
},
{
    id: 5,
    src: '/images/DSCF1754.JPG',
    alt: 'Latte art',
    aspectRatio: '3/2', // Landscape
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
      const viewportCenter = windowHeight / 2;
      
      // Calculate the scrollable distance based on the container's full height relative to the document
      // Adjust calculation to account for the last image being centered
      const lastImageElement = container.querySelector('.photo-item:last-of-type') as HTMLElement;
      const lastImagePosition = lastImageElement ? lastImageElement.offsetTop + (lastImageElement.offsetHeight / 2) : 0;
      const targetScrollPosition = lastImagePosition - (windowHeight / 2);
      
      const scrollableDistance = Math.max(0, targetScrollPosition - container.offsetTop);
      
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
        
        // Calculate how centered the image is in the viewport
        const imageCenter = rect.top + (rect.height / 2);
        const distanceFromCenter = Math.abs(imageCenter - viewportCenter);
        const centeredness = 1 - (distanceFromCenter / (windowHeight / 2));
        
        // Combine visibility and centeredness to determine the most prominent image
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visibility = visibleHeight > 0 ? visibleHeight / rect.height : 0;
        
        const prominence = visibility * 0.7 + centeredness * 0.3;
        
        if (prominence > maxVisibility) {
          maxVisibility = prominence;
          mostVisibleIndex = index;
        }
        
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
  const windowHeight = window.innerHeight;
  
  // Use the element's position relative to the document
  const rect = imageElement.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Calculate absolute position of the image center
  const absoluteImageTop = rect.top + scrollTop;
  const imageHeight = rect.height;
  const imageCenter = absoluteImageTop + (imageHeight / 2);
  
  // Calculate where to scroll to center the image
  const targetScrollPosition = imageCenter - (windowHeight / 2);
  
  window.scrollTo({
    top: targetScrollPosition,
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
                <div 
                  className="overflow-hidden bg-background" 
                  style={{ 
                    borderRadius: 'calc(1.5rem - var(--border-width))',
                    aspectRatio: image.aspectRatio
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.aspectRatio === '3/2' ? 2400 : 1600}
                    height={image.aspectRatio === '3/2' ? 1600 : 2400}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full h-full object-cover"
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
          
          {/* Add extra padding at the bottom to allow scrolling the last image to center */}
          <div style={{ height: '50vh' }} aria-hidden="true"></div>
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
              className={`relative w-20 overflow-hidden transition-all duration-300 
                ${index === activeIndex 
                  ? 'z-10 shadow-md' 
                  : `hover:shadow-sm ${isPassed ? 'opacity-70' : 'opacity-40'} hover:opacity-100`
                }`}
              style={{
                transform: index === activeIndex ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.3s ease-out',
                aspectRatio: image.aspectRatio,
                borderRadius: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (index !== activeIndex) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== activeIndex) {
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              aria-label={`Scroll to ${image.alt}`}
            >
              <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: '0.5rem' }}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                {index !== activeIndex && (
                  <div className="absolute inset-0 bg-black opacity-30 hover:opacity-0 transition-all duration-300"></div>
                )}
              </div>
              {/* Hover indicator */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-lg ring-2 ring-primary/50"></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </div>)} 
  