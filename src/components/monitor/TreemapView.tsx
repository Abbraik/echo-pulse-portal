
import React, { useState } from 'react';
import MasterTreemapCard from './treemap/MasterTreemapCard';
import UniversalAlertHub from './treemap/UniversalAlertHub';
import AnomalyDetector from './treemap/AnomalyDetector';

const TreemapView: React.FC = () => {
  const [filterMode, setFilterMode] = useState<'all' | 'strategic' | 'operational'>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-6">
      {/* Master Treemap Card */}
      <div style={{ height: '65vh' }}>
        <MasterTreemapCard 
          filterMode={filterMode}
          onFilterChange={setFilterMode}
          isExpanded={isExpanded}
          onExpandToggle={setIsExpanded}
        />
      </div>
      
      {/* Alerts & Anomalies */}
      {!isExpanded && (
        <div className="flex gap-6" style={{ height: '35vh' }}>
          <div className="flex-[3]">
            <UniversalAlertHub />
          </div>
          <div className="flex-[2]">
            <AnomalyDetector />
          </div>
        </div>
      )}
    </div>
  );
};

export default TreemapView;
