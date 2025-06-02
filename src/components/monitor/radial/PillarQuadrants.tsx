
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PillarOverviewDrawer } from '../quadrant/PillarOverviewDrawer';

interface PillarData {
  name: string;
  description: string;
  angle: number;
  gradient: string;
  indicators: Array<{
    name: string;
    current: number;
    target: number;
    status: 'good' | 'warning' | 'critical';
  }>;
}

interface PillarQuadrantsProps {
  onHover: (element: string | null) => void;
  onModalToggle: (isOpen: boolean) => void;
}

export const PillarQuadrants: React.FC<PillarQuadrantsProps> = ({ 
  onHover, 
  onModalToggle 
}) => {
  const [selectedPillar, setSelectedPillar] = useState<PillarData | null>(null);

  const pillars: PillarData[] = [
    {
      name: 'Population Dynamics',
      angle: 45,
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
      angle: 135,
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
      angle: 225,
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
      angle: 315,
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

  const handleCloseDrawer = () => {
    setSelectedPillar(null);
    onModalToggle(false);
  };

  return (
    <>
      {/* Pillar Quadrant Ring SVG */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ zIndex: 5 }}
        width="800" 
        height="800"
      >
        <defs>
          {pillars.map((pillar, index) => (
            <linearGradient key={`gradient-${index}`} id={`pillar-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={pillar.gradient.match(/#[0-9A-F]{6}/gi)?.[0] || '#0288D1'} stopOpacity="0.2" />
              <stop offset="100%" stopColor={pillar.gradient.match(/#[0-9A-F]{6}/gi)?.[1] || '#00BCD4'} stopOpacity="0.2" />
            </linearGradient>
          ))}
        </defs>
        
        {pillars.map((pillar, index) => {
          const startAngle = (index * 90 - 90) * Math.PI / 180; // Convert to radians, offset by -90°
          const endAngle = ((index + 1) * 90 - 90) * Math.PI / 180;
          const centerX = 400;
          const centerY = 400;
          const innerRadius = 150;
          const outerRadius = 220;
          
          // Create path for sector
          const x1 = centerX + innerRadius * Math.cos(startAngle);
          const y1 = centerY + innerRadius * Math.sin(startAngle);
          const x2 = centerX + outerRadius * Math.cos(startAngle);
          const y2 = centerY + outerRadius * Math.sin(startAngle);
          const x3 = centerX + outerRadius * Math.cos(endAngle);
          const y3 = centerY + outerRadius * Math.sin(endAngle);
          const x4 = centerX + innerRadius * Math.cos(endAngle);
          const y4 = centerY + innerRadius * Math.sin(endAngle);
          
          const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
          
          const pathData = [
            `M ${x1} ${y1}`,
            `L ${x2} ${y2}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}`,
            `L ${x4} ${y4}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`,
            'Z'
          ].join(' ');

          return (
            <motion.path
              key={`quadrant-${index}`}
              d={pathData}
              fill={`url(#pillar-gradient-${index})`}
              stroke="rgba(0, 255, 195, 0.3)"
              strokeWidth="1"
              className="pointer-events-auto cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              whileHover={{ 
                fill: `url(#pillar-gradient-${index})`,
                stroke: "rgba(0, 255, 195, 0.6)",
                strokeWidth: 2
              }}
              onClick={() => handlePillarClick(pillar)}
              onMouseEnter={() => onHover(`quadrant-${index}`)}
              onMouseLeave={() => onHover(null)}
            />
          );
        })}
      </svg>

      {/* Pillar Labels */}
      {pillars.map((pillar, index) => {
        const angle = pillar.angle * Math.PI / 180;
        const radius = 185;
        const x = 400 + radius * Math.cos(angle);
        const y = 400 + radius * Math.sin(angle);

        return (
          <motion.div
            key={`label-${index}`}
            className="absolute cursor-pointer pointer-events-auto"
            style={{
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
              zIndex: 15
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => handlePillarClick(pillar)}
            onMouseEnter={() => onHover(`label-${index}`)}
            onMouseLeave={() => onHover(null)}
          >
            <div 
              className="px-3 py-1 rounded-lg backdrop-blur-[16px] border border-white/20 text-center"
              style={{
                background: 'rgba(20, 30, 50, 0.4)',
                boxShadow: '0 0 15px rgba(0, 255, 195, 0.1)'
              }}
            >
              <div 
                className="text-sm font-bold whitespace-nowrap"
                style={{ color: '#00FFC3' }}
              >
                {pillar.name}
              </div>
            </div>
          </motion.div>
        );
      })}

      <PillarOverviewDrawer
        pillar={selectedPillar}
        isOpen={selectedPillar !== null}
        onClose={handleCloseDrawer}
      />
    </>
  );
};
