
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getColorByValue(value: number, threshold: { low: number; medium: number; high: number }) {
  if (value <= threshold.low) {
    return "red";
  } else if (value <= threshold.medium) {
    return "amber";
  } else {
    return "emerald";
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getRandomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Creates a throttle function that limits how often a function can fire
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall < limit) return;
    lastCall = now;
    return func(...args);
  };
}

// Creates a debounce function that delays invoking a function
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
