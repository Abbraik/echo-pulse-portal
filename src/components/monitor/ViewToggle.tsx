
import React from 'react';
import { motion } from 'framer-motion';

interface ViewToggleProps {
  activeView: 'treemap' | 'heatmap';
  onViewChange: (view: 'treemap' | 'heatmap') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ activeView, onViewChange }) => {
  return (
    <div 
      className="w-full h-12 flex items-center px-6 gap-4"
      style={{
        background: 'rgba(10,20,40,0.5)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1rem',
        border: '1px solid rgba(0,255,195,0.15)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
      }}
    >
      <button
        role="tab"
        aria-selected={activeView === 'treemap'}
        onClick={() => onViewChange('treemap')}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
          activeView === 'treemap'
            ? 'bg-[#00FFC3] text-[#081226] shadow-[0_0_8px_rgba(0,255,195,0.6)]'
            : 'bg-transparent border border-[rgba(255,255,255,0.10)] text-[#E0E0E0] hover:bg-[rgba(255,255,255,0.10)]'
        }`}
        style={{ width: '120px', height: '32px' }}
      >
        Treemap View
      </button>
      
      <button
        role="tab"
        aria-selected={activeView === 'heatmap'}
        onClick={() => onViewChange('heatmap')}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
          activeView === 'heatmap'
            ? 'bg-[#00FFC3] text-[#081226] shadow-[0_0_8px_rgba(0,255,195,0.6)]'
            : 'bg-transparent border border-[rgba(255,255,255,0.10)] text-[#E0E0E0] hover:bg-[rgba(255,255,255,0.10)]'
        }`}
        style={{ width: '120px', height: '32px' }}
      >
        Heatmap + Table View
      </button>
    </div>
  );
};

export default ViewToggle;
