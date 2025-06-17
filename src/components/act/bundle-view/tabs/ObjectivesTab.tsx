
import React from 'react';
import { motion } from 'framer-motion';
import { Info, Pencil, Plus } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/use-translation';
import { Bundle } from '../../types/act-types';

interface ObjectivesTabProps {
  bundle: Bundle;
}

const ObjectivesTab: React.FC<ObjectivesTabProps> = ({ bundle }) => {
  const { t } = useTranslation();

  return (
    <GlassCard className="h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">{t('objectives', { defaultValue: 'Objectives' })}</h3>
        <Button variant="ghost" size="sm">
          <Info className="h-4 w-4 mr-1" />
          {t('helpButton', { defaultValue: 'Help' })}
        </Button>
      </div>
      
      <div className="space-y-4">
        {bundle.objectives && bundle.objectives.length > 0 ? (
          bundle.objectives.map((objective, index) => (
            <motion.div 
              key={`obj-${index}`}
              className="p-4 border border-white/10 rounded-lg bg-white/5 flex items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-3 text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <Input 
                  value={objective} 
                  className="border-none bg-transparent focus-visible:ring-0 px-0 text-base"
                  readOnly
                />
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Pencil className="h-4 w-4" />
              </Button>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No objectives defined for this bundle</p>
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-dashed border-white/20 bg-white/5"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('addObjective', { defaultValue: 'Add Objective' })}
        </Button>
      </div>
    </GlassCard>
  );
};

export default ObjectivesTab;
