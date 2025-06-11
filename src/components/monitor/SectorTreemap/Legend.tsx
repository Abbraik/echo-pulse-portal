
import React from 'react';

interface LegendProps {
  visible: boolean;
  groupBy: string;
}

export const Legend: React.FC<LegendProps> = ({ visible, groupBy }) => {
  if (!visible) return null;

  const getLegendItems = () => {
    switch (groupBy) {
      case 'sector':
        return [
          { color: 'rgba(0,184,255,0.3)', label: 'Systemic' },
          { color: 'rgba(0,255,195,0.3)', label: 'Population' },
          { color: 'rgba(255,193,7,0.3)', label: 'Resource Market' },
          { color: 'rgba(123,104,238,0.3)', label: 'Goods & Services' },
          { color: 'rgba(60,179,113,0.3)', label: 'Social Outcomes' },
          { color: 'rgba(199,21,133,0.3)', label: 'Governance' }
        ];
      case 'performance':
        return [
          { color: 'rgba(0,255,195,0.3)', label: 'Excellent (90%+)' },
          { color: 'rgba(255,193,7,0.3)', label: 'Good (75-89%)' },
          { color: 'rgba(255,110,110,0.3)', label: 'Needs Attention (<75%)' }
        ];
      default:
        return [
          { color: 'rgba(255,255,255,0.1)', label: 'Low Weight' },
          { color: 'rgba(255,255,255,0.2)', label: 'Medium Weight' },
          { color: 'rgba(255,255,255,0.3)', label: 'High Weight' }
        ];
    }
  };

  return (
    <div className="legend-panel" role="img" aria-label="Color legend">
      <h4 className="legend-title">Legend</h4>
      <div className="legend-items">
        {getLegendItems().map((item, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="legend-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
