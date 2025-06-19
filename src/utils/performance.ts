
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} execution time: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }) as T;
}

export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
}

export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  
  mark(name: string): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(performance.now());
  }
  
  measure(startMark: string, endMark: string): number {
    const startTimes = this.metrics.get(startMark);
    const endTimes = this.metrics.get(endMark);
    
    if (!startTimes || !endTimes || startTimes.length === 0 || endTimes.length === 0) {
      return 0;
    }
    
    const startTime = startTimes[startTimes.length - 1];
    const endTime = endTimes[endTimes.length - 1];
    
    return endTime - startTime;
  }
  
  getAverageTime(name: string): number {
    const times = this.metrics.get(name);
    if (!times || times.length < 2) return 0;
    
    let totalTime = 0;
    for (let i = 1; i < times.length; i++) {
      totalTime += times[i] - times[i - 1];
    }
    
    return totalTime / (times.length - 1);
  }
  
  clear(name?: string): void {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }
  
  getReport(): Record<string, { average: number; count: number }> {
    const report: Record<string, { average: number; count: number }> = {};
    
    for (const [name, times] of this.metrics.entries()) {
      report[name] = {
        average: this.getAverageTime(name),
        count: times.length
      };
    }
    
    return report;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();
