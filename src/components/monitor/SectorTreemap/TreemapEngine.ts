
export interface TreemapTile {
  id: string;
  name: string;
  value: number;
  target: number;
  weight: number;
  sector: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TreemapSector {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tiles: TreemapTile[];
}

interface SquarifyNode {
  id: string;
  name: string;
  value: number;
  target: number;
  weight: number;
  sector: string;
  area: number;
}

export class TreemapEngine {
  private static SECTOR_GUTTER = 4;
  private static TILE_GUTTER = 2;

  static generateLayout(
    indicators: any[],
    containerWidth: number,
    containerHeight: number
  ): TreemapSector[] {
    // Group indicators by sector
    const sectorGroups = new Map<string, any[]>();
    indicators.forEach(indicator => {
      if (!sectorGroups.has(indicator.sector)) {
        sectorGroups.set(indicator.sector, []);
      }
      sectorGroups.get(indicator.sector)!.push(indicator);
    });

    // Calculate sector layout (2x3 grid)
    const sectors = Array.from(sectorGroups.keys());
    const cols = 3;
    const rows = 2;
    
    const sectorWidth = (containerWidth - (cols - 1) * this.SECTOR_GUTTER) / cols;
    const sectorHeight = (containerHeight - (rows - 1) * this.SECTOR_GUTTER) / rows;

    const sectorRects: TreemapSector[] = [];

    sectors.forEach((sectorName, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const x = col * (sectorWidth + this.SECTOR_GUTTER);
      const y = row * (sectorHeight + this.SECTOR_GUTTER);
      
      const indicators = sectorGroups.get(sectorName) || [];
      const tiles = this.layoutTilesInSector(indicators, x, y, sectorWidth, sectorHeight);
      
      sectorRects.push({
        name: sectorName,
        x,
        y,
        width: sectorWidth,
        height: sectorHeight,
        tiles
      });
    });

    return sectorRects;
  }

  private static layoutTilesInSector(
    indicators: any[],
    sectorX: number,
    sectorY: number,
    sectorWidth: number,
    sectorHeight: number
  ): TreemapTile[] {
    if (indicators.length === 0) return [];

    // Add padding for sector label
    const padding = 20; // Space for sector label
    const availableWidth = sectorWidth - this.TILE_GUTTER * 2;
    const availableHeight = sectorHeight - padding - this.TILE_GUTTER;
    
    const totalWeight = indicators.reduce((sum, ind) => sum + ind.weight, 0);
    const totalArea = availableWidth * availableHeight;

    // Prepare nodes for squarify algorithm
    const nodes: SquarifyNode[] = indicators.map(ind => ({
      ...ind,
      area: (ind.weight / totalWeight) * totalArea
    })).sort((a, b) => b.area - a.area);

    // Apply squarify algorithm
    const tiles = this.squarify(
      nodes,
      sectorX + this.TILE_GUTTER,
      sectorY + padding,
      availableWidth,
      availableHeight
    );

    return tiles;
  }

  private static squarify(
    nodes: SquarifyNode[],
    x: number,
    y: number,
    width: number,
    height: number
  ): TreemapTile[] {
    if (nodes.length === 0) return [];
    if (nodes.length === 1) {
      return [{
        id: nodes[0].id,
        name: nodes[0].name,
        value: nodes[0].value,
        target: nodes[0].target,
        weight: nodes[0].weight,
        sector: nodes[0].sector,
        x: x + this.TILE_GUTTER / 2,
        y: y + this.TILE_GUTTER / 2,
        width: Math.max(0, width - this.TILE_GUTTER),
        height: Math.max(0, height - this.TILE_GUTTER)
      }];
    }

    const totalArea = nodes.reduce((sum, node) => sum + node.area, 0);
    const ratio = width / height;
    
    // Find the best row to minimize aspect ratio
    let bestRow: SquarifyNode[] = [];
    let bestWorst = Infinity;
    
    for (let i = 1; i <= Math.min(nodes.length, 6); i++) {
      const row = nodes.slice(0, i);
      const worst = this.worst(row, ratio, totalArea, width, height);
      
      if (worst < bestWorst) {
        bestWorst = worst;
        bestRow = row;
      } else {
        break;
      }
    }

    const rowNodes = bestRow;
    const remainingNodes = nodes.slice(rowNodes.length);
    
    // Layout the row
    const rowTiles = this.layoutRow(rowNodes, x, y, width, height, totalArea);
    
    if (remainingNodes.length === 0) {
      return rowTiles;
    }

    // Recursively layout remaining nodes
    const rowArea = rowNodes.reduce((sum, node) => sum + node.area, 0);
    const remainingArea = totalArea - rowArea;
    
    let nextX = x;
    let nextY = y;
    let nextWidth = width;
    let nextHeight = height;
    
    if (width > height) {
      // Horizontal split
      const rowWidth = (rowArea / totalArea) * width;
      nextX = x + rowWidth;
      nextWidth = width - rowWidth;
    } else {
      // Vertical split
      const rowHeight = (rowArea / totalArea) * height;
      nextY = y + rowHeight;
      nextHeight = height - rowHeight;
    }

    const remainingTiles = this.squarify(
      remainingNodes,
      nextX,
      nextY,
      nextWidth,
      nextHeight
    );

    return [...rowTiles, ...remainingTiles];
  }

  private static layoutRow(
    row: SquarifyNode[],
    x: number,
    y: number,
    width: number,
    height: number,
    totalArea: number
  ): TreemapTile[] {
    const rowArea = row.reduce((sum, node) => sum + node.area, 0);
    const tiles: TreemapTile[] = [];
    
    if (width > height) {
      // Horizontal layout
      const rowWidth = (rowArea / totalArea) * width;
      let currentY = y;
      
      row.forEach(node => {
        const tileHeight = (node.area / rowArea) * height;
        tiles.push({
          id: node.id,
          name: node.name,
          value: node.value,
          target: node.target,
          weight: node.weight,
          sector: node.sector,
          x: x + this.TILE_GUTTER / 2,
          y: currentY + this.TILE_GUTTER / 2,
          width: Math.max(0, rowWidth - this.TILE_GUTTER),
          height: Math.max(0, tileHeight - this.TILE_GUTTER)
        });
        currentY += tileHeight;
      });
    } else {
      // Vertical layout
      const rowHeight = (rowArea / totalArea) * height;
      let currentX = x;
      
      row.forEach(node => {
        const tileWidth = (node.area / rowArea) * width;
        tiles.push({
          id: node.id,
          name: node.name,
          value: node.value,
          target: node.target,
          weight: node.weight,
          sector: node.sector,
          x: currentX + this.TILE_GUTTER / 2,
          y: y + this.TILE_GUTTER / 2,
          width: Math.max(0, tileWidth - this.TILE_GUTTER),
          height: Math.max(0, rowHeight - this.TILE_GUTTER)
        });
        currentX += tileWidth;
      });
    }

    return tiles;
  }

  private static worst(
    row: SquarifyNode[],
    ratio: number,
    totalArea: number,
    width: number,
    height: number
  ): number {
    const rowArea = row.reduce((sum, node) => sum + node.area, 0);
    const rowRatio = width > height ? 
      ((rowArea / totalArea) * width) / height :
      width / ((rowArea / totalArea) * height);
    
    let worst = 0;
    
    for (const node of row) {
      const tileRatio = width > height ?
        ((rowArea / totalArea) * width) / ((node.area / rowArea) * height) :
        ((node.area / rowArea) * width) / ((rowArea / totalArea) * height);
      
      const aspectRatio = Math.max(tileRatio, 1 / tileRatio);
      worst = Math.max(worst, aspectRatio);
    }
    
    return worst;
  }
}
