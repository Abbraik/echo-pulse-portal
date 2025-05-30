
import React from 'react';
import { 
  Pencil, 
  Play, 
  BarChart3, 
  FileText, 
  Network, 
  Users, 
  Dice6, 
  Zap, 
  Route 
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
    { id: 'sketch', label: t('sketch'), icon: <Pencil size={16} /> },
    { id: 'simulate', label: t('simulate'), icon: <Play size={16} /> },
    { id: 'results', label: t('results'), icon: <BarChart3 size={16} /> },
    { id: 'blueprint', label: t('blueprint'), icon: <FileText size={16} /> },
    { id: 'compare', label: t('compare'), icon: <Network size={16} /> },
    { id: 'co-create', label: t('coCreate'), icon: <Users size={16} /> },
    { id: 'ensemble', label: t('ensemble'), icon: <Dice6 size={16} /> },
    { id: 'breakpoints', label: t('breakpoints'), icon: <Zap size={16} /> },
    { id: 'pathways', label: t('pathways'), icon: <Route size={16} /> }
  ];

  return (
    <div className="h-14 px-6 relative">
      <ScrollArea className="w-full">
        <div className="flex items-center gap-1 min-w-max py-2">
          {tabs.map((tab, index) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'text-teal-300 shadow-lg' 
                    : 'hover:bg-white/10 hover:text-white text-gray-400'
                }`}
                style={{
                  fontFamily: 'Noto Sans',
                  fontWeight: activeTab === tab.id ? 'bold' : 'medium'
                }}
              >
                {/* Icon with jiggle animation on activation */}
                <motion.div
                  animate={activeTab === tab.id ? {
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {tab.icon}
                </motion.div>
                
                <span className="hidden sm:inline text-sm">{tab.label}</span>
                
                {/* Active tab underline with morph animation */}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full"
                    layoutId="activeTabUnderline"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* Active tab glow */}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'rgba(20, 184, 166, 0.1)',
                      boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.2)'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {/* Section divider */}
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent"
      />
    </div>
  );
};
