import React, { useState, useEffect } from 'react';

const TypingLoader = () => {
  const [text, setText] = useState('');
  const fullText = 'Loading...';
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    if (text.length < fullText.length) {
      const typingTimer = setTimeout(() => {
        setText(fullText.substring(0, text.length + 1));
      }, 150);
      
      return () => clearTimeout(typingTimer);
    }
  }, [text]);
  
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500); 
    
    return () => clearInterval(cursorTimer);
  }, []);
  
  return (
    <div className="mobileLoader fixed inset-0 flex items-center justify-center bg-blue-950 z-50" style={{ backgroundColor: '#080c17' }}>
      <div className="text-4xl md:text-6xl font-mono font-bold text-white">
        {text}
        <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity ml-1`}>_</span>
      </div>
    </div>
  );
};

export default TypingLoader;