
import React from 'react';
import { FileText, Target, MapPin, Settings, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CanvasTabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const CanvasTabNavigation: React.FC<CanvasTabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'objectives', label: 'Objectives', icon: Target },
    { id: 'geography', label: 'Geography', icon: MapPin },
    { id: 'leverage', label: 'Leverage Points', icon: Settings },
    { id: 'stakeholders', label: 'Stakeholders', icon: Users },
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
  ];

  return (
    <div className="px-6 py-4 border-b border-white/10 flex-shrink-0">
      <div className="flex space-x-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CanvasTabNavigation;
