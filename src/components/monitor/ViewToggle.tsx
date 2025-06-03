
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
    <div className="flex gap-3">
      {views.map((view) => (
        <motion.button
          key={view.id}
          onClick={() => onViewChange(view.id as ViewMode)}
          className="transition-all duration-150"
          style={{
            fontFamily: 'Noto Sans',
            fontWeight: 600,
            fontSize: '14px',
            width: '140px',
            height: '32px',
            borderRadius: '999px',
            ...(activeView === view.id
              ? {
                  background: '#00FFC3',
                  color: '#081226',
                  boxShadow: '0 0 12px rgba(0, 255, 195, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)',
                }
              : {
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#E0E0E0',
                }),
          }}
          whileHover={
            activeView !== view.id
              ? { 
                  background: 'rgba(255, 255, 255, 0.10)',
                  transition: { duration: 0.15 }
                }
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
  );
};

export default ViewToggle;
