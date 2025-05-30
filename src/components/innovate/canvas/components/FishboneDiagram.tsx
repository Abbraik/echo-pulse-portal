
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
  const marginLeft = Math.max(60, width * 0.08);
  const marginRight = Math.max(60, width * 0.08);
  const centerY = height * 0.3; // Position spine at 30% from top
  const spineStartX = marginLeft + 50; // Start after baseline node
  const spineEndX = width - marginRight;
  const spineLength = spineEndX - spineStartX;
  const maxBranchLength = width < 600 ? 80 : 120;
  const maxImpactMetric = Math.max(...branches.map(b => b.impactMetric), 1);
  const isSmallScreen = width < 600;

  // Trigger spine animation
  useEffect(() => {
    if (width > 0 && height > 0) {
      const timer = setTimeout(() => setSpineAnimated(true), 200);
      return () => clearTimeout(timer);
    }
  }, [width, height]);

  // Calculate branch positions
  const calculateBranchPositions = () => {
    const n = branches.length;
    if (n === 0) return [];

    return branches.map((branch, index) => {
      // Anchor point on spine - evenly distributed
      const anchorX = spineStartX + ((index + 1) * (spineLength / (n + 1)));
      
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

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Fishbone diagram comparing scenarios to ${baselineLabel}`}
      >
        <defs>
          <linearGradient id="spineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main Baseline Spine - Fixed and Visible */}
        <motion.line
          x1={spineStartX}
          y1={centerY}
          x2={spineEndX}
          y2={centerY}
          stroke="url(#spineGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#glowEffect)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: spineAnimated ? 1 : 0, opacity: spineAnimated ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />

        {/* Current State Label - Left Side */}
        <motion.text
          x={marginLeft - 10}
          y={centerY - 20}
          textAnchor="end"
          className="fill-gray-300 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Current State
        </motion.text>

        {/* Future Vision Label - Right Side */}
        <motion.text
          x={spineEndX + 10}
          y={centerY - 20}
          textAnchor="start"
          className="fill-gray-300 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Future Vision
        </motion.text>

        {/* Baseline Node */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <circle
            cx={marginLeft}
            cy={centerY}
            r="40"
            fill="rgba(20, 30, 50, 0.7)"
            stroke="#14b8a6"
            strokeWidth="3"
            filter="url(#glowEffect)"
            style={{ backdropFilter: 'blur(20px)' }}
          />
          <text
            x={marginLeft}
            y={centerY - 8}
            textAnchor="middle"
            className="fill-white text-sm font-bold"
            style={{ fontFamily: 'Noto Sans' }}
          >
            Current
          </text>
          <text
            x={marginLeft}
            y={centerY + 8}
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
          const branchColor = branch.type === 'reinforcing' ? '#14b8a6' : '#f97316';

          return (
            <motion.path
              key={branch.id}
              d={branch.pathData}
              stroke={branchColor}
              strokeWidth={isSelected ? "8" : isHovered ? "6" : "4"}
              fill="none"
              filter="url(#glowEffect)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: spineAnimated ? 1 : 0 }}
              transition={{
                delay: 1.0 + index * 0.15,
                duration: 0.4,
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
                delay: 1.2 + index * 0.15,
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
                fill="rgba(20, 30, 50, 0.7)"
                stroke={isSelected || isHovered ? branch.color : 'rgba(255, 255, 255, 0.4)'}
                strokeWidth={isSelected ? "4" : "2"}
                filter="url(#glowEffect)"
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
