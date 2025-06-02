
import React from 'react';
import { MoreVertical, Minus, Maximize2, Search, Settings, TrendingUp } from 'lucide-react';

interface Alert {
  id: number;
  indicator: string;
  deviation: number;
  time: string;
  category: 'Strategic' | 'Operational';
  status: 'warning' | 'critical';
}

const alerts: Alert[] = [
  { id: 1, indicator: 'Social Trust Index', deviation: -12.5, time: '05/17 14:30', category: 'Strategic', status: 'critical' },
  { id: 2, indicator: 'Resource Efficiency', deviation: 8.2, time: '05/17 14:15', category: 'Strategic', status: 'warning' },
  { id: 3, indicator: 'Open Claims Queue', deviation: 20.0, time: '05/17 14:00', category: 'Operational', status: 'warning' },
  { id: 4, indicator: 'System Error Rate', deviation: 50.0, time: '05/17 13:45', category: 'Operational', status: 'critical' }
];

const UniversalAlertHub: React.FC = () => {
  const getDeviationColor = (deviation: number) => {
    if (deviation > 5) return '#00FFC3'; // Green
    if (deviation >= -5) return '#FFC107'; // Amber
    return '#FF6E6E'; // Red
  };

  return (
    <div 
      className="w-full h-full"
      style={{
        background: 'rgba(10,20,40,0.45)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,255,195,0.15)',
        borderRadius: '1.5rem',
        boxShadow: '0 12px 24px rgba(0,0,0,0.6)'
      }}
    >
      {/* Inner Glass */}
      <div 
        className="w-full h-full relative"
        style={{
          background: 'rgba(20,30,50,0.6)',
          backdropFilter: 'blur(32px)',
          borderRadius: '1.25rem',
          margin: '2px'
        }}
      >
        {/* Header */}
        <div 
          className="h-8 flex items-center justify-between px-4"
          style={{
            background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
            borderRadius: '1.25rem 1.25rem 0 0'
          }}
        >
          <h3 
            className="text-white font-bold text-sm"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            Universal Alert Hub
          </h3>
          <div className="flex items-center gap-2">
            <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all">
              <MoreVertical size={14} />
            </button>
            <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all">
              <Minus size={14} />
            </button>
            <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all">
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr 
                className="h-10 text-white text-xs font-bold"
                style={{ background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)' }}
              >
                <th className="text-left px-3">Indicator</th>
                <th className="text-center px-2">Deviation (%)</th>
                <th className="text-center px-2">Time</th>
                <th className="text-center px-2">Category</th>
                <th className="text-center px-2">Actions</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody>
              {alerts.map((alert, index) => (
                <tr 
                  key={alert.id}
                  className="h-12 text-xs text-[#E0E0E0] border-b border-white/5 hover:bg-[rgba(0,255,195,0.10)] hover:transform hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(0,255,195,0.4)] transition-all duration-200 cursor-pointer"
                  style={{ background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                >
                  <td className="px-3 font-medium">{alert.indicator}</td>
                  <td 
                    className="text-center font-bold"
                    style={{ color: getDeviationColor(alert.deviation) }}
                  >
                    {alert.deviation > 0 ? '+' : ''}{alert.deviation}%
                  </td>
                  <td className="text-center">{alert.time}</td>
                  <td className="text-center">
                    <span 
                      className="px-2 py-1 rounded-full text-white text-xs font-medium"
                      style={{ 
                        background: alert.category === 'Strategic' ? '#00FFC3' : '#00B8FF',
                        color: '#081226'
                      }}
                    >
                      {alert.category}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        className="w-6 h-6 rounded-full bg-[#00FFC3] flex items-center justify-center hover:shadow-[0_0_8px_rgba(0,255,195,0.5)] transition-all"
                        aria-label="Drill down"
                      >
                        <Search size={12} className="text-[#081226]" />
                      </button>
                      <button 
                        className="w-6 h-6 rounded-full bg-[#00FFC3] flex items-center justify-center hover:shadow-[0_0_8px_rgba(0,255,195,0.5)] transition-all"
                        aria-label="Settings"
                      >
                        <Settings size={12} className="text-[#081226]" />
                      </button>
                      <button 
                        className="w-6 h-6 rounded-full bg-[#00FFC3] flex items-center justify-center hover:shadow-[0_0_8px_rgba(0,255,195,0.5)] transition-all"
                        aria-label="Trend chart"
                      >
                        <TrendingUp size={12} className="text-[#081226]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="h-8 flex items-center justify-end px-4">
          <button className="text-[#00B8FF] text-sm font-medium hover:underline hover:text-[#00FFC3] transition-colors">
            View All Alerts ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversalAlertHub;
