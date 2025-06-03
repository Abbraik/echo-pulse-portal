
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const headerButtonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="h-full rounded-2xl flex flex-col backdrop-blur-xl bg-slate-800/40 border border-white/20 overflow-hidden shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
      }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between px-6 py-4 border-b border-white/10"
        initial={{ opacity: 0.9 }}
        whileHover={{ 
          opacity: 1,
          backgroundColor: "rgba(15, 23, 42, 0.1)"
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.h3 
          className="text-xl font-bold text-white"
          whileHover={{ 
            scale: 1.02,
            textShadow: "0 0 10px rgba(255, 255, 255, 0.3)"
          }}
          transition={{ duration: 0.2 }}
        >
          Universal Alert Hub
        </motion.h3>
        <motion.div 
          className="flex items-center space-x-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {['⋮', '—', '⛶'].map((symbol, index) => (
            <motion.button 
              key={symbol}
              variants={headerButtonVariants}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              whileHover={{ 
                scale: 1.1,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "rgba(255, 255, 255, 1)"
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <span className="text-lg">{symbol}</span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Table Container */}
      <div className="flex-1 p-6">
        <motion.div 
          className="h-full overflow-auto rounded-lg bg-white/5 backdrop-blur-sm"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.20) transparent',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <table className="w-full">
            <motion.thead
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <tr className="bg-gradient-to-r from-teal-500/20 to-blue-500/20 border-b border-white/10">
                <th className="text-left px-4 py-3 font-semibold text-white text-sm">Indicator</th>
                <th className="text-left px-4 py-3 font-semibold text-white text-sm">Deviation (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-white text-sm">Time</th>
                <th className="text-left px-4 py-3 font-semibold text-white text-sm">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-white text-sm">Actions</th>
              </tr>
            </motion.thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {alerts.map((alert, index) => (
                <motion.tr
                  key={alert.id}
                  variants={rowVariants}
                  className={`border-b border-white/5 cursor-pointer transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white/2' : 'bg-transparent'
                  }`}
                  whileHover={{
                    backgroundColor: "rgba(20, 184, 166, 0.1)",
                    x: 4,
                    boxShadow: "0 4px 12px rgba(20, 184, 166, 0.2)"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-4 py-3 font-medium text-slate-200 text-sm">{alert.indicator}</td>
                  <td className={`px-4 py-3 font-medium text-sm ${getDeviationColor(alert.deviation)}`}>
                    {alert.deviation > 0 ? '+' : ''}{alert.deviation}%
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-sm">{alert.time}</td>
                  <td className="px-4 py-3">
                    <motion.span 
                      className={`px-3 py-1 rounded-full font-medium text-white text-xs ${
                        alert.category === 'strategic' 
                          ? 'bg-teal-500/80' 
                          : 'bg-blue-500/80'
                      }`}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
                      }}
                      transition={{ duration: 0.15 }}
                    >
                      {alert.category === 'strategic' ? 'Strategic' : 'Operational'}
                    </motion.span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {[
                        { icon: Search, label: "Search details" },
                        { icon: Settings, label: "Settings" },
                        { icon: TrendingUp, label: "View trends" }
                      ].map(({ icon: Icon, label }, actionIndex) => (
                        <motion.button 
                          key={label}
                          className="w-8 h-8 rounded-full bg-teal-500/80 flex items-center justify-center text-slate-900 transition-all duration-200"
                          aria-label={label}
                          whileHover={{ 
                            scale: 1.1,
                            backgroundColor: "rgba(20, 184, 166, 1)",
                            boxShadow: "0 4px 12px rgba(20, 184, 166, 0.4)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={{ 
                            animationDelay: `${(index * 0.1) + (actionIndex * 0.05)}s`
                          }}
                        >
                          <Icon size={14} />
                        </motion.button>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="flex justify-end mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <motion.button 
            className="font-medium text-teal-400 text-sm hover:text-teal-300 transition-colors duration-200"
            whileHover={{ 
              scale: 1.02,
              textShadow: "0 0 8px rgba(20, 184, 166, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            View All Alerts ▶
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UniversalAlertHub;
