
import { SNAData } from '../types/sna-types';

export const mockSnaData: SNAData = {
  nodes: [
    { 
      id: 'gov1', 
      type: 'government', 
      label: 'Central Government', 
      degree: 5, 
      betweenness: 0.42, 
      closeness: 0.78,
      color: '#14b8a6'
    },
    { 
      id: 'gov2', 
      type: 'government', 
      label: 'Local Authority', 
      degree: 4, 
      betweenness: 0.28, 
      closeness: 0.65,
      color: '#14b8a6'
    },
    { 
      id: 'corp1', 
      type: 'private', 
      label: 'Multinational Corp', 
      degree: 3, 
      betweenness: 0.15, 
      closeness: 0.52,
      color: '#3b82f6'
    },
    { 
      id: 'corp2', 
      type: 'private', 
      label: 'Local Business', 
      degree: 2, 
      betweenness: 0.08, 
      closeness: 0.44,
      color: '#3b82f6'
    },
    { 
      id: 'ngo1', 
      type: 'ngo', 
      label: 'International NGO', 
      degree: 3, 
      betweenness: 0.22, 
      closeness: 0.56,
      color: '#a855f7'
    },
    { 
      id: 'ngo2', 
      type: 'ngo', 
      label: 'Community Group', 
      degree: 2, 
      betweenness: 0.06, 
      closeness: 0.42,
      color: '#a855f7'
    },
    { 
      id: 'acad1', 
      type: 'academic', 
      label: 'University', 
      degree: 4, 
      betweenness: 0.18, 
      closeness: 0.62,
      color: '#f59e0b'
    },
  ],
  edges: [
    { source: 'gov1', target: 'corp1', weight: 0.8 },
    { source: 'gov1', target: 'ngo1', weight: 0.6 },
    { source: 'gov1', target: 'gov2', weight: 0.9 },
    { source: 'gov1', target: 'acad1', weight: 0.5 },
    { source: 'gov2', target: 'corp2', weight: 0.7 },
    { source: 'gov2', target: 'ngo2', weight: 0.8 },
    { source: 'corp1', target: 'ngo1', weight: 0.4 },
    { source: 'corp1', target: 'corp2', weight: 0.6 },
    { source: 'ngo1', target: 'ngo2', weight: 0.7 },
    { source: 'ngo1', target: 'acad1', weight: 0.5 },
    { source: 'acad1', target: 'corp2', weight: 0.4 },
    { source: 'acad1', target: 'gov2', weight: 0.6 }
  ],
  metrics: {
    density: 0.42,
    avgClustering: 0.31,
    avgPathLength: 2.4,
    centralization: 0.68
  }
};
