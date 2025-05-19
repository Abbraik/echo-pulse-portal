
import React, { useEffect, useState } from 'react';
import { X, Play, Plus, Bell } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface RecommendationPopupProps {
  recommendation: {
    id: string;
    message: string;
    type?: 'info' | 'warning' | 'success';
  } | null;
  onDismiss: () => void;
  onApplyPlaybook: () => void;
  onCreateBundle: () => void;
}

export const RecommendationPopup: React.FC<RecommendationPopupProps> = ({
  recommendation,
  onDismiss,
  onApplyPlaybook,
  onCreateBundle
}) => {
  const { t, isRTL } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!recommendation || hovered) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Allow animation to complete
    }, 8000);

    return () => clearTimeout(timer);
  }, [recommendation, hovered, onDismiss]);

  if (!recommendation) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed bottom-4 ${isRTL ? 'left-4' : 'right-4'} z-50`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className={`glass-panel-deep w-80 p-4 shadow-lg ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-teal-400 mr-2" />
                <h3 className="text-sm font-medium">{t('recommendation')}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onDismiss, 300);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <p className="text-sm mb-4">{recommendation.message}</p>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={onApplyPlaybook}
              >
                <Play className="mr-1 h-3 w-3" /> {t('applyPlaybook')}
              </Button>
              <Button
                size="sm"
                className="text-xs"
                onClick={onCreateBundle}
              >
                <Plus className="mr-1 h-3 w-3" /> {t('newBundle')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
