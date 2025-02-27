import React from 'react';
import { TextAnimate } from "../../components/magicui/text-animate";

export default function Coffee() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <TextAnimate animation="blurIn" as="h1" className="text-4xl font-bold">
        Coffee Page
      </TextAnimate>
      <TextAnimate animation="blurIn" as="p" className="mt-4 text-center max-w-md">
        Explore our curated list of coffees and brewing methods.
      </TextAnimate>
    </div>
  );
} 