import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeliveryChains from '@/components/act/DeliveryChains';
import { DetailView } from '@/components/act/types/detail-view-types';

interface ActDeliverySectionProps {
  detailView: DetailView;
  selectedBundleId: string | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ActDeliverySection: React.FC<ActDeliverySectionProps> = ({
  detailView,
  selectedBundleId,
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <motion.div 
      id="delivery-chains"
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
      className={`mb-8 transition-all duration-300 ${isCollapsed ? 'mb-2' : ''}`}
    >
      <div 
        className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative"
        style={{
          background: 'rgba(20, 30, 50, 0.6)',
          boxShadow: 'inset 0 0 30px rgba(139, 69, 199, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/5 rounded-2xl"></div>
        
        {/* Collapse/Expand Header */}
        <div className="relative z-10 p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Delivery Chains Manager</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-white hover:bg-white/10"
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Expand
              </>
            ) : (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>

        {/* Collapsible Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative overflow-hidden"
            >
              <DeliveryChains 
                highlightBundle={detailView === 'launch-delivery' && selectedBundleId ? selectedBundleId : null}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ActDeliverySection;
