
import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import SystemFramingStudio from './SystemFramingStudio';
import { SNAData } from './types/sna-types';
import { adaptSNADataToSystemFraming } from './utils/sna-adapter';

interface SystemFramingSectionProps {
  mockSnaData: SNAData;
  mockCldData: any;
}

const SystemFramingSection: React.FC<SystemFramingSectionProps> = ({ 
  mockSnaData, 
  mockCldData 
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      className="mb-8"
    >
      <div 
        className="rounded-2xl p-8 backdrop-blur-[24px] border border-white/20 overflow-hidden relative"
        style={{
          background: 'rgba(20, 30, 50, 0.6)',
          boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-2xl"></div>
        <div className="relative">
          <motion.h2 
            className="text-2xl font-bold mb-6 text-left flex items-center text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500"
            style={{ letterSpacing: '0.05em' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Layout className="mr-3 text-teal-400" size={24} />
            {t("systemFramingStudio").toUpperCase()}
          </motion.h2>
          <SystemFramingStudio 
            cldData={mockCldData} 
            snaData={adaptSNADataToSystemFraming(mockSnaData)} 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SystemFramingSection;
