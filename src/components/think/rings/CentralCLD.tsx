
import React from 'react';
import { Save, RotateCcw } from 'lucide-react';

const CentralCLD: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      <div className="text-center mb-2">
        <h3 className="text-white text-sm font-medium">Editable CLD Map</h3>
      </div>
      
      <div className="w-full flex space-x-2 mt-2">
        <button 
          className="flex-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white flex items-center justify-center"
          onClick={() => console.log('Save CLD')}
        >
          <Save size={12} className="mr-1" />
          Save
        </button>
        <button 
          className="flex-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white flex items-center justify-center"
          onClick={() => console.log('Reset CLD')}
        >
          <RotateCcw size={12} className="mr-1" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default CentralCLD;
