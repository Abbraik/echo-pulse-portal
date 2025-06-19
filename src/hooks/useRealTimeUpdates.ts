
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RealTimeConfig {
  enabled: boolean;
  interval: number;
  maxRetries: number;
  backoffMultiplier: number;
}

interface RealTimeState {
  isConnected: boolean;
  lastUpdate: string | null;
  retryCount: number;
  error: string | null;
}

export const useRealTimeUpdates = (
  refreshCallback: () => Promise<void>,
  config: RealTimeConfig = {
    enabled: true,
    interval: 120000, // Default to 2 minutes instead of 30 seconds
    maxRetries: 3,
    backoffMultiplier: 2
  }
) => {
  const [state, setState] = useState<RealTimeState>({
    isConnected: false,
    lastUpdate: null,
    retryCount: 0,
    error: null
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  };

  const handleSuccess = () => {
    setState(prev => ({
      ...prev,
      isConnected: true,
      lastUpdate: new Date().toISOString(),
      retryCount: 0,
      error: null
    }));
  };

  const handleError = (error: any) => {
    const errorMessage = error instanceof Error ? error.message : 'Connection failed';
    
    setState(prev => ({
      ...prev,
      isConnected: false,
      error: errorMessage,
      retryCount: prev.retryCount + 1
    }));

    // Show toast for connection issues only on first failure to avoid spam
    if (state.retryCount === 0) {
      toast({
        title: "Connection Issue",
        description: "Real-time updates temporarily unavailable",
        variant: "destructive",
      });
    }
  };

  const performUpdate = async () => {
    try {
      await refreshCallback();
      handleSuccess();
    } catch (error) {
      handleError(error);
      
      // Implement exponential backoff for retries
      if (state.retryCount < config.maxRetries) {
        const retryDelay = config.interval * Math.pow(config.backoffMultiplier, state.retryCount);
        retryTimeoutRef.current = setTimeout(() => {
          performUpdate();
        }, retryDelay);
      }
    }
  };

  const startRealTimeUpdates = () => {
    if (!config.enabled) return;

    clearTimers();
    
    // Initial update only if no data exists
    if (!state.lastUpdate) {
      performUpdate();
    }
    
    // Set up interval for regular updates with longer interval
    intervalRef.current = setInterval(() => {
      performUpdate();
    }, config.interval);
  };

  const stopRealTimeUpdates = () => {
    clearTimers();
    setState(prev => ({
      ...prev,
      isConnected: false
    }));
  };

  const reconnect = () => {
    setState(prev => ({
      ...prev,
      retryCount: 0,
      error: null
    }));
    startRealTimeUpdates();
  };

  useEffect(() => {
    if (config.enabled) {
      startRealTimeUpdates();
    }

    return () => {
      clearTimers();
    };
  }, [config.enabled, config.interval]);

  return {
    ...state,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    reconnect
  };
};
