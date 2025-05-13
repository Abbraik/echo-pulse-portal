
export interface Actor {
  id: string;
  type: 'government' | 'private' | 'ngo' | 'academic';
  label: string;
  degree: number;
  betweenness: number;
  closeness: number;
}

export interface Connection {
  source: string;
  target: string;
  weight: number;
}

export interface SNAMetrics {
  density: number;
  avgClustering: number;
  avgPathLength: number;
  centralization: number;
}

export interface SNAData {
  nodes: Actor[];
  edges: Connection[];
  metrics: SNAMetrics;
}
