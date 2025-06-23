
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import AiAdvisorSection from './AiAdvisorSection';
import { ThinkPageState } from './hooks/useThinkPageState';

interface ThinkPageLayoutProps {
  children: React.ReactNode;
  pageState: ThinkPageState;
  onToggleAiAdvisor: () => void;
}

const ThinkPageLayout: React.FC<ThinkPageLayoutProps> = ({
  children,
  pageState,
  onToggleAiAdvisor
}) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <motion.div 
        className="max-w-7xl mx-auto space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {t('thinkZone', { defaultValue: 'Think Zone' })}
              </h1>
              <p className="text-gray-400 mt-2">
                {t('thinkZoneDescription', { defaultValue: 'Strategic thinking and scenario planning workspace' })}
              </p>
            </div>
          </div>
          
          {children}
        </GlassCard>
      </motion.div>

      <AiAdvisorSection
        showAiAdvisor={pageState.showAiAdvisor}
        setShowAiAdvisor={onToggleAiAdvisor}
      />
    </div>
  );
};

export default ThinkPageLayout;
