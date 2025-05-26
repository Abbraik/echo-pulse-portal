
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
    <div className="h-12 px-6 border-b border-white/10">
      <ScrollArea className="w-full">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              size="sm"
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-teal-500/20 text-teal-300 shadow-lg shadow-teal-500/10 border-b-2 border-teal-400' 
                  : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline text-sm">{tab.label}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
