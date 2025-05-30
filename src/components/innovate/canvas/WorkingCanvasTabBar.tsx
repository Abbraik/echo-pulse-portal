
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
    <div className="h-16 px-6 border-b border-teal-400/20 bg-black/10">
      <ScrollArea className="w-full h-full">
        <div className="flex items-center gap-2 min-w-max h-full">
          {tabs.map((tab, index) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 h-10 rounded-xl transition-all duration-300 font-noto-medium ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-teal-500/30 to-blue-500/30 text-teal-200 shadow-lg border border-teal-400/40 neon-border' 
                    : 'hover:bg-white/10 hover:text-white text-gray-300 border border-transparent hover:border-white/20'
                }`}
              >
                <motion.div
                  animate={activeTab === tab.id ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {tab.icon}
                </motion.div>
                <span className="hidden sm:inline text-sm">{tab.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
