import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'wide' | 'tall';
  showControls?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  alt, 
  className = '', 
  aspectRatio = 'square',
  showControls = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Ensure we have at least 3 images by duplicating if needed
  const normalizedImages = images.length >= 3 
    ? images 
    : [...images, ...Array(3 - images.length).fill(images[0])];

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === normalizedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? normalizedImages.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX);
    setScrollLeft(walk);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollLeft > 50) {
      goToPrev();
    } else if (scrollLeft < -50) {
      goToNext();
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  // Set aspect ratio class based on screen size
  let aspectRatioClass = 'aspect-square sm:aspect-[4/3]';
  if (aspectRatio === 'wide') {
    aspectRatioClass = 'aspect-[4/3] sm:aspect-[16/9]';
  } else if (aspectRatio === 'tall') {
    aspectRatioClass = 'aspect-[3/4] sm:aspect-[4/5]';
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <div 
        ref={carouselRef}
        className={`relative ${aspectRatioClass} overflow-hidden bg-gray-100`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
          className="absolute inset-0 flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {normalizedImages.map((image, index) => (
            <div 
              key={index} 
              className="min-w-full h-full flex-shrink-0 relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={image} 
                  alt={`${alt} - view ${index + 1}`} 
                  className="w-full h-full object-contain"
                  draggable="false"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>
          ))}
        </div>
        
        {showControls && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 shadow-lg transition-all z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-gray-800" />
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 shadow-lg transition-all z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-gray-800" />
            </button>
          </>
        )}
      </div>
      
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
        {normalizedImages.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index 
                ? 'bg-white w-4' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;