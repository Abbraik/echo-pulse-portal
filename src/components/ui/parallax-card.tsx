
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface ParallaxCardProps {
  className?: string;
  children: React.ReactNode;
  depth?: number; // Control the intensity of the effect
  disabled?: boolean; // Allow disabling the effect
}

export const ParallaxCard: React.FC<ParallaxCardProps> = ({
  children,
  className = "",
  depth = 20,
  disabled = false,
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top; // y position within the element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateYValue = ((x - centerX) / centerX) * (depth / 3);
    const rotateXValue = ((centerY - y) / centerY) * (depth / 4);
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Reset rotation when component unmounts or disabled changes
  useEffect(() => {
    return () => {
      setRotateX(0);
      setRotateY(0);
    };
  }, [disabled]);

  return (
    <motion.div
      ref={ref}
      className={`transition-transform ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ transform: "translateZ(20px)" }}>{children}</div>
    </motion.div>
  );
};

export const ParallaxItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  depth?: number;
}> = ({ children, className = "", depth = 15 }) => {
  return (
    <div
      className={`${className}`}
      style={{
        transform: `translateZ(${depth}px)`,
      }}
    >
      {children}
    </div>
  );
};
