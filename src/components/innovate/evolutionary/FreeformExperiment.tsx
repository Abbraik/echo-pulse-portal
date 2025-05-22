
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const FreeformExperiment: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-500/20 to-blue-500/20 flex items-center justify-center cursor-pointer mb-4 border border-teal-500/30"
      >
        <Plus className="w-10 h-10 text-teal-400" />
      </motion.div>
      <h3 className="text-xl font-medium mb-2">{t('newBlankStart')}</h3>
      <p className="text-sm text-gray-400 text-center max-w-xs">
        {t('beginAdHocPolicy')}
      </p>
      <Button className="mt-4 bg-gradient-to-r from-teal-500 to-blue-500">
        {t('startNewExperiment')}
      </Button>
    </div>
  );
};
