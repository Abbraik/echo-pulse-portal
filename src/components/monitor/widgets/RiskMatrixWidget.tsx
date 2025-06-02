
import React from 'react';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RiskMatrixWidgetProps {
  onFullscreen: () => void;
  isFullscreen: boolean;
  onClose: () => void;
}

const RiskMatrixWidget: React.FC<RiskMatrixWidgetProps> = ({
  onFullscreen,
  isFullscreen,
  onClose
}) => {
  const risks = [
    { name: 'Loop Drift', likelihood: 0.3, impact: 0.6, quadrant: 'TR' },
    { name: 'Extraction Over-Quota', likelihood: 0.5, impact: 0.4, quadrant: 'BL' },
    { name: 'Population Surge', likelihood: 0.7, impact: 0.8, quadrant: 'BR' }
  ];

  const quadrantColors = {
    TL: 'bg-green-500/20',
    TR: 'bg-yellow-500/20',
    BL: 'bg-orange-500/20',
    BR: 'bg-red-500/20'
  };

  if (isFullscreen) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-400">Risk Matrix Analysis</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-96 h-96">
            {/* Matrix Grid */}
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-1">
              <div className={`${quadrantColors.TL} border border-green-500/30 rounded-lg flex items-center justify-center`}>
                <span className="text-sm text-gray-300">Low Risk</span>
              </div>
              <div className={`${quadrantColors.TR} border border-yellow-500/30 rounded-lg flex items-center justify-center relative`}>
                <span className="text-sm text-gray-300">Medium Risk</span>
                <div 
                  className="absolute w-3 h-3 bg-yellow-400 rounded-full cursor-move"
                  style={{ left: '30%', top: '60%' }}
                  draggable
                  title="Loop Drift"
                />
              </div>
              <div className={`${quadrantColors.BL} border border-orange-500/30 rounded-lg flex items-center justify-center relative`}>
                <span className="text-sm text-gray-300">Medium Risk</span>
                <div 
                  className="absolute w-3 h-3 bg-orange-400 rounded-full cursor-move"
                  style={{ left: '50%', top: '40%' }}
                  draggable
                  title="Extraction Over-Quota"
                />
              </div>
              <div className={`${quadrantColors.BR} border border-red-500/30 rounded-lg flex items-center justify-center relative`}>
                <span className="text-sm text-gray-300">High Risk</span>
                <div 
                  className="absolute w-3 h-3 bg-red-400 rounded-full cursor-move"
                  style={{ left: '70%', top: '80%' }}
                  draggable
                  title="Population Surge"
                />
              </div>
            </div>
            
            {/* Axis Labels */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-400">
              Impact →
            </div>
            <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm text-gray-400">
              Likelihood →
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-white">Risk Items</h3>
          {risks.map((risk, index) => (
            <div key={index} className="bg-black/20 rounded-lg p-3 flex justify-between items-center">
              <span className="text-white">{risk.name}</span>
              <div className="flex space-x-4 text-sm">
                <span className="text-gray-400">L: {risk.likelihood}</span>
                <span className="text-gray-400">I: {risk.impact}</span>
              </div>
            </div>
          ))}
          
          <div className="flex justify-center mt-6">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Reassess Risk ▶
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Risk Matrix</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullscreen}
          className="text-gray-400 hover:text-white"
        >
          <Maximize2 size={14} />
        </Button>
      </div>
      
      <div className="flex-1 flex justify-center items-center">
        <div className="relative w-24 h-24">
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5">
            <div className={`${quadrantColors.TL} border border-green-500/30 rounded-sm`}></div>
            <div className={`${quadrantColors.TR} border border-yellow-500/30 rounded-sm relative`}>
              <div className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full top-1/2 left-1/3" />
            </div>
            <div className={`${quadrantColors.BL} border border-orange-500/30 rounded-sm relative`}>
              <div className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full top-1/3 left-1/2" />
            </div>
            <div className={`${quadrantColors.BR} border border-red-500/30 rounded-sm relative`}>
              <div className="absolute w-1.5 h-1.5 bg-red-400 rounded-full bottom-1/4 right-1/4" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 text-center">
        3 risks plotted
      </div>
    </div>
  );
};

export default RiskMatrixWidget;
