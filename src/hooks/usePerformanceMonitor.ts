
import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  memoryUsage?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentCount: 0
  });

  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;

    setMetrics(prev => ({
      ...prev,
      renderTime,
      componentCount: prev.componentCount + 1,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || undefined
    }));

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time:`, renderTime.toFixed(2), 'ms');
    }
  });

  return metrics;
};
