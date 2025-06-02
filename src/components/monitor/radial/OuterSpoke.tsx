
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock, Users, Activity, AlertTriangle, Target } from 'lucide-react';
import { ClaimsModal } from '../ClaimsModal';
import { HandoffDrawer } from '../HandoffDrawer';
import { EntropyModal } from '../EntropyModal';

interface OuterSpokeProps {
  type: string;
  index: number;
}

export const OuterSpoke: React.FC<OuterSpokeProps> = ({ type, index }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  // Mock data for different spoke types
  const spokeData = {
    claims: { open: 12, oldest: 5 },
    handoff: { count: 4, avg: 2 },
    'entropy-think': { value: 0.24, trend: 'up' },
    'entropy-act': { value: 0.30, trend: 'down' },
    alerts: { critical: 3, warning: 5, info: 10 },
    risk: { likelihood: 0.7, impact: 0.8 }
  };

  const handleClick = () => {
    if (type === 'handoff') {
      setShowDrawer(true);
    } else {
      setShowModal(true);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'claims': return <Clock size={16} className="text-teal-400" />;
      case 'handoff': return <Users size={16} className="text-blue-400" />;
      case 'entropy-think':
      case 'entropy-act': return <Activity size={16} className="text-amber-400" />;
      case 'alerts': return <AlertTriangle size={16} className="text-red-400" />;
      case 'risk': return <Target size={16} className="text-orange-400" />;
      default: return null;
    }
  };

  const renderContent = () => {
    const data = spokeData[type as keyof typeof spokeData];
    
    switch (type) {
      case 'claims':
        return (
          <div className="text-center">
            <div className="text-lg font-bold text-teal-400 mb-1">12</div>
            <div className="text-xs text-gray-400">Open Claims</div>
            <div className="text-xs text-gray-500">Oldest: 5d</div>
          </div>
        );
      
      case 'handoff':
        return (
          <div className="text-center">
            <div className="text-sm font-bold text-blue-400 mb-1">Think→Act</div>
            <div className="text-lg font-bold text-white">4</div>
            <div className="w-12 h-1 bg-blue-500/30 rounded mx-auto mt-1">
              <div className="w-3/4 h-full bg-blue-500 rounded"></div>
            </div>
          </div>
        );
      
      case 'entropy-think':
      case 'entropy-act':
        const zone = type.split('-')[1];
        const entropyData = spokeData[type as keyof typeof spokeData] as { value: number; trend: string };
        return (
          <div className="text-center">
            <div className="text-sm font-bold text-gray-300 mb-1">{zone.toUpperCase()}</div>
            <div className="text-lg font-bold text-amber-400">{entropyData.value}</div>
            <div className="text-xs text-gray-400">
              {entropyData.trend === 'up' ? '↑' : entropyData.trend === 'down' ? '↓' : '→'}
            </div>
          </div>
        );
      
      case 'alerts':
        return (
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Alerts</div>
            <div className="text-sm">
              <span className="text-red-400">3🔴</span> <span className="text-amber-400">5🟠</span> <span className="text-green-400">10🟢</span>
            </div>
          </div>
        );
      
      case 'risk':
        return (
          <div className="relative h-full">
            <div className="grid grid-cols-2 gap-1 h-12">
              <div className="bg-green-500/20 rounded"></div>
              <div className="bg-amber-500/20 rounded"></div>
              <div className="bg-orange-500/20 rounded"></div>
              <div className="bg-red-500/20 rounded relative">
                <div className="absolute top-1 right-1 w-2 h-2 bg-teal-400 rounded-full"></div>
              </div>
            </div>
            <div className="text-xs text-gray-400 text-center mt-1">Risk Matrix</div>
          </div>
        );
      
      default:
        return <div className="text-center text-white">Unknown</div>;
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="w-24 h-24 rounded-2xl backdrop-blur-[24px] border border-white/20 p-2 cursor-pointer flex flex-col items-center justify-center"
            style={{
              background: 'rgba(10, 20, 40, 0.6)',
              boxShadow: 'inset 0 0 15px rgba(20, 184, 166, 0.1), 0 6px 12px rgba(0, 0, 0, 0.3)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2 + index * 0.1, duration: 0.4, type: "spring" }}
            whileHover={{ 
              y: -4, 
              boxShadow: '0 0 25px rgba(20, 184, 166, 0.4), inset 0 0 15px rgba(20, 184, 166, 0.2)'
            }}
            onClick={handleClick}
          >
            <div className="mb-1">{getIcon()}</div>
            {renderContent()}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{type === 'claims' ? 'Claims distribution: Think 3, Act 4, Learn 2, Innovate 3' : 
             type === 'handoff' ? 'Item #17: pending since 05-28; Item #21: pending 05-29' : 
             type.includes('entropy') ? `${type.split('-')[1]} Entropy: trending ${spokeData[type as keyof typeof spokeData].trend}` : 
             type === 'alerts' ? '3 Critical, 5 Warning, 10 Info' : 
             'Population Surge: likelihood 0.7, impact 0.8'}</p>
        </TooltipContent>
      </Tooltip>

      <ClaimsModal
        isOpen={showModal && type === 'claims'}
        onClose={() => setShowModal(false)}
        data={spokeData.claims}
      />

      <HandoffDrawer
        isOpen={showDrawer && type === 'handoff'}
        onClose={() => setShowDrawer(false)}
        data={[{ from: 'Think', to: 'Act', count: 4, avgDays: 2 }]}
      />

      <EntropyModal
        isOpen={showModal && type.includes('entropy')}
        onClose={() => setShowModal(false)}
        data={{
          Think: { value: 0.24, trend: 'up' as const },
          Act: { value: 0.30, trend: 'down' as const },
          Monitor: { value: 0.27, trend: 'stable' as const },
          Learn: { value: 0.18, trend: 'up' as const },
          Innovate: { value: 0.22, trend: 'down' as const }
        }}
      />
    </>
  );
};
