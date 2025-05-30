
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Layers, Settings, Plus, Minus, Circle, Square, Download, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { DelayVisualizer } from '../../enhanced/DelayVisualizer';
import { motion } from 'framer-motion';

interface SketchTabProps {
  onLeverageSidebarToggle: () => void;
}

export const SketchTab: React.FC<SketchTabProps> = ({ onLeverageSidebarToggle }) => {
  const { t } = useTranslation();
  const [overlayMode, setOverlayMode] = useState(false);
  const [showDelayVisualizer, setShowDelayVisualizer] = useState(false);
  const [selectedTool, setSelectedTool] = useState('select');
  const [cldData, setCldData] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  const tools = [
    { id: 'select', label: t('select'), icon: <Settings size={16} /> },
    { id: 'stock', label: t('stock'), icon: <Square size={16} /> },
    { id: 'flow', label: t('flow'), icon: <Circle size={16} /> },
    { id: 'connector', label: t('connector'), icon: <Plus size={16} /> }
  ];

  const handleImportCLD = async () => {
    setIsImporting(true);
    // Simulate API call to Think Zone
    setTimeout(() => {
      setCldData({
        nodes: [
          { id: 'youth-engagement', x: 25, y: 35, value: 45, label: 'Youth Engagement' },
          { id: 'social-trust', x: 70, y: 35, value: 72, label: 'Social Trust' },
          { id: 'community-cohesion', x: 50, y: 65, value: 68, label: 'Community Cohesion' }
        ],
        connections: [
          { from: 'youth-engagement', to: 'social-trust', polarity: '+' },
          { from: 'social-trust', to: 'community-cohesion', polarity: '+' },
          { from: 'community-cohesion', to: 'youth-engagement', polarity: '+' }
        ]
      });
      setIsImporting(false);
    }, 2000);
  };

  useEffect(() => {
    // Auto-import CLD on mount
    handleImportCLD();
  }, []);

  return (
    <div className="h-full flex">
      {/* Toolbar - Fixed Width Left Panel */}
      <div className="w-48 glass-panel-deep flex flex-col py-4 px-3 border-r border-white/10 flex-shrink-0">
        <div className="space-y-2 mb-6">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              size="sm"
              variant="ghost"
              onClick={() => setSelectedTool(tool.id)}
              className={`w-full justify-start gap-2 ${
                selectedTool === tool.id ? 'bg-teal-500/20 text-teal-300' : ''
              }`}
            >
              {tool.icon}
              <span className="text-xs">{tool.label}</span>
            </Button>
          ))}
        </div>
        
        <div className="w-full h-px bg-white/20 my-4" />
        
        <div className="space-y-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleImportCLD}
            disabled={isImporting}
            className="w-full justify-start gap-2 text-teal-300"
          >
            {isImporting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw size={16} />
              </motion.div>
            ) : (
              <Download size={16} />
            )}
            <span className="text-xs">{isImporting ? t('importing') : t('importCLD')}</span>
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onLeverageSidebarToggle}
            className="w-full justify-start gap-2"
          >
            <Layers size={16} />
            <span className="text-xs">{t('leveragePoints')}</span>
          </Button>
        </div>
      </div>

      {/* Canvas Area - Flexible Width */}
      <div className="flex-1 relative overflow-hidden">
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

        {/* CLD Canvas - Full Size */}
        <div className="w-full h-full bg-gradient-to-br from-slate-900/20 to-slate-800/20 relative overflow-hidden">
          {cldData ? (
            <>
              {/* Live CLD Nodes */}
              {cldData.nodes.map((node) => (
                <motion.div
                  key={node.id}
                  className={`absolute cursor-pointer transition-all duration-300 ${
                    overlayMode ? 'border-2 border-green-400 shadow-lg shadow-green-400/20' : ''
                  }`}
                  style={{ 
                    left: `${node.x}%`, 
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * cldData.nodes.indexOf(node) }}
                  onMouseEnter={() => setShowDelayVisualizer(true)}
                  onMouseLeave={() => setShowDelayVisualizer(false)}
                >
                  <div className="glass-panel p-4 rounded-xl min-w-32">
                    <div className="font-medium text-sm">{node.label}</div>
                    <div className="text-xs text-muted-foreground">{node.value}</div>
                  </div>
                </motion.div>
              ))}

              {/* Live CLD Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                          refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="rgba(20, 184, 166, 0.8)" />
                  </marker>
                </defs>
                {cldData.connections.map((conn, index) => {
                  const fromNode = cldData.nodes.find(n => n.id === conn.from);
                  const toNode = cldData.nodes.find(n => n.id === conn.to);
                  if (!fromNode || !toNode) return null;
                  
                  return (
                    <motion.line
                      key={`${conn.from}-${conn.to}`}
                      x1={`${fromNode.x}%`} y1={`${fromNode.y}%`}
                      x2={`${toNode.x}%`} y2={`${toNode.y}%`}
                      stroke="rgba(20, 184, 166, 0.8)" 
                      strokeWidth="2" 
                      markerEnd="url(#arrowhead)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                    />
                  );
                })}
              </svg>

              {/* Delay Visualizer */}
              {showDelayVisualizer && (
                <DelayVisualizer flowId="youth-trust-flow" />
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <RefreshCw size={48} className="mx-auto mb-4 text-teal-400/50 animate-spin" />
                <div className="font-noto-medium text-lg text-gray-400">{t('importingCLD')}</div>
                <div className="text-sm text-gray-500 mt-2">{t('fetchingFromThinkZone')}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
