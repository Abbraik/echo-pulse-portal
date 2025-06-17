
import React from 'react';
import { motion } from 'framer-motion';
import DeliveryChains from '@/components/act/DeliveryChains';
import { DetailView } from '@/pages/Act';

interface ActDeliverySectionProps {
  detailView: DetailView;
  selectedBundleId: string | null;
}

const ActDeliverySection: React.FC<ActDeliverySectionProps> = ({
  detailView,
  selectedBundleId
}) => {
  return (
    <motion.div 
      id="delivery-chains"
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
      className="mb-8"
    >
      <div 
        className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative"
        style={{
          background: 'rgba(20, 30, 50, 0.6)',
          boxShadow: 'inset 0 0 30px rgba(139, 69, 199, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/5 rounded-2xl"></div>
        <div className="relative">
          <DeliveryChains 
            highlightBundle={detailView === 'launch-delivery' && selectedBundleId ? selectedBundleId : null}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ActDeliverySection;
