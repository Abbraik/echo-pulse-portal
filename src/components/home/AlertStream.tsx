
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, CheckCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from '../../api/dashboard';
import { getAlerts } from '../../api/dashboard';

const AlertStream: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [readAlerts, setReadAlerts] = useState<string[]>([]);
  
  useEffect(() => {
    getAlerts().then(setAlerts);
    
    // Simulate receiving new alerts periodically
    const interval = setInterval(() => {
      // Random chance to add a new alert
      if (Math.random() > 0.7) {
        const types: Alert['type'][] = ['warning', 'info', 'error', 'success'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const messages = [
          'Population model update required',
          'Resource allocation threshold reached',
          'Data synchronization completed',
          'System maintenance scheduled',
          'Anomaly detected in pattern recognition'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: randomType,
          message: randomMessage,
          timestamp: new Date().toISOString(),
          isNew: true
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 8)]);
        
        // Remove "isNew" flag after animation
        setTimeout(() => {
          setAlerts(prev => 
            prev.map(alert => 
              alert.id === newAlert.id ? { ...alert, isNew: false } : alert
            )
          );
        }, 3000);
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="text-amber-400" size={18} />;
      case 'error': return <AlertTriangle className="text-red-400" size={18} />;
      case 'info': return <Info className="text-blue-400" size={18} />;
      case 'success': return <CheckCircle className="text-emerald-400" size={18} />;
      default: return <Info className="text-gray-400" size={18} />;
    }
  };
  
  const getAlertBgClass = (type: Alert['type']) => {
    switch (type) {
      case 'warning': return 'bg-amber-500/10 border-amber-500/30';
      case 'error': return 'bg-red-500/10 border-red-500/30';
      case 'info': return 'bg-blue-500/10 border-blue-500/30';
      case 'success': return 'bg-emerald-500/10 border-emerald-500/30';
      default: return 'bg-gray-500/10 border-gray-500/30';
    }
  };
  
  const dismissAlert = (id: string) => {
    setReadAlerts(prev => [...prev, id]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 300);
  };
  
  return (
    <div className="glass-panel p-5 h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-blue-400" />
          <h3 className="text-lg font-medium">Alerts & Notifications</h3>
        </div>
        <span className="text-xs text-gray-400 bg-gray-700/30 px-2 py-1 rounded-full">
          {alerts.length} active
        </span>
      </div>
      
      <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
        <AnimatePresence>
          {alerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: alert.isNew ? [1, 1.03, 1] : 1,
                transition: { 
                  duration: 0.3,
                  scale: { duration: 0.5 }
                }
              }}
              exit={{ opacity: 0, x: -50 }}
              className={`${getAlertBgClass(alert.type)} rounded-lg border p-3 flex items-start justify-between ${
                readAlerts.includes(alert.id) ? 'opacity-50' : ''
              } ${alert.isNew ? 'ring-1 ring-teal-500 shadow-lg' : ''}`}
            >
              <div className="flex gap-3">
                <div className="mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => dismissAlert(alert.id)}
                className="text-gray-400 hover:text-gray-300"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {alerts.length === 0 && (
          <div className="h-24 flex items-center justify-center text-gray-400 text-sm">
            No active alerts
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertStream;
