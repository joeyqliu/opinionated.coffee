'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Sample coffee images - replace with your actual images
const coffeeImages = [
  {
    id: 1,
    src: '/images/1.jpg',
    alt: 'Coffee beans being roasted',
  },
  {
    id: 2,
    src: '/images/2.jpg',
    alt: 'Pour over coffee brewing',
  },
  {
    id: 3,
    src: '/images/3.jpg',
    alt: 'Espresso shot',
  },
  {
    id: 4,
    src: '/images/4.jpg',
    alt: 'Coffee plantation',
  },
  {
    id: 5,
    src: '/images/5.jpg',
    alt: 'Latte art',
  }
];

export default function ScrollablePhotosGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const scrollPosition = window.scrollY;
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled through the container
      const scrollableDistance = containerHeight - windowHeight;
      const scrolled = Math.max(0, scrollPosition - containerTop);
      const progress = Math.min(1, scrolled / scrollableDistance);
      
      setScrollProgress(progress * 100);
      
      // Determine which image is most visible
      const imageElements = container.querySelectorAll('.photo-item');
      let maxVisibility = 0;
      let mostVisibleIndex = 0;
      
      imageElements.forEach((image, index) => {
        const rect = image.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visibility = visibleHeight > 0 ? visibleHeight / rect.height : 0;
        
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleIndex = index;
        }
      });
      
      setActiveIndex(mostVisibleIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative flex" ref={containerRef}>
      {/* Main content - vertically stacked images */}
      <div className="flex-grow mx-auto max-w-4xl px-4 py-12">
        <div className="flex flex-col gap-24">
          {coffeeImages.map((image, index) => (
            <div 
              key={image.id}
              className={`photo-item relative h-[80vh] w-full rounded-lg overflow-hidden transition-opacity duration-300 ${
                Math.abs(index - activeIndex) > 1 ? 'opacity-80' : 'opacity-100'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                priority={index < 2}
              />
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {image.alt}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Progress bar on the right */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 h-1/3 flex flex-col items-center">
        <div className="h-full w-[2px] bg-gray-300 relative">
          <div 
            className="absolute top-0 w-[2px] bg-black transition-all duration-300 ease-out"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>
        
        <div className="absolute top-0 right-0 h-full flex flex-col justify-between items-end">
          {coffeeImages.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-black scale-150' : 'bg-gray-400'
              }`}
              style={{
                position: 'absolute',
                top: `${(index / (coffeeImages.length - 1)) * 100}%`,
                transform: 'translateY(-50%)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 