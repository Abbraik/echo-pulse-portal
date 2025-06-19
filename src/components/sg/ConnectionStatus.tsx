
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectionStatusProps {
  isConnected: boolean;
  lastUpdate: string | null;
  error: string | null;
  retryCount: number;
  onReconnect: () => void;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  lastUpdate,
  error,
  retryCount,
  onReconnect,
  className = ""
}) => {
  const getStatusColor = () => {
    if (error) return 'text-red-400';
    if (isConnected) return 'text-green-400';
    return 'text-amber-400';
  };

  const getStatusIcon = () => {
    if (error) return <WifiOff size={16} className="text-red-400" />;
    if (isConnected) return <Wifi size={16} className="text-green-400" />;
    return <AlertTriangle size={16} className="text-amber-400" />;
  };

  const getStatusText = () => {
    if (error) return 'Connection Lost';
    if (isConnected) return 'Live';
    return 'Connecting...';
  };

  return (
    <motion.div 
      className={`flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ scale: isConnected ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 2, repeat: isConnected ? Infinity : 0 }}
        className="flex items-center space-x-1"
      >
        {getStatusIcon()}
        <span className={`text-sm font-mono ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </motion.div>

      {lastUpdate && isConnected && (
        <span className="text-xs text-gray-400 font-mono">
          {new Date(lastUpdate).toLocaleTimeString()}
        </span>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center space-x-2"
          >
            {retryCount > 0 && (
              <span className="text-xs text-red-400 font-mono">
                Retry {retryCount}/3
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={onReconnect}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400/50 backdrop-blur-sm"
            >
              <RefreshCw size={12} className="mr-1" />
              Reconnect
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
