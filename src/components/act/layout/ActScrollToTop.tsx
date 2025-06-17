
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowUpCircle } from 'lucide-react';

interface ActScrollToTopProps {
  showScrollToTop: boolean;
  onScrollToTop: () => void;
}

const ActScrollToTop: React.FC<ActScrollToTopProps> = ({
  showScrollToTop,
  onScrollToTop
}) => {
  if (!showScrollToTop) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Button 
        variant="outline"
        size="icon" 
        className="fixed bottom-6 right-6 z-50 rounded-full h-12 w-12 backdrop-blur-[24px] border border-white/20 shadow-lg transition-all duration-300 hover:scale-110"
        style={{
          background: 'rgba(20, 184, 166, 0.8)',
          boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)'
        }}
        onClick={onScrollToTop}
      >
        <ArrowUpCircle className="h-6 w-6 text-white" />
      </Button>
    </motion.div>
  );
};

export default ActScrollToTop;
