
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

interface ParticlesBackgroundProps {
  count?: number;
  colorStart?: string;
  colorEnd?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  className?: string;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  count = 50,
  colorStart = "#14B8A6",
  colorEnd = "#2563EB",
  minSize = 2,
  maxSize = 6,
  speed = 0.3,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animationFrameId: number;
    let width: number;
    let height: number;
    
    // Initialize particles
    const initParticles = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      particles.current = [];
      
      for (let i = 0; i < count; i++) {
        const size = Math.random() * (maxSize - minSize) + minSize;
        particles.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          speedX: (Math.random() - 0.5) * speed,
          speedY: (Math.random() - 0.5) * speed,
          color: i % 2 === 0 ? colorStart : colorEnd,
          opacity: Math.random() * 0.6 + 0.1,
        });
      }
    };
    
    // Update and draw particles
    const render = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, width, height);
      
      particles.current.forEach((particle) => {
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > width) {
          particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > height) {
          particle.speedY *= -1;
        }
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    const handleResize = () => {
      initParticles();
    };
    
    window.addEventListener("resize", handleResize);
    initParticles();
    render();
    
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, colorStart, colorEnd, minSize, maxSize, speed]);
  
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b dark:from-navy-900/50 dark:to-navy-900/80 from-blue-50/50 to-white/80"></div>
    </div>
  );
};

export default ParticlesBackground;
