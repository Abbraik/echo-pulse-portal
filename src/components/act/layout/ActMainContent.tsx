
import React from 'react';
import { motion } from 'framer-motion';
import BundlesRail from '@/components/act/BundlesRail';
import DetailCanvas from '@/components/act/DetailCanvas';
import { Bundle } from '@/components/act/types/act-types';
import { DetailView } from '@/pages/Act';

interface ActMainContentProps {
  selectedBundle: Bundle | null;
  onBundleSelect: (bundle: Bundle | null) => void;
  detailView: DetailView;
  isDeliveryCollapsed: boolean;
}

const ActMainContent: React.FC<ActMainContentProps> = ({
  selectedBundle,
  onBundleSelect,
  detailView,
  isDeliveryCollapsed
}) => {
  // Calculate height based on delivery section state
  const contentHeight = isDeliveryCollapsed ? 'h-[calc(100vh-12rem)]' : 'h-[600px]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className={`flex flex-col lg:flex-row gap-6 mb-8 transition-all duration-300 ${contentHeight}`}
    >
      {/* Bundles Rail (Sidebar) */}
      <motion.div 
        className="w-full lg:w-1/5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div 
          className={`rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative ${contentHeight}`}
          style={{
            background: 'rgba(20, 30, 50, 0.6)',
            boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
          <div className="relative h-full">
            <BundlesRail 
              selectedBundle={selectedBundle} 
              onBundleSelect={onBundleSelect}
            />
          </div>
        </div>
      </motion.div>
      
      {/* Detail Canvas (Main content) */}
      <motion.div 
        className="w-full lg:w-4/5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div 
          className={`rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative ${contentHeight}`}
          style={{
            background: 'rgba(20, 30, 50, 0.6)',
            boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-2xl"></div>
          <div className="relative h-full">
            <DetailCanvas 
              view={detailView} 
              selectedBundle={selectedBundle ? selectedBundle.id : null}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActMainContent;
