
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SmartRefreshButtonProps {
  onRefresh: () => Promise<void>;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  isLoading?: boolean;
  lastRefresh?: string;
  className?: string;
}

export const SmartRefreshButton: React.FC<SmartRefreshButtonProps> = ({
  onRefresh,
  autoRefresh,
  onToggleAutoRefresh,
  isLoading = false,
  lastRefresh,
  className = ""
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing || isLoading) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          variant="outline"
          size="sm"
          className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400/50 backdrop-blur-sm transition-all duration-200"
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
          >
            <RefreshCw size={14} className="mr-2" />
          </motion.div>
          {isRefreshing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onToggleAutoRefresh}
          variant="outline"
          size="sm"
          className={`backdrop-blur-sm transition-all duration-200 ${
            autoRefresh
              ? 'border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-400/50'
              : 'border-gray-500/30 text-gray-400 hover:bg-gray-500/10 hover:border-gray-400/50'
          }`}
        >
          {autoRefresh ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap size={14} className="mr-2" />
              </motion.div>
              Auto-Sync On
            </>
          ) : (
            <>
              <Clock size={14} className="mr-2" />
              Auto-Sync Off
            </>
          )}
        </Button>
      </motion.div>

      {lastRefresh && (
        <span className="text-xs text-gray-400 font-mono">
          Last: {new Date(lastRefresh).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};
