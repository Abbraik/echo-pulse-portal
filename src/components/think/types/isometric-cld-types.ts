
export interface CLDNode {
  id: string;
  x: number;
  y: number;
  z: number;
  layer: string;
  label: string;
  width: number;
  height: number;
  color: string;
  type: 'variable' | 'stock' | 'flow' | 'connector';
}

export interface CLDConnector {
  id: string;
  from: string;
  to: string;
  bends: Array<{ x: number; y: number }>;
  layer: string;
  style: 'solid' | 'dashed';
  polarity: 'positive' | 'negative';
}

export interface CLDLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
  order: number;
}

export interface IsometricCLDState {
  nodes: CLDNode[];
  connectors: CLDConnector[];
  layers: CLDLayer[];
  selectedTool: 'select' | 'pan' | 'add-node' | 'add-connector';
  selectedNodeId: string | null;
  selectedConnectorId: string | null;
  zoom: number;
  panOffset: { x: number; y: number };
  snapToGrid: boolean;
  gridSize: number;
}

export interface ViewportTransform {
  zoom: number;
  panOffset: { x: number; y: number };
}
