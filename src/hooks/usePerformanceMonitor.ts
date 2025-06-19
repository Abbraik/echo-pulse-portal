
import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  lastRender: number;
}

export const usePerformanceMonitor = (componentName: string): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentCount: 1,
    lastRender: Date.now()
  });
  
  const renderStartTime = useRef<number>(Date.now());
  const mountTime = useRef<number>(Date.now());
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStartTime.current = Date.now();
  });

  useEffect(() => {
    const renderTime = Date.now() - renderStartTime.current;
    renderCount.current += 1;
    
    // Only update metrics if there's a significant change to avoid infinite loops
    if (renderTime > 0 || renderCount.current % 10 === 0) {
      console.info(`${componentName} render time: ${renderTime.toFixed(2)} ms`);
      
      setMetrics(prev => ({
        renderTime,
        componentCount: renderCount.current,
        lastRender: Date.now()
      }));
    }
  }, [componentName]); // Only depend on componentName which shouldn't change

  return metrics;
};
