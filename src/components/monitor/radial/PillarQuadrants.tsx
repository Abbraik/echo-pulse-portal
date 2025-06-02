
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PillarOverviewDrawer } from '../quadrant/PillarOverviewDrawer';

interface PillarQuadrantsProps {
  onHover: (element: string | null) => void;
  onModalToggle: (isOpen: boolean) => void;
}

interface PillarData {
  name: string;
  description: string;
  indicators: Array<{
    name: string;
    current: number;
    target: number;
    status: 'good' | 'warning' | 'critical';
  }>;
}

export const PillarQuadrants: React.FC<PillarQuadrantsProps> = ({ 
  onHover, 
  onModalToggle 
}) => {
  const [selectedPillar, setSelectedPillar] = useState<PillarData | null>(null);

  const pillars = [
    {
      name: 'Population Dynamics',
      angle: 45, // 0°-90° midpoint
      gradient: 'linear-gradient(135deg, #0288D1 0%, #00BCD4 100%)',
      description: 'Targeting balanced growth through policies',
      indicators: [
        { name: 'Population Volatility', current: 0.12, target: 0.10, status: 'warning' as const },
        { name: 'Structure Deviation', current: 0.08, target: 0.05, status: 'warning' as const },
        { name: 'Natural Growth Balance', current: 0.95, target: 1.00, status: 'good' as const }
      ]
    },
    {
      name: 'Resource Market',
      angle: 135, // 90°-180° midpoint
      gradient: 'linear-gradient(135deg, #009688 0%, #26A69A 100%)',
      description: 'Sustainable resource allocation and pricing',
      indicators: [
        { name: 'Stock vs Target', current: 0.92, target: 0.90, status: 'good' as const },
        { name: 'Renewal vs Consumption', current: 0.85, target: 0.90, status: 'warning' as const },
        { name: 'Extraction Pressure', current: 0.60, target: 0.70, status: 'good' as const }
      ]
    },
    {
      name: 'Products & Services Market',
      angle: 225, // 180°-270° midpoint
      gradient: 'linear-gradient(135deg, #3F51B5 0%, #5C6BC0 100%)',
      description: 'Market efficiency and service delivery',
      indicators: [
        { name: 'Service Quality Index', current: 0.78, target: 0.80, status: 'warning' as const },
        { name: 'Market Penetration', current: 0.65, target: 0.70, status: 'warning' as const },
        { name: 'Innovation Rate', current: 0.85, target: 0.80, status: 'good' as const }
      ]
    },
    {
      name: 'Social Outcomes',
      angle: 315, // 270°-360° midpoint
      gradient: 'linear-gradient(135deg, #283593 0%, #3949AB 100%)',
      description: 'Community wellbeing and social cohesion',
      indicators: [
        { name: 'Trust Index', current: 64, target: 70, status: 'warning' as const },
        { name: 'Social Cohesion', current: 0.72, target: 0.75, status: 'warning' as const },
        { name: 'Wellbeing Score', current: 0.68, target: 0.70, status: 'warning' as const }
      ]
    }
  ];

  const handlePillarClick = (pillar: PillarData) => {
    setSelectedPillar(pillar);
    onModalToggle(true);
  };

  const handleDrawerClose = () => {
    setSelectedPillar(null);
    onModalToggle(false);
  };

  return (
    <>
      {/* Quadrant Rings */}
      <svg 
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        width="500" 
        height="500"
        style={{ zIndex: 10 }}
      >
        <defs>
          {pillars.map((pillar, index) => (
            <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={pillar.gradient.match(/#[A-Fa-f0-9]{6}/g)?.[0]} stopOpacity="0.2" />
              <stop offset="100%" stopColor={pillar.gradient.match(/#[A-Fa-f0-9]{6}/g)?.[1]} stopOpacity="0.2" />
            </linearGradient>
          ))}
        </defs>
        
        {/* Quadrant Arcs */}
        {pillars.map((pillar, index) => {
          const startAngle = index * 90;
          const endAngle = (index + 1) * 90;
          const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
          
          const x1 = 250 + 150 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 250 + 150 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 250 + 150 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 250 + 150 * Math.sin((endAngle * Math.PI) / 180);
          
          const x3 = 250 + 220 * Math.cos((endAngle * Math.PI) / 180);
          const y3 = 250 + 220 * Math.sin((endAngle * Math.PI) / 180);
          const x4 = 250 + 220 * Math.cos((startAngle * Math.PI) / 180);
          const y4 = 250 + 220 * Math.sin((startAngle * Math.PI) / 180);

          return (
            <motion.path
              key={index}
              d={`M ${x1} ${y1} A 150 150 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A 220 220 0 ${largeArcFlag} 0 ${x4} ${y4} Z`}
              fill={`url(#gradient-${index})`}
              stroke="#00FFC3"
              strokeWidth="0"
              className="pointer-events-auto cursor-pointer"
              whileHover={{ 
                fill: `url(#gradient-${index})`,
                strokeWidth: 2,
                transition: { duration: 0.2 }
              }}
              onClick={() => handlePillarClick(pillar)}
              onMouseEnter={() => onHover(`pillar-${index}`)}
              onMouseLeave={() => onHover(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
            />
          );
        })}
      </svg>

      {/* Pillar Labels */}
      {pillars.map((pillar, index) => (
        <motion.div
          key={pillar.name}
          className="absolute cursor-pointer pointer-events-auto"
          role="button"
          aria-label={`${pillar.name} pillar overview`}
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${pillar.angle}deg) translateY(-185px) rotate(-${pillar.angle}deg)`,
            zIndex: 20
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => handlePillarClick(pillar)}
          onMouseEnter={() => onHover(`pillar-${index}`)}
          onMouseLeave={() => onHover(null)}
        >
          <div 
            className="px-4 py-2 rounded-lg backdrop-blur-[24px] border border-white/20 text-center"
            style={{
              background: 'rgba(10, 20, 40, 0.8)',
              boxShadow: '0 0 15px rgba(0, 255, 195, 0.1)'
            }}
          >
            <div 
              className="text-sm font-bold"
              style={{ color: '#00FFC3' }}
            >
              {pillar.name}
            </div>
          </div>
        </motion.div>
      ))}

      <PillarOverviewDrawer
        pillar={selectedPillar}
        isOpen={selectedPillar !== null}
        onClose={handleDrawerClose}
      />
    </>
  );
};
