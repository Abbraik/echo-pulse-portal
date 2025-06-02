
import React from 'react';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClaimsWidgetProps {
  onFullscreen: () => void;
  isFullscreen: boolean;
  onClose: () => void;
}

const ClaimsWidget: React.FC<ClaimsWidgetProps> = ({
  onFullscreen,
  isFullscreen,
  onClose
}) => {
  const claims = {
    total: 12,
    oldest: '5d',
    breakdown: { Think: 3, Act: 4, Learn: 2, Innovate: 3 }
  };

  if (isFullscreen) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-400">Open Claims Management</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="flex space-x-4 mb-4">
            <input 
              type="text" 
              placeholder="Search claims..." 
              className="flex-1 bg-black/20 border border-gray-600 rounded px-3 py-2 text-white"
            />
            <select className="bg-black/20 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All Zones</option>
              <option>Think</option>
              <option>Act</option>
              <option>Learn</option>
              <option>Innovate</option>
            </select>
          </div>
          
          <div className="bg-black/20 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-black/40">
                <tr>
                  <th className="text-left p-3 text-gray-300">ID</th>
                  <th className="text-left p-3 text-gray-300">Zone</th>
                  <th className="text-left p-3 text-gray-300">Issue</th>
                  <th className="text-left p-3 text-gray-300">Age</th>
                  <th className="text-left p-3 text-gray-300">Priority</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 12 }, (_, i) => (
                  <tr key={i} className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">CLM-{1000 + i}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs">
                        {Object.keys(claims.breakdown)[i % 4]}
                      </span>
                    </td>
                    <td className="p-3 text-gray-300">Data sync issue #{i + 1}</td>
                    <td className="p-3 text-gray-400">{Math.floor(Math.random() * 5) + 1}d</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        i % 3 === 0 ? 'bg-red-500/20 text-red-400' :
                        i % 3 === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-center">
            <Button className="bg-red-600 hover:bg-red-700">
              Resolve All ▶
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Claims</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullscreen}
          className="text-gray-400 hover:text-white"
        >
          <Maximize2 size={14} />
        </Button>
      </div>
      
      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-400">Open: </span>
            <span className="text-red-400 font-medium">{claims.total}</span>
          </div>
          <div>
            <span className="text-gray-400">Oldest: </span>
            <span className="text-yellow-400 font-medium">{claims.oldest}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          {Object.entries(claims.breakdown).map(([zone, count]) => (
            <div key={zone} className="flex justify-between items-center">
              <span className="text-xs text-gray-300">{zone}</span>
              <div className="flex items-center space-x-2">
                <div 
                  className="h-2 bg-teal-500 rounded"
                  style={{ width: `${(count / Math.max(...Object.values(claims.breakdown))) * 30}px` }}
                />
                <span className="text-xs text-white w-4">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClaimsWidget;
