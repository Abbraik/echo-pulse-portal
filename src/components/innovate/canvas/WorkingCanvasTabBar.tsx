
import React from 'react';
import { 
  Pencil, 
  Play, 
  Network, 
  Users, 
  FileText 
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

interface WorkingCanvasTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const WorkingCanvasTabBar: React.FC<WorkingCanvasTabBarProps> = ({
  activeTab,
  onTabChange
}) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'sketch', label: t('sketch'), icon: <Pencil size={18} /> },
    { id: 'simulation', label: t('simulation'), icon: <Play size={18} /> },
    { id: 'compare', label: t('compare'), icon: <Network size={18} /> },
    { id: 'co-create', label: t('coCreate'), icon: <Users size={18} /> },
    { id: 'blueprint', label: t('blueprint'), icon: <FileText size={18} /> }
  ];

  return (
    <div className="h-20 px-8 border-b border-teal-400/20 bg-black/10 relative">
      <div className="flex items-center justify-center h-full relative">
        <div className="flex items-center gap-1 relative">
          {/* Animated underline */}
          <motion.div
            className="absolute bottom-0 h-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"
            layoutId="activeTabUnderline"
            initial={false}
            animate={{
              left: `${tabs.findIndex(tab => tab.id === activeTab) * 20}%`,
              width: '20%'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          
          {tabs.map((tab, index) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Button
                size="lg"
                variant="ghost"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-2 px-8 py-4 h-16 rounded-xl transition-all duration-300 font-noto-medium relative ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-b from-teal-500/20 to-blue-500/20 text-teal-200 shadow-lg border border-teal-400/40' 
                    : 'hover:bg-white/10 hover:text-white text-gray-300 border border-transparent hover:border-white/20'
                }`}
              >
                <motion.div
                  animate={activeTab === tab.id ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {tab.icon}
                </motion.div>
                <span className="text-sm leading-tight">{tab.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
