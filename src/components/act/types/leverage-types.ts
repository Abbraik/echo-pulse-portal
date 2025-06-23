
export interface LeveragePoint {
  id: string;
  name: string;
  description: string;
  currentUsage: number;     // 0–100%
  recommended: boolean;
}

export interface LeveragePointChipData {
  id: string;
  name: string;
  recommended: boolean;
}
