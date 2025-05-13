
import React from 'react';
import { Html } from '@react-three/drei';
import SparklineChart from './SparklineChart';

interface NodeSubIndicator {
  name: string;
  value: number;
  history?: number[];
}

interface NodeInfoPopupProps {
  nodeId: string;
  position: [number, number, number];
  subIndicators: NodeSubIndicator[];
}

const NodeInfoPopup: React.FC<NodeInfoPopupProps> = ({
  nodeId,
  position,
  subIndicators,
}) => {
  return (
    <Html position={[position[0], position[1] + 1.5, position[2]]}>
      <div className="w-64 p-3 bg-black/70 backdrop-blur-md border border-white/20 rounded-lg shadow-xl text-left transform -translate-x-1/2">
        <h3 className="text-teal-300 font-bold text-lg mb-2">
          {nodeId.charAt(0).toUpperCase() + nodeId.slice(1)}
        </h3>
        
        <div className="space-y-2">
          {subIndicators.map((indicator, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">{indicator.name}:</span>
              <div className="flex items-center">
                <span className="text-white font-medium text-sm mr-2">
                  {indicator.value}
                </span>
                {indicator.history && (
                  <div className="h-6 w-16">
                    <SparklineChart data={indicator.history} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Html>
  );
};

export default NodeInfoPopup;
