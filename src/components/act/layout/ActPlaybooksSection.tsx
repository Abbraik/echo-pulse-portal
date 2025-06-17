
import React from 'react';
import { motion } from 'framer-motion';
import PlaybooksLibrary from '@/components/act/PlaybooksLibrary';

interface ActPlaybooksSectionProps {
  playbooksExpanded: boolean;
  onToggleExpanded: () => void;
}

const ActPlaybooksSection: React.FC<ActPlaybooksSectionProps> = ({
  playbooksExpanded,
  onToggleExpanded
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
    >
      <div 
        className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative"
        style={{
          background: 'rgba(20, 30, 50, 0.6)',
          boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/5 rounded-2xl"></div>
        <div className="relative">
          <PlaybooksLibrary 
            expanded={playbooksExpanded}
            onToggleExpanded={onToggleExpanded}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ActPlaybooksSection;
