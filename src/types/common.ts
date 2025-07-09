// Common types used across the application

export interface BaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DataItem {
  id: string | number;
  name: string;
  value: number;
}

export interface TrendData {
  name: string;
  value: number;
  trend?: number[];
}

export interface MetricValue {
  current: number;
  target?: number;
  unit?: string;
  trend?: number[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormError {
  field: string;
  message: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  [key: string]: string | number | boolean | undefined;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
}

export interface UserAction {
  type: string;
  payload?: any;
  timestamp: Date;
  userId?: string;
}

// Enum-like constants
export const ZONES = {
  THINK: 'THINK',
  ACT: 'ACT',
  LEARN: 'LEARN',
  INNOVATE: 'INNOVATE',
  MONITOR: 'MONITOR'
} as const;

export const STATUS_TYPES = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
} as const;

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;