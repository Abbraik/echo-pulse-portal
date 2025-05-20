
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DeiGaugeChartProps {
  value: number;
  minBand: number;
  maxBand: number;
  pulsing: boolean;
}

const DeiGaugeChart: React.FC<DeiGaugeChartProps> = ({
  value,
  minBand,
  maxBand,
  pulsing
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Convert 0-100 scale to radians (0 = -135deg, 100 = 135deg)
  const valueToRadian = (val: number) => ((val / 100) * 270 - 135) * Math.PI / 180;
  
  useEffect(() => {
    const renderGauge = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set dimensions
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;
      const gaugeWidth = radius * 0.2;
      
      // Draw background arc
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -135 * Math.PI / 180, 135 * Math.PI / 180, false);
      ctx.lineWidth = gaugeWidth;
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
      ctx.stroke();
      
      // Draw equilibrium band
      const minRadian = valueToRadian(minBand);
      const maxRadian = valueToRadian(maxBand);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, minRadian, maxRadian, false);
      ctx.lineWidth = gaugeWidth;
      
      // Create gradient for equilibrium band
      const bandGradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
      bandGradient.addColorStop(0, 'rgba(45, 212, 191, 0.5)');
      bandGradient.addColorStop(1, 'rgba(59, 130, 246, 0.5)');
      ctx.strokeStyle = bandGradient;
      ctx.stroke();
      
      // Draw needle
      const valueRadian = valueToRadian(value);
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(valueRadian);
      
      // Draw needle body
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(radius * 0.95, 0);
      ctx.lineTo(0, 10);
      ctx.closePath();
      
      // Create gradient based on in/out of equilibrium
      let needleGradient;
      if (value >= minBand && value <= maxBand) {
        // In equilibrium - teal/blue gradient
        needleGradient = ctx.createLinearGradient(-radius / 2, 0, radius, 0);
        needleGradient.addColorStop(0, '#2DD4BF');
        needleGradient.addColorStop(1, '#3B82F6');
      } else if (value < minBand) {
        // Below equilibrium - red/orange gradient
        needleGradient = ctx.createLinearGradient(-radius / 2, 0, radius, 0);
        needleGradient.addColorStop(0, '#EF4444');
        needleGradient.addColorStop(1, '#F97316');
      } else {
        // Above equilibrium - yellow/amber gradient
        needleGradient = ctx.createLinearGradient(-radius / 2, 0, radius, 0);
        needleGradient.addColorStop(0, '#FBBF24');
        needleGradient.addColorStop(1, '#F59E0B');
      }
      
      ctx.fillStyle = needleGradient;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fill();
      
      // Draw needle center
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = '#E2E8F0';
      ctx.shadowBlur = 10;
      ctx.fill();
      
      ctx.restore();
      
      // Draw gauge labels
      ctx.font = `${radius * 0.1}px Inter, sans-serif`;
      ctx.fillStyle = 'rgba(100, 116, 139, 0.8)';
      ctx.textAlign = 'center';
      
      // Min label (0)
      const minPos = valueToRadian(0);
      const minX = centerX + Math.cos(minPos) * (radius + gaugeWidth);
      const minY = centerY + Math.sin(minPos) * (radius + gaugeWidth);
      ctx.fillText('0', minX, minY + radius * 0.05);
      
      // Max label (100)
      const maxPos = valueToRadian(100);
      const maxX = centerX + Math.cos(maxPos) * (radius + gaugeWidth);
      const maxY = centerY + Math.sin(maxPos) * (radius + gaugeWidth);
      ctx.fillText('100', maxX, maxY + radius * 0.05);
      
      // Quarter ticks
      for (let i = 25; i <= 75; i += 25) {
        const tickPos = valueToRadian(i);
        const tickX = centerX + Math.cos(tickPos) * (radius + gaugeWidth * 0.5);
        const tickY = centerY + Math.sin(tickPos) * (radius + gaugeWidth * 0.5);
        ctx.fillText(i.toString(), tickX, tickY + radius * 0.05);
      }
    };
    
    renderGauge();
    
    // Re-render on window resize
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const container = canvas.parentElement;
      if (!container) return;
      
      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Set display size (css pixels) and actual size (canvas pixels)
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      
      // Scale context to normalize drawing operations
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      renderGauge();
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [value, minBand, maxBand]);
  
  return (
    <div className="w-full aspect-[2/1] relative">
      <motion.div
        className="absolute inset-0"
        animate={
          pulsing 
            ? { opacity: [0.7, 1, 0.7] } 
            : { opacity: 1 }
        }
        transition={
          pulsing 
            ? { repeat: Infinity, duration: 2, ease: "easeInOut" } 
            : {}
        }
      >
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
        />
      </motion.div>
    </div>
  );
};

export default DeiGaugeChart;
