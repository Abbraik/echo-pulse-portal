
import React from 'react';
import { motion } from 'framer-motion';
import { User, Globe, Sun, Moon, Bell } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DirectorHeaderProps {
  viewMode?: 'classic' | 'enhanced';
  onViewModeChange?: (mode: 'classic' | 'enhanced') => void;
  isLoading?: boolean;
}

const DirectorHeader: React.FC<DirectorHeaderProps> = ({
  viewMode = 'enhanced',
  onViewModeChange,
  isLoading = false
}) => {
  const { t, language, setLanguage, isRTL } = useTranslation();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [notifications] = React.useState(5);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white">System Dashboard</h1>
        {isLoading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-400"></div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {onViewModeChange && (
          <div className="flex bg-slate-800 rounded-lg p-1">
            <Button
              variant={viewMode === 'classic' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('classic')}
            >
              Classic
            </Button>
            <Button
              variant={viewMode === 'enhanced' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('enhanced')}
            >
              Enhanced
            </Button>
          </div>
        )}
        
        <Button variant="ghost" size="sm" onClick={toggleLanguage}>
          <Globe className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
          {notifications > 0 && (
            <Badge variant="destructive" className="ml-1 text-xs">
              {notifications}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DirectorHeader;
