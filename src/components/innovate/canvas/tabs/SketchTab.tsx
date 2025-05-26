
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Layers, Settings, Plus, Minus, Circle, Square } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { DelayVisualizer } from '../../enhanced/DelayVisualizer';

interface SketchTabProps {
  onLeverageSidebarToggle: () => void;
}

export const SketchTab: React.FC<SketchTabProps> = ({ onLeverageSidebarToggle }) => {
  const { t } = useTranslation();
  const [overlayMode, setOverlayMode] = useState(false);
  const [showDelayVisualizer, setShowDelayVisualizer] = useState(false);
  const [selectedTool, setSelectedTool] = useState('select');

  const tools = [
    { id: 'select', label: t('select'), icon: <Settings size={16} /> },
    { id: 'stock', label: t('stock'), icon: <Square size={16} /> },
    { id: 'flow', label: t('flow'), icon: <Circle size={16} /> },
    { id: 'connector', label: t('connector'), icon: <Plus size={16} /> }
  ];

  return (
    <div className="h-full flex relative">
      {/* Toolbar */}
      <div className="w-16 glass-panel-deep flex flex-col items-center py-4 gap-2 border-r border-white/10">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            size="sm"
            variant="ghost"
            onClick={() => setSelectedTool(tool.id)}
            className={`w-12 h-12 p-0 ${
              selectedTool === tool.id ? 'bg-teal-500/20 text-teal-300' : ''
            }`}
            title={tool.label}
          >
            {tool.icon}
          </Button>
        ))}
        
        <div className="w-8 h-px bg-white/20 my-2" />
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onLeverageSidebarToggle}
          className="w-12 h-12 p-0"
          title={t('leveragePoints')}
        >
          <Layers size={16} />
        </Button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative">
        {/* Controls */}
        <div className="absolute top-4 left-4 z-10 glass-panel p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{t('overlayMode')}</span>
            <Switch 
              checked={overlayMode} 
              onCheckedChange={setOverlayMode}
            />
            <span className="text-xs text-muted-foreground">
              {overlayMode ? 'SNA' : 'CLD'}
            </span>
          </div>
        </div>

        {/* Mock CLD Canvas */}
        <div className="w-full h-full bg-gradient-to-br from-slate-900/20 to-slate-800/20 relative overflow-hidden">
          {/* Sample Nodes */}
          <div className="absolute top-1/3 left-1/4">
            <div 
              className={`glass-panel p-4 rounded-xl cursor-pointer transition-all ${
                overlayMode ? 'border-2 border-green-400 shadow-lg shadow-green-400/20' : ''
              }`}
              onMouseEnter={() => setShowDelayVisualizer(true)}
              onMouseLeave={() => setShowDelayVisualizer(false)}
            >
              <div className="font-medium">Youth Engagement</div>
              <div className="text-sm text-muted-foreground">45</div>
            </div>
          </div>

          <div className="absolute top-1/3 right-1/4">
            <div 
              className={`glass-panel p-4 rounded-xl cursor-pointer transition-all ${
                overlayMode ? 'border-2 border-blue-400 shadow-lg shadow-blue-400/20' : ''
              }`}
            >
              <div className="font-medium">Social Trust</div>
              <div className="text-sm text-muted-foreground">72</div>
            </div>
          </div>

          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
            <div 
              className={`glass-panel p-4 rounded-xl cursor-pointer transition-all ${
                overlayMode ? 'border-2 border-purple-400 shadow-lg shadow-purple-400/20' : ''
              }`}
            >
              <div className="font-medium">Community Cohesion</div>
              <div className="text-sm text-muted-foreground">68</div>
            </div>
          </div>

          {/* Sample Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(20, 184, 166, 0.6)" />
              </marker>
            </defs>
            <line x1="25%" y1="35%" x2="70%" y2="35%" 
                  stroke="rgba(20, 184, 166, 0.6)" strokeWidth="2" 
                  markerEnd="url(#arrowhead)" />
            <line x1="70%" y1="40%" x2="55%" y2="65%" 
                  stroke="rgba(20, 184, 166, 0.6)" strokeWidth="2" 
                  markerEnd="url(#arrowhead)" />
            <line x1="45%" y1="70%" x2="30%" y2="45%" 
                  stroke="rgba(20, 184, 166, 0.6)" strokeWidth="2" 
                  markerEnd="url(#arrowhead)" />
          </svg>

          {/* Delay Visualizer */}
          {showDelayVisualizer && (
            <DelayVisualizer flowId="youth-trust-flow" />
          )}
        </div>
      </div>
    </div>
  );
};
