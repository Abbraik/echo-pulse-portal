
import React from 'react';

const SensitivityRing: React.FC = () => {
  // Mock sensitivity data
  const sensitivityData = [
    { parameter: "Water Tariff", impact: 34 },
    { parameter: "Migration Policy", impact: 28 },
    { parameter: "Educational Investment", impact: 25 },
    { parameter: "Energy Subsidies", impact: 22 },
    { parameter: "Healthcare Access", impact: 20 },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Tornado chart visualization around the ring */}
      <div className="w-5/6 h-5/6 relative">
        {sensitivityData.map((item, index) => {
          // Position the bars around the circle
          const angle = (index / sensitivityData.length) * 360;
          const radians = (angle - 90) * (Math.PI / 180);
          const radius = 45; // percentage from center
          const centerX = 50;
          const centerY = 50;
          const x = centerX + radius * Math.cos(radians);
          const y = centerY + radius * Math.sin(radians);
          
          // Scale impact into bar width
          const barWidth = item.impact / 5; // scale factor
          
          return (
            <div 
              key={item.parameter}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${y}%`,
                left: `${x}%`,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              }}
            >
              <div 
                className="bg-teal-500/50 h-2 rounded-full"
                style={{ width: `${barWidth}px` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SensitivityRing;
