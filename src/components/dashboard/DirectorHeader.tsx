
import React from 'react';
import { motion } from 'framer-motion';
import { User, Globe, Sun, Moon, Bell } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const DirectorHeader: React.FC = () => {
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
    <motion.header 
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Left: Loop Ribbon */}
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className="glass-panel px-4 py-2 rounded-full border border-white/20">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} space-x-4 ${isRTL ? 'space-x-reverse' : ''} text-sm font-medium`}>
                <span className="text-teal-400">THINK</span>
                <span className="text-gray-400">▶</span>
                <span className="text-blue-400">ACT</span>
                <span className="text-gray-400">▶</span>
                <span className="text-purple-400">MONITOR</span>
                <span className="text-gray-400">▶</span>
                <span className="text-orange-400">LEARN</span>
                <span className="text-gray-400">▶</span>
                <span className="text-green-400">INNOVATE</span>
              </div>
            </div>
          </div>

          {/* Center: Role Banner */}
          <div className="flex items-center space-x-3">
            <div className="text-center">
              <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                {t('welcome')}, Director General
              </h1>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {t('populationDynamicsSystem')}
              </p>
            </div>
          </div>

          {/* Right: User Controls */}
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="rounded-full hover:bg-white/5 relative"
            >
              <Globe size={18} className="text-gray-400" />
              <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {language === 'en' ? 'AR' : 'EN'}
              </span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-white/5"
            >
              {resolvedTheme === 'dark' ? (
                <Moon size={18} className="text-gray-300" />
              ) : (
                <Sun size={18} className="text-gray-600" />
              )}
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/5"
              >
                <Bell size={18} className="text-gray-400" />
              </Button>
              {notifications > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-gradient-to-r from-teal-500 to-blue-600 text-white border-0"
                >
                  {notifications > 9 ? '9+' : notifications}
                </Badge>
              )}
            </div>

            {/* User Avatar & Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full hover:bg-white/5 p-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-500/30 to-blue-500/30 flex items-center justify-center">
                    <User size={16} className="text-gray-300" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-panel-dark w-56 mt-2">
                <DropdownMenuItem className="cursor-pointer hover:bg-white/5">
                  {t('profile')}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-white/5">
                  {t('settings')}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400 cursor-pointer hover:bg-white/5">
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default DirectorHeader;
