import { useEffect, useRef } from 'react';
import { AppContent } from '../types';

interface AmbientBackgroundProps {
  theme: AppContent['theme'];
}

export default function AmbientBackground({ theme }: AmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const sentinel = sentinelRef.current;
    if (!canvas || !sentinel) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isIntersecting = true;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }> = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Create particles
    const particleCount = Math.min(60, Math.floor(window.innerWidth / 25));
    const colors = [theme.secondaryColor, theme.accentColor, '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      if (!isIntersecting) return; // Halt calculations and frame cycles of particles when scrolled out of view

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce edge check
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      // Draw faint connections
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.05;
      ctx.strokeStyle = theme.secondaryColor;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    // Configure the observer with a 400px margin so the system starts animating ahead of appearing on screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        const met = entry.isIntersecting;
        if (met !== isIntersecting) {
          isIntersecting = met;
          if (isIntersecting) {
            cancelAnimationFrame(animationFrameId);
            draw();
          }
        }
      },
      { threshold: 0.0, rootMargin: '400px' }
    );

    observer.observe(sentinel);
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [theme.secondaryColor, theme.accentColor]);

  return (
    <>
      {/* Sentinel Sibling Node to enable scroll visibility observation without blocking UI clicks */}
      <div ref={sentinelRef} className="absolute top-0 left-0 w-full h-px pointer-events-none" />

      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-slate-950">
        {/* Background Gradient Blurs */}
        <div 
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full filter blur-[150px] opacity-20 animate-pulse duration-[10000ms]"
          style={{ backgroundColor: theme.primaryColor }}
        />
        <div 
          className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full filter blur-[150px] opacity-20 animate-pulse duration-[8000ms]"
          style={{ backgroundColor: theme.secondaryColor }}
        />
        <div 
          className="absolute top-2/3 left-1/3 w-[500px] h-[500px] rounded-full filter blur-[120px] opacity-15 animate-bounce duration-[15000ms]"
          style={{ backgroundColor: theme.accentColor }}
        />
        
        {/* Dynamic Particle Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 block" />
      </div>
    </>
  );
}
