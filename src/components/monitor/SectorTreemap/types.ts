
export interface Indicator {
  id: string;
  name: string;
  sector: 'Systemic' | 'Population' | 'ResourceMarket' | 'GoodsServices' | 'SocialOutcomes' | 'Governance';
  value: number;
  target: number;
  weight: number;
}

export type Sector = { 
  name: string; 
  indicators: Indicator[]; 
}
