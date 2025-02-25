import React from 'react';
import ScrollablePhotosGrid from '../components/ScrollablePhotosGrid';

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold">About Us</h1>
      <div className="mt-4 max-w-md text-center">
        <img src="/path-to-your-image.jpg" alt="About us" className="w-32 h-32 rounded-full mx-auto" />
        <p className="mt-4">
          We created this site to share our passion for coffee and to provide a curated list of the best coffees and unique ways to enjoy them.
        </p>
        <ScrollablePhotosGrid />
      </div>
    </div>
  );
} 