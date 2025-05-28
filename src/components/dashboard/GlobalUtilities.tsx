
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Rocket, FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const GlobalUtilities: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [notifications] = React.useState(8);

  return (
    <motion.footer 
      className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-white/10 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <div className="container mx-auto">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Search Bar */}
          <div className="flex items-center space-x-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="System-wide search..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Center - Quick Launch Buttons */}
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
            >
              <Rocket size={14} className="mr-2" />
              New Redesign Sprint
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              <FileText size={14} className="mr-2" />
              Generate Meta-Design Blueprint
            </Button>
          </div>

          {/* Notifications Center */}
          <div className="flex items-center space-x-4">
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
            
            <div className="text-right">
              <div className="text-xs text-gray-400">
                THINK → ACT → MONITOR → LEARN → INNOVATE
              </div>
              <div className="text-xs text-gray-500">
                Population Dynamics System v2.4.1
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default GlobalUtilities;
