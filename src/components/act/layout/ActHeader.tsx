
import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface ActHeaderProps {
  hideHeader: boolean;
}

const ActHeader: React.FC<ActHeaderProps> = ({ hideHeader }) => {
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
            className="p-3 rounded-2xl bg-blue-500/20 text-blue-400"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Settings size={28} />
          </motion.div>
          <div className="text-left">
            <motion.h1 
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-500 font-noto-bold"
              style={{ letterSpacing: '0.05em' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              ACT ⚙️: {t("strategyAndDelivery", { defaultValue: "STRATEGY & DELIVERY" })}
            </motion.h1>
            <motion.p 
              className="text-base text-gray-300 font-noto-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {t("actCoreDesc", { defaultValue: "Transform insights into coordinated delivery" })}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default ActHeader;
