
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Minimize2, Maximize2, X } from 'lucide-react';

interface RadialHubViewProps {
  timeRange: string;
  domainFilter: string;
  chartType: 'bar' | 'line';
  onFullscreen: () => void;
  isFullscreen: boolean;
}

const RadialHubView: React.FC<RadialHubViewProps> = ({ 
  timeRange, 
  domainFilter, 
  chartType, 
  onFullscreen, 
  isFullscreen 
}) => {
  const [selectedSpoke, setSelectedSpoke] = useState<string | null>(null);

  const centerHub = {
    name: 'DEI Stability',
    value: 78,
    max: 100,
  };

  const strategicSpokes = [
    { name: 'Network Dev Index', value: 64, max: 100, position: { x: 0, y: -120 } },
    { name: 'Trust Recovery Index', value: 89, max: 100, position: { x: 120, y: 0 } },
    { name: 'Bundle Coherence', value: 72, max: 100, position: { x: 0, y: 120 } },
    { name: 'Scenario Validation', value: 85, max: 100, position: { x: -120, y: 0 } },
  ];

  const operationalSpokes = [
    { name: 'Open Facilitator Claims', value: 12, label: '12', position: { x: 85, y: -85 } },
    { name: 'Think→Act Queue', value: 4, label: '4', position: { x: 85, y: 85 } },
    { name: 'Act→Monitor Queue', value: 3, label: '3', position: { x: -85, y: 85 } },
    { name: 'System Error Count', value: 5, label: '5', position: { x: -85, y: -85 } },
  ];

  const handleSpokeClick = (spokeName: string) => {
    setSelectedSpoke(spokeName);
  };

  const getStatusColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 75) return '#00FFC3';
    if (percentage >= 50) return '#FFC107';
    return '#FF6E6E';
  };

  return (
    <div
      className="w-full h-full rounded-3xl relative overflow-hidden"
      style={{
        background: 'rgba(10, 20, 40, 0.45)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0, 255, 195, 0.15)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)',
        minHeight: isFullscreen ? '80vh' : '500px',
      }}
    >
      {/* Header Strip */}
      <div
        className="h-10 flex items-center justify-between px-4"
        style={{
          background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
        }}
      >
        <h2
          style={{
            fontFamily: 'Noto Sans',
            fontWeight: 700,
            fontSize: '16px',
            color: '#FFFFFF',
            textShadow: '0 2px 4px rgba(0,0,0,0.6)',
          }}
        >
          Radial Hub & Spokes
        </h2>
        <div className="flex items-center space-x-2">
          <motion.button
            className="text-white opacity-50 hover:opacity-100"
            whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
          >
            <MoreVertical size={16} />
          </motion.button>
          <motion.button
            className="text-white opacity-50 hover:opacity-100"
            whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
          >
            <Minimize2 size={16} />
          </motion.button>
          <motion.button
            className="text-white opacity-50 hover:opacity-100"
            whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
            onClick={onFullscreen}
          >
            <Maximize2 size={16} />
          </motion.button>
        </div>
      </div>

      {/* Radial Layout */}
      <div className="flex-1 relative flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="-300 -300 600 600" className="overflow-visible">
          {/* Center Hub */}
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <circle
              cx="0"
              cy="0"
              r="60"
              fill="rgba(20, 30, 50, 0.6)"
              stroke="#00FFC3"
              strokeWidth="3"
              style={{
                filter: 'drop-shadow(0 0 24px rgba(0,255,195,0.6))',
              }}
            />
            <text
              x="0"
              y="-5"
              textAnchor="middle"
              style={{
                fontFamily: 'Noto Sans',
                fontWeight: 700,
                fontSize: '24px',
                fill: '#FFFFFF',
              }}
            >
              {centerHub.value}%
            </text>
            <text
              x="0"
              y="15"
              textAnchor="middle"
              style={{
                fontFamily: 'Noto Sans',
                fontWeight: 400,
                fontSize: '12px',
                fill: '#E0E0E0',
              }}
            >
              {centerHub.name}
            </text>
          </motion.g>

          {/* Strategic Spokes */}
          {strategicSpokes.map((spoke, index) => (
            <motion.g
              key={spoke.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              whileHover={{
                scale: 1.15,
                filter: 'drop-shadow(0 0 16px rgba(0,255,195,0.5))',
              }}
              style={{ cursor: 'pointer' }}
              onClick={() => handleSpokeClick(spoke.name)}
            >
              <circle
                cx={spoke.position.x}
                cy={spoke.position.y}
                r="40"
                fill="rgba(20, 30, 50, 0.6)"
                stroke="rgba(255, 255, 255, 0.10)"
                strokeWidth="1"
                style={{
                  backdropFilter: 'blur(20px)',
                }}
              />
              <text
                x={spoke.position.x}
                y={spoke.position.y - 5}
                textAnchor="middle"
                style={{
                  fontFamily: 'Noto Sans',
                  fontWeight: 600,
                  fontSize: '16px',
                  fill: getStatusColor(spoke.value, spoke.max),
                }}
              >
                {spoke.value}
              </text>
              <text
                x={spoke.position.x}
                y={spoke.position.y + 10}
                textAnchor="middle"
                style={{
                  fontFamily: 'Noto Sans',
                  fontWeight: 400,
                  fontSize: '8px',
                  fill: '#E0E0E0',
                }}
              >
                {spoke.name.split(' ')[0]}
              </text>
            </motion.g>
          ))}

          {/* Operational Spokes */}
          {operationalSpokes.map((spoke, index) => (
            <motion.g
              key={spoke.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * (index + 5) }}
              whileHover={{
                scale: 1.15,
                filter: 'drop-shadow(0 0 16px rgba(0,255,195,0.5))',
              }}
              style={{ cursor: 'pointer' }}
              onClick={() => handleSpokeClick(spoke.name)}
            >
              <circle
                cx={spoke.position.x}
                cy={spoke.position.y}
                r="30"
                fill="rgba(20, 30, 50, 0.6)"
                stroke="rgba(255, 255, 255, 0.10)"
                strokeWidth="1"
              />
              <text
                x={spoke.position.x}
                y={spoke.position.y + 5}
                textAnchor="middle"
                style={{
                  fontFamily: 'Noto Sans',
                  fontWeight: 600,
                  fontSize: '14px',
                  fill: '#00B8FF',
                }}
              >
                {spoke.label}
              </text>
            </motion.g>
          ))}

          {/* Connection lines */}
          {strategicSpokes.map((spoke, index) => (
            <motion.line
              key={`line-strategic-${index}`}
              x1="0"
              y1="0"
              x2={spoke.position.x}
              y2={spoke.position.y}
              stroke="rgba(0, 255, 195, 0.3)"
              strokeWidth="1"
              strokeDasharray="2 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            />
          ))}

          {operationalSpokes.map((spoke, index) => (
            <motion.line
              key={`line-operational-${index}`}
              x1="0"
              y1="0"
              x2={spoke.position.x}
              y2={spoke.position.y}
              stroke="rgba(0, 184, 255, 0.3)"
              strokeWidth="1"
              strokeDasharray="2 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 5) }}
            />
          ))}
        </svg>

        {/* Spoke Details Pop-Over */}
        <AnimatePresence>
          {selectedSpoke && (
            <motion.div
              className="absolute top-4 right-4 w-64 p-4 rounded-xl"
              style={{
                background: 'rgba(20, 30, 50, 0.85)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(0, 255, 195, 0.15)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3
                  style={{
                    fontFamily: 'Noto Sans',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#00FFC3',
                  }}
                >
                  {selectedSpoke}
                </h3>
                <motion.button
                  onClick={() => setSelectedSpoke(null)}
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </motion.button>
              </div>
              
              {/* Mini Trend Chart Placeholder */}
              <div className="h-16 mb-3 bg-white/5 rounded flex items-center justify-center">
                <span className="text-xs text-gray-400">
                  {chartType === 'bar' ? 'Bar' : 'Line'} Chart
                </span>
              </div>

              <motion.button
                className="w-full py-2 px-4 rounded text-center font-medium text-sm"
                style={{
                  background: '#00B8FF',
                  color: '#081226',
                  boxShadow: '0 4px 8px rgba(0, 184, 255, 0.4)',
                }}
                whileHover={{ 
                  backgroundColor: 'rgba(0, 184, 255, 0.9)',
                  boxShadow: '0 6px 12px rgba(0, 184, 255, 0.6)',
                }}
              >
                View Full Details ▶
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mini Trend Charts (only in fullscreen) */}
      {isFullscreen && (
        <motion.div
          className="p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-2 gap-4">
            {['Strategic Average', 'Operational Average', 'System Health', 'Network Stability'].map((title, index) => (
              <div
                key={title}
                className="h-24 p-3 rounded-lg"
                style={{
                  background: 'rgba(20, 30, 50, 0.6)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                }}
              >
                <h4
                  className="text-sm mb-2"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontWeight: 600,
                    color: '#00FFC3',
                  }}
                >
                  {title}
                </h4>
                <div className="h-12 bg-white/5 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">6-Month Trend</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RadialHubView;
