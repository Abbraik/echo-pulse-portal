
import React from 'react';
import { Sector } from './types';

interface SectorTreemapProps {
  sectors: Sector[];
}

interface PositionedIndicator {
  id: string;
  name: string;
  sector: string;
  x: number;
  y: number;
  width: number;
  height: number;
  weight: number;
}

const SectorTreemap: React.FC<SectorTreemapProps> = ({ sectors }) => {
  const W = 800; // SVG width
  const H = 600; // SVG height
  
  // Step 1: Flatten data and compute areas
  const indicators = sectors.flatMap(s => s.indicators);
  const totalWeight = indicators.reduce((sum, i) => sum + i.weight, 0);
  const svgArea = W * H;
  
  const indicatorsWithArea = indicators.map(i => ({
    ...i,
    area: (i.weight / totalWeight) * svgArea
  }));

  // Step 2: Basic row-by-row packing
  const numberOfRows = Math.ceil(indicators.length / 6);
  const rowHeight = H / numberOfRows;
  
  const positionedIndicators: PositionedIndicator[] = [];
  let currentRow = 0;
  let currentX = 0;
  let indicatorsInCurrentRow = 0;
  const maxIndicatorsPerRow = 6;

  indicatorsWithArea.forEach((indicator, index) => {
    const width = indicator.area / rowHeight;
    
    // Check if we need to start a new row
    if (indicatorsInCurrentRow >= maxIndicatorsPerRow || currentX + width > W) {
      currentRow++;
      currentX = 0;
      indicatorsInCurrentRow = 0;
    }
    
    const y = currentRow * rowHeight;
    
    positionedIndicators.push({
      id: indicator.id,
      name: indicator.name,
      sector: indicator.sector,
      x: currentX,
      y: y,
      width: width,
      height: rowHeight,
      weight: indicator.weight
    });
    
    // Log computed values for verification
    console.log(`Indicator ${indicator.name}: x=${currentX.toFixed(2)}, y=${y.toFixed(2)}, width=${width.toFixed(2)}, height=${rowHeight.toFixed(2)}, weight=${indicator.weight}`);
    
    currentX += width;
    indicatorsInCurrentRow++;
  });

  // Step 4: Group indicators by sector for labels
  const sectorGroups = new Map<string, PositionedIndicator[]>();
  positionedIndicators.forEach(indicator => {
    if (!sectorGroups.has(indicator.sector)) {
      sectorGroups.set(indicator.sector, []);
    }
    sectorGroups.get(indicator.sector)!.push(indicator);
  });

  return (
    <div 
      className="sector-treemap-card h-full w-full p-4"
      style={{ 
        background: 'rgba(10, 20, 40, 0.3)', 
        borderRadius: '1rem' 
      }}
    >
      <div className="text-white">
        <h3 className="text-xl font-semibold mb-4">Sector Treemap</h3>
        
        {/* Step 3: Render SVG with rectangles */}
        <svg width={W} height={H} className="border border-gray-500">
          {/* Render rectangles for each indicator */}
          {positionedIndicators.map((indicator) => (
            <rect
              key={indicator.id}
              x={indicator.x}
              y={indicator.y}
              width={indicator.width}
              height={indicator.height}
              fill="none"
              stroke="black"
              strokeWidth="1"
            />
          ))}
          
          {/* Step 4: Render sector labels */}
          {Array.from(sectorGroups.entries()).map(([sectorName, indicators]) => {
            // Find the first (leftmost) indicator in this sector
            const firstIndicator = indicators.reduce((leftmost, current) => 
              current.x < leftmost.x ? current : leftmost
            );
            
            return (
              <text
                key={sectorName}
                x={firstIndicator.x}
                y={firstIndicator.y - 4}
                fill="#000"
                fontSize="12"
                fontFamily="Arial, sans-serif"
              >
                {sectorName}
              </text>
            );
          })}
        </svg>
        
        {/* Debug info */}
        <div className="mt-4 text-sm text-gray-300">
          <p>Total Indicators: {indicators.length}</p>
          <p>Total Weight: {totalWeight.toFixed(2)}</p>
          <p>SVG Dimensions: {W} x {H}</p>
          <p>Row Height: {rowHeight.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default SectorTreemap;
