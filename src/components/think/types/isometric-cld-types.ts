
export interface CLDNode {
  id: string;
  x: number;
  y: number;
  z?: number;
  layer: string;
  label: string;
  width: number;
  height: number;
  color: string;
  type: 'stock' | 'flow' | 'auxiliary' | 'connector';
}

export interface CLDBend {
  x: number;
  y: number;
  id: string;
}

export interface CLDConnector {
  id: string;
  from: string;
  to: string;
  bends: CLDBend[];
  layer: string;
  style: 'solid' | 'dashed';
  type: 'reinforcing' | 'balancing';
  arrowType: 'single' | 'double';
}

export interface CLDLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
  order: number;
}

export interface IsometricViewport {
  x: number;
  y: number;
  zoom: number;
  rotation: {
    x: number;
    y: number;
  };
}

export interface CLDWorkspace {
  nodes: CLDNode[];
  connectors: CLDConnector[];
  layers: CLDLayer[];
  viewport: IsometricViewport;
  snapToGrid: boolean;
  gridSize: number;
}

export type ToolType = 'select' | 'pan' | 'zoom' | 'add-node' | 'add-connector' | 'edit';

export interface CLDTool {
  id: ToolType;
  name: string;
  icon: React.ReactNode;
  shortcut?: string;
}
