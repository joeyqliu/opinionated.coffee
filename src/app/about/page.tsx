import React from 'react';
import Image from 'next/image';
import ScrollablePhotosGrid from '../components/ScrollablePhotosGrid';
import { TextAnimate } from "../../components/magicui/text-animate";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold">About Us</h1>
      <div className="mt-4 max-w-md text-center">
        <Image src="/path-to-your-image.jpg" width={100} height={100} alt="About us" className="w-32 h-32 rounded-full mx-auto" />
        <TextAnimate animation="blurIn" as="p" className="mt-4">
          We created this site to share our passion for coffee and to provide a curated list of the best coffees and unique ways to enjoy them.
        </TextAnimate>
        <ScrollablePhotosGrid />
      </div>
    </div>
  );
} 