
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface DataSyncIndicatorProps {
  status: 'syncing' | 'synced' | 'error' | 'stale';
  lastSync?: string;
  nextSync?: string;
  className?: string;
}

export const DataSyncIndicator: React.FC<DataSyncIndicatorProps> = ({
  status,
  lastSync,
  nextSync,
  className = ""
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'syncing':
        return {
          icon: <Loader2 size={14} className="animate-spin" />,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
          text: 'Syncing...'
        };
      case 'synced':
        return {
          icon: <CheckCircle2 size={14} />,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          text: 'Synced'
        };
      case 'error':
        return {
          icon: <AlertCircle size={14} />,
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          text: 'Sync Error'
        };
      case 'stale':
        return {
          icon: <Clock size={14} />,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/20',
          borderColor: 'border-amber-500/30',
          text: 'Data Stale'
        };
      default:
        return {
          icon: <Clock size={14} />,
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/30',
          text: 'Unknown'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <motion.div 
      className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${config.bgColor} border ${config.borderColor} backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={status === 'syncing' ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 1, repeat: status === 'syncing' ? Infinity : 0 }}
        className={config.color}
      >
        {config.icon}
      </motion.div>
      
      <div className="flex flex-col">
        <span className={`text-xs font-medium ${config.color}`}>
          {config.text}
        </span>
        
        {lastSync && status === 'synced' && (
          <span className="text-xs text-gray-400 font-mono">
            {new Date(lastSync).toLocaleTimeString()}
          </span>
        )}
        
        {nextSync && status !== 'syncing' && (
          <span className="text-xs text-gray-500 font-mono">
            Next: {new Date(nextSync).toLocaleTimeString()}
          </span>
        )}
      </div>
    </motion.div>
  );
};
