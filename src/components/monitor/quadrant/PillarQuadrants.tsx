
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PillarOverviewDrawer } from './PillarOverviewDrawer';

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

export const PillarQuadrants: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<PillarData | null>(null);

  const pillars = [
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
      name: 'Products & Services',
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

  return (
    <>
      {pillars.map((pillar, index) => (
        <motion.div
          key={pillar.name}
          className="absolute cursor-pointer"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${pillar.angle}deg) translateY(-200px) rotate(-${pillar.angle}deg)`,
            zIndex: 5
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setSelectedPillar(pillar)}
        >
          <div 
            className="px-4 py-2 rounded-lg backdrop-blur-[24px] border border-white/20 text-center"
            style={{
              background: `${pillar.gradient.replace('100%', '20%')}`,
              boxShadow: '0 0 15px rgba(20, 184, 166, 0.1)'
            }}
          >
            <div className="text-sm font-bold text-teal-400">{pillar.name}</div>
          </div>
        </motion.div>
      ))}

      <PillarOverviewDrawer
        pillar={selectedPillar}
        isOpen={selectedPillar !== null}
        onClose={() => setSelectedPillar(null)}
      />
    </>
  );
};
