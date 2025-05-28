
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
    </motion.header>
  );
};

export default DirectorHeader;
