import { useState, useEffect } from 'react';

export default function ReadingProgressBar() {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScrollPosition = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      
      if (scrollHeight > 0) {
        setReadingProgress(Number((currentScrollPosition / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-transparent">
      <div 
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  );
}
