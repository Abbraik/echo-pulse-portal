
import { ReactElement } from "react";

// Type for the color values accepted by the GaugeComponent
export type GaugeColorType = 'teal' | 'blue' | 'amber' | 'purple' | 'emerald' | 'gold' | 'rose';

export interface KpiData {
  id: string;
  name: string;
  value: number;
  target: number;
  min: number;
  max: number;
  color: GaugeColorType;
  type: 'gauge' | 'grid' | 'sparkline';
  icon: React.ElementType;
  data?: number[];
}
