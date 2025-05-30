
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Scenario {
  id: string;
  name: string;
  impact: number;          // 0–1 normalized impact score
  disturbance: number;     // 0–1 normalized disturbance score
  deltaMetrics: Record<string, number>;
}

interface RadialDendrogramProps {
  width: number;
  height: number;
  baselineLabel: string;
  scenarios: Scenario[];
  onSelectScenario: (id: string) => void;
  selectedScenarioId?: string;
}

interface Position {
  x: number;
  y: number;
}

interface QuadrantInfo {
  name: string;
  color: string;
  description: string;
}

const RadialDendrogram: React.FC<RadialDendrogramProps> = ({
  width,
  height,
  baselineLabel,
  scenarios,
  onSelectScenario,
  selectedScenarioId
}) => {
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const baselineRadius = 50;
  const minRadius = 100;
  const maxRadius = Math.min(width, height) / 2 - 80;

  // Quadrant definitions
  const quadrants: Record<string, QuadrantInfo> = {
    'sweet-spot': { name: 'Sweet Spot', color: '#10B981', description: 'High Impact / Low Disturbance' },
    'bold-experiments': { name: 'Bold Experiments', color: '#F59E0B', description: 'High Impact / High Disturbance' },
    'risky-tweaks': { name: 'Risky Tweaks', color: '#F97316', description: 'Low Impact / High Disturbance' },
    'safe-pilots': { name: 'Safe Pilots', color: '#14B8A6', description: 'Low Impact / Low Disturbance' }
  };

  // Convert scenario to polar coordinates
  const getScenarioPosition = (scenario: Scenario): Position => {
    // Map disturbance to quadrant angles
    const disturbanceToAngle = (disturbance: number): number => {
      if (disturbance <= 0.5) {
        // Low disturbance: left quadrants (-45° to -135°)
        const t = disturbance * 2; // normalize to 0-1
        return scenario.impact <= 0.5 
          ? -45 - (t * 90)  // Bottom-left (safe pilots)
          : -45 - (t * 90);  // Top-left (sweet spot)
      } else {
        // High disturbance: right quadrants (-225° to -315°)
        const t = (disturbance - 0.5) * 2; // normalize to 0-1
        return scenario.impact <= 0.5
          ? -225 - (t * 90)  // Bottom-right (risky tweaks)
          : -315 + (t * 90);  // Top-right (bold experiments)
      }
    };

    const angle = getScenarioAngle(scenario);
    const radius = minRadius + (scenario.impact * (maxRadius - minRadius));
    
    const angleRad = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleRad),
      y: centerY + radius * Math.sin(angleRad)
    };
  };

  const getScenarioAngle = (scenario: Scenario): number => {
    // Map to quadrant centers based on impact and disturbance
    if (scenario.impact > 0.5 && scenario.disturbance <= 0.5) {
      // Top-left: Sweet Spot
      return -90 + (scenario.disturbance * 45) + ((scenario.impact - 0.5) * 45);
    } else if (scenario.impact > 0.5 && scenario.disturbance > 0.5) {
      // Top-right: Bold Experiments
      return -45 + ((scenario.disturbance - 0.5) * 45) + ((scenario.impact - 0.5) * 45);
    } else if (scenario.impact <= 0.5 && scenario.disturbance > 0.5) {
      // Bottom-right: Risky Tweaks
      return 0 + ((scenario.disturbance - 0.5) * 45) + (scenario.impact * 45);
    } else {
      // Bottom-left: Safe Pilots
      return -135 + (scenario.disturbance * 45) + (scenario.impact * 45);
    }
  };

  const getQuadrantColor = (scenario: Scenario): string => {
    if (scenario.impact > 0.5 && scenario.disturbance <= 0.5) return quadrants['sweet-spot'].color;
    if (scenario.impact > 0.5 && scenario.disturbance > 0.5) return quadrants['bold-experiments'].color;
    if (scenario.impact <= 0.5 && scenario.disturbance > 0.5) return quadrants['risky-tweaks'].color;
    return quadrants['safe-pilots'].color;
  };

  // Quadrant background arcs
  const createQuadrantArc = (startAngle: number, endAngle: number, color: string) => {
    const start1 = (startAngle * Math.PI) / 180;
    const end1 = (endAngle * Math.PI) / 180;
    const start2 = start1;
    const end2 = end1;

    const x1 = centerX + minRadius * Math.cos(start1);
    const y1 = centerY + minRadius * Math.sin(start1);
    const x2 = centerX + maxRadius * Math.cos(start1);
    const y2 = centerY + maxRadius * Math.sin(start1);
    const x3 = centerX + maxRadius * Math.cos(end1);
    const y3 = centerY + maxRadius * Math.sin(end1);
    const x4 = centerX + minRadius * Math.cos(end1);
    const y4 = centerY + minRadius * Math.sin(end1);

    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

    return `M ${x1} ${y1} 
            L ${x2} ${y2} 
            A ${maxRadius} ${maxRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}
            L ${x4} ${y4}
            A ${minRadius} ${minRadius} 0 ${largeArcFlag} 0 ${x1} ${y1} Z`;
  };

  const handleScenarioClick = (scenarioId: string) => {
    onSelectScenario(scenarioId);
  };

  const handleKeyDown = (event: React.KeyboardEvent, scenarioId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleScenarioClick(scenarioId);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Scenario comparison radial diagram"
        className="overflow-visible"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10"/>
          </filter>
        </defs>

        {/* Quadrant background arcs */}
        <g opacity="0.2">
          <path
            d={createQuadrantArc(-135, -90, quadrants['sweet-spot'].color)}
            fill={quadrants['sweet-spot'].color}
          />
          <path
            d={createQuadrantArc(-90, -45, quadrants['bold-experiments'].color)}
            fill={quadrants['bold-experiments'].color}
          />
          <path
            d={createQuadrantArc(-45, 0, quadrants['risky-tweaks'].color)}
            fill={quadrants['risky-tweaks'].color}
          />
          <path
            d={createQuadrantArc(-180, -135, quadrants['safe-pilots'].color)}
            fill={quadrants['safe-pilots'].color}
          />
        </g>

        {/* Baseline center node */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <circle
            cx={centerX}
            cy={centerY}
            r={baselineRadius}
            fill="rgba(20, 30, 50, 0.8)"
            stroke="#14B8A6"
            strokeWidth="3"
            filter="url(#glow)"
          />
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#14B8A6"
            fontSize="12"
            fontFamily="Noto Sans"
            fontWeight="bold"
          >
            {baselineLabel}
          </text>
        </motion.g>

        {/* Scenario nodes */}
        <AnimatePresence>
          {scenarios.map((scenario, index) => {
            const position = getScenarioPosition(scenario);
            const isSelected = selectedScenarioId === scenario.id;
            const isHovered = hoveredScenario === scenario.id;
            const quadrantColor = getQuadrantColor(scenario);

            return (
              <motion.g
                key={scenario.id}
                initial={{ 
                  x: centerX - position.x, 
                  y: centerY - position.y, 
                  scale: 0, 
                  opacity: 0 
                }}
                animate={{ 
                  x: 0, 
                  y: 0, 
                  scale: isHovered ? 1.2 : 1, 
                  opacity: 1 
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Connection line to center */}
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={position.x}
                  y2={position.y}
                  stroke="#14B8A6"
                  strokeWidth="1"
                  opacity="0.3"
                  strokeDasharray="2,2"
                />

                {/* Scenario node */}
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="20"
                  fill="rgba(20, 30, 50, 0.6)"
                  stroke={isSelected ? quadrantColor : "#14B8A6"}
                  strokeWidth={isSelected ? "4" : "2"}
                  filter={isHovered ? "url(#glow)" : undefined}
                  style={{ backdropFilter: 'blur(20px)' }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Scenario ${scenario.name}: impact ${scenario.impact}, disturbance ${scenario.disturbance}`}
                  className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
                  onClick={() => handleScenarioClick(scenario.id)}
                  onMouseEnter={() => setHoveredScenario(scenario.id)}
                  onMouseLeave={() => setHoveredScenario(null)}
                  onKeyDown={(e) => handleKeyDown(e, scenario.id)}
                />

                {/* Scenario label */}
                <text
                  x={position.x}
                  y={position.y + 35}
                  textAnchor="middle"
                  fill="#14B8A6"
                  fontSize="12"
                  fontFamily="Noto Sans"
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {scenario.name}
                </text>

                {/* Selection pulse animation */}
                {isSelected && (
                  <motion.circle
                    cx={position.x}
                    cy={position.y}
                    r="20"
                    fill="none"
                    stroke={quadrantColor}
                    strokeWidth="2"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.g>
            );
          })}
        </AnimatePresence>

        {/* Quadrant labels */}
        <g className="pointer-events-none">
          <text x={centerX - maxRadius + 20} y={centerY - maxRadius + 20} fill="#14B8A6" fontSize="10" fontWeight="bold">
            Sweet Spot
          </text>
          <text x={centerX + maxRadius - 80} y={centerY - maxRadius + 20} fill="#F59E0B" fontSize="10" fontWeight="bold">
            Bold Experiments
          </text>
          <text x={centerX + maxRadius - 80} y={centerY + maxRadius - 10} fill="#F97316" fontSize="10" fontWeight="bold">
            Risky Tweaks
          </text>
          <text x={centerX - maxRadius + 20} y={centerY + maxRadius - 10} fill="#14B8A6" fontSize="10" fontWeight="bold">
            Safe Pilots
          </text>
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredScenario && (
        <div
          className="absolute pointer-events-none z-10 bg-slate-900/90 border border-teal-400/30 rounded-lg p-3 backdrop-blur-md"
          style={{
            left: getScenarioPosition(scenarios.find(s => s.id === hoveredScenario)!).x + 30,
            top: getScenarioPosition(scenarios.find(s => s.id === hoveredScenario)!).y - 50,
          }}
          role="tooltip"
          aria-live="polite"
        >
          {(() => {
            const scenario = scenarios.find(s => s.id === hoveredScenario)!;
            return (
              <div className="text-sm">
                <div className="font-bold text-teal-400 mb-2">{scenario.name}</div>
                <div className="text-gray-300 text-xs mb-2">
                  Impact: {(scenario.impact * 100).toFixed(0)}% | 
                  Disturbance: {(scenario.disturbance * 100).toFixed(0)}%
                </div>
                <div className="space-y-1">
                  {Object.entries(scenario.deltaMetrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-400 capitalize">{key}:</span>
                      <span className={value > 0 ? 'text-green-400' : 'text-red-400'}>
                        {value > 0 ? '+' : ''}{value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default RadialDendrogram;
