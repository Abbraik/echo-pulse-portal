
import React, { useState, useRef } from 'react';
import { Save, RotateCcw, Edit, Eye, ChevronsUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface CentralCLDProps {
  data: any; // We'll type this properly when building the real data interfaces
}

const CentralCLD: React.FC<CentralCLDProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [isEditing, setIsEditing] = useState(false);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  const handleSave = () => {
    toast({
      title: "CLD Map Saved",
      description: "Your changes have been saved successfully.",
      variant: "default",
    });
  };
  
  const handleReset = () => {
    // In a real implementation, this would reset the map to its default state
    toast({
      title: "CLD Map Reset",
      description: "The map has been reset to its default state.",
      variant: "default",
    });
  };
  
  const toggleViewMode = () => {
    setViewMode(prev => prev === '2D' ? '3D' : '2D');
    toast({
      title: `Switched to ${viewMode === '2D' ? '3D' : '2D'} View`,
      description: `The CLD map is now in ${viewMode === '2D' ? '3D' : '2D'} mode.`,
      variant: "default",
    });
  };
  
  const toggleEditMode = () => {
    setIsEditing(prev => !prev);
    toast({
      title: isEditing ? "View Mode" : "Edit Mode",
      description: isEditing ? "You can now view the CLD map." : "You can now edit the CLD map.",
      variant: "default",
    });
  };
  
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setDetailsPanelOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      <div className="text-center mb-2">
        <h3 className="text-white text-sm font-medium">Editable CLD Map</h3>
      </div>
      
      {/* Main Visualization Area - would normally contain Cytoscape or Three.js */}
      <div className="relative w-full h-24 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          {viewMode === '2D' ? (
            <div className="animate-pulse w-8 h-8 rounded-full bg-teal-500/50"></div>
          ) : (
            <div className="animate-pulse w-8 h-8 rounded bg-blue-500/50 transform rotate-45"></div>
          )}
        </div>
      </div>
      
      {/* Control Buttons */}
      <div className="w-full flex space-x-2 mt-1">
        <motion.button 
          className="flex-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white flex items-center justify-center"
          onClick={handleSave}
          whileTap={{ scale: 0.95 }}
        >
          <Save size={12} className="mr-1" />
          Save
        </motion.button>
        <motion.button 
          className="flex-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white flex items-center justify-center"
          onClick={handleReset}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw size={12} className="mr-1" />
          Reset
        </motion.button>
      </div>
      
      {/* Mode Toggle Buttons */}
      <div className="w-full flex space-x-2 mt-1">
        <motion.button 
          className={`flex-1 px-2 py-1 rounded text-xs flex items-center justify-center
            ${isEditing ? 'bg-teal-500/70 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
          onClick={toggleEditMode}
          whileTap={{ scale: 0.95 }}
        >
          <Edit size={12} className="mr-1" />
          {isEditing ? 'Editing' : 'Edit'}
        </motion.button>
        <motion.button 
          className="flex-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white flex items-center justify-center"
          onClick={toggleViewMode}
          whileTap={{ scale: 0.95 }}
        >
          <Eye size={12} className="mr-1" />
          {viewMode}
        </motion.button>
      </div>
      
      {/* Slide-out Details Panel */}
      <AnimatePresence>
        {detailsPanelOpen && (
          <motion.div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-l-lg p-3 w-48"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-teal-400 text-sm font-semibold">Node Details</h4>
              <button 
                className="text-white/70 hover:text-white" 
                onClick={() => setDetailsPanelOpen(false)}
              >
                <ChevronsUpDown size={16} />
              </button>
            </div>
            <div className="text-xs text-white space-y-2">
              <div>
                <span className="text-gray-400">Name:</span> Water Supply
              </div>
              <div>
                <span className="text-gray-400">Type:</span> Stock
              </div>
              <div>
                <span className="text-gray-400">Value:</span> 72.5
              </div>
              <div className="mt-2">
                <label className="text-gray-400 block">Adjust:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="72" 
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer" 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CentralCLD;
