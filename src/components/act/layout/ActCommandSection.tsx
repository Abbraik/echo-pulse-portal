
import React from 'react';
import { motion } from 'framer-motion';
import CommandBar from '@/components/act/CommandBar';
import { DetailView } from '@/pages/Act';

interface ActCommandSectionProps {
  onAction: (action: DetailView) => void;
}

const ActCommandSection: React.FC<ActCommandSectionProps> = ({ onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      className="mb-8"
    >
      <div 
        className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative"
        style={{
          background: 'rgba(20, 30, 50, 0.6)',
          boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-2xl"></div>
        <div className="relative">
          <CommandBar onAction={onAction} />
        </div>
      </div>
    </motion.div>
  );
};

export default ActCommandSection;
