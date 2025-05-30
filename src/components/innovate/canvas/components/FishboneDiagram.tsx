
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Branch {
  id: string;
  name: string;
  deltaValue: number;
  impactMetric: number;
  type: 'reinforcing' | 'balancing';
  color: string;
}

interface FishboneDiagramProps {
  baselineLabel: string;
  branches: Branch[];
  width: number;
  height: number;
  onBranchSelect?: (branchId: string) => void;
  selectedBranchId?: string | null;
}

interface TooltipState {
  visible: boolean;
  branch: Branch | null;
  x: number;
  y: number;
}

export const FishboneDiagram: React.FC<FishboneDiagramProps> = ({
  baselineLabel,
  branches,
  width,
  height,
  onBranchSelect,
  selectedBranchId
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, branch: null, x: 0, y: 0 });
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);

  // Layout calculations
  const margin = { left: 80, right: 80, top: 40, bottom: 40 };
  const centerY = height / 2;
  const baselineStartX = margin.left;
  const baselineEndX = width - margin.right;
  const spineLength = baselineEndX - baselineStartX;
  const maxBranchLength = Math.min(120, (height - 120) / 2);
  const maxImpactMetric = Math.max(...branches.map(b => b.impactMetric), 1);

  // Initialize component
  useEffect(() => {
    if (width > 0 && height > 0) {
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [width, height]);

  // Calculate branch positions
  const getBranchPositions = () => {
    if (branches.length === 0) return [];

    return branches.map((branch, index) => {
      // Anchor point on spine
      const anchorX = baselineStartX + ((index + 1) * (spineLength / (branches.length + 1)));
      
      // Branch direction and length
      const isUpward = index % 2 === 0;
      const angle = isUpward ? -30 : 30;
      const branchLength = Math.max(60, (branch.impactMetric / maxImpactMetric) * maxBranchLength);
      
      // Calculate end position
      const angleRad = (angle * Math.PI) / 180;
      const endX = anchorX + Math.cos(angleRad) * branchLength;
      const endY = centerY + Math.sin(angleRad) * branchLength;
      
      // Control point for smooth curve
      const controlX = anchorX + Math.cos(angleRad) * branchLength * 0.7;
      const controlY = centerY + Math.sin(angleRad) * branchLength * 0.5;
      
      return {
        ...branch,
        anchorX,
        anchorY: centerY,
        endX,
        endY,
        controlX,
        controlY,
        branchLength,
        isUpward,
        pathData: `M ${anchorX},${centerY} Q ${controlX},${controlY} ${endX},${endY}`
      };
    });
  };

  const branchPositions = getBranchPositions();

  const handleBranchClick = (branchId: string) => {
    onBranchSelect?.(branchId);
  };

  const handleBranchHover = (branch: Branch, event: React.MouseEvent, entering: boolean) => {
    if (entering) {
      setHoveredBranch(branch.id);
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        setTooltip({
          visible: true,
          branch,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 10
        });
      }
    } else {
      setHoveredBranch(null);
      setTooltip({ visible: false, branch: null, x: 0, y: 0 });
    }
  };

  if (!isReady || width <= 0 || height <= 0) {
    return <div className="w-full h-full bg-slate-800/20 rounded-lg animate-pulse" />;
  }

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        role="img"
        aria-label={`Fishbone diagram showing ${baselineLabel} with ${branches.length} scenarios`}
      >
        <defs>
          <linearGradient id="spineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main Spine Line */}
        <motion.line
          x1={baselineStartX}
          y1={centerY}
          x2={baselineEndX}
          y2={centerY}
          stroke="url(#spineGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Baseline Node */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <circle
            cx={baselineStartX}
            cy={centerY}
            r="40"
            fill="rgba(20, 30, 50, 0.8)"
            stroke="#14b8a6"
            strokeWidth="3"
            filter="url(#glow)"
          />
          <text
            x={baselineStartX}
            y={centerY - 8}
            textAnchor="middle"
            className="fill-white text-sm font-bold"
            style={{ fontFamily: 'Noto Sans' }}
          >
            Current
          </text>
          <text
            x={baselineStartX}
            y={centerY + 8}
            textAnchor="middle"
            className="fill-teal-300 text-xs"
            style={{ fontFamily: 'Noto Sans' }}
          >
            (+0)
          </text>
        </motion.g>

        {/* Branch Lines */}
        {branchPositions.map((branch, index) => {
          const isSelected = selectedBranchId === branch.id;
          const isHovered = hoveredBranch === branch.id;
          
          return (
            <motion.path
              key={`branch-${branch.id}`}
              d={branch.pathData}
              stroke={branch.color}
              strokeWidth={isSelected ? "6" : isHovered ? "5" : "4"}
              fill="none"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: 1.0 + index * 0.1,
                duration: 0.5,
                ease: "easeOut"
              }}
              style={{ 
                opacity: isSelected || isHovered ? 1 : 0.8,
                transition: 'stroke-width 0.2s ease, opacity 0.2s ease'
              }}
            />
          );
        })}

        {/* Branch Nodes */}
        {branchPositions.map((branch, index) => {
          const isSelected = selectedBranchId === branch.id;
          const isHovered = hoveredBranch === branch.id;
          const nodeWidth = width < 600 ? 80 : 100;
          const nodeHeight = width < 600 ? 40 : 50;

          return (
            <motion.g
              key={`node-${branch.id}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 1.2 + index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ scale: 1.1 }}
              style={{ cursor: 'pointer' }}
              onClick={() => handleBranchClick(branch.id)}
              onMouseEnter={(e) => handleBranchHover(branch, e as any, true)}
              onMouseLeave={(e) => handleBranchHover(branch, e as any, false)}
              role="button"
              aria-label={`${branch.name}: +${branch.deltaValue}%`}
              tabIndex={0}
            >
              <rect
                x={branch.endX - nodeWidth / 2}
                y={branch.endY - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                rx="8"
                fill="rgba(20, 30, 50, 0.8)"
                stroke={isSelected || isHovered ? branch.color : '#ffffff40'}
                strokeWidth={isSelected ? "3" : "2"}
                filter="url(#glow)"
                style={{
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.2s ease'
                }}
              />
              <text
                x={branch.endX}
                y={branch.endY - 8}
                textAnchor="middle"
                className="fill-white text-xs font-bold"
                style={{ fontFamily: 'Noto Sans' }}
              >
                {branch.name.length > 12 ? branch.name.substring(0, 12) + '...' : branch.name}
              </text>
              <text
                x={branch.endX}
                y={branch.endY + 8}
                textAnchor="middle"
                className="fill-teal-300 text-xs"
                style={{ fontFamily: 'Noto Sans' }}
              >
                +{branch.deltaValue}
              </text>
            </motion.g>
          );
        })}

        {/* Labels */}
        <text
          x={margin.left - 20}
          y={centerY - 50}
          textAnchor="end"
          className="fill-gray-400 text-sm font-medium"
        >
          Current State
        </text>
        <text
          x={baselineEndX + 20}
          y={centerY - 50}
          textAnchor="start"
          className="fill-gray-400 text-sm font-medium"
        >
          Future Vision
        </text>
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip.visible && tooltip.branch && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translateX(-50%) translateY(-100%)'
            }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="glass-panel-deep p-3 rounded-lg border border-teal-400/30 min-w-48">
              <div className="text-sm font-bold text-white mb-2">{tooltip.branch.name}</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-300">Delta Value:</span>
                  <span className="text-teal-400">+{tooltip.branch.deltaValue}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Impact:</span>
                  <span className="text-teal-400">{tooltip.branch.impactMetric}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Type:</span>
                  <span className={tooltip.branch.type === 'reinforcing' ? 'text-green-400' : 'text-orange-400'}>
                    {tooltip.branch.type}
                  </span>
                </div>
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-400/30"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
