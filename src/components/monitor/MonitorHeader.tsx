
import React from 'react';
import { HelpCircle, Maximize2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const MonitorHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-20 relative">
      {/* Glass Header */}
      <div 
        className="w-full h-full px-8 flex items-center justify-between"
        style={{
          background: 'rgba(10,20,40,0.6)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.4)'
        }}
      >
        {/* Left Side - Title */}
        <div>
          <h1 
            className="font-noto-bold text-xl text-[#00FFC3]"
            style={{ 
              textShadow: '0 2px 4px rgba(0,0,0,0.6)',
              fontSize: '20px'
            }}
          >
            MONITOR ▮ : OPERATIONAL & STRATEGIC TRACKING
          </h1>
          <p 
            className="text-[#E0E0E0] mt-1"
            style={{ fontSize: '14px' }}
          >
            Real-time system health and performance insights
          </p>
        </div>
        
        {/* Right Side - Icons */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Help"
            className="w-8 h-8 flex items-center justify-center text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all duration-200"
          >
            <HelpCircle size={20} />
          </button>
          <button
            aria-label="Full Screen"
            className="w-8 h-8 flex items-center justify-center text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all duration-200"
            disabled
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonitorHeader;
