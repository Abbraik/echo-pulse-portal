
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { CirclePlus, Box, ArrowRight, Variable } from 'lucide-react';
import { motion } from 'framer-motion';

export const ModelCanvas: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="relative h-full border border-dashed border-gray-700/30 rounded-lg flex flex-col">
      <div className="absolute top-2 left-2 flex gap-2">
        <Button size="sm" variant="outline" className="h-8 gap-1 bg-background/50 backdrop-blur-sm">
          <Box className="w-4 h-4" />
          <span>{t('addStock')}</span>
        </Button>
        <Button size="sm" variant="outline" className="h-8 gap-1 bg-background/50 backdrop-blur-sm">
          <ArrowRight className="w-4 h-4" />
          <span>{t('addFlow')}</span>
        </Button>
        <Button size="sm" variant="outline" className="h-8 gap-1 bg-background/50 backdrop-blur-sm">
          <Variable className="w-4 h-4" />
          <span>{t('addVariable')}</span>
        </Button>
      </div>
      
      <div className="flex items-center justify-center h-full text-gray-400">
        <motion.div 
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-center"
        >
          <CirclePlus className="w-8 h-8 mx-auto mb-2" />
          <p>{t('dragElementsToCreateModel')}</p>
        </motion.div>
      </div>
    </div>
  );
};
