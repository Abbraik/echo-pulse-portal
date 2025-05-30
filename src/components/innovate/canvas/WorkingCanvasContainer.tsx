
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { WorkingCanvasHeader } from './WorkingCanvasHeader';
import { WorkingCanvasTabBar } from './WorkingCanvasTabBar';
import { WorkingCanvasContent } from './WorkingCanvasContent';
import { LeveragePointSidebar } from '../enhanced/LeveragePointSidebar';

interface ConceptBlock {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
  type: string;
}

interface ScenarioForkData {
  id: string;
  name: string;
  active: boolean;
}

interface WorkingCanvasContainerProps {
  selectedItem: ConceptBlock | ScenarioForkData | null;
  onClose: () => void;
}

export const WorkingCanvasContainer: React.FC<WorkingCanvasContainerProps> = ({ 
  selectedItem, 
  onClose 
}) => {
  const { t, isRTL } = useTranslation();
  const [activeTab, setActiveTab] = useState('sketch');
  const [leverageSidebarOpen, setLeverageSidebarOpen] = useState(false);

  const getItemType = (item: ConceptBlock | ScenarioForkData | null): string => {
    if (!item) return 'Unknown';
    if ('type' in item) return item.type;
    return 'Fork';
  };

  const getItemName = (item: ConceptBlock | ScenarioForkData | null): string => {
    if (!item) return 'System Redesign';
    return item.name;
  };

  return (
    <AnimatePresence>
      {selectedItem && (
        <motion.div
          className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} w-[70vw] h-screen z-50`}
          initial={{ x: isRTL ? '-100%' : '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: isRTL ? '-100%' : '100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <motion.div 
            className="w-full h-full rounded-l-2xl flex flex-col relative overflow-hidden"
            style={{
              background: 'rgba(20, 30, 50, 0.6)',
              backdropFilter: 'blur(24px)',
              boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            initial={{ scale: 0.97 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {/* Ambient glow effect */}
            <motion.div 
              className="absolute inset-0 rounded-l-2xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.1), transparent 50%)',
                filter: 'blur(20px)'
              }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <WorkingCanvasHeader
                itemName={getItemName(selectedItem)}
                itemType={getItemType(selectedItem)}
                activeTab={activeTab}
                onClose={onClose}
              />
            </motion.div>

            {/* Tab Bar with enhanced styling */}
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="border-b border-white/10"
              style={{
                background: 'linear-gradient(90deg, rgba(20, 184, 166, 0.05), rgba(37, 99, 235, 0.05))'
              }}
            >
              <WorkingCanvasTabBar
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </motion.div>

            {/* Content Area with responsive grid */}
            <div className="flex-1 relative overflow-hidden">
              <motion.div 
                className="h-full"
                style={{
                  maxWidth: '960px',
                  margin: '0 auto',
                  padding: '24px'
                }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                {/* Responsive 12-column CSS Grid */}
                <div 
                  className="h-full"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: '16px',
                    gridTemplateRows: 'auto 1fr'
                  }}
                >
                  <motion.div 
                    className="col-span-12"
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <WorkingCanvasContent
                      activeTab={activeTab}
                      selectedItem={selectedItem}
                      onLeverageSidebarToggle={() => setLeverageSidebarOpen(!leverageSidebarOpen)}
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Leverage Point Sidebar with enhanced animations */}
              <AnimatePresence>
                {leverageSidebarOpen && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setLeverageSidebarOpen(false)}
                    />
                    
                    {/* Sidebar */}
                    <motion.div
                      className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} h-full z-10`}
                      initial={{ x: isRTL ? '-100%' : '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: isRTL ? '-100%' : '100%' }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <LeveragePointSidebar
                        onClose={() => setLeverageSidebarOpen(false)}
                        viewMode="cld"
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Scroll progress indicator */}
              <motion.div 
                className="absolute top-0 right-2 w-1 bg-white/10 rounded-full"
                style={{ height: '100%' }}
              >
                <motion.div 
                  className="w-full bg-gradient-to-b from-teal-400 to-blue-500 rounded-full"
                  style={{ height: '20%' }}
                  animate={{ y: ['0%', '80%', '0%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
            </div>

            {/* Premium border animation */}
            <motion.div 
              className="absolute inset-0 rounded-l-2xl pointer-events-none"
              style={{
                background: 'linear-gradient(45deg, rgba(20, 184, 166, 0.2), rgba(37, 99, 235, 0.2), rgba(20, 184, 166, 0.2))',
                backgroundSize: '300% 300%',
                mask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)',
                maskComposite: 'xor',
                padding: '2px'
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
