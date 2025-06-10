
export interface TreemapNode {
  id: string;
  name: string;
  value: number;
  weight: number;
  sector: string;
  x: number;
  y: number;
  width: number;
  height: number;
  children?: TreemapNode[];
}

export interface TreemapRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class TreemapLayoutEngine {
  private static squarify(
    children: TreemapNode[],
    rect: TreemapRect,
    totalValue: number
  ): TreemapNode[] {
    if (children.length === 0) return [];

    // Sort children by value (descending)
    const sortedChildren = [...children].sort((a, b) => b.weight - a.weight);
    
    // Calculate areas
    const rectArea = rect.width * rect.height;
    const childrenWithArea = sortedChildren.map(child => ({
      ...child,
      area: (child.weight / totalValue) * rectArea
    }));

    return this.layoutChildren(childrenWithArea, rect);
  }

  private static layoutChildren(
    children: (TreemapNode & { area: number })[],
    rect: TreemapRect
  ): TreemapNode[] {
    const result: TreemapNode[] = [];
    let currentRect = { ...rect };
    
    let i = 0;
    while (i < children.length) {
      // Find the best row to minimize aspect ratio
      const row = this.getBestRow(children.slice(i), currentRect);
      const rowNodes = this.layoutRow(row, currentRect);
      
      result.push(...rowNodes);
      i += row.length;
      
      // Update remaining rectangle
      if (i < children.length) {
        currentRect = this.getNextRect(row, currentRect);
      }
    }

    return result;
  }

  private static getBestRow(
    children: (TreemapNode & { area: number })[],
    rect: TreemapRect
  ): (TreemapNode & { area: number })[] {
    if (children.length === 0) return [];
    
    const totalArea = children.reduce((sum, child) => sum + child.area, 0);
    const shortSide = Math.min(rect.width, rect.height);
    
    let bestRow = [children[0]];
    let bestRatio = this.getWorstRatio(bestRow, shortSide);
    
    for (let i = 1; i < Math.min(children.length, 6); i++) {
      const currentRow = children.slice(0, i + 1);
      const currentRatio = this.getWorstRatio(currentRow, shortSide);
      
      if (currentRatio < bestRatio) {
        bestRow = currentRow;
        bestRatio = currentRatio;
      } else {
        break;
      }
    }
    
    return bestRow;
  }

  private static getWorstRatio(
    row: (TreemapNode & { area: number })[],
    shortSide: number
  ): number {
    const totalArea = row.reduce((sum, child) => sum + child.area, 0);
    const rowWidth = totalArea / shortSide;
    
    let worstRatio = 0;
    for (const child of row) {
      const height = child.area / rowWidth;
      const ratio = Math.max(rowWidth / height, height / rowWidth);
      worstRatio = Math.max(worstRatio, ratio);
    }
    
    return worstRatio;
  }

  private static layoutRow(
    row: (TreemapNode & { area: number })[],
    rect: TreemapRect
  ): TreemapNode[] {
    const totalArea = row.reduce((sum, child) => sum + child.area, 0);
    const shortSide = Math.min(rect.width, rect.height);
    const rowThickness = totalArea / shortSide;
    
    const isVertical = rect.width > rect.height;
    let offset = 0;
    
    return row.map(child => {
      const childThickness = child.area / shortSide;
      
      const result: TreemapNode = {
        ...child,
        x: isVertical ? rect.x : rect.x + offset,
        y: isVertical ? rect.y + offset : rect.y,
        width: isVertical ? rowThickness : childThickness,
        height: isVertical ? childThickness : rowThickness
      };
      
      offset += childThickness;
      return result;
    });
  }

  private static getNextRect(
    row: (TreemapNode & { area: number })[],
    rect: TreemapRect
  ): TreemapRect {
    const totalArea = row.reduce((sum, child) => sum + child.area, 0);
    const shortSide = Math.min(rect.width, rect.height);
    const rowThickness = totalArea / shortSide;
    
    const isVertical = rect.width > rect.height;
    
    return {
      x: isVertical ? rect.x + rowThickness : rect.x,
      y: isVertical ? rect.y : rect.y + rowThickness,
      width: isVertical ? rect.width - rowThickness : rect.width,
      height: isVertical ? rect.height : rect.height - rowThickness
    };
  }

  static layout(
    indicators: any[],
    width: number,
    height: number,
    groupBy: string = 'sector'
  ): TreemapNode[] {
    // Group indicators by sector
    const groups = new Map<string, any[]>();
    
    indicators.forEach(indicator => {
      const groupKey = this.getGroupKey(indicator, groupBy);
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(indicator);
    });

    // Calculate total weight for proportional sizing
    const totalWeight = indicators.reduce((sum, i) => sum + i.weight, 0);
    
    // Create sector rectangles
    const sectorNodes: TreemapNode[] = [];
    const sectorEntries = Array.from(groups.entries());
    
    // Calculate sector weights
    const sectorsWithWeights = sectorEntries.map(([sector, items]) => ({
      sector,
      items,
      weight: items.reduce((sum, item) => sum + item.weight, 0)
    }));

    // Layout sectors first
    const sectorRects = this.squarify(
      sectorsWithWeights.map(s => ({
        id: s.sector,
        name: s.sector,
        value: s.weight,
        weight: s.weight,
        sector: s.sector,
        x: 0,
        y: 0,
        width: 0,
        height: 0
      })),
      { x: 0, y: 0, width, height },
      totalWeight
    );

    // Layout indicators within each sector
    sectorRects.forEach((sectorRect, index) => {
      const sectorData = sectorsWithWeights[index];
      const sectorWeight = sectorData.weight;
      
      // Add padding around sector
      const padding = 2;
      const innerRect = {
        x: sectorRect.x + padding,
        y: sectorRect.y + padding,
        width: Math.max(0, sectorRect.width - 2 * padding),
        height: Math.max(0, sectorRect.height - 2 * padding)
      };
      
      if (innerRect.width > 0 && innerRect.height > 0) {
        const indicatorNodes = this.squarify(
          sectorData.items.map(item => ({
            id: item.id,
            name: item.name,
            value: item.value,
            weight: item.weight,
            sector: item.sector,
            x: 0,
            y: 0,
            width: 0,
            height: 0
          })),
          innerRect,
          sectorWeight
        );

        sectorNodes.push(...indicatorNodes);
      }
    });

    return sectorNodes;
  }

  private static getGroupKey(indicator: any, groupBy: string): string {
    switch (groupBy) {
      case 'sector':
        return indicator.sector;
      case 'type':
        return 'Standard';
      case 'performance':
        const performance = (indicator.value / indicator.target) * 100;
        if (performance >= 90) return 'Excellent';
        if (performance >= 75) return 'Good';
        return 'Needs Attention';
      case 'weight':
        if (indicator.weight >= 8) return 'High Weight';
        if (indicator.weight >= 5) return 'Medium Weight';
        return 'Low Weight';
      default:
        return indicator.sector;
    }
  }
}
