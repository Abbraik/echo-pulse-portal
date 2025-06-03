
import React from 'react';
import { motion } from 'framer-motion';

type ViewMode = 'treemap' | 'heatmap' | 'radial' | 'tile';

interface ViewToggleProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ activeView, onViewChange }) => {
  const views = [
    { id: 'treemap', label: 'Treemap View' },
    { id: 'heatmap', label: 'Heatmap + Table View' },
    { id: 'radial', label: 'Radial Hub & Spokes' },
    { id: 'tile', label: 'Tile Dashboard' },
  ] as const;

  return (
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div 
        className="flex gap-2 p-2 rounded-2xl"
        style={{
          background: 'rgba(10, 20, 40, 0.5)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 195, 0.15)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
        }}
      >
        {views.map((view) => (
          <motion.button
            key={view.id}
            onClick={() => onViewChange(view.id as ViewMode)}
            className={`px-4 py-2 rounded-lg transition-all duration-150 ${
              activeView === view.id
                ? 'text-gray-900'
                : 'text-gray-300 hover:bg-white/10'
            }`}
            style={{
              fontFamily: 'Noto Sans',
              fontWeight: 600,
              fontSize: '14px',
              width: '120px',
              height: '32px',
              ...(activeView === view.id
                ? {
                    background: '#00FFC3',
                    color: '#081226',
                    boxShadow: '0 0 8px rgba(0, 255, 195, 0.6)',
                  }
                : {
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    color: '#E0E0E0',
                  }),
            }}
            whileHover={
              activeView !== view.id
                ? { backgroundColor: 'rgba(255, 255, 255, 0.10)' }
                : {}
            }
            whileTap={{ scale: 0.98 }}
            role="tab"
            aria-selected={activeView === view.id}
          >
            {view.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ViewToggle;
