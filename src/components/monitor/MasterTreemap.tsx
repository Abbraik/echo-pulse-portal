import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, MoreHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface IndicatorData {
  name: string;
  weight: number;
  value: number;
  target: number;
  type: 'strategic' | 'operational';
}

interface TreemapRect {
  x: number;
  y: number;
  width: number;
  height: number;
  data: IndicatorData;
  color: string;
}

interface MasterTreemapProps {
  className?: string;
}

const MasterTreemap: React.FC<MasterTreemapProps> = ({ className }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'strategic' | 'operational'>('all');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hoveredRect, setHoveredRect] = useState<string | null>(null);
  const [selectedRect, setSelectedRect] = useState<IndicatorData | null>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 800, height: 400 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const allIndicators: IndicatorData[] = [
    { name: 'DEI Composite', weight: 4, value: 78, target: 80, type: 'strategic' },
    { name: 'Network Dev Index', weight: 3, value: 64, target: 100, type: 'strategic' },
    { name: 'Trust Recovery Index', weight: 3, value: 89, target: 100, type: 'strategic' },
    { name: 'Avg Bundle Coherence', weight: 2, value: 72, target: 100, type: 'strategic' },
    { name: 'Open Facilitator Claims', weight: 3, value: 12, target: 0, type: 'operational' },
    { name: 'Think→Act Queue', weight: 2, value: 4, target: 0, type: 'operational' },
    { name: 'Act→Monitor Queue', weight: 2, value: 3, target: 0, type: 'operational' },
    { name: 'System Error Count', weight: 3, value: 5, target: 0, type: 'operational' }
  ];

  const filteredIndicators = allIndicators.filter(indicator => {
    if (filter === 'strategic') return indicator.type === 'strategic';
    if (filter === 'operational') return indicator.type === 'operational';
    return true;
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setSvgDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isFullScreen]);

  const getIndicatorColor = (indicator: IndicatorData): string => {
    if (indicator.type === 'strategic') {
      const ratio = indicator.value / indicator.target;
      if (ratio >= 1.0) return 'rgba(0,255,195,0.12)';
      if (ratio >= 0.9) return 'rgba(255,193,7,0.12)';
      return 'rgba(255,110,110,0.12)';
    } else {
      if (indicator.value === 0) return 'rgba(0,255,195,0.12)';
      if (indicator.value <= 5) return 'rgba(255,193,7,0.12)';
      return 'rgba(255,110,110,0.12)';
    }
  };

  const calculateTreemapLayout = (width: number, height: number): TreemapRect[] => {
    const totalWeight = filteredIndicators.reduce((sum, ind) => sum + ind.weight, 0);
    const totalArea = width * height;
    
    let currentX = 0;
    let currentY = 0;
    let rowHeight = 0;
    let remainingWidth = width;
    const rectangles: TreemapRect[] = [];
    
    filteredIndicators.forEach((indicator, index) => {
      const area = (indicator.weight / totalWeight) * totalArea;
      const rectWidth = Math.min(Math.sqrt(area * 1.5), remainingWidth);
      const rectHeight = area / rectWidth;
      
      if (currentX + rectWidth > width && rectangles.length > 0) {
        currentX = 0;
        currentY += rowHeight;
        rowHeight = 0;
        remainingWidth = width;
      }
      
      rectangles.push({
        x: currentX,
        y: currentY,
        width: rectWidth,
        height: rectHeight,
        data: indicator,
        color: getIndicatorColor(indicator)
      });
      
      currentX += rectWidth;
      remainingWidth -= rectWidth;
      rowHeight = Math.max(rowHeight, rectHeight);
    });
    
    return rectangles;
  };

  const rectangles = calculateTreemapLayout(svgDimensions.width, svgDimensions.height);

  const handleRectClick = (indicator: IndicatorData) => {
    setSelectedRect(indicator);
  };

  const handleFilterChange = (newFilter: 'all' | 'strategic' | 'operational') => {
    setFilter(newFilter);
  };

  const canShowText = (rect: TreemapRect) => {
    return rect.width >= 100 && rect.height >= 60;
  };

  const formatValue = (indicator: IndicatorData) => {
    if (indicator.type === 'strategic') {
      const ratio = Math.round((indicator.value / indicator.target) * 100);
      return `${indicator.value}/${indicator.target} (${ratio}%)`;
    } else {
      return `${indicator.value} ${indicator.value === 1 ? 'item' : 'items'}`;
    }
  };

  return (
    <div className={cn('w-full h-full', className)}>
      <motion.div 
        className={cn(
          'w-full h-full overflow-hidden relative',
          isFullScreen ? 'fixed inset-0 z-50' : ''
        )}
        layout
      >
        <div className="h-full flex flex-col">
          {/* Gradient Header Bar - matching ACT style */}
          <div 
            className="h-10 flex items-center justify-between px-6 relative z-10 flex-shrink-0"
            style={{ 
              background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)'
            }}
          >
            <h2 className="text-base font-bold text-white font-['Noto_Sans']" style={{
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
              fontSize: '16px'
            }}>
              Master Treemap: Key Monitor Indicators
            </h2>
            <div className="flex items-center gap-3">
              <button 
                className="text-white/50 hover:text-white transition-all duration-200"
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
                aria-label="Drag handle"
              >
                <MoreHorizontal size={16} />
              </button>
              <button 
                className="text-white/50 hover:text-white transition-all duration-200"
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
                onClick={() => setIsFullScreen(!isFullScreen)}
                aria-label={isFullScreen ? "Exit full-screen" : "Enter full-screen"}
              >
                {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>

          {/* Enhanced Filter Pills - matching ACT style */}
          <div className="flex justify-center py-4 px-6 gap-4 relative z-10 flex-shrink-0">
            {(['all', 'strategic', 'operational'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => handleFilterChange(filterOption)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                  'font-["Noto_Sans"]',
                  filter === filterOption
                    ? 'text-[#081226] shadow-[0_0_8px_rgba(0,255,195,0.6)]'
                    : 'text-[#E0E0E0] hover:bg-[rgba(255,255,255,0.10)]'
                )}
                style={filter === filterOption ? {
                  background: '#00FFC3',
                  boxShadow: '0 0 8px rgba(0,255,195,0.6)'
                } : {
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)'
                }}
              >
                {filterOption === 'all' ? 'All' : 
                 filterOption === 'strategic' ? 'Strategic Only' : 'Operational Only'}
              </button>
            ))}
          </div>

          {/* Enhanced Treemap SVG - fills remaining space */}
          <div 
            ref={containerRef}
            className="flex-1 relative"
            style={{ minHeight: 0 }}
          >
            <motion.svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
              className="absolute inset-0"
              layout
            >
              <AnimatePresence>
                {rectangles.map((rect, index) => (
                  <motion.g
                    key={`${rect.data.name}-${filter}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: hoveredRect && hoveredRect !== rect.data.name ? 0.8 : 1, 
                      scale: hoveredRect === rect.data.name ? 1.15 : (hoveredRect && hoveredRect !== rect.data.name ? 0.92 : 1),
                      x: rect.x,
                      y: rect.y
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ 
                      duration: hoveredRect === rect.data.name ? 0.2 : 0.4, 
                      ease: hoveredRect === rect.data.name ? "easeOut" : [0.68, -0.55, 0.265, 1.55]
                    }}
                    style={{ transformOrigin: 'center' }}
                  >
                    <rect
                      width={rect.width}
                      height={rect.height}
                      fill={rect.color}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth={hoveredRect === rect.data.name ? 2 : 1}
                      rx={8}
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        filter: hoveredRect === rect.data.name 
                          ? 'drop-shadow(0 0 16px rgba(0,255,195,0.5))'
                          : 'none',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                      }}
                      onMouseEnter={() => setHoveredRect(rect.data.name)}
                      onMouseLeave={() => setHoveredRect(null)}
                      onClick={() => handleRectClick(rect.data)}
                    />
                    
                    {canShowText(rect) ? (
                      <g>
                        <text
                          x={rect.width / 2}
                          y={rect.height / 2 - 8}
                          textAnchor="middle"
                          className="text-sm font-bold font-['Noto_Sans'] pointer-events-none"
                          fill="#00FFC3"
                          style={{ 
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                            fontSize: '14px'
                          }}
                        >
                          {rect.data.name}
                        </text>
                        <text
                          x={rect.width / 2}
                          y={rect.height / 2 + 12}
                          textAnchor="middle"
                          className="text-xs font-['Noto_Sans'] pointer-events-none"
                          fill="#E0E0E0"
                        >
                          {formatValue(rect.data)}
                        </text>
                      </g>
                    ) : (
                      <g>
                        <circle
                          cx={rect.width / 2}
                          cy={rect.height / 2}
                          r={8}
                          fill="rgba(0,255,195,0.2)"
                          stroke="#00FFC3"
                          strokeWidth={1}
                        />
                        <text
                          x={rect.width / 2}
                          y={rect.height / 2 + 2}
                          textAnchor="middle"
                          className="text-xs pointer-events-none"
                          fill="#00FFC3"
                        >
                          ℹ
                        </text>
                      </g>
                    )}
                  </motion.g>
                ))}
              </AnimatePresence>
            </motion.svg>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Detail Modal - matching ACT style */}
      <AnimatePresence>
        {selectedRect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedRect(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl rounded-[1.5rem] border p-6"
              style={{
                background: 'rgba(10, 20, 40, 0.9)',
                backdropFilter: 'blur(32px)',
                border: '1px solid rgba(0,255,195,0.15)',
                boxShadow: '0 16px 32px rgba(0,0,0,0.6)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#00FFC3] font-['Noto_Sans']" style={{
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}>
                  {selectedRect.name} Details
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRect(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 font-['Noto_Sans']">Current Value</p>
                    <p className="text-2xl font-bold text-white">{selectedRect.value}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-['Noto_Sans']">Target</p>
                    <p className="text-2xl font-bold text-white">{selectedRect.target}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-2 font-['Noto_Sans']">Performance</p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        selectedRect.type === 'strategic' 
                          ? (selectedRect.value / selectedRect.target >= 1.0 ? 'default' : 
                             selectedRect.value / selectedRect.target >= 0.9 ? 'warning' : 'destructive')
                          : (selectedRect.value === 0 ? 'default' : 
                             selectedRect.value <= 5 ? 'warning' : 'destructive')
                      }
                    >
                      {selectedRect.type === 'strategic' 
                        ? `${Math.round((selectedRect.value / selectedRect.target) * 100)}%`
                        : selectedRect.value === 0 ? 'Optimal' : 'Needs Attention'}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    className="bg-[#00FFC3] text-[#081226] hover:bg-[#00FFC3]/80"
                    style={{ boxShadow: '0 4px 8px rgba(0,255,195,0.4)' }}
                  >
                    Export CSV ▶
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedRect(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MasterTreemap;
