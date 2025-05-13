
import React, { useState } from 'react';
import { Layers, LayoutGrid, Save, RotateCcw, Plus } from 'lucide-react';

interface Node {
  id?: string;
  name?: string;
  type?: string;
}

interface Link {
  source?: string;
  target?: string;
  type?: string;
}

interface CLDData {
  nodes: Node[];
  links: Link[];
}

interface SNAData {
  nodes: Node[];
  edges: Link[];
}

interface SystemFramingStudioProps {
  cldData: CLDData;
  snaData: SNAData;
}

const SystemFramingStudio: React.FC<SystemFramingStudioProps> = ({ cldData, snaData }) => {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  const handleSave = () => {
    console.log('Saving system frame...');
    // In a real app, this would call the API endpoint /think/cld/save
  };

  const handleReset = () => {
    console.log('Resetting system frame...');
    // In a real app, this would call the API endpoint /think/cld/reset
  };

  const handleAddNode = () => {
    console.log('Adding new node...');
    // In a real app, this would open a node creation dialog
  };

  return (
    <div className="flex flex-col">
      {/* Mode toggle and toolbar */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('2d')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center ${
              viewMode === '2d' 
                ? 'bg-teal-500/70 text-white' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <LayoutGrid size={16} className="mr-1.5" />
            2D View
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center ${
              viewMode === '3d' 
                ? 'bg-teal-500/70 text-white' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Layers size={16} className="mr-1.5" />
            3D View
          </button>
        </div>
        <button 
          onClick={handleAddNode}
          className="px-3 py-1.5 text-sm bg-teal-500/30 text-teal-300 rounded-lg hover:bg-teal-500/40 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-1.5" />
          Add Node
        </button>
      </div>

      {/* Main visualization area */}
      <div className="aspect-video bg-navy-800/50 rounded-lg flex items-center justify-center border border-white/10 mb-4">
        {viewMode === '2d' ? (
          <div className="text-center">
            <p className="text-gray-400 mb-2">2D Causal Loop Diagram & Social Network Analysis</p>
            <p className="text-xs text-gray-500">
              In a real implementation, this would render using Cytoscape.js
            </p>
            
            {/* Placeholder visualization elements */}
            <div className="mt-6 flex justify-center">
              <div className="relative w-[300px] h-[200px]">
                {/* Population node */}
                <div className="absolute top-10 left-10 h-16 w-16 rounded-full bg-teal-500/30 border border-teal-500/50 flex items-center justify-center">
                  <span className="text-xs">Population</span>
                </div>
                
                {/* Resources node */}
                <div className="absolute top-10 right-10 h-16 w-16 rounded-full bg-blue-500/30 border border-blue-500/50 flex items-center justify-center">
                  <span className="text-xs">Resources</span>
                </div>
                
                {/* Goods node */}
                <div className="absolute bottom-10 left-10 h-16 w-16 rounded-full bg-purple-500/30 border border-purple-500/50 flex items-center justify-center">
                  <span className="text-xs">Goods</span>
                </div>
                
                {/* Social node */}
                <div className="absolute bottom-10 right-10 h-16 w-16 rounded-full bg-amber-500/30 border border-amber-500/50 flex items-center justify-center">
                  <span className="text-xs">Social</span>
                </div>
                
                {/* Connection lines - highly simplified */}
                <div className="absolute top-[68px] left-[84px] h-[64px] w-[132px] border-t-2 border-teal-500/50 rounded-full"></div>
                <div className="absolute top-[88px] left-[26px] h-[24px] w-[258px] border-b-2 border-blue-500/50 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-400 mb-2">3D Isometric Network Visualization</p>
            <p className="text-xs text-gray-500">
              In a real implementation, this would render using React Three Fiber
            </p>
            
            {/* 3D placeholder - would be replaced with actual 3D rendering */}
            <div className="mt-6 perspective-[800px] flex justify-center items-center">
              <div className="relative transform-gpu rotate-x-[30deg] rotate-z-[30deg]">
                {/* 3D nodes would go here */}
                <div className="bg-gradient-to-b from-teal-400/40 to-teal-600/40 h-10 w-10 rounded-full absolute top-0 left-0 transform-gpu shadow-lg"></div>
                <div className="bg-gradient-to-b from-blue-400/40 to-blue-600/40 h-10 w-10 rounded-full absolute top-0 right-0 transform-gpu shadow-lg"></div>
                <div className="bg-gradient-to-b from-purple-400/40 to-purple-600/40 h-10 w-10 rounded-full absolute bottom-0 left-0 transform-gpu shadow-lg"></div>
                <div className="bg-gradient-to-b from-amber-400/40 to-amber-600/40 h-10 w-10 rounded-full absolute bottom-0 right-0 transform-gpu shadow-lg"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions bar */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-sm bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors flex items-center"
        >
          <RotateCcw size={16} className="mr-1.5" />
          Reset
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1.5 text-sm bg-teal-500/70 text-white rounded-lg hover:bg-teal-500/90 transition-colors flex items-center"
        >
          <Save size={16} className="mr-1.5" />
          Save
        </button>
      </div>
    </div>
  );
};

export default SystemFramingStudio;
