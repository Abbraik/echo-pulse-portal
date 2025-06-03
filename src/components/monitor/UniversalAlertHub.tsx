
import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Minimize2, Maximize2, Search, Settings, TrendingUp, ArrowRight } from 'lucide-react';

interface UniversalAlertHubProps {
  onFullscreen: () => void;
}

const UniversalAlertHub: React.FC<UniversalAlertHubProps> = ({ onFullscreen }) => {
  const alerts = [
    {
      indicator: 'Social Trust Index',
      deviation: -35.7,
      timestamp: '05/18 14:23',
      category: 'Strategic',
      severity: 'critical'
    },
    {
      indicator: 'Resource Efficiency',
      deviation: -13.3,
      timestamp: '05/18 13:45',
      category: 'Operational',
      severity: 'warning'
    },
    {
      indicator: 'Bundle Coherence',
      deviation: -4.0,
      timestamp: '05/18 12:30',
      category: 'Operational',
      severity: 'warning'
    },
    {
      indicator: 'Population Dynamics',
      deviation: -41.7,
      timestamp: '05/17 16:15',
      category: 'Strategic',
      severity: 'critical'
    },
    {
      indicator: 'Network Development',
      deviation: 2.5,
      timestamp: '05/17 15:20',
      category: 'Strategic',
      severity: 'healthy'
    },
  ];

  const getDeviationColor = (deviation: number) => {
    if (deviation > 5) return '#00FFC3';
    if (deviation >= -5) return '#FFC107';
    return '#FF6E6E';
  };

  const getCategoryStyle = (category: string) => ({
    background: category === 'Strategic' ? '#00FFC3' : '#00B8FF',
    color: '#081226',
    padding: '4px 8px',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: 500,
    fontFamily: 'Noto Sans',
  });

  return (
    <div
      className="w-full h-full rounded-3xl relative overflow-hidden"
      style={{
        background: 'rgba(10, 20, 40, 0.45)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0, 255, 195, 0.15)',
        borderRadius: '1.5rem',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        className="h-8 flex items-center justify-between px-4"
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
          }}
        >
          Universal Alert Hub
        </h2>
        <div className="flex items-center space-x-2">
          <motion.button
            className="text-white transition-all duration-200"
            style={{ opacity: 0.6 }}
            whileHover={{ 
              opacity: 1,
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 195, 0.6))',
            }}
          >
            <MoreVertical size={16} />
          </motion.button>
          <motion.button
            className="text-white transition-all duration-200"
            style={{ opacity: 0.6 }}
            whileHover={{ 
              opacity: 1,
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 195, 0.6))',
            }}
          >
            <Minimize2 size={16} />
          </motion.button>
          <motion.button
            className="text-white transition-all duration-200"
            style={{ opacity: 0.6 }}
            whileHover={{ 
              opacity: 1,
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 195, 0.6))',
            }}
            onClick={onFullscreen}
          >
            <Maximize2 size={16} />
          </motion.button>
        </div>
      </div>

      {/* Scrollable Alert Table */}
      <div 
        className="flex-1 overflow-auto p-3"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.20) transparent',
        }}
      >
        <table className="w-full">
          <thead>
            <tr
              style={{
                background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
              }}
            >
              <th className="text-left p-2 text-white font-bold text-xs">Indicator</th>
              <th className="text-left p-2 text-white font-bold text-xs">Deviation</th>
              <th className="text-left p-2 text-white font-bold text-xs">Time</th>
              <th className="text-left p-2 text-white font-bold text-xs">Category</th>
              <th className="text-left p-2 text-white font-bold text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <motion.tr
                key={index}
                className="h-12 border-b border-white/5"
                style={{
                  background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}
                whileHover={{
                  background: 'rgba(0,255,195,0.10)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 0 12px rgba(0,255,195,0.4)',
                  transition: { duration: 0.2 },
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                role="row"
              >
                <td className="p-2 text-teal-400 font-semibold text-xs">{alert.indicator}</td>
                <td
                  className="p-2 text-xs font-semibold"
                  style={{ color: getDeviationColor(alert.deviation) }}
                >
                  {alert.deviation > 0 ? '+' : ''}{alert.deviation.toFixed(1)}%
                </td>
                <td className="p-2 text-gray-300 text-xs">{alert.timestamp}</td>
                <td className="p-2">
                  <span style={getCategoryStyle(alert.category)}>
                    {alert.category}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex space-x-1">
                    <motion.button
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ 
                        background: '#00FFC3',
                        color: '#081226',
                      }}
                      whileHover={{ 
                        scale: 1.1, 
                        boxShadow: '0 0 8px rgba(0,255,195,0.6)',
                      }}
                      aria-label={`Investigate ${alert.indicator}`}
                    >
                      <Search size={10} />
                    </motion.button>
                    <motion.button
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ 
                        background: '#00FFC3',
                        color: '#081226',
                      }}
                      whileHover={{ 
                        scale: 1.1, 
                        boxShadow: '0 0 8px rgba(0,255,195,0.6)',
                      }}
                      aria-label={`Settings for ${alert.indicator}`}
                    >
                      <Settings size={10} />
                    </motion.button>
                    <motion.button
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ 
                        background: '#00FFC3',
                        color: '#081226',
                      }}
                      whileHover={{ 
                        scale: 1.1, 
                        boxShadow: '0 0 8px rgba(0,255,195,0.6)',
                      }}
                      aria-label={`Trend chart for ${alert.indicator}`}
                    >
                      <TrendingUp size={10} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-3 flex justify-end">
        <motion.button
          className="flex items-center space-x-2 transition-all duration-150"
          style={{
            fontFamily: 'Noto Sans',
            fontWeight: 500,
            fontSize: '14px',
            color: '#00B8FF',
          }}
          whileHover={{ 
            textDecoration: 'underline',
            textDecorationColor: '#00FFC3',
          }}
        >
          <span>View All Alerts</span>
          <ArrowRight size={14} />
        </motion.button>
      </div>
    </div>
  );
};

export default UniversalAlertHub;
