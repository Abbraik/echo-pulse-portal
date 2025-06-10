import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RadialHubViewProps {
  timeRange: string;
  domainFilter: string;
  chartType: 'bar' | 'line';
}

interface SpokeData {
  id: string;
  name: string;
  value: number;
  target: number;
  category: 'strategic' | 'operational';
  position: { x: number; y: number };
}

const RadialHubView: React.FC<RadialHubViewProps> = ({ timeRange, domainFilter, chartType }) => {
  const [selectedSpoke, setSelectedSpoke] = useState<string | null>(null);
  const [popoverData, setPopoverData] = useState<SpokeData | null>(null);

  const strategicSpokes: SpokeData[] = [
    { id: 's1', name: 'Network Dev Index', value: 52, target: 100, category: 'strategic', position: { x: 50, y: 20 } },
    { id: 's2', name: 'Trust Recovery', value: 72, target: 100, category: 'strategic', position: { x: 80, y: 50 } },
    { id: 's3', name: 'Bundle Coherence', value: 59, target: 100, category: 'strategic', position: { x: 50, y: 80 } },
    { id: 's4', name: 'Scenario Validation', value: 69, target: 100, category: 'strategic', position: { x: 20, y: 50 } },
  ];

  const operationalSpokes: SpokeData[] = [
    { id: 'o1', name: 'Open Claims', value: 10, target: 5, category: 'operational', position: { x: 65, y: 25 } },
    { id: 'o2', name: 'Think→Act Queue', value: 4, target: 3, category: 'operational', position: { x: 75, y: 65 } },
    { id: 'o3', name: 'Act→Monitor Queue', value: 3, target: 2, category: 'operational', position: { x: 35, y: 75 } },
    { id: 'o4', name: 'System Errors', value: 5, target: 1, category: 'operational', position: { x: 25, y: 35 } },
  ];

  const overallStability = 63; // Reduced by 10%
  const inBandDegree = (overallStability / 100) * 360;

  const handleSpokeClick = (spoke: SpokeData) => {
    setSelectedSpoke(spoke.id);
    setPopoverData(spoke);
  };

  const handleClosePopover = () => {
    setSelectedSpoke(null);
    setPopoverData(null);
  };

  return (
    <div className="h-full flex flex-col relative p-4">
      <div 
        className="flex-1 relative overflow-y-auto"
        style={{
          minHeight: '500px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.20) transparent'
        }}
      >
        <style>{`
          .flex-1::-webkit-scrollbar {
            width: 6px;
          }
          .flex-1::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.20);
            border-radius: 3px;
          }
          .flex-1::-webkit-scrollbar-track {
            background: transparent;
          }
        `}</style>

        {/* Central Hub - Scaled smaller */}
        <div 
          className="absolute w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: `conic-gradient(#00FFC3 ${inBandDegree}deg, #FFC107 ${inBandDegree + 60}deg, #FF6E6E ${inBandDegree + 120}deg)`,
            boxShadow: '0 0 20px rgba(0,255,195,0.5), inset 0 2px 6px rgba(0,0,0,0.3)',
          }}
        >
          <div 
            className="w-16 h-16 rounded-full flex flex-col items-center justify-center"
            style={{
              background: 'rgba(20,30,50,0.8)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <span 
              className="text-sm font-bold text-white"
              style={{ 
                fontFamily: 'Noto Sans',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)' 
              }}
            >
              {overallStability}%
            </span>
            <span 
              className="text-xs text-[#E0E0E0]"
              style={{ fontFamily: 'Noto Sans' }}
            >
              DEI
            </span>
          </div>
        </div>

        {/* Strategic Spokes (Inner Ring) - Compact size */}
        {strategicSpokes.map((spoke) => (
          <motion.div
            key={spoke.id}
            className="absolute w-12 h-12 rounded-full cursor-pointer flex flex-col items-center justify-center"
            style={{
              left: `${spoke.position.x}%`,
              top: `${spoke.position.y}%`,
              transform: 'translate(-50%, -50%)',
              background: 'rgba(20,30,50,0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
            }}
            whileHover={{ 
              scale: 1.15,
              boxShadow: '0 0 12px rgba(0,255,195,0.5)',
            }}
            onClick={() => handleSpokeClick(spoke)}
            role="button"
            tabIndex={0}
            aria-label={`${spoke.name}: ${spoke.value}`}
          >
            <span 
              className="text-xs font-semibold text-[#00FFC3] text-center leading-tight"
              style={{ 
                fontFamily: 'Noto Sans',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)' 
              }}
            >
              {spoke.name.split(' ').map(word => word.slice(0, 3)).join(' ')}
            </span>
            <span 
              className="text-sm font-bold text-[#00FFC3]"
              style={{ fontFamily: 'Noto Sans' }}
            >
              {spoke.value}
            </span>
          </motion.div>
        ))}

        {/* Operational Spokes (Outer Ring) - Compact size */}
        {operationalSpokes.map((spoke) => (
          <motion.div
            key={spoke.id}
            className="absolute w-10 h-10 rounded-full cursor-pointer flex flex-col items-center justify-center"
            style={{
              left: `${spoke.position.x}%`,
              top: `${spoke.position.y}%`,
              transform: 'translate(-50%, -50%)',
              background: 'rgba(20,30,50,0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
            }}
            whileHover={{ 
              scale: 1.15,
              boxShadow: '0 0 12px rgba(0,255,195,0.5)',
            }}
            onClick={() => handleSpokeClick(spoke)}
            role="button"
            tabIndex={0}
            aria-label={`${spoke.name}: ${spoke.value}`}
          >
            <span 
              className="text-xs font-semibold text-[#00FFC3] text-center leading-tight"
              style={{ 
                fontFamily: 'Noto Sans',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)' 
              }}
            >
              {spoke.name.split(' ')[0]}
            </span>
            <span 
              className="text-sm font-bold text-[#00FFC3]"
              style={{ fontFamily: 'Noto Sans' }}
            >
              {spoke.value}
            </span>
          </motion.div>
        ))}

        {/* Popover - Increased size */}
        <AnimatePresence>
          {popoverData && (
            <>
              {/* Background overlay */}
              <motion.div
                className="absolute inset-0 bg-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClosePopover}
              />
              
              {/* Popover content */}
              <motion.div
                className="absolute z-50 w-80 rounded-2xl p-4"
                style={{
                  left: `${popoverData.position.x}%`,
                  top: `${popoverData.position.y - 15}%`,
                  transform: 'translate(-50%, -100%)',
                  background: 'rgba(20,30,50,0.85)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <h3 
                  className="font-bold text-[#00FFC3] text-lg mb-3"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  {popoverData.name}
                </h3>
                
                <div className="mb-4">
                  <div 
                    className="w-full h-16 rounded border overflow-hidden"
                    style={{ background: 'rgba(10,15,25,0.5)' }}
                  >
                    <svg width="100%" height="100%" viewBox="0 0 100 64">
                      {chartType === 'line' ? (
                        <polyline
                          points="10,45 25,40 40,38 55,35 70,30 85,28"
                          fill="none"
                          stroke="#00FFC3"
                          strokeWidth="2"
                        />
                      ) : (
                        [65, 70, 72, 75, 80, 85].map((value, i) => (
                          <rect
                            key={i}
                            x={10 + i * 13}
                            y={64 - (value * 0.6)}
                            width="8"
                            height={value * 0.6}
                            fill="#00FFC3"
                          />
                        ))
                      )}
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span 
                    className="text-sm text-[#E0E0E0]"
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    Current: {popoverData.value}
                  </span>
                  <span 
                    className="text-sm text-[#E0E0E0]"
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    Target: {popoverData.target}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#E0E0E0]">Category:</span>
                    <span className="text-sm text-white capitalize">{popoverData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#E0E0E0]">Performance:</span>
                    <span className="text-sm text-white">
                      {((popoverData.value / popoverData.target) * 100).toFixed(1)}% of target
                    </span>
                  </div>
                </div>

                <button
                  className="w-full py-3 rounded-lg text-sm font-medium transition-all duration-150"
                  style={{
                    background: '#00B8FF',
                    color: '#081226',
                    fontFamily: 'Noto Sans',
                    boxShadow: '0 4px 8px rgba(0,184,255,0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#00CCFF';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,184,255,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#00B8FF';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,184,255,0.4)';
                  }}
                >
                  View Details
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RadialHubView;
