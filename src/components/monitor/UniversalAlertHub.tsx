
import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Minus, Maximize2, Search, Settings, TrendingUp } from 'lucide-react';

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
      className="h-full rounded-3xl border relative"
      style={{
        background: 'rgba(10,20,40,0.45)',
        backdropFilter: 'blur(24px)',
        borderColor: 'rgba(0,255,195,0.15)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.6)',
      }}
    >
      {/* Inner Glass Layer */}
      <div 
        className="absolute inset-0.5 rounded-[1.25rem] p-4 flex flex-col"
        style={{
          background: 'rgba(20,30,50,0.6)',
          backdropFilter: 'blur(32px)',
        }}
      >
        {/* Header */}
        <div 
          className="h-8 flex items-center justify-between px-4 rounded-lg mb-4 flex-shrink-0"
          style={{
            background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
          }}
        >
          <h3 
            className="font-noto-bold text-white text-base"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            Universal Alert Hub
          </h3>
          <div className="flex items-center space-x-2">
            <button className="w-5 h-5 text-white/50 hover:text-[#00FFC3] transition-colors">
              <MoreVertical className="w-full h-full" />
            </button>
            <button className="w-5 h-5 text-white/50 hover:text-[#00FFC3] transition-colors">
              <Minus className="w-full h-full" />
            </button>
            <button className="w-5 h-5 text-white/50 hover:text-[#00FFC3] transition-colors">
              <Maximize2 className="w-full h-full" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr 
                className="h-8"
                style={{
                  background: 'linear-gradient(90deg, rgba(0,255,195,0.2) 0%, rgba(0,184,255,0.2) 100%)',
                }}
              >
                <th className="text-left px-2 font-noto-bold text-white text-xs">Indicator</th>
                <th className="text-left px-2 font-noto-bold text-white text-xs">Deviation (%)</th>
                <th className="text-left px-2 font-noto-bold text-white text-xs">Time</th>
                <th className="text-left px-2 font-noto-bold text-white text-xs">Category</th>
                <th className="text-left px-2 font-noto-bold text-white text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => (
                <motion.tr
                  key={alert.id}
                  className={`h-12 cursor-pointer transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white/2' : 'bg-transparent'
                  } hover:bg-[rgba(0,255,195,0.10)] hover:-translate-y-0.5`}
                  style={{
                    boxShadow: 'none',
                  }}
                  whileHover={{
                    boxShadow: '0 0 12px rgba(0,255,195,0.4)',
                  }}
                >
                  <td className="px-2 font-noto-medium text-[#E0E0E0] text-xs">
                    {alert.indicator}
                  </td>
                  <td className={`px-2 font-noto-medium text-xs ${getDeviationColor(alert.deviation)}`}>
                    {alert.deviation > 0 ? '+' : ''}{alert.deviation}%
                  </td>
                  <td className="px-2 font-noto-regular text-[#E0E0E0] text-xs">
                    {alert.time}
                  </td>
                  <td className="px-2">
                    <span 
                      className={`px-2 py-1 rounded-full font-noto-medium text-white text-xs ${
                        alert.category === 'strategic' 
                          ? 'bg-[#00FFC3] text-[#081226]' 
                          : 'bg-[#00B8FF] text-[#081226]'
                      }`}
                    >
                      {alert.category === 'strategic' ? 'Strategic' : 'Operational'}
                    </span>
                  </td>
                  <td className="px-2">
                    <div className="flex items-center space-x-1">
                      <button 
                        className="w-7 h-7 rounded-full bg-[#00FFC3] flex items-center justify-center hover:shadow-lg transition-all duration-200"
                        style={{ boxShadow: '0 0 8px rgba(0,255,195,0.4)' }}
                        aria-label="Search details"
                      >
                        <Search className="w-3 h-3 text-[#081226]" />
                      </button>
                      <button 
                        className="w-7 h-7 rounded-full bg-[#00FFC3] flex items-center justify-center hover:shadow-lg transition-all duration-200"
                        style={{ boxShadow: '0 0 8px rgba(0,255,195,0.4)' }}
                        aria-label="Settings"
                      >
                        <Settings className="w-3 h-3 text-[#081226]" />
                      </button>
                      <button 
                        className="w-7 h-7 rounded-full bg-[#00FFC3] flex items-center justify-center hover:shadow-lg transition-all duration-200"
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
        <div className="flex justify-end mt-4 flex-shrink-0">
          <button className="font-noto-medium text-[#00B8FF] text-sm hover:underline transition-colors">
            View All Alerts ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversalAlertHub;
