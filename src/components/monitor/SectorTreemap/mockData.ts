
import { Sector } from './types';

export const mockSectors: Sector[] = [
  {
    name: 'Systemic',
    indicators: [
      { id: 'sys1', name: 'System Coherence Index', sector: 'Systemic', value: 78, target: 85, weight: 0.25 },
      { id: 'sys2', name: 'Cross-Sector Alignment', sector: 'Systemic', value: 82, target: 90, weight: 0.20 },
      { id: 'sys3', name: 'Policy Integration Score', sector: 'Systemic', value: 75, target: 80, weight: 0.18 },
      { id: 'sys4', name: 'System Resilience Factor', sector: 'Systemic', value: 88, target: 92, weight: 0.22 },
      { id: 'sys5', name: 'Feedback Loop Efficiency', sector: 'Systemic', value: 71, target: 78, weight: 0.15 },
      { id: 'sys6', name: 'Adaptive Capacity', sector: 'Systemic', value: 84, target: 88, weight: 0.20 },
      { id: 'sys7', name: 'System Learning Rate', sector: 'Systemic', value: 79, target: 85, weight: 0.17 }
    ]
  },
  {
    name: 'Population',
    indicators: [
      { id: 'pop1', name: 'Human Development Index', sector: 'Population', value: 85, target: 90, weight: 0.30 },
      { id: 'pop2', name: 'Health Access Equity', sector: 'Population', value: 77, target: 85, weight: 0.25 },
      { id: 'pop3', name: 'Education Quality Score', sector: 'Population', value: 82, target: 88, weight: 0.28 },
      { id: 'pop4', name: 'Social Mobility Index', sector: 'Population', value: 69, target: 75, weight: 0.22 },
      { id: 'pop5', name: 'Digital Inclusion Rate', sector: 'Population', value: 91, target: 95, weight: 0.15 },
      { id: 'pop6', name: 'Cultural Diversity Score', sector: 'Population', value: 88, target: 92, weight: 0.18 }
    ]
  },
  {
    name: 'ResourceMarket',
    indicators: [
      { id: 'res1', name: 'Resource Efficiency Index', sector: 'ResourceMarket', value: 73, target: 80, weight: 0.28 },
      { id: 'res2', name: 'Market Stability Score', sector: 'ResourceMarket', value: 86, target: 90, weight: 0.25 },
      { id: 'res3', name: 'Circular Economy Rate', sector: 'ResourceMarket', value: 65, target: 75, weight: 0.22 },
      { id: 'res4', name: 'Innovation Investment', sector: 'ResourceMarket', value: 89, target: 92, weight: 0.20 },
      { id: 'res5', name: 'Supply Chain Resilience', sector: 'ResourceMarket', value: 78, target: 85, weight: 0.23 },
      { id: 'res6', name: 'Energy Transition Progress', sector: 'ResourceMarket', value: 81, target: 88, weight: 0.27 }
    ]
  },
  {
    name: 'GoodsServices',
    indicators: [
      { id: 'goods1', name: 'Service Quality Index', sector: 'GoodsServices', value: 84, target: 88, weight: 0.26 },
      { id: 'goods2', name: 'Innovation Rate', sector: 'GoodsServices', value: 79, target: 85, weight: 0.24 },
      { id: 'goods3', name: 'Digital Transformation', sector: 'GoodsServices', value: 92, target: 95, weight: 0.22 },
      { id: 'goods4', name: 'Sustainability Score', sector: 'GoodsServices', value: 71, target: 80, weight: 0.25 },
      { id: 'goods5', name: 'Market Competitiveness', sector: 'GoodsServices', value: 87, target: 90, weight: 0.21 },
      { id: 'goods6', name: 'Customer Satisfaction', sector: 'GoodsServices', value: 85, target: 90, weight: 0.23 }
    ]
  },
  {
    name: 'SocialOutcomes',
    indicators: [
      { id: 'social1', name: 'Well-being Index', sector: 'SocialOutcomes', value: 76, target: 82, weight: 0.30 },
      { id: 'social2', name: 'Social Cohesion Score', sector: 'SocialOutcomes', value: 83, target: 88, weight: 0.28 },
      { id: 'social3', name: 'Quality of Life Index', sector: 'SocialOutcomes', value: 89, target: 92, weight: 0.32 },
      { id: 'social4', name: 'Safety & Security', sector: 'SocialOutcomes', value: 91, target: 95, weight: 0.25 },
      { id: 'social5', name: 'Environmental Health', sector: 'SocialOutcomes', value: 74, target: 80, weight: 0.22 },
      { id: 'social6', name: 'Community Engagement', sector: 'SocialOutcomes', value: 68, target: 75, weight: 0.20 }
    ]
  },
  {
    name: 'Governance',
    indicators: [
      { id: 'gov1', name: 'Transparency Index', sector: 'Governance', value: 81, target: 88, weight: 0.28 },
      { id: 'gov2', name: 'Public Trust Score', sector: 'Governance', value: 72, target: 80, weight: 0.30 },
      { id: 'gov3', name: 'Policy Effectiveness', sector: 'Governance', value: 86, target: 90, weight: 0.26 },
      { id: 'gov4', name: 'Digital Government Index', sector: 'Governance', value: 94, target: 96, weight: 0.18 },
      { id: 'gov5', name: 'Citizen Participation', sector: 'Governance', value: 65, target: 75, weight: 0.24 },
      { id: 'gov6', name: 'Rule of Law Index', sector: 'Governance', value: 88, target: 92, weight: 0.27 }
    ]
  }
];
