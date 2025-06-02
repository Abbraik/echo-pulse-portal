
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Minimize2, Maximize2, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface IndicatorData {
  name: string;
  weight: number;
  value: number;
  target: number;
  type: 'composite' | 'pillar';
}

interface TreemapRect {
  x: number;
  y: number;
  width: number;
  height: number;
  data: IndicatorData;
  color: string;
  id: string;
}

export const IndicatorTreemap: React.FC = () => {
  const { t } = useTranslation();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredRect, setHoveredRect] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; data: IndicatorData } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Indicator data with mock values
  const indicatorData: IndicatorData[] = [
    { name: 'DEI Composite', weight: 4, value: 72, target: 80, type: 'composite' },
    { name: 'Network Development Index', weight: 4, value: 64, target: 100, type: 'composite' },
    { name: 'Trust Recovery Index', weight: 4, value: 89, target: 100, type: 'composite' },
    { name: 'Average Bundle Coherence', weight: 4, value: 72, target: 100, type: 'composite' },
    { name: 'Social Pillar', weight: 2, value: 82, target: 85, type: 'pillar' },
    { name: 'Economic Pillar', weight: 2, value: 68, target: 75, type: 'pillar' },
    { name: 'Environmental Pillar', weight: 2, value: 91, target: 90, type: 'pillar' },
    { name: 'Governance Pillar', weight: 2, value: 73, target: 80, type: 'pillar' }
  ];

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate color based on value/target ratio
  const getIndicatorColor = (data: IndicatorData): string => {
    const ratio = data.value / data.target;
    if (ratio >= 1.0) return 'rgba(0,255,195,0.20)'; // neon-teal
    if (ratio >= 0.9) return 'rgba(255,193,7,0.20)'; // amber
    return 'rgba(255,110,110,0.20)'; // coral
  };

  // Simple treemap algorithm
  const generateTreemapRects = (width: number, height: number): TreemapRect[] => {
    const totalWeight = indicatorData.reduce((sum, item) => sum + item.weight, 0);
    const rects: TreemapRect[] = [];
    
    let currentX = 0;
    let currentY = 0;
    let rowHeight = 0;
    let currentRowWidth = 0;
    
    // Calculate optimal layout
    const targetAspectRatio = width / height;
    const sortedData = [...indicatorData].sort((a, b) => b.weight - a.weight);
    
    for (let i = 0; i < sortedData.length; i++) {
      const data = sortedData[i];
      const area = (data.weight / totalWeight) * (width * height);
      
      // Calculate dimensions for better aspect ratio
      const rectWidth = Math.sqrt(area * targetAspectRatio);
      const rectHeight = area / rectWidth;
      
      // Check if we need to start a new row
      if (currentX + rectWidth > width && currentRowWidth > 0) {
        currentX = 0;
        currentY += rowHeight;
        rowHeight = 0;
        currentRowWidth = 0;
      }
      
      // Adjust dimensions to fit
      const finalWidth = Math.min(rectWidth, width - currentX);
      const finalHeight = Math.min(rectHeight, height - currentY);
      
      rects.push({
        x: currentX,
        y: currentY,
        width: finalWidth,
        height: finalHeight,
        data,
        color: getIndicatorColor(data),
        id: `rect-${i}`
      });
      
      currentX += finalWidth;
      currentRowWidth += finalWidth;
      rowHeight = Math.max(rowHeight, finalHeight);
    }
    
    return rects;
  };

  const handleRectHover = (rect: TreemapRect, event: React.MouseEvent) => {
    setHoveredRect(rect.id);
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (svgRect) {
      setTooltipData({
        x: event.clientX - svgRect.left,
        y: event.clientY - svgRect.top,
        data: rect.data
      });
    }
  };

  const handleRectLeave = () => {
    setHoveredRect(null);
    setTooltipData(null);
  };

  const handleFullScreen = () => {
    setIsFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
  };

  const handleExportSVG = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = 'indicator-treemap.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    }
  };

  // Render functions
  const renderRectangle = (rect: TreemapRect, index: number) => {
    const isHovered = hoveredRect === rect.id;
    const isNeighbor = hoveredRect && hoveredRect !== rect.id && 
      Math.abs(rect.x - (rects.find(r => r.id === hoveredRect)?.x || 0)) < 20;
    
    const scale = isHovered ? 1.15 : isNeighbor ? 0.9 : 1;
    const opacity = hoveredRect && !isHovered ? 0.8 : 1;
    
    // Calculate if text should be shown
    const shouldShowText = rect.width >= 80 && rect.height >= 80;
    const ratio = (rect.data.value / rect.data.target * 100).toFixed(0);
    
    return (
      <g key={rect.id}>
        <motion.rect
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          fill={rect.color}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
          rx={6}
          style={{ 
            cursor: 'pointer',
            transformOrigin: `${rect.x + rect.width/2}px ${rect.y + rect.height/2}px`
          }}
          animate={{ 
            scale,
            opacity
          }}
          transition={{ 
            duration: 0.2,
            type: isHovered ? "spring" : "ease-out"
          }}
          whileHover={{ 
            stroke: '#00FFC3',
            strokeWidth: isHovered ? 3 : 2,
            filter: 'drop-shadow(0 8px 16px rgba(0,255,195,0.5))'
          }}
          onMouseEnter={(e) => handleRectHover(rect, e as any)}
          onMouseLeave={handleRectLeave}
        />
        
        {shouldShowText && (
          <motion.g
            animate={{ scale, opacity }}
            transition={{ duration: 0.2 }}
          >
            <text
              x={rect.x + rect.width / 2}
              y={rect.y + rect.height / 2 - 8}
              textAnchor="middle"
              className="font-noto-bold text-xs fill-teal-400"
              style={{ fontSize: '12px' }}
            >
              {rect.data.name}
            </text>
            <text
              x={rect.x + rect.width / 2}
              y={rect.y + rect.height / 2 + 8}
              textAnchor="middle"
              className="font-noto-regular text-xs fill-gray-300"
              style={{ fontSize: '10px' }}
            >
              {rect.data.value} / {rect.data.target} ({ratio}%)
            </text>
          </motion.g>
        )}
        
        {!shouldShowText && (
          <motion.text
            x={rect.x + rect.width / 2}
            y={rect.y + rect.height / 2}
            textAnchor="middle"
            className="text-lg"
            animate={{ scale, opacity }}
            transition={{ duration: 0.2 }}
          >
            ℹ️
          </motion.text>
        )}
      </g>
    );
  };

  // Generate rectangles based on current size
  const containerWidth = isFullScreen ? 1200 : 300;
  const containerHeight = isFullScreen ? 600 : isMobile ? 120 : 240;
  const rects = generateTreemapRects(containerWidth - 32, containerHeight - (isFullScreen ? 96 : 64));

  // Mobile collapsed view
  if (isMobile && !isFullScreen) {
    return (
      <motion.div
        className="w-full h-[120px] rounded-2xl backdrop-blur-[24px] border border-teal-500/20 overflow-hidden relative p-4 cursor-pointer"
        style={{
          background: 'rgba(20, 30, 50, 0.6)',
          boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
        }}
        onClick={handleFullScreen}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-center h-full">
          <span className="text-lg font-noto-bold text-teal-400">
            Indicator Importance Treemap ▶
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseFullScreen}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`rounded-2xl backdrop-blur-[24px] border border-teal-500/20 overflow-hidden relative ${
          isFullScreen ? 'fixed inset-4 z-50' : 'w-full'
        }`}
        style={{
          background: 'rgba(20, 30, 50, 0.6)',
          boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)',
          height: isFullScreen ? 'calc(100vh - 32px)' : containerHeight
        }}
        animate={{
          scale: isFullScreen ? 1 : 1,
          width: isFullScreen ? 'calc(100vw - 32px)' : '100%'
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Header */}
        <div 
          className="h-8 px-4 flex items-center justify-between"
          style={{ background: 'rgba(10, 20, 40, 0.8)' }}
        >
          <h3 className="text-base font-noto-bold text-teal-400">
            Indicator Importance Treemap
          </h3>
          
          <div className="flex items-center space-x-2">
            {isFullScreen && (
              <>
                <select className="bg-black/20 border border-white/20 text-white text-xs rounded px-2 py-1">
                  <option>View: Composite</option>
                  <option>View: Pillar</option>
                </select>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportSVG}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  <Download size={14} className="mr-1" />
                  Export SVG
                </Button>
              </>
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-teal-400 hover:text-teal-300"
                >
                  <MoreVertical size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Drag Handle</TooltipContent>
            </Tooltip>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-teal-400 hover:text-teal-300"
            >
              <Minimize2 size={14} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={isFullScreen ? handleCloseFullScreen : handleFullScreen}
              className="text-teal-400 hover:text-teal-300"
            >
              {isFullScreen ? <X size={14} /> : <Maximize2 size={14} />}
            </Button>
          </div>
        </div>

        {/* Full-screen legend */}
        {isFullScreen && (
          <div className="h-12 px-4 flex items-center justify-center space-x-6 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(0,255,195,0.4)' }}></div>
              <span className="text-xs text-gray-300">🟢 In-Band (≥100%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(255,193,7,0.4)' }}></div>
              <span className="text-xs text-gray-300">🟠 Near Target (90-100%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(255,110,110,0.4)' }}></div>
              <span className="text-xs text-gray-300">🔴 Below 90%</span>
            </div>
          </div>
        )}

        {/* Treemap SVG */}
        {!isCollapsed && (
          <div className="p-4 h-full">
            <svg
              ref={svgRef}
              width={containerWidth - 32}
              height={containerHeight - (isFullScreen ? 96 : 64)}
              className="w-full h-full"
            >
              {rects.map((rect, index) => renderRectangle(rect, index))}
            </svg>

            {/* Tooltip */}
            <AnimatePresence>
              {tooltipData && (
                <motion.div
                  className="absolute pointer-events-none z-10 rounded-xl p-3 text-sm"
                  style={{
                    background: 'rgba(10, 20, 40, 0.8)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                    left: tooltipData.x + 10,
                    top: tooltipData.y - 10
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="text-white font-noto-medium">
                    {tooltipData.data.name}
                  </div>
                  <div className="text-gray-300 text-xs">
                    Value: {tooltipData.data.value} / {tooltipData.data.target}
                  </div>
                  <div className="text-gray-300 text-xs">
                    Ratio: {((tooltipData.data.value / tooltipData.data.target) * 100).toFixed(1)}%
                  </div>
                  <div className="text-gray-300 text-xs">
                    Weight: {tooltipData.data.weight}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};
