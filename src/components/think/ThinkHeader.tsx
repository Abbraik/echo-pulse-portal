
import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface ThinkHeaderProps {
  hideHeader: boolean;
}

const ThinkHeader: React.FC<ThinkHeaderProps> = ({ hideHeader }) => {
  const { t } = useTranslation();

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full backdrop-blur-[24px] py-4 px-6 mb-8"
      style={{
        background: 'rgba(20, 30, 50, 0.6)',
        borderBottom: '1px solid rgba(20, 184, 166, 0.3)',
        boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hideHeader ? -100 : 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="p-3 rounded-2xl bg-teal-500/20 text-teal-400"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain size={28} />
          </motion.div>
          <div className="text-left">
            <motion.h1 
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500"
              style={{ letterSpacing: '0.05em' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              THINK 🔍: {t("strategyZone").toUpperCase()}
            </motion.h1>
            <motion.p 
              className="text-base text-gray-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {t("thinkCoreDesc")}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default ThinkHeader;
