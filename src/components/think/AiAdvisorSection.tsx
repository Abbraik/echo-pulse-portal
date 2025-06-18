
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AiAdvisorChat from './AiAdvisorChat';

interface AiAdvisorSectionProps {
  showAiAdvisor: boolean;
  setShowAiAdvisor: (show: boolean) => void;
}

const AiAdvisorSection: React.FC<AiAdvisorSectionProps> = ({
  showAiAdvisor,
  setShowAiAdvisor
}) => {
  return (
    <>
      {/* AI Advisor Chat Button */}
      <motion.div 
        className="fixed left-6 bottom-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.4, type: "spring" }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => setShowAiAdvisor(!showAiAdvisor)} 
            className={`rounded-full p-4 backdrop-blur-[24px] border border-white/20 transition-all duration-300 ${
              showAiAdvisor 
                ? 'bg-red-500/80 hover:bg-red-600/80 shadow-lg shadow-red-500/25' 
                : 'bg-teal-500/80 hover:bg-teal-600/80 shadow-lg shadow-teal-500/25'
            }`}
          >
            <MessageSquare size={24} />
          </Button>
        </motion.div>
      </motion.div>
      
      {/* AI Advisor Chat Panel */}
      {showAiAdvisor && <AiAdvisorChat onClose={() => setShowAiAdvisor(false)} />}
    </>
  );
};

export default AiAdvisorSection;
