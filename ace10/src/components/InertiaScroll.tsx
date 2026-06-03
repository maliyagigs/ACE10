import React, { useEffect } from 'react';

export default function InertiaScroll() {
  useEffect(() => {
    // For mobile device wrappers, ensure momentum smooth-scrolling is enabled natively via CSS.
    // Leverages native system compositor layer thread to keep mobile performance buttery smooth.
    (document.documentElement.style as any).webkitOverflowScrolling = 'touch';

    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    let isMoving = false;
    let rafId: number | null = null;
    
    // Lerp friction strength: lower is silkier & wider momentum, higher is more responsive
    const lerpStrength = 0.082;

    const handleWheel = (e: WheelEvent) => {
      // Prevent jumpy native rendering
      e.preventDefault();

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate target with responsive multiplier scaling
      targetScrollY = Math.max(0, Math.min(maxScroll, targetScrollY + e.deltaY * 0.95));

      if (!isMoving) {
        isMoving = true;
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    const updateScroll = () => {
      const diff = targetScrollY - currentScrollY;

      if (Math.abs(diff) > 0.15) {
        currentScrollY += diff * lerpStrength;
        window.scrollTo({
          top: currentScrollY,
          behavior: 'auto' // Must bypass 'smooth' to prevent standard layout conflict stalling
        });
        rafId = requestAnimationFrame(updateScroll);
      } else {
        currentScrollY = targetScrollY;
        window.scrollTo({
          top: currentScrollY,
          behavior: 'auto'
        });
        isMoving = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    // Synchronize variables instantly when user clicks navbar links or programmatically scrolls
    const handleScroll = () => {
      if (!isMoving) {
        targetScrollY = window.scrollY;
        currentScrollY = window.scrollY;
      }
    };

    // Global programmatic inertial redirection scroll handler
    const triggerInertiaScroll = (targetY: number) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollY = Math.max(0, Math.min(maxScroll, targetY));
      currentScrollY = window.scrollY;
      
      if (!isMoving) {
        isMoving = true;
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    (window as any).__triggerInertiaScroll = triggerInertiaScroll;

    // Handle keypress navigation events nicely
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      if (keys.includes(e.key)) {
        // Allow keys to update values inside inertia loop for smooth experience
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        let step = 150;
        
        if (e.key === 'ArrowUp') targetScrollY = Math.max(0, targetScrollY - step);
        else if (e.key === 'ArrowDown') targetScrollY = Math.min(maxScroll, targetScrollY + step);
        else if (e.key === 'PageUp') targetScrollY = Math.max(0, targetScrollY - window.innerHeight * 0.8);
        else if (e.key === 'PageDown') targetScrollY = Math.min(maxScroll, targetScrollY + window.innerHeight * 0.8);
        else if (e.key === 'Home') targetScrollY = 0;
        else if (e.key === 'End') targetScrollY = maxScroll;
        else if (e.key === ' ') {
          if (e.shiftKey) {
            targetScrollY = Math.max(0, targetScrollY - window.innerHeight * 0.8);
          } else {
            targetScrollY = Math.min(maxScroll, targetScrollY + window.innerHeight * 0.8);
          }
        }

        e.preventDefault();
        if (!isMoving) {
          isMoving = true;
          rafId = requestAnimationFrame(updateScroll);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      delete (window as any).__triggerInertiaScroll;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return null;
}
