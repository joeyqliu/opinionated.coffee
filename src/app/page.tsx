import React from 'react';
import AlternatingContent from './components/AlternatingContent';
import ScrollablePhotosGrid from './components/ScrollablePhotosGrid';

export default function Home() {
  return (
    <div>
      <AlternatingContent />
      <ScrollablePhotosGrid />
    </div>
  );
}
