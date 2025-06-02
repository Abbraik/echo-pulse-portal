
import React, { useState } from 'react';
import DomainHeatmap from './heatmap/DomainHeatmap';
import IndicatorTable from './heatmap/IndicatorTable';

const HeatmapTableView: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleHeatmapCellClick = (domain: string, category: string) => {
    setSelectedDomain(domain);
    setSelectedCategory(category);
  };

  return (
    <div className="space-y-6">
      {/* Domain Heatmap */}
      <div style={{ height: '45vh' }}>
        <DomainHeatmap onCellClick={handleHeatmapCellClick} />
      </div>
      
      {/* Indicator Table */}
      <div style={{ height: '55vh' }}>
        <IndicatorTable 
          selectedDomain={selectedDomain}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  );
};

export default HeatmapTableView;
