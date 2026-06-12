import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface ComponentProps {
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
}

// 3D coordinate interface
interface Point3D {
  x: number;
  y: number; // Y is height (upwards is negative or positive, let's treat Y as pointing UP)
  z: number; // Z is depth
}

// A line segment between two 3D indexes or direct points
interface LineSegment {
  p1: Point3D;
  p2: Point3D;
  color: string;
  glow: boolean;
  width: number;
}

// Modern building / attraction definition
interface CityStructure {
  name: string;
  centerX: number;
  centerZ: number;
  baseY: number;
  width: number;
  depth: number;
  height: number;
  type: 'tower' | 'helix' | 'pyramid' | 'ferris' | 'bridge' | 'block';
  primaryColor: string;
  secondaryColor: string;
  data?: any; // Extra parameters (like angle for Ferris wheel)
}

export default function NeonCityBackground({ theme }: ComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Theme support
  const accentColor = theme?.accentColor || '#10b981'; // Emerald/Green Neon
  const secondaryColor = theme?.secondaryColor || '#6366f1'; // Indigo/Cyan Neon
  const pinkNeon = '#f43f5e'; // Rose/Pink neon accent
  const skyNeon = '#22d3ee'; // Skyblue neon attraction

  // Shared state ref to keep anime.js and requestAnimationFrame synced
  const cameraRef = useRef({
    x: 0,
    y: 190, // Hovering slightly above the ground
    z: -700, // Distance to city center
    yaw: 0.1, // Slight angle to view 3D dimensions
    pitch: -0.15, // Tilted down looking at the skyline
    fov: 520, // Field of view focal length
  });

  // Track cursor offsets to pan the camera interactively
  const mouseOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let structures: CityStructure[] = [];
    let animationFrameId: number;

    const setupScene = () => {
      const container = containerRef.current;
      const rect = container ? container.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const isMobile = rect.width < 768;

      // Layout coordinates: City Center is around (x = 0, z = 0).
      // Let's create an array of skyscraper structures
      structures = [
        // --- CENTER ATTRACTION ---
        {
          name: "Luminous Ferris Eye",
          type: "ferris",
          centerX: isMobile ? 0 : -80,
          centerZ: 100,
          baseY: -80, // Base level
          width: 140,
          depth: 40,
          height: 140,
          primaryColor: pinkNeon,
          secondaryColor: skyNeon,
          data: { angle: 0, speed: 0.005 }
        },

        // --- BACK/TALL SKYSCRAPERS ---
        {
          name: "Nebula Summit",
          type: "pyramid",
          centerX: -250,
          centerZ: 250,
          baseY: -80,
          width: 80,
          depth: 80,
          height: 380,
          primaryColor: secondaryColor,
          secondaryColor: skyNeon
        },
        {
          name: "Hyperion Spires",
          type: "helix",
          centerX: 180,
          centerZ: 240,
          baseY: -80,
          width: 75,
          depth: 75,
          height: 350,
          primaryColor: accentColor,
          secondaryColor: skyNeon
        },
        {
          name: "Omni corporate Grid",
          type: "tower",
          centerX: 350,
          centerZ: 150,
          baseY: -80,
          width: 90,
          depth: 90,
          height: 290,
          primaryColor: secondaryColor,
          secondaryColor: pinkNeon
        },

        // --- FRONT/MID GROUND TALL STRUCTURES ---
        {
          name: "Pulse Tower",
          type: "tower",
          centerX: -410,
          centerZ: 40,
          baseY: -80,
          width: 70,
          depth: 70,
          height: 230,
          primaryColor: skyNeon,
          secondaryColor: accentColor
        },
        {
          name: "Quantum Archway",
          type: "tower",
          centerX: 0,
          centerZ: 400, // Deep in the back background
          baseY: -80,
          width: 120,
          depth: 120,
          height: 480,
          primaryColor: pinkNeon,
          secondaryColor: secondaryColor
        },
        {
          name: "Stratagem Monolith",
          type: "pyramid",
          centerX: 280,
          centerZ: -20,
          baseY: -80,
          width: 60,
          depth: 60,
          height: 220,
          primaryColor: accentColor,
          secondaryColor: pinkNeon
        },

        // --- IN-BETWEEN SMALL BLOCKS & LANDMARKS ---
        {
          name: "Core Hub A",
          type: "block",
          centerX: -180,
          centerZ: 20,
          baseY: -80,
          width: 50,
          depth: 50,
          height: 120,
          primaryColor: secondaryColor,
          secondaryColor: skyNeon
        },
        {
          name: "Core Hub B",
          type: "block",
          centerX: 90,
          centerZ: 10,
          baseY: -80,
          width: 45,
          depth: 45,
          height: 110,
          primaryColor: skyNeon,
          secondaryColor: accentColor
        },
        {
          name: "Attraction Dome",
          type: "helix",
          centerX: -80,
          centerZ: -80,
          baseY: -80,
          width: 60,
          depth: 60,
          height: 70,
          primaryColor: pinkNeon,
          secondaryColor: accentColor
        }
      ];

      // If mobile, keep only major landmarks to save cycles and avoid visual clutter
      if (isMobile) {
        structures = structures.filter((_, i) => [0, 1, 2, 4, 7].includes(i));
      }
    };

    setupScene();

    // Resize Event
    const handleResize = () => {
      setupScene();
    };
    window.addEventListener('resize', handleResize);

    // Mouse movement to pan angle subtly
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

      // Subtly animate client-to-camera panning destination
      mouseOffset.current.x = x * 140; // max 60 units lateral pan
      mouseOffset.current.y = y * 120; // max 40 units elevation height offset
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    // Slowly cycle / wander the camera via animejs loop so it always has elegant, passive floating movie-pan
    const panAnim = animate(cameraRef.current, {
      yaw: [-0.08, 0.08],
      pitch: [-0.18, -0.08],
      y: [160, 210],
      duration: 18000,
      direction: 'alternate',
      loop: true,
      ease: 'easeInOutQuad'
    });

    // 3D Point Projection helper
    const project = (pt: Point3D, w: number, h: number) => {
      const cam = cameraRef.current;
      
      // Dynamic shift from mouse displacement (gives real 3D looking depth on hover)
      const currentCamX = cam.x + mouseOffset.current.x;
      const currentCamY = cam.y + mouseOffset.current.y;

      // Translate point relative to active Camera coord structure
      const dx = pt.x - currentCamX;
      const dy = pt.y - currentCamY; // vertical inverted coordinate
      const dz = pt.z - cam.z;

      // Rotate around Camera Yaw (horizontal pan look-left/right)
      const cosY = Math.cos(cam.yaw);
      const sinY = Math.sin(cam.yaw);
      const rx1 = dx * cosY - dz * sinY;
      const rz1 = dx * sinY + dz * cosY;

      // Rotate around Camera Pitch (tilt look-up/down)
      const cosP = Math.cos(cam.pitch);
      const sinP = Math.sin(cam.pitch);
      // Coordinate adjustment: Y axis points down in standard viewport, but we treat pos Y as skywards
      // so we invert dy direction to match standard cartesian graphics projection.
      const ry2 = (-dy) * cosP - rz1 * sinP;
      const rz2 = (-dy) * sinP + rz1 * cosP;

      // Clip structures completely behind the camera to prevent wild reverse projection loops
      const minDistance = 20; 
      if (rz2 <= minDistance) return null;

      const scale = cam.fov / rz2;
      return {
        x: w / 2 + rx1 * scale,
        y: h / 2 + ry2 * scale,
        scale: scale,
        depth: rz2
      };
    };

    // Construct 3D Neon Lines for each structure
    const compileStructureSegments = (s: CityStructure, step: number): LineSegment[] => {
      const segments: LineSegment[] = [];

      const xMin = s.centerX - s.width / 2;
      const xMax = s.centerX + s.width / 2;
      const zMin = s.centerZ - s.depth / 2;
      const zMax = s.centerZ + s.depth / 2;
      const yMin = s.baseY;
      const yMax = s.baseY + s.height;

      // Modern corporate / grid Skyscraper
      if (s.type === 'tower') {
        const levels = 8;
        const widthDivisions = 4;

        // 4 Vertical corner pillars
        const corners = [
          { x: xMin, z: zMin },
          { x: xMax, z: zMin },
          { x: xMax, z: zMax },
          { x: xMin, z: zMax },
        ];

        corners.forEach((c) => {
          segments.push({
            p1: { x: c.x, y: yMin, z: c.z },
            p2: { x: c.x, y: yMax, z: c.z },
            color: s.primaryColor,
            glow: true,
            width: 1.2
          });
        });

        // Horizontal rings/roofs at intermediate heights to resemble luxury skyscrapers
        for (let j = 0; j <= levels; j++) {
          const levelY = yMin + (s.height / levels) * j;
          const isTop = j === levels;
          const isBase = j === 0;

          // Connecting ring
          for (let m = 0; m < 4; m++) {
            const c1 = corners[m];
            const c2 = corners[(m + 1) % 4];
            segments.push({
              p1: { x: c1.x, y: levelY, z: c1.z },
              p2: { x: c2.x, y: levelY, z: c2.z },
              color: isTop ? s.secondaryColor : s.primaryColor,
              glow: isTop || j % 3 === 0,
              width: isTop || isBase ? 1.5 : 0.8
            });
          }

          // Grid decorative panel details (inner windows visual)
          if (!isTop && !isBase && j % 2 === 0) {
            for (let d = 1; d < widthDivisions; d++) {
              const rat = d / widthDivisions;
              // Front structural grids
              segments.push({
                p1: { x: xMin + s.width * rat, y: levelY, z: zMin },
                p2: { x: xMin + s.width * rat, y: levelY + (s.height / levels), z: zMin },
                color: s.secondaryColor,
                glow: false,
                width: 0.5
              });
              // Right structural grids
              segments.push({
                p1: { x: xMax, y: levelY, z: zMin + s.depth * rat },
                p2: { x: xMax, y: levelY + (s.height / levels), z: zMin + s.depth * rat },
                color: s.secondaryColor,
                glow: false,
                width: 0.5
              });
            }
          }
        }

        // Aviation beacon on top center of tower
        const topCenter = { x: s.centerX, y: yMax, z: s.centerZ };
        const peakPoint = { x: s.centerX, y: yMax + 30, z: s.centerZ };
        segments.push({
          p1: topCenter,
          p2: peakPoint,
          color: '#ffffff',
          glow: true,
          width: 1.5
        });
      }

      // Modern Pyramid / Obelisk high-rise
      else if (s.type === 'pyramid') {
        const peakPoint = { x: s.centerX, y: yMax, z: s.centerZ };

        // 4 baseline points
        const corners = [
          { x: xMin, z: zMin },
          { x: xMax, z: zMin },
          { x: xMax, z: zMax },
          { x: xMin, z: zMax },
        ];

        // Draw 4 base segment lines
        for (let m = 0; m < 4; m++) {
          const c1 = corners[m];
          const c2 = corners[(m + 1) % 4];
          segments.push({
            p1: { x: c1.x, y: yMin, z: c1.z },
            p2: { x: c2.x, y: yMin, z: c2.z },
            color: s.primaryColor,
            glow: false,
            width: 1.0
          });
        }

        // Draw angled corner lines from base to peak obelisk
        corners.forEach((c) => {
          segments.push({
            p1: { x: c.x, y: yMin, z: c.z },
            p2: peakPoint,
            color: s.primaryColor,
            glow: true,
            width: 1.4
          });
        });

        // Horizontal ring details that reduce in scale as they approach the peak
        const details = 6;
        for (let j = 1; j < details; j++) {
          const ratio = j / details;
          const levelY = yMin + s.height * ratio;
          const currentH = s.width * (1 - ratio);
          const currentD = s.depth * (1 - ratio);

          const curXMin = s.centerX - currentH / 2;
          const curXMax = s.centerX + currentH / 2;
          const curZMin = s.centerZ - currentD / 2;
          const curZMax = s.centerZ + currentD / 2;

          segments.push({ p1: { x: curXMin, y: levelY, z: curZMin }, p2: { x: curXMax, y: levelY, z: curZMin }, color: s.secondaryColor, glow: true, width: 0.8 });
          segments.push({ p1: { x: curXMax, y: levelY, z: curZMin }, p2: { x: curXMax, y: levelY, z: curZMax }, color: s.secondaryColor, glow: true, width: 0.8 });
          segments.push({ p1: { x: curXMax, y: levelY, z: curZMax }, p2: { x: curXMin, y: levelY, z: curZMax }, color: s.secondaryColor, glow: true, width: 0.8 });
          segments.push({ p1: { x: curXMin, y: levelY, z: curZMax }, p2: { x: curXMin, y: levelY, z: curZMin }, color: s.secondaryColor, glow: true, width: 0.8 });
        }
      }

      // Modern Helix/Spiral tower (Shanghai Tower/Torre Glòries style)
      else if (s.type === 'helix') {
        const ringsCount = 13;
        const radialPoints = 8;
        const radius = s.width / 2;

        let prevRingPoints: Point3D[] = [];

        for (let j = 0; j <= ringsCount; j++) {
          const t = j / ringsCount;
          const curY = yMin + s.height * t;
          
          // Taper building slightly near the peak top
          const scaleFactor = t < 0.8 ? 1.0 : 1.0 - (t - 0.8) * 4.0;
          const curRadius = radius * Math.max(0.15, scaleFactor);
          // Apply twisting twist angle to layers
          const twistAngle = t * Math.PI * 1.5;

          const ringPoints: Point3D[] = [];

          for (let m = 0; m < radialPoints; m++) {
            const ang = (m / radialPoints) * Math.PI * 2 + twistAngle;
            const px = s.centerX + Math.cos(ang) * curRadius;
            const pz = s.centerZ + Math.sin(ang) * curRadius;
            ringPoints.push({ x: px, y: curY, z: pz });
          }

          // Draw ring circumference segments
          for (let m = 0; m < radialPoints; m++) {
            segments.push({
              p1: ringPoints[m],
              p2: ringPoints[(m + 1) % radialPoints],
              color: s.primaryColor,
              glow: j % 3 === 0,
              width: j % 3 === 0 ? 1.4 : 0.7
            });
          }

          // Vertical linking rods connecting this ring to previous ring, twisting
          if (prevRingPoints.length > 0) {
            for (let m = 0; m < radialPoints; m++) {
              segments.push({
                p1: prevRingPoints[m],
                p2: ringPoints[(m + 1) % radialPoints], // diagonal twist connection
                color: s.secondaryColor,
                glow: false,
                width: 0.6
              });
            }
          }

          prevRingPoints = ringPoints;
        }

        // Needle antenna peak core
        segments.push({
          p1: { x: s.centerX, y: yMax, z: s.centerZ },
          p2: { x: s.centerX, y: yMax + 40, z: s.centerZ },
          color: '#ffffff',
          glow: true,
          width: 1.5
        });
      }

      // Compact Digital block / Core low rises
      else if (s.type === 'block') {
        const corners = [
          { x: xMin, z: zMin },
          { x: xMax, z: zMin },
          { x: xMax, z: zMax },
          { x: xMin, z: zMax },
        ];

        // Draw vertical profiles
        corners.forEach((c) => {
          segments.push({
            p1: { x: c.x, y: yMin, z: c.z },
            p2: { x: c.x, y: yMax, z: c.z },
            color: s.primaryColor,
            glow: true,
            width: 1.0
          });
        });

        // Top and Bottom ceiling plates
        [yMin, yMax].forEach((levelY, levelIdx) => {
          for (let m = 0; m < 4; m++) {
            segments.push({
              p1: { x: corners[m].x, y: levelY, z: corners[m].z },
              p2: { x: corners[(m + 1) % 4].x, y: levelY, z: corners[(m + 1) % 4].z },
              color: s.secondaryColor,
              glow: levelIdx === 1,
              width: levelIdx === 1 ? 1.4 : 0.8
            });
          }
        });

        // Abstract server/core grid lines across front-face
        const division = 3;
        for (let f = 1; f < division; f++) {
          const dy = yMin + (s.height / division) * f;
          segments.push({
            p1: { x: xMin, y: dy, z: zMin },
            p2: { x: xMax, y: dy, z: zMin },
            color: s.secondaryColor,
            glow: false,
            width: 0.6
          });
        }
      }

      // Luminous Ferris Eye (Large Neon Attraction Ferris Wheel)
      else if (s.type === 'ferris') {
        const wheelRadius = s.height / 2;
        const wheelY = s.baseY + wheelRadius;
        
        // Static supporting framework tripod stand
        segments.push({
          p1: { x: s.centerX - 40, y: yMin, z: s.centerZ },
          p2: { x: s.centerX, y: wheelY, z: s.centerZ },
          color: s.primaryColor,
          glow: true,
          width: 2.2
        });
        segments.push({
          p1: { x: s.centerX + 40, y: yMin, z: s.centerZ },
          p2: { x: s.centerX, y: wheelY, z: s.centerZ },
          color: s.primaryColor,
          glow: true,
          width: 2.2
        });
        segments.push({
          p1: { x: s.centerX, y: yMin, z: s.centerZ + 30 },
          p2: { x: s.centerX, y: wheelY, z: s.centerZ },
          color: s.primaryColor,
          glow: false,
          width: 1.2
        });

        // Rotating ring calculations
        const spokesCount = 10;
        const currentAngle = (s.data?.angle || 0) + (s.data?.speed || 0.005) * step;
        
        // Save computed updated angle back to data
        if (s.data) {
          s.data.angle = currentAngle;
        }

        // Double rings (Outer neon rims)
        const radialDivs = 20;
        const ring1Points: Point3D[] = [];
        const ring2Points: Point3D[] = [];

        for (let m = 0; m < radialDivs; m++) {
          const radialAng = (m / radialDivs) * Math.PI * 2 + currentAngle;
          ring1Points.push({
            x: s.centerX + Math.cos(radialAng) * wheelRadius,
            y: wheelY + Math.sin(radialAng) * wheelRadius,
            z: s.centerZ
          });
          ring2Points.push({
            x: s.centerX + Math.cos(radialAng) * (wheelRadius - 10),
            y: wheelY + Math.sin(radialAng) * (wheelRadius - 10),
            z: s.centerZ
          });
        }

        // Segments for dual rings
        for (let m = 0; m < radialDivs; m++) {
          segments.push({
            p1: ring1Points[m],
            p2: ring1Points[(m + 1) % radialDivs],
            color: s.secondaryColor,
            glow: true,
            width: 1.8
          });
          segments.push({
            p1: ring2Points[m],
            p2: ring2Points[(m + 1) % radialDivs],
            color: s.secondaryColor,
            glow: false,
            width: 0.8
          });

          // cross struts linking inner/outer rings
          segments.push({
            p1: ring1Points[m],
            p2: ring2Points[m],
            color: '#ffffff',
            glow: false,
            width: 0.6
          });
        }

        // Inner spokes
        for (let m = 0; m < spokesCount; m++) {
          const spokeAng = (m / spokesCount) * Math.PI * 2 + currentAngle;
          segments.push({
            p1: { x: s.centerX, y: wheelY, z: s.centerZ },
            p2: {
              x: s.centerX + Math.cos(spokeAng) * (wheelRadius - 10),
              y: wheelY + Math.sin(spokeAng) * (wheelRadius - 10),
              z: s.centerZ
            },
            color: s.primaryColor,
            glow: false,
            width: 0.8
          });

          // Suspended neon passenger pods on rim spokes
          const podX = s.centerX + Math.cos(spokeAng) * wheelRadius;
          const podY = wheelY + Math.sin(spokeAng) * wheelRadius;

          // Cute square/circle little pod models
          segments.push({
            p1: { x: podX - 4, y: podY - 4, z: s.centerZ },
            p2: { x: podX + 4, y: podY - 4, z: s.centerZ },
            color: '#ffffff',
            glow: true,
            width: 1.0
          });
          segments.push({
            p1: { x: podX + 4, y: podY - 4, z: s.centerZ },
            p2: { x: podX + 4, y: podY + 3, z: s.centerZ },
            color: s.primaryColor,
            glow: true,
            width: 1.0
          });
          segments.push({
            p1: { x: podX + 4, y: podY + 3, z: s.centerZ },
            p2: { x: podX - 4, y: podY + 3, z: s.centerZ },
            color: s.primaryColor,
            glow: true,
            width: 1.0
          });
          segments.push({
            p1: { x: podX - 4, y: podY + 3, z: s.centerZ },
            p2: { x: podX - 4, y: podY - 4, z: s.centerZ },
            color: s.primaryColor,
            glow: true,
            width: 1.0
          });
        }
      }

      return segments;
    };

    // Flying traffic particles (Monorail/Highways) zipping under skyscrapers
    const activeTraffic: Array<{ x: number; y: number; z: number; color: string; speed: number; dir: number }> = [];
    for (let i = 0; i < 18; i++) {
      activeTraffic.push({
        x: (Math.random() - 0.5) * 1000,
        y: -75 + Math.random() * 25, // flying slightly above the ground plane
        z: 50 + Math.random() * 320,
        color: i % 2 === 0 ? skyNeon : pinkNeon,
        speed: 1.8 + Math.random() * 2.5,
        dir: Math.random() > 0.5 ? 1 : -1
      });
    }

    let frameCount = 0;

    // Render loop
    const render = () => {
      frameCount++;
      const rect = containerRef.current 
        ? containerRef.current.getBoundingClientRect() 
        : { width: window.innerWidth, height: window.innerHeight };
      
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // --- SKY SCENE EFFECTS ---
      // Distant stars / beacons behind everything
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 25; i++) {
        // High frequency static pseudorandom positions using prime modules
        const starX = ((i * 12345) % width);
        const starY = ((i * 54321) % (height * 0.45));
        const blink = Math.abs(Math.sin(frameCount * 0.02 + i));
        ctx.globalAlpha = 0.15 + blink * 0.5;
        ctx.fillRect(starX, starY, 1.2, 1.2);
      }
      ctx.globalAlpha = 1.0;

      // Draw Grid ground perspective plane to ground the 3D skyscrapers
      const groundY = -80;
      const gridSegments: Array<{ p1: Point3D; p2: Point3D; alpha: number }> = [];

      // Grid latitudinal lines (extending along Z axis)
      for (let gridX = -600; gridX <= 600; gridX += 100) {
        gridSegments.push({
          p1: { x: gridX, y: groundY, z: -100 },
          p2: { x: gridX, y: groundY, z: 600 },
          alpha: 0.07 * (1 - Math.abs(gridX) / 700)
        });
      }

      // Grid depth transversal rings (moving/marching Z lines)
      const pulseSpeed = 0.25;
      const tShift = (frameCount * pulseSpeed) % 80;
      for (let gridZ = -100; gridZ <= 600; gridZ += 80) {
        const curZ = gridZ - tShift;
        if (curZ < -100) continue;
        gridSegments.push({
          p1: { x: -600, y: groundY, z: curZ },
          p2: { x: 600, y: groundY, z: curZ },
          alpha: 0.04 * (1 - curZ / 700)
        });
      }

      // Project and draw ground grid lines
      gridSegments.forEach((g) => {
        const pr1 = project(g.p1, width, height);
        const pr2 = project(g.p2, width, height);

        if (pr1 && pr2) {
          ctx.beginPath();
          ctx.moveTo(pr1.x, pr1.y);
          ctx.lineTo(pr2.x, pr2.y);
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = g.alpha;
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1.0;

      // Compile ALL architecture pieces into segments
      let allSegments: Array<{ p1_proj: any; p2_proj: any; seg: LineSegment }> = [];

      structures.forEach((s) => {
        const structuralLines = compileStructureSegments(s, frameCount);
        
        structuralLines.forEach((line) => {
          const pr1 = project(line.p1, width, height);
          const pr2 = project(line.p2, width, height);

          if (pr1 && pr2) {
            // Store projections and deep-depth so we can draw painter order sorted or clip properly
            const meanDepth = (pr1.depth + pr2.depth) / 2;
            allSegments.push({
              p1_proj: pr1,
              p2_proj: pr2,
              seg: { ...line, p1: { ...line.p1, z: meanDepth } } // hijack Z to serve sorted order
            });
          }
        });
      });

      // Render 3D Flying Traffic Particles as glowing trails
      activeTraffic.forEach((t) => {
        // Move traffic
        t.x += t.speed * t.dir;
        if (t.x > 600 && t.dir === 1) t.x = -600;
        if (t.x < -600 && t.dir === -1) t.x = 600;

        const p1: Point3D = { x: t.x, y: t.y, z: t.z };
        const p2: Point3D = { x: t.x - t.dir * 18, y: t.y, z: t.z };

        const pr1 = project(p1, width, height);
        const pr2 = project(p2, width, height);

        if (pr1 && pr2) {
          allSegments.push({
            p1_proj: pr1,
            p2_proj: pr2,
            seg: {
              p1: { x: t.x, y: t.y, z: pr1.depth },
              p2: { x: t.x, y: t.y, z: pr2.depth },
              color: t.color,
              glow: true,
              width: 1.0
            }
          });
        }
      });

      // Painter Sort algorithm: Sort segments by depth (Z-value back-to-front) so overlap layers build naturally
      allSegments.sort((a, b) => b.seg.p1.z - a.seg.p1.z);

      // --- PAINTER METHOD DRAWING ---
      allSegments.forEach(({ p1_proj, p2_proj, seg }) => {
        // Depth-based fog fade (skyscrapers deep in the horizon are dimmer and softer)
        const maxVisibility = 850;
        const depthFactor = Math.max(0, 1 - p1_proj.depth / maxVisibility);
        if (depthFactor <= 0) return;

        ctx.lineWidth = seg.width * Math.max(0.4, p1_proj.scale * 1.5);
        ctx.globalAlpha = depthFactor * (seg.glow ? 0.75 : 0.35);

        // Standard stroke path
        ctx.beginPath();
        ctx.moveTo(p1_proj.x, p1_proj.y);
        ctx.lineTo(p2_proj.x, p2_proj.y);

        if (seg.glow) {
          // Double lines to construct high-realistic heavy glowing cyber-neon strip look without crashing browser canvas FPS
          ctx.strokeStyle = seg.color;
          ctx.stroke();

          // Outer heavy glow path overlapping
          ctx.beginPath();
          ctx.moveTo(p1_proj.x, p1_proj.y);
          ctx.lineTo(p2_proj.x, p2_proj.y);
          ctx.lineWidth = ctx.lineWidth * 2.8;
          ctx.strokeStyle = `${seg.color}22`;
          ctx.stroke();
        } else {
          ctx.strokeStyle = seg.color;
          ctx.stroke();
        }
      });

      // Master reset
      ctx.globalAlpha = 1.0;

      // Render aesthetic title block/crosshair vectors to highlight mock HUD target coordinate telemetry details
      const hudX = width * 0.12;
      const hudY = height * 0.78;
      if (width > 640) {
        ctx.font = '500 8px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
        ctx.fillStyle = '#475569';
        ctx.fillText(`YAW: ${cameraRef.current.yaw.toFixed(3)}L`, hudX, hudY);
        ctx.fillText(`PITCH: ${cameraRef.current.pitch.toFixed(3)}D`, hudX + 110, hudY);
        ctx.fillText(`RENDER_VEC: ${allSegments.length} SEG`, hudX + 220, hudY);

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 0.5;
        // Drawing corner grids
        ctx.beginPath();
        ctx.moveTo(30, 30);
        ctx.lineTo(60, 30);
        ctx.moveTo(30, 30);
        ctx.lineTo(30, 60);

        ctx.moveTo(width - 30, 30);
        ctx.lineTo(width - 60, 30);
        ctx.moveTo(width - 30, 30);
        ctx.lineTo(width - 30, 60);

        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
      panAnim.pause();
    };
  }, [accentColor, secondaryColor]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto overflow-hidden select-none -z-10"
    >
      {/* Cityscape canvas container overlay */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full opacity-[0.38] mix-blend-screen pointer-events-none"
      />
      
      {/* Neon purple backing shadow gradient */}
      <div 
        className="absolute bottom-0 left-[20%] w-[600px] h-[400px] rounded-full blur-[140px] opacity-[0.08] mix-blend-screen pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 80%)`
        }}
      />
    </div>
  );
}
