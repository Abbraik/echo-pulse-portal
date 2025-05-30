
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Branch {
  name: string;
  deltaValue: number;
  impactMetric: number;
  type: 'reinforcing' | 'balancing';
  id: string;
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

interface TooltipData {
  branch: Branch;
  visible: boolean;
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
  const [spineAnimated, setSpineAnimated] = useState(false);
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Layout constants
  const marginLeft = width * 0.1;
  const marginRight = width * 0.1;
  const centerY = height * 0.5;
  const usableSpineLength = width - marginLeft - marginRight;
  const maxBranchLength = width < 600 ? 80 : 120;
  const maxImpactMetric = Math.max(...branches.map(b => b.impactMetric), 1);
  const isSmallScreen = width < 600;

  // Trigger spine animation
  useEffect(() => {
    if (width > 0) {
      const timer = setTimeout(() => setSpineAnimated(true), 100);
      return () => clearTimeout(timer);
    }
  }, [width]);

  // Calculate branch positions
  const calculateBranchPositions = () => {
    const n = branches.length;
    if (n === 0) return [];

    return branches.map((branch, index) => {
      // Anchor point on spine
      const anchorX = marginLeft + ((index + 1) * (usableSpineLength / (n + 1)));
      
      // Branch length based on impact metric
      const branchLength = Math.min(maxBranchLength, (branch.impactMetric / maxImpactMetric) * maxBranchLength);
      
      // Alternate direction: even up, odd down
      const isUp = index % 2 === 0;
      const angle = isSmallScreen ? (isUp ? -60 : 60) : (isUp ? -30 : 30);
      const angleRad = (angle * Math.PI) / 180;
      
      // End point
      const endX = anchorX + Math.cos(angleRad) * branchLength;
      const endY = centerY + Math.sin(angleRad) * branchLength;
      
      // Control points for Bézier curve
      const controlX = anchorX + Math.cos(angleRad) * branchLength * 0.6;
      const controlY = centerY + Math.sin(angleRad) * branchLength * 0.8;
      
      return {
        ...branch,
        anchorX,
        anchorY: centerY,
        endX,
        endY,
        controlX,
        controlY,
        branchLength,
        angle,
        pathData: `M ${anchorX} ${centerY} Q ${controlX} ${controlY} ${endX} ${endY}`
      };
    });
  };

  const positionedBranches = calculateBranchPositions();

  const handleBranchHover = (branch: Branch, event: React.MouseEvent, isEntering: boolean) => {
    if (isEntering) {
      setHoveredBranch(branch.id);
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        setTooltip({
          branch,
          visible: true,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 10
        });
      }
    } else {
      setHoveredBranch(null);
      setTooltip(null);
    }
  };

  const handleBranchClick = (branchId: string) => {
    onBranchSelect?.(branchId);
  };

  const getBranchColor = (type: 'reinforcing' | 'balancing') => {
    return type === 'reinforcing' ? '#14b8a6' : '#f97316';
  };

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        role="img"
        aria-label={`Fishbone diagram comparing scenarios to ${baselineLabel}`}
      >
        <defs>
          <linearGradient id="spineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(20, 184, 166, 0.6)" />
            <stop offset="50%" stopColor="rgba(20, 184, 166, 1)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)" />
          </linearGradient>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="pulseGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Baseline Spine */}
        <motion.line
          x1={marginLeft}
          y1={centerY}
          x2={width - marginRight}
          y2={centerY}
          stroke="url(#spineGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#neonGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: spineAnimated ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Baseline Node */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <circle
            cx={marginLeft}
            cy={centerY}
            r="40"
            fill="rgba(20, 184, 166, 0.2)"
            stroke="rgba(20, 184, 166, 0.8)"
            strokeWidth="4"
            filter="url(#neonGlow)"
            style={{ backdropFilter: 'blur(20px)' }}
          />
          <text
            x={marginLeft}
            y={centerY - 5}
            textAnchor="middle"
            className="fill-white text-sm font-bold"
            style={{ fontFamily: 'Noto Sans' }}
          >
            {baselineLabel}
          </text>
          <text
            x={marginLeft}
            y={centerY + 12}
            textAnchor="middle"
            className="fill-teal-300 text-xs"
            style={{ fontFamily: 'Noto Sans' }}
          >
            (+0)
          </text>
        </motion.g>

        {/* Branch Paths */}
        {positionedBranches.map((branch, index) => {
          const isSelected = selectedBranchId === branch.id;
          const isHovered = hoveredBranch === branch.id;
          const branchColor = getBranchColor(branch.type);

          return (
            <motion.path
              key={branch.id}
              d={branch.pathData}
              stroke={branchColor}
              strokeWidth={isSelected ? "8" : isHovered ? "6" : "4"}
              fill="none"
              filter="url(#neonGlow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: spineAnimated ? 1 : 0 }}
              transition={{
                delay: 0.6 + index * 0.1,
                duration: 0.3,
                ease: "easeOut"
              }}
              style={{
                transition: 'stroke-width 0.3s ease',
                opacity: isSelected || isHovered ? 1 : 0.8
              }}
            />
          );
        })}

        {/* Branch Nodes */}
        {positionedBranches.map((branch, index) => {
          const isSelected = selectedBranchId === branch.id;
          const isHovered = hoveredBranch === branch.id;
          const nodeWidth = isSmallScreen ? 80 : 100;
          const nodeHeight = isSmallScreen ? 40 : 50;

          return (
            <motion.g
              key={`node-${branch.id}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.8 + index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ scale: 1.1 }}
              style={{ cursor: 'pointer' }}
              onClick={() => handleBranchClick(branch.id)}
              onMouseEnter={(e) => handleBranchHover(branch, e as any, true)}
              onMouseLeave={(e) => handleBranchHover(branch, e as any, false)}
              role="button"
              aria-label={`Scenario ${branch.name}: +${branch.deltaValue}%`}
              tabIndex={0}
            >
              <rect
                x={branch.endX - nodeWidth / 2}
                y={branch.endY - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                rx="8"
                ry="8"
                fill="rgba(20, 30, 50, 0.6)"
                stroke={isSelected || isHovered ? branch.color : 'rgba(255, 255, 255, 0.4)'}
                strokeWidth={isSelected ? "4" : "2"}
                filter="url(#neonGlow)"
                style={{
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s ease'
                }}
              />
              <text
                x={branch.endX}
                y={branch.endY - 8}
                textAnchor="middle"
                className="fill-white text-xs font-bold"
                style={{ fontFamily: 'Noto Sans' }}
              >
                {branch.name.split(' ')[0]}
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
      </svg>

      {/* Interactive Tooltip */}
      <AnimatePresence>
        {tooltip && tooltip.visible && (
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
            role="tooltip"
            aria-describedby={`tooltip-${tooltip.branch.id}`}
          >
            <div className="glass-panel-deep p-4 rounded-xl border border-teal-400/30 min-w-64">
              <div className="text-sm font-bold text-white mb-3">{tooltip.branch.name}</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Delta Value:</span>
                    <span className="text-teal-400">+{tooltip.branch.deltaValue}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Impact:</span>
                    <span className="text-teal-400">{tooltip.branch.impactMetric}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Type:</span>
                    <span className={tooltip.branch.type === 'reinforcing' ? 'text-green-400' : 'text-orange-400'}>
                      {tooltip.branch.type}
                    </span>
                  </div>
                  <button className="text-teal-400 hover:text-teal-300 text-xs pointer-events-auto">
                    View Details ▶
                  </button>
                </div>
              </div>
              {/* Tooltip Arrow */}
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
