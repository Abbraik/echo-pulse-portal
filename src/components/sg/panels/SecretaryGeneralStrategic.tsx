
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, TrendingUp, TrendingDown } from 'lucide-react';
import { StrategicCommand } from '@/types/sg';

interface SecretaryGeneralStrategicProps {
  data: StrategicCommand;
  onFullscreen?: () => void;
}

const SecretaryGeneralStrategic: React.FC<SecretaryGeneralStrategicProps> = ({ 
  data, 
  onFullscreen 
}) => {
  const [showModal, setShowModal] = useState(false);

  // Calculate combined score
  const combinedScore = Math.round((data.deiComposite.current + data.trustIndex.current) / 2);

  // Calculate sparkline paths
  const createSparklinePath = (values: number[], width: number = 100, height: number = 30) => {
    if (!values || values.length === 0) return '';
    
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const range = maxVal - minVal || 1;
    
    return values.map((val, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((val - minVal) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
  };

  // Get PSI status color
  const getPSIStatusColor = (value: number) => {
    if (value >= 0.7) return '#00FFC3';
    if (value >= 0.5) return '#FFB800';
    return '#FF4444';
  };

  return (
    <>
      <motion.div 
        className="h-full relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.3)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          padding: '24px'
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Strip */}
        <div 
          className="h-10 flex items-center justify-between px-4 mb-6 rounded-lg"
          style={{
            background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)'
          }}
        >
          <h3 className="text-white font-bold text-base font-noto">Strategic Command</h3>
          <button 
            onClick={onFullscreen}
            className="text-white hover:scale-110 transition-transform"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="h-[calc(100%-4rem)] grid grid-cols-2 grid-rows-2 gap-4">
          {/* DEI + Trust Composite Gauge - Top row, spans 2 columns */}
          <div className="col-span-2 flex flex-col items-center justify-center relative">
            {/* Circular Gauge */}
            <div className="relative w-32 h-32 mb-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background circles */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                />
                
                {/* DEI Arc */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#00FFC3"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(data.deiComposite.current / 100) * 314} 314`}
                  style={{
                    filter: 'drop-shadow(0 0 8px #00FFC3)'
                  }}
                />
                
                {/* Trust Arc */}
                <circle
                  cx="60"
                  cy="60"
                  r="42"
                  fill="none"
                  stroke="#00B8FF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(data.trustIndex.current / 100) * 264} 264`}
                  style={{
                    filter: 'drop-shadow(0 0 8px #00B8FF)'
                  }}
                />
              </svg>
              
              {/* Center Score */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-xl font-noto">
                  {combinedScore}/100
                </span>
              </div>
            </div>

            {/* Sparkline */}
            <div className="w-24 h-6">
              <svg viewBox="0 0 100 30" className="w-full h-full">
                <path
                  d={createSparklinePath([...data.deiComposite.history, ...data.trustIndex.history])}
                  fill="none"
                  stroke="#00FFC3"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Tooltip on hover */}
            <div className="absolute top-0 right-0 opacity-0 hover:opacity-100 transition-opacity bg-black/80 text-white text-xs p-2 rounded pointer-events-none">
              DEI: {data.deiComposite.current}/{data.deiComposite.target} ({data.deiComposite.current - data.deiComposite.target}) | 
              Trust: {data.trustIndex.current}/{data.trustIndex.target} ({data.trustIndex.current - data.trustIndex.target})
            </div>
          </div>

          {/* PSIU Matrix - Bottom left */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(data.psiScores).map(([key, value]) => (
              <div
                key={key}
                className="relative flex flex-col items-center justify-center p-2 rounded-lg"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="text-white text-xs font-medium font-noto mb-1">
                  {key}
                </div>
                <div 
                  className="text-lg font-bold font-noto"
                  style={{
                    color: value >= 0.6 ? '#00FFC3' : '#FFFFFF',
                    textShadow: value >= 0.6 ? '0 0 8px #00FFC3' : 'none'
                  }}
                >
                  {value.toFixed(2)}
                </div>
                <div 
                  className="absolute bottom-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: getPSIStatusColor(value) }}
                />
              </div>
            ))}
          </div>

          {/* Entropy Trends - Bottom right */}
          <div className="flex flex-col space-y-2">
            {data.entropyTrends.map((trend) => (
              <div key={trend.zone} className="flex items-center space-x-3">
                <span className="text-white text-xs font-medium font-noto w-12">
                  {trend.zone}
                </span>
                <div className="flex-1 h-6">
                  <svg viewBox="0 0 100 30" className="w-full h-full">
                    <path
                      d={createSparklinePath(trend.values)}
                      fill="none"
                      stroke="#00B8FF"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className="flex items-center space-x-1">
                  {trend.values[trend.values.length - 1] > trend.values[trend.values.length - 2] ? (
                    <TrendingUp size={10} className="text-green-400" />
                  ) : (
                    <TrendingDown size={10} className="text-red-400" />
                  )}
                  <span className="text-gray-300 text-xs font-noto">
                    +1.5%
                  </span>
                </div>
              </div>
            ))}

            {/* Review Strategic Alert Button */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full mt-2 px-3 py-2 rounded-lg font-medium text-sm text-white transition-all hover:scale-105"
              style={{
                background: '#00B8FF',
                boxShadow: '0 4px 8px rgba(0,184,255,0.4)'
              }}
            >
              Review Strategic Alert
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal for Strategic Alert */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full mx-4 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white font-noto">Strategic Alert Review</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* DEI Trend */}
              <div>
                <h3 className="text-lg font-semibold text-teal-400 mb-2 font-noto">DEI Composite (90 Days)</h3>
                <div className="h-32 bg-black/20 rounded-lg p-4 flex items-center justify-center">
                  <svg viewBox="0 0 400 100" className="w-full h-full">
                    <path
                      d={createSparklinePath(data.deiComposite.history, 400, 100)}
                      fill="none"
                      stroke="#00FFC3"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
                <div className="mt-2 text-sm text-gray-300">
                  Current: {data.deiComposite.current} | Target: {data.deiComposite.target}
                </div>
              </div>

              {/* Trust Trend */}
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2 font-noto">Trust Index (90 Days)</h3>
                <div className="h-32 bg-black/20 rounded-lg p-4 flex items-center justify-center">
                  <svg viewBox="0 0 400 100" className="w-full h-full">
                    <path
                      d={createSparklinePath(data.trustIndex.history, 400, 100)}
                      fill="none"
                      stroke="#00B8FF"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
                <div className="mt-2 text-sm text-gray-300">
                  Current: {data.trustIndex.current} | Target: {data.trustIndex.target}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default SecretaryGeneralStrategic;
