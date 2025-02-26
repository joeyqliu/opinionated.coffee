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

  return (
    <div className="relative flex" ref={containerRef}>
    {/* Main content - vertically stacked images */}
    <div className="flex-grow mx-auto max-w-4xl px-4 py-12">
    <div className="flex flex-col space-y-10">
        {coffeeImages.map((image, index) => (
            <motion.div 
                key={image.id}
                className={`photo-item relative w-full rounded-3xl overflow-hidden mx-auto ${
                            Math.abs(index - activeIndex) > 1 ? 'opacity-90' : 'opacity-100'
                            }`}
                style={{
                marginTop: index === 0 ? '0' : '-2vh',
                zIndex: coffeeImages.length - index,
                transform: `scale(${imageTransforms[index]?.scale || 1}) translateY(${(index * 5) + (imageTransforms[index]?.y || 0)}px)`,
                transformOrigin: 'center',
                willChange: 'transform',
                borderRadius: '1.5rem',
                transition: 'transform 0.3s ease-out'
                }}
            >
                <Image
                src={image.src}
                alt={image.alt}
                width={2400}
                height={1600}
                sizes="(max-width: 768px) 100vw, 800px"
                className="w-full h-auto object-contain rounded-3xl"
                priority={index < 3}
                style={{
                    transform: `translateY(${index % 2 === 0 ? -1 : 1}px) scale(${1 + (Math.abs(index - activeIndex) * 0.003)})`,
                    borderRadius: '1.5rem',
                    transition: 'transform 0.3s ease-out'
                }}
                />
            </motion.div>
          ))}
        </div>
      </div>
      
    {/* Progress bar on the right */}
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 h-1/2 flex flex-col items-center">
    <div className="h-full w-[2px] bg-gray-300 relative">
        <div 
        className="absolute top-0 w-[2px] bg-black"
        style={{ height: `${scrollProgress}%` }}
        />
        
        <div className="absolute top-0 right-0 h-full flex flex-col justify-between items-end">
          {coffeeImages.map((_, index) => (
            <div 
              key={index}
            className={`w-2 h-2 rounded-full ${
            index === activeIndex ? 'bg-black scale-150' : 'bg-gray-400'
            }`}
              style={{
                position: 'absolute',
                top: `${(index / (coffeeImages.length - 1)) * 100}%`,
                transform: 'translateY(-50%)',
                transition: 'background-color 0.3s ease, transform 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>)} 

  