
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface RecommendationPopupProps {
  recommendation: any;
  onDismiss: () => void;
  onApplyPlaybook?: (id: string) => void; 
  onCreateBundle?: (id: string) => void;
}

export const RecommendationPopup: React.FC<RecommendationPopupProps> = ({
  recommendation,
  onDismiss,
  onApplyPlaybook = () => {}, // Default empty function
  onCreateBundle = () => {}   // Default empty function
}) => {
  if (!recommendation) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-20 right-4 z-50 max-w-sm"
      >
        <div className="glass-panel-deep p-4 shadow-xl">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <Sparkles className="mr-2 text-amber-400" size={18} />
              <h4 className="font-medium">AI Recommendation</h4>
            </div>
            <Button variant="ghost" size="sm" onClick={onDismiss} className="h-6 w-6 p-0">
              <X size={14} />
            </Button>
          </div>
          
          <p className="text-sm mb-4">{recommendation.message}</p>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => onDismiss()}
            >
              Dismiss
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="text-xs bg-gradient-to-r from-teal-500 to-blue-500"
              onClick={() => onApplyPlaybook(recommendation.id)}
            >
              Analyze
              <ArrowRight size={12} className="ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
