
import React from 'react';

interface CLDSketchCanvasProps {
  mode: 'lesson-driven' | 'freeform' | 'moonshot';
}

export const CLDSketchCanvas: React.FC<CLDSketchCanvasProps> = ({ mode }) => {
  return (
    <div className="h-full p-2">
      <h3 className="text-lg font-medium mb-2">CLD Sketch Canvas</h3>
      <div className="bg-black/10 rounded-md h-[calc(100%-40px)] flex items-center justify-center border border-white/10">
        <div className="text-center text-muted-foreground">
          <p>Start drawing your causal loop diagram</p>
          <p className="text-sm mt-1">Use the tools above to add stocks, variables, and connections</p>
          <div className="mt-4 text-xs bg-black/20 p-2 rounded">Mode: {mode}</div>
        </div>
      </div>
    </div>
  );
};
