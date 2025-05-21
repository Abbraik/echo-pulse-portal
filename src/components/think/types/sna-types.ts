
export interface Actor {
  id: string;
  type: 'government' | 'private' | 'ngo' | 'academic';
  label: string;
  degree: number;
  betweenness: number;
  closeness: number;
  color?: string;
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

export interface ExecutionPathway {
  id: string;
  title: string;
  description: string;
  actors: string[];
  coordinationTime: number;
  impact: number;
  relatedObjectives: number[]; // Added missing property for objectives relationship
}

export interface ActorInfluence {
  actorId: string;
  score: number;
}

export interface PathwayAnalysis {
  pathways: ExecutionPathway[];
  topInfluencers: ActorInfluence[];
  bottlenecks: ActorInfluence[];
}
