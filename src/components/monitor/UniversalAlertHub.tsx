
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Settings, TrendingUp } from 'lucide-react';

interface Alert {
  id: string;
  indicator: string;
  deviation: number;
  time: string;
  category: 'strategic' | 'operational';
}

const UniversalAlertHub: React.FC = () => {
  const alerts: Alert[] = [
    { id: '1', indicator: 'DEI Composite', deviation: -2.5, time: '12/15 14:30', category: 'strategic' },
    { id: '2', indicator: 'Resource Efficiency', deviation: 8.2, time: '12/15 14:25', category: 'operational' },
    { id: '3', indicator: 'Workflow Health', deviation: -10.7, time: '12/15 14:20', category: 'operational' },
    { id: '4', indicator: 'Social Cohesion', deviation: -5.6, time: '12/15 14:15', category: 'strategic' },
    { id: '5', indicator: 'Infrastructure Load', deviation: -35.7, time: '12/15 14:10', category: 'operational' },
  ];

  const getDeviationColor = (deviation: number) => {
    if (deviation > 5) return 'text-green-400';
    if (deviation >= -5 && deviation <= 5) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div 
      className="h-full rounded-3xl flex flex-col"
      style={{
        background: 'rgba(10,20,40,0.45)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,255,195,0.15)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
      }}
    >
      {/* Header */}
      <div 
        className="h-8 flex items-center justify-between px-4 rounded-t-3xl flex-shrink-0"
        style={{
          background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
        }}
      >
        <h3 
          className="font-bold text-white text-base"
          style={{ 
            fontFamily: 'Noto Sans',
            textShadow: '0 2px 4px rgba(0,0,0,0.6)' 
          }}
        >
          Universal Alert Hub
        </h3>
        <div className="flex items-center space-x-2">
          <button className="w-6 h-6 text-white/50 hover:text-[#00FFC3] transition-colors">
            <span className="text-sm">⋮</span>
          </button>
          <button className="w-6 h-6 text-white/50 hover:text-[#00FFC3] transition-colors">
            <span className="text-sm">—</span>
          </button>
          <button className="w-6 h-6 text-white/50 hover:text-[#00FFC3] transition-colors">
            <span className="text-sm">⛶</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div 
        className="flex-1 p-3"
        style={{
          background: 'rgba(20,30,50,0.6)',
          backdropFilter: 'blur(32px)',
        }}
      >
        <div 
          className="h-full overflow-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.20) transparent',
          }}
        >
          <table className="w-full">
            <thead>
              <tr 
                className="h-6"
                style={{
                  background: 'linear-gradient(90deg, rgba(0,255,195,0.2) 0%, rgba(0,184,255,0.2) 100%)',
                }}
              >
                <th 
                  className="text-left px-2 font-bold text-white text-xs"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  Indicator
                </th>
                <th 
                  className="text-left px-2 font-bold text-white text-xs"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  Deviation (%)
                </th>
                <th 
                  className="text-left px-2 font-bold text-white text-xs"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  Time
                </th>
                <th 
                  className="text-left px-2 font-bold text-white text-xs"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  Category
                </th>
                <th 
                  className="text-left px-2 font-bold text-white text-xs"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => (
                <motion.tr
                  key={alert.id}
                  className={`h-10 cursor-pointer transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white/2' : 'bg-transparent'
                  } hover:bg-[rgba(0,255,195,0.10)]`}
                  whileHover={{
                    y: -2,
                    boxShadow: '0 0 12px rgba(0,255,195,0.4)',
                  }}
                >
                  <td 
                    className="px-2 font-medium text-[#E0E0E0] text-xs"
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    {alert.indicator}
                  </td>
                  <td 
                    className={`px-2 font-medium text-xs ${getDeviationColor(alert.deviation)}`}
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    {alert.deviation > 0 ? '+' : ''}{alert.deviation}%
                  </td>
                  <td 
                    className="px-2 text-[#E0E0E0] text-xs"
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    {alert.time}
                  </td>
                  <td className="px-2">
                    <span 
                      className={`px-2 py-1 rounded-full font-medium text-white text-xs ${
                        alert.category === 'strategic' 
                          ? 'bg-[#00FFC3] text-[#081226]' 
                          : 'bg-[#00B8FF] text-[#081226]'
                      }`}
                      style={{ fontFamily: 'Noto Sans' }}
                    >
                      {alert.category === 'strategic' ? 'Strategic' : 'Operational'}
                    </span>
                  </td>
                  <td className="px-2">
                    <div className="flex items-center space-x-1">
                      <button 
                        className="w-6 h-6 rounded-full bg-[#00FFC3] flex items-center justify-center hover:shadow-lg transition-all duration-200"
                        style={{ boxShadow: '0 0 8px rgba(0,255,195,0.4)' }}
                        aria-label="Search details"
                      >
                        <Search className="w-3 h-3 text-[#081226]" />
                      </button>
                      <button 
                        className="w-6 h-6 rounded-full bg-[#00FFC3] flex items-center justify-center hover:shadow-lg transition-all duration-200"
                        style={{ boxShadow: '0 0 8px rgba(0,255,195,0.4)' }}
                        aria-label="Settings"
                      >
                        <Settings className="w-3 h-3 text-[#081226]" />
                      </button>
                      <button 
                        className="w-6 h-6 rounded-full bg-[#00FFC3] flex items-center justify-center hover:shadow-lg transition-all duration-200"
                        style={{ boxShadow: '0 0 8px rgba(0,255,195,0.4)' }}
                        aria-label="View trends"
                      >
                        <TrendingUp className="w-3 h-3 text-[#081226]" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-3 flex-shrink-0">
          <button 
            className="font-medium text-[#00B8FF] text-sm hover:underline transition-colors"
            style={{ 
              fontFamily: 'Noto Sans',
              textDecorationColor: '#00FFC3',
            }}
          >
            View All Alerts ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversalAlertHub;
