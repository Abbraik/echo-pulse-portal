
export interface SubIndicator {
  name: string;
  value: number;
  unit?: string;
  history?: number[];
}

export interface Node {
  id: string;
  label: string;
  type: 'stock' | 'subIndicator' | 'auxiliary';
  color: string;
  size?: number;
  position?: { x: number; y: number; z?: number };
  subIndicators?: SubIndicator[];
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type: 'reinforcing' | 'balancing' | 'auxiliary';
  label?: string;
}

export interface CLDData {
  nodes: Node[];
  edges: Edge[];
}

export interface SNAData {
  nodes: Node[];
  edges: Edge[];
}

export interface SystemFramingStudioProps {
  cldData: CLDData;
  snaData: SNAData;
}

// Mock data for demonstration purposes
export const mockNodes: Node[] = [
  {
    id: 'population',
    label: 'Population Size & Characteristics',
    type: 'stock',
    color: '#14B8A6', // teal-500
    position: { x: 0, y: 0, z: 0 },
    subIndicators: [
      { name: 'Fertility Rate', value: 2.1, unit: 'births/woman', history: [2.3, 2.2, 2.15, 2.1, 2.05] },
      { name: 'Age-Dependency Ratio', value: 52, unit: '%', history: [58, 56, 54, 53, 52] },
      { name: 'Migration Volatility', value: 18, unit: '%', history: [22, 20, 19, 18.5, 18] },
      { name: 'Population Growth Stability', value: 76, unit: '%', history: [70, 72, 74, 75, 76] }
    ]
  },
  {
    id: 'resources',
    label: 'Resource-Market Efficiency',
    type: 'stock',
    color: '#60A5FA', // blue-400
    position: { x: 200, y: 0, z: 0 },
    subIndicators: [
      { name: 'Resource Market Supply/Demand Ratio', value: 0.89, unit: '', history: [0.82, 0.84, 0.86, 0.88, 0.89] },
      { name: 'Energy Per Capita', value: 4.2, unit: 'MWh', history: [4.5, 4.4, 4.3, 4.25, 4.2] },
      { name: 'Water Per Capita', value: 130, unit: 'm³/year', history: [140, 137, 135, 132, 130] }
    ]
  },
  {
    id: 'goods',
    label: 'Goods & Services Market Stability',
    type: 'stock',
    color: '#64748B', // slate-500
    position: { x: 200, y: 200, z: 0 },
    subIndicators: [
      { name: 'Supply/Demand Balance', value: 0.95, unit: '', history: [0.88, 0.90, 0.92, 0.94, 0.95] },
      { name: 'Global Market Integration', value: 68, unit: '%', history: [60, 62, 64, 66, 68] },
      { name: 'Service Delivery Index', value: 72, unit: '', history: [65, 67, 69, 71, 72] }
    ]
  },
  {
    id: 'social',
    label: 'Social Cohesion',
    type: 'stock',
    color: '#1E40AF', // blue-800
    position: { x: 0, y: 200, z: 0 },
    subIndicators: [
      { name: 'Education Attainment', value: 74, unit: '%', history: [68, 70, 71, 73, 74] },
      { name: 'Health Coverage', value: 82, unit: '%', history: [75, 77, 79, 81, 82] },
      { name: 'Social Trust Index', value: 68, unit: '', history: [60, 63, 65, 67, 68] }
    ]
  }
];

export const mockEdges: Edge[] = [
  { id: 'r1', source: 'population', target: 'resources', type: 'reinforcing', label: 'R1' },
  { id: 'b1', source: 'resources', target: 'population', type: 'balancing', label: 'B1' },
  { id: 'r2', source: 'population', target: 'goods', type: 'reinforcing', label: 'R2' },
  { id: 'b2', source: 'goods', target: 'population', type: 'balancing', label: 'B2' },
  { id: 'r3', source: 'population', target: 'social', type: 'reinforcing', label: 'R3' },
  { id: 'r4', source: 'social', target: 'population', type: 'reinforcing', label: 'R4' },
  { id: 'r5', source: 'resources', target: 'goods', type: 'reinforcing', label: 'R5' },
  { id: 'b3', source: 'goods', target: 'resources', type: 'balancing', label: 'B3' },
  { id: 'r6', source: 'goods', target: 'social', type: 'reinforcing', label: 'R6' },
  { id: 'r7', source: 'social', target: 'goods', type: 'reinforcing', label: 'R7' },
  { id: 'b4', source: 'resources', target: 'social', type: 'balancing', label: 'B4' },
  { id: 'r8', source: 'social', target: 'resources', type: 'reinforcing', label: 'R8' }
];
