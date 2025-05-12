
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Check, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  isNew?: boolean;
}

const AlertStream: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setAlerts([
        {
          id: 'alert1',
          title: 'Health Access Gap Detected',
          description: 'Rural areas showing 23% below target for healthcare accessibility. Recommend reallocation of mobile clinics.',
          severity: 'high',
          timestamp: '12 minutes ago',
          isNew: true,
        },
        {
          id: 'alert2',
          title: 'Education Coordination Opportunity',
          description: 'Cross-sector initiative potential between schools and community organizations for after-school programs.',
          severity: 'medium',
          timestamp: '2 hours ago',
        },
        {
          id: 'alert3',
          title: 'Economic Equilibrium Shift',
          description: 'Small business sector showing instability in northwest region. May require intervention.',
          severity: 'medium',
          timestamp: '4 hours ago',
        },
      ]);
      setLoading(false);
    }, 1200);
  }, []);

  const toggleAlert = (alertId: string) => {
    if (expandedAlertId === alertId) {
      setExpandedAlertId(null);
    } else {
      setExpandedAlertId(alertId);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500 bg-red-500/10';
      case 'medium':
        return 'text-amber-500 bg-amber-500/10';
      case 'low':
        return 'text-green-500 bg-green-500/10';
      default:
        return 'text-blue-500 bg-blue-500/10';
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-6 h-64 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-700/30 rounded mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-3 flex items-start">
            <div className="w-6 h-6 rounded-full bg-gray-700/30 mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700/30 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700/30 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <h2 className="text-lg font-semibold mb-4 text-left flex items-center">
        <AlertTriangle size={18} className="mr-2 text-amber-500" />
        Active Alerts
      </h2>

      <div className="space-y-3">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="relative rounded-lg overflow-hidden"
            >
              {/* Alert container */}
              <motion.div
                className={`rounded-lg border border-white/10 p-3 cursor-pointer hover:bg-white/5 transition-colors ${
                  expandedAlertId === alert.id ? 'bg-white/5' : ''
                }`}
                onClick={() => toggleAlert(alert.id)}
                layout
              >
                {/* Alert header */}
                <div className="flex items-start">
                  <div
                    className={`p-1.5 rounded-full mr-3 ${getSeverityColor(alert.severity)}`}
                  >
                    <AlertTriangle size={14} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm">{alert.title}</h3>
                      {alert.isNew && (
                        <span className="text-xs px-1.5 py-0.5 bg-teal-500/20 text-teal-400 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{alert.timestamp}</p>
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {expandedAlertId === alert.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pt-3 mt-3 border-t border-white/10"
                    >
                      <p className="text-sm text-gray-300 mb-4">{alert.description}</p>
                      <div className="flex space-x-2">
                        <button className="text-xs flex items-center px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-colors">
                          <Check size={12} className="mr-1" />
                          Acknowledge
                        </button>
                        <button className="text-xs flex items-center px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <ArrowUpRight size={12} className="mr-1" />
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {alerts.length > 0 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
            View All Alerts
          </button>
        </div>
      )}

      {alerts.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <AlertTriangle size={24} className="mx-auto opacity-50 mb-2" />
          <p>No active alerts</p>
        </div>
      )}
    </div>
  );
};

export default AlertStream;
