'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

// Sample content sections with alternating layouts
const contentSections = [
  {
    id: 1,
    title: "The Goal Behind the Goal",
    description: "Compassion comes first for the coffee experience. We believe in sourcing ethically and brewing perfectly.",
    imageSrc: "/images/1.jpg",
    imageAlt: "Coffee brewing process",
    layout: "imageRight" // Image on the right
  },
  {
    id: 2,
    title: "Sourcing with Purpose",
    description: "We work directly with farmers to ensure fair compensation and sustainable practices. Every bean has a story.",
    imageSrc: "/images/2.jpg",
    imageAlt: "Coffee farm",
    layout: "imageLeft" // Image on the left
  },
  {
    id: 3,
    title: "The Art of Brewing",
    description: "Precision and patience define our approach to brewing. Temperature, time, and technique all matter.",
    imageSrc: "/images/3.jpg",
    imageAlt: "Pour over coffee",
    layout: "imageRight" // Image on the right
  },
  {
    id: 4,
    title: "Community First",
    description: "Coffee brings people together. Our spaces are designed to foster connection and conversation.",
    imageSrc: "/images/4.jpg",
    imageAlt: "Coffee shop interior",
    layout: "imageLeft" // Image on the left
  }
];

export default function AlternatingContent() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
        
        if (isVisible) {
          section.classList.add('opacity-100');
          section.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="py-16">
      {contentSections.map((section, index) => (
        <div 
          key={section.id}
          ref={(el: HTMLDivElement | null) => { sectionRefs.current[index] = el }}
          className={`flex flex-col ${section.layout === 'imageLeft' ? 'md:flex-row-reverse' : 'md:flex-row'} 
                     items-center mb-32 opacity-0 translate-y-10 transition-all duration-1000 ease-out`}
        >
          {/* Text content */}
          <div className="w-full md:w-1/2 px-6 md:px-12 mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{section.title}</h2>
            <p className="text-lg md:text-xl">{section.description}</p>
          </div>
          
          {/* Image */}
          <div className="w-full md:w-1/2 px-6">
            <div className="relative h-[50vh] w-full overflow-hidden rounded-lg">
              <Image
                src={section.imageSrc}
                alt={section.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={index < 2}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 