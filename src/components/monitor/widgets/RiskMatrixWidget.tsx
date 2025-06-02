
import React from 'react';
import { Shield } from 'lucide-react';

interface RiskMatrixWidgetProps {
  isFullscreen?: boolean;
  isHovered?: boolean;
}

const RiskMatrixWidget: React.FC<RiskMatrixWidgetProps> = ({ 
  isFullscreen, 
  isHovered 
}) => {
  const risks = [
    { name: 'Loop Drift', likelihood: 0.3, impact: 0.6, quadrant: 'tr' },
    { name: 'Extraction Over-Quota', likelihood: 0.5, impact: 0.4, quadrant: 'bl' },
    { name: 'Population Surge', likelihood: 0.7, impact: 0.8, quadrant: 'br' }
  ];

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'tl': return 'bg-green-500/40';
      case 'tr': return 'bg-amber-500/40';
      case 'bl': return 'bg-orange-500/40';
      case 'br': return 'bg-red-500/40';
      default: return 'bg-gray-500/40';
    }
  };

  return (
    <div className="h-full w-full p-3">
      <div className="flex items-center mb-3">
        <Shield className="h-4 w-4 text-orange-400 mr-2" />
        <h4 className="text-sm font-medium text-white">Risk Matrix</h4>
      </div>

      <div className="relative">
        {/* 2x2 Risk Matrix Grid */}
        <div className="grid grid-cols-2 gap-1 h-16 w-16 mx-auto mb-2">
          <div className={`${getQuadrantColor('tl')} border border-white/20 relative`}>
            {/* Top-left quadrant (low likelihood, high impact) */}
          </div>
          <div className={`${getQuadrantColor('tr')} border border-white/20 relative`}>
            {/* Top-right quadrant (high likelihood, high impact) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full" title="Loop Drift" />
            </div>
          </div>
          <div className={`${getQuadrantColor('bl')} border border-white/20 relative`}>
            {/* Bottom-left quadrant (low likelihood, low impact) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full" title="Extraction Over-Quota" />
            </div>
          </div>
          <div className={`${getQuadrantColor('br')} border border-white/20 relative`}>
            {/* Bottom-right quadrant (high likelihood, low impact) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full" title="Population Surge" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-gray-400">{risks.length} Risk Factors</div>
        </div>
      </div>

      {isFullscreen && (
        <div className="mt-8 w-full">
          <h4 className="text-xl font-semibold text-white mb-4">Risk Assessment Matrix</h4>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2 h-80 w-80 mx-auto mb-4">
              {/* Large interactive 2x2 matrix would be here */}
              <div className="bg-green-500/20 border border-white/20 p-4">
                <div className="text-xs text-white">Low Risk</div>
              </div>
              <div className="bg-amber-500/20 border border-white/20 p-4 relative">
                <div className="text-xs text-white">Medium Risk</div>
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="bg-orange-500/20 border border-white/20 p-4 relative">
                <div className="text-xs text-white">Medium Risk</div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="bg-red-500/20 border border-white/20 p-4 relative">
                <div className="text-xs text-white">High Risk</div>
                <div className="absolute center w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <button className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded border border-orange-500/30">
              Reassess Risk ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskMatrixWidget;
