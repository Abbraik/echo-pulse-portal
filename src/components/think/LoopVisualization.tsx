
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp } from 'lucide-react';

interface LoopVisualizationProps {
  loopId: string;
  name: string;
  type: 'reinforcing' | 'balancing';
  description: string;
  nodes: string[];
  coverageRatio: number;
  netEffect: number;
  onPromoteObjective?: () => void;
}

const LoopVisualization: React.FC<LoopVisualizationProps> = ({
  loopId,
  name,
  type,
  description,
  nodes,
  coverageRatio,
  netEffect,
  onPromoteObjective
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const loopColor = type === 'reinforcing' ? '#14b8a6' : '#f97316'; // teal-500 : orange-500
  const centerLabel = type === 'reinforcing' ? 'R' : 'B';
  
  // Calculate positions for nodes in a circle
  const radius = 45;
  const centerX = 60;
  const centerY = 60;
  
  const nodePositions = nodes.map((_, index) => {
    const angle = (index * 2 * Math.PI) / nodes.length - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      angle
    };
  });

  const handleDiagramClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="glass-panel p-4 space-y-4">
      <div className="flex items-start gap-4">
        {/* Loop Diagram */}
        <div 
          className="flex-shrink-0 cursor-pointer group relative"
          onClick={handleDiagramClick}
          onKeyDown={(e) => e.key === 'Enter' && handleDiagramClick()}
          tabIndex={0}
          role="button"
          aria-label={`${name} ${type} loop diagram`}
          aria-expanded={isExpanded}
        >
          <svg 
            width="120" 
            height="120" 
            viewBox="0 0 120 120"
            className="transition-transform duration-300 group-hover:scale-105"
          >
            {/* Background circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius + 5}
              fill="none"
              stroke={loopColor}
              strokeWidth="2"
              strokeOpacity="0.3"
              className="group-hover:stroke-opacity-50 transition-all duration-300"
            />
            
            {/* Arrows connecting nodes */}
            {nodePositions.map((pos, index) => {
              const nextIndex = (index + 1) % nodePositions.length;
              const nextPos = nodePositions[nextIndex];
              
              // Calculate arrow direction
              const dx = nextPos.x - pos.x;
              const dy = nextPos.y - pos.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const unitX = dx / length;
              const unitY = dy / length;
              
              // Adjust start and end points to not overlap with nodes
              const startX = pos.x + unitX * 8;
              const startY = pos.y + unitY * 8;
              const endX = nextPos.x - unitX * 8;
              const endY = nextPos.y - unitY * 8;
              
              return (
                <g key={`arrow-${index}`}>
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke={loopColor}
                    strokeWidth="2"
                    className={`transition-all duration-300 ${
                      hoveredNode === index || hoveredNode === nextIndex 
                        ? 'stroke-opacity-100' 
                        : 'stroke-opacity-70 group-hover:stroke-opacity-90'
                    }`}
                  />
                  {/* Arrow head */}
                  <polygon
                    points={`${endX},${endY} ${endX - 4 * unitX + 2 * unitY},${endY - 4 * unitY - 2 * unitX} ${endX - 4 * unitX - 2 * unitY},${endY - 4 * unitY + 2 * unitX}`}
                    fill={loopColor}
                    className={`transition-all duration-300 ${
                      hoveredNode === index || hoveredNode === nextIndex 
                        ? 'fill-opacity-100' 
                        : 'fill-opacity-70 group-hover:fill-opacity-90'
                    }`}
                  />
                </g>
              );
            })}
            
            {/* Nodes */}
            {nodePositions.map((pos, index) => (
              <circle
                key={`node-${index}`}
                cx={pos.x}
                cy={pos.y}
                r="6"
                fill={loopColor}
                className={`transition-all duration-300 cursor-pointer ${
                  hoveredNode === index 
                    ? 'fill-opacity-100 drop-shadow-lg' 
                    : 'fill-opacity-80 group-hover:fill-opacity-90'
                }`}
                onMouseEnter={() => setHoveredNode(index)}
                onMouseLeave={() => setHoveredNode(null)}
              />
            ))}
            
            {/* Center label */}
            <circle
              cx={centerX}
              cy={centerY}
              r="15"
              fill={loopColor}
              fillOpacity="0.2"
              stroke={loopColor}
              strokeWidth="2"
              className="group-hover:fill-opacity-30 transition-all duration-300"
            />
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-lg font-bold"
              fill={loopColor}
              style={{ filter: `drop-shadow(0 0 4px ${loopColor}40)` }}
            >
              {centerLabel}
            </text>
          </svg>
          
          {/* Hover tooltip */}
          {hoveredNode !== null && (
            <div className="absolute -top-2 left-full ml-2 z-10 bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
              <div>Coverage: {(coverageRatio * 100).toFixed(0)}%</div>
              <div>Effect: {netEffect >= 0 ? '+' : ''}{netEffect.toFixed(1)}%</div>
            </div>
          )}
        </div>
        
        {/* Loop Description */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-white">{name}</h4>
            <Badge 
              variant="secondary" 
              className={type === 'reinforcing' ? 'bg-teal-500/20 text-teal-400' : 'bg-orange-500/20 text-orange-400'}
            >
              {t(type)}
            </Badge>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {description}
          </p>
          
          {/* Metrics */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Coverage: {(coverageRatio * 100).toFixed(0)}%</span>
            <span className={netEffect >= 0 ? 'text-teal-400' : 'text-orange-400'}>
              Effect: {netEffect >= 0 ? '+' : ''}{netEffect.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Expanded View */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-white/10 pt-4 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium text-white">Loop Sequence</h5>
              <div className="space-y-1">
                {nodes.map((node, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: loopColor }}
                    />
                    <span className="text-gray-300">{node}</span>
                    {index < nodes.length - 1 && (
                      <span className="text-gray-500">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-medium text-white">Actions</h5>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
                  onClick={() => {
                    // Simulate showing time-series chart
                    console.log('Showing time-series chart for', loopId);
                  }}
                >
                  <TrendingUp size={12} className="mr-2" />
                  View Time Series
                </Button>
                
                {onPromoteObjective && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                    onClick={onPromoteObjective}
                  >
                    <Target size={12} className="mr-2" />
                    {t('promoteToAct')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LoopVisualization;
