
import React from 'react';
import { X } from 'lucide-react';
import { Node } from '../types/system-framing-types';
import SparklineChart from './SparklineChart';

interface NodePopupProps {
  node: Node | null;
  onClose: () => void;
}

const NodePopup: React.FC<NodePopupProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-lg border border-white/20 p-4 w-[300px] text-left">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium" style={{ color: node.color }}>{node.label}</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
          <X size={16} />
        </button>
      </div>
      <div className="space-y-2">
        {node.subIndicators?.map((indicator) => (
          <div key={indicator.name} className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-300">{indicator.name}: </span>
              <span className="text-white font-medium">
                {indicator.value} {indicator.unit || ''}
              </span>
            </div>
            {indicator.history && <SparklineChart data={indicator.history} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodePopup;
