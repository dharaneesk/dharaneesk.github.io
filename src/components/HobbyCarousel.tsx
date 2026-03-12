import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Slide {
  image?: string;
  gifSrc?: string; 
  title: string;
  description: string;
  fitVertical?: boolean;
  youtubeEmbed?: string;
}

interface HobbyCarouselProps {
  slides: Slide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  fitVertical?: boolean;
  hobbyKey?: string; // Add a unique key for each hobby (optional to prevent breaking existing code)
}

export default function HobbyCarousel({ 
  slides, 
  autoPlay = true, 
  autoPlayInterval = 5000,
  fitVertical = false,
  hobbyKey = 'default' // Default key if none provided
}: HobbyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<number | null>(null);
  
  // Reset currentIndex when hobbyKey changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [hobbyKey]);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrevSlide = () => {
    const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNextSlide = () => {
    const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  useEffect(() => {
    if (autoPlay) {
      timerRef.current = window.setInterval(goToNextSlide, autoPlayInterval);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, autoPlay, autoPlayInterval]);

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (autoPlay && !timerRef.current) {
      timerRef.current = window.setInterval(goToNextSlide, autoPlayInterval);
    }
  };

  // Check if the current slide should use vertical fitting
  const shouldFitVertical = (index: number) => {
    if (fitVertical) return true;
    return slides[index]?.fitVertical || false;
  };

  return (
    <div className="relative w-full animate-on-scroll">
      {/* Main carousel container */}
      <div 
        className="relative w-full rounded-xl overflow-hidden aspect-[4/5] sm:aspect-video max-w-4xl mx-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Slides */}
        <div className="relative w-full h-full overflow-hidden">
          {slides.map((slide, index) => {
            const isVerticalFit = shouldFitVertical(index);
            
            return (
              <div
                key={index}
                className={cn(
                  "absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out",
                  index === currentIndex 
                    ? "opacity-100 translate-x-0" 
                    : index < currentIndex 
                      ? "opacity-0 -translate-x-full" 
                      : "opacity-0 translate-x-full"
                )}
              >
                {/* Text overlay on desktop only */}
                <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent text-white z-20 hidden md:block">
                  <h3 className="text-xl font-semibold mb-2">{slide.title}</h3>
                  <p className="text-sm text-white/80">{slide.description}</p>
                </div>

                {/* YouTube embed handling */}
                {slide.youtubeEmbed ? (
                  <iframe
                    src={slide.youtubeEmbed}
                    className="w-full h-full z-10"
                    title={slide.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : slide.gifSrc ? (
                  <img
                    src={slide.gifSrc}
                    alt={slide.title}
                    className="w-full h-full object-cover z-10"
                  />
                ) : (
                  <>
                    {/* Blurred background for vertical fit images */}
                    {isVerticalFit && index === currentIndex && (
                      <div 
                        className="absolute inset-0 w-full h-full blur-lg opacity-60 scale-110 z-0"
                        style={{
                          backgroundImage: `url(${slide.image})`,
                          backgroundPosition: 'center',
                          backgroundSize: 'cover'
                        }}
                      />
                    )}
                    
                    {slide.image && (
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className={cn(
                          "w-full h-full relative z-10",
                          isVerticalFit 
                            ? "object-contain" // Fit vertically, no cropping
                            : "object-cover"   // Fill and crop as needed
                        )}
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Controls */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors z-30"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors z-30"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
        
        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex ? "bg-white w-4" : "bg-white/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Mobile text container - shows below the carousel */}
      {slides[currentIndex] && !slides[currentIndex].youtubeEmbed && (
        <div className="md:hidden mt-4 p-4 bg-background/50 rounded-lg border border-border/20 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">{slides[currentIndex].title}</h3>
          <p className="text-sm text-foreground/80">{slides[currentIndex].description}</p>
        </div>
      )}
    </div>
  );
}