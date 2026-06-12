import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface ComponentProps {
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
}

interface ConstellationNode {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  radius: number;
  pulseRadius: number;
  baseRadius: number;
  label?: string;
  color: string;
  opacity: number;
}

const BUSINESS_LABELS = [
  "STRATEGY",
  "INTELLIGENCE",
  "GROWTH_LABS",
  "CONVERSIONS",
  "REVENUE",
  "OPTIMIZE",
  "CORE_VITAL",
  "INFRASTRUCTURE",
  "AI_ENGINE",
  "ENTERPRISE",
  "HEURISTICS"
];

export default function HeroLayeredBackground({ theme }: ComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animeInstancesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  const accentColor = theme?.accentColor || '#10b981';
  const secondaryColor = theme?.secondaryColor || '#6366f1';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: ConstellationNode[] = [];
    let animationFrameId: number;

    const setupCanvas = () => {
      const container = containerRef.current;
      const rect = container ? container.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // Cancel previous animejs animations
      animeInstancesRef.current.forEach(inst => {
        if (inst && typeof inst.pause === 'function') {
          inst.pause();
        }
      });
      animeInstancesRef.current = [];

      // Re-create nodes relative to new width & height
      const w = rect.width;
      const h = rect.height;
      
      // Determine columns and rows based on screen size for uniform distribution
      const isMobile = w < 768;
      const nodeCount = isMobile ? 14 : 26;
      const newParticles: ConstellationNode[] = [];

      const colors = [accentColor, secondaryColor, '#38bdf8', '#818cf8'];

      for (let i = 0; i < nodeCount; i++) {
        // Space nodes somewhat uniformly across the viewport
        const marginX = w * 0.1;
        const marginY = h * 0.15;
        const oX = marginX + Math.random() * (w - marginX * 2);
        const oY = marginY + Math.random() * (h - marginY * 2);

        // Assign high-tech business labels to 4-5 key nodes
        const shouldHaveLabel = i < (isMobile ? 3 : 6);
        const labelText = shouldHaveLabel ? BUSINESS_LABELS[i % BUSINESS_LABELS.length] : undefined;

        const size = Math.random() * 2 + 1.5;

        newParticles.push({
          x: oX,
          y: oY,
          originalX: oX,
          originalY: oY,
          radius: size,
          pulseRadius: size * 3,
          baseRadius: size,
          label: labelText,
          color: colors[i % colors.length],
          opacity: Math.random() * 0.6 + 0.3
        });
      }

      particles = newParticles;

      // Launch animejs simulations to swim nodes organically
      particles.forEach((p, idx) => {
        // Animate position
        const swimInstanceX = animate(p, {
          x: [p.originalX, p.originalX + (Math.random() - 0.5) * (isMobile ? 40 : 100)],
          duration: 3500 + Math.random() * 4000,
          delay: Math.random() * 500,
          ease: 'easeInOutQuad',
          loop: true,
          direction: 'alternate'
        });

        const swimInstanceY = animate(p, {
          y: [p.originalY, p.originalY + (Math.random() - 0.5) * (isMobile ? 40 : 100)],
          duration: 3500 + Math.random() * 4000,
          delay: Math.random() * 500,
          ease: 'easeInOutQuad',
          loop: true,
          direction: 'alternate'
        });

        // Pulsing glow animation
        const pulseInstance = animate(p, {
          pulseRadius: [p.baseRadius * 1.5, p.baseRadius * 6.5],
          opacity: [0.25, 0.85],
          duration: 2500 + Math.random() * 2000,
          ease: 'easeInOutSine',
          loop: true,
          direction: 'alternate'
        });

        animeInstancesRef.current.push(swimInstanceX, swimInstanceY, pulseInstance);
      });
    };

    setupCanvas();

    // Resize observer for accurate resize triggers without flickering
    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupCanvas();
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    // Track mouse coordinates for physical field interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Main Canvas Render Loop
    const render = () => {
      const containerElement = containerRef.current;
      const rect = containerElement 
        ? containerElement.getBoundingClientRect() 
        : { width: window.innerWidth, height: window.innerHeight };
      
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw connection lines first to layer behind nodes
      const maxDistance = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i];
          const pj = particles[j];

          // Compute absolute distance
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.12;
            
            // Rich multi-colored connection paths
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            
            const grad = ctx.createLinearGradient(pi.x, pi.y, pj.x, pj.y);
            grad.addColorStop(0, `${pi.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
            grad.addColorStop(1, `${pj.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 2. Draw nodes and indicators
      particles.forEach((p) => {
        let renderX = p.x;
        let renderY = p.y;

        // Apply interactive mouse displacement
        if (mouseRef.current.active) {
          const mDx = mouseRef.current.x - p.x;
          const mDy = mouseRef.current.y - p.y;
          const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
          const activeRadius = 160;

          if (mDist < activeRadius) {
            // Force factor: pull slightly towards cursor for standard sleek effect
            const force = (1 - mDist / activeRadius) * 23;
            const angle = Math.atan2(mDy, mDx);
            renderX += Math.cos(angle) * force;
            renderY += Math.sin(angle) * force;
          }
        }

        // Draw soft ambient pulse glow behind the node
        const glowRad = Math.max(1.5, p.pulseRadius);
        ctx.beginPath();
        ctx.arc(renderX, renderY, glowRad, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * 0.12;
        ctx.fill();

        // Draw solid active particle core
        ctx.beginPath();
        ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 1.0;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(renderX, renderY, p.radius + 1.2, 0, Math.PI * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = p.opacity;
        ctx.stroke();

        // 3. Draw high-tech labels and connector offsets if exists
        if (p.label) {
          ctx.font = '500 8px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
          ctx.fillStyle = '#94a3b8';
          ctx.globalAlpha = p.opacity * 0.7;
          
          // Small technical crosshair lines extending from the node to the label
          ctx.beginPath();
          ctx.moveTo(renderX + 4, renderY - 4);
          ctx.lineTo(renderX + 16, renderY - 12);
          ctx.lineTo(renderX + 32, renderY - 12);
          ctx.strokeStyle = `${p.color}55`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // Render high-tech uppercase key terms
          ctx.fillText(p.label, renderX + 35, renderY - 9);
        }
      });

      // Restore alpha safety
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }

      // Cleanup remaining animejs instances
      animeInstancesRef.current.forEach(inst => {
        if (inst && typeof inst.pause === 'function') {
          inst.pause();
        }
      });
    };
  }, [theme?.accentColor, theme?.secondaryColor]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto overflow-hidden -z-10 select-none"
    >
      {/* Absolute canvas element capturing relative interaction space */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full opacity-60 mix-blend-screen pointer-events-none"
      />

      {/* Deep backing ambient radial halos */}
      <div 
        className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full blur-[150px] opacity-20 mix-blend-screen pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`
        }}
      />
      <div 
        className="absolute top-[45%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[130px] opacity-15 mix-blend-screen pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${secondaryColor}08 0%, transparent 70%)`
        }}
      />
    </div>
  );
}
