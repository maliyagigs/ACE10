import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [isFading, setIsFading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Small delay to trigger intro animation 
    setHasMounted(true);
    
    // Show the splash screen for 2.5 seconds, then begin fade out
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        onComplete();
      }, 700);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#111111] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
        isFading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      <div 
        className={`flex flex-col items-center transition-all duration-1000 transform ${
          hasMounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        {/* ACE Title Block */}
        <h1 
          style={{ fontFamily: 'Impact, sans-serif' }} 
          className="text-white text-[8rem] md:text-[10rem] font-black leading-none uppercase tracking-wide drop-shadow-2xl"
        >
          ACE
        </h1>
        
        {/* = 10 = Sub Block */}
        <div className="flex items-center gap-5 mt-1 md:mt-2">
          {/* Left = */}
          <div className="flex flex-col gap-2 md:gap-2.5">
            <div className="w-10 md:w-12 h-2 md:h-2.5 bg-white"></div>
            <div className="w-10 md:w-12 h-2 md:h-2.5 bg-white"></div>
          </div>
          
          <span className="text-[#3ba2f6] text-6xl md:text-7xl font-sans font-black drop-shadow-md">
            10
          </span>
          
          {/* Right = */}
          <div className="flex flex-col gap-2 md:gap-2.5">
            <div className="w-10 md:w-12 h-2 md:h-2.5 bg-white"></div>
            <div className="w-10 md:w-12 h-2 md:h-2.5 bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
