import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FullscreenButton } from '@/components/ui/fullscreen-button';
import ThinkSnapshot from '@/components/dashboard/ThinkSnapshot';
import ActSnapshot from '@/components/dashboard/ActSnapshot';
import MonitorSnapshot from '@/components/dashboard/MonitorSnapshot';
import LearnSnapshot from '@/components/dashboard/LearnSnapshot';
import InnovateSnapshot from '@/components/dashboard/InnovateSnapshot';

interface ZoneSnapshotGridProps {
  data?: any;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const ZoneSnapshotGrid: React.FC<ZoneSnapshotGridProps> = ({ 
  data,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  const zones = [
    { name: 'THINK', component: ThinkSnapshot, color: 'text-teal-400', bgColor: 'bg-teal-500/10' },
    { name: 'ACT', component: ActSnapshot, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { name: 'MONITOR', component: MonitorSnapshot, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { name: 'LEARN', component: LearnSnapshot, color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
    { name: 'INNOVATE', component: InnovateSnapshot, color: 'text-green-400', bgColor: 'bg-green-500/10' }
  ];

  const handleZoneExpand = (zoneName: string) => {
    setExpandedZone(expandedZone === zoneName ? null : zoneName);
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h3 className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 ${isFullscreen ? 'text-3xl' : 'text-xl'}`}>
          Zone Snapshots
        </h3>
        <div className="flex items-center space-x-2">
          {onToggleFullscreen && (
            <FullscreenButton
              isFullscreen={isFullscreen}
              onToggle={onToggleFullscreen}
            />
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="border-gray-500/50 text-gray-400"
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            <span className="ml-2">{isCollapsed ? 'Expand' : 'Collapse'}</span>
          </Button>
        </div>
      </div>

      {/* Zone Grid */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`space-y-4 ${isFullscreen ? 'flex-1 overflow-hidden' : ''}`}
          >
            {expandedZone ? (
              /* Full Screen Zone View */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed inset-0 z-50 bg-black/50 p-4"
              >
                <GlassCard className="h-full relative">
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setExpandedZone(null)}
                      className="bg-white/10 backdrop-blur"
                    >
                      Close
                    </Button>
                  </div>
                  {zones.find(zone => zone.name === expandedZone)?.component && 
                    React.createElement(zones.find(zone => zone.name === expandedZone)!.component, {
                      data: data?.[expandedZone.toLowerCase()]
                    })
                  }
                </GlassCard>
              </motion.div>
            ) : (
              /* Grid View */
              <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ${isFullscreen ? 'h-full overflow-auto' : ''}`}>
                {zones.map((zone, index) => (
                  <motion.div
                    key={zone.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`group relative ${isFullscreen ? 'h-80' : 'h-64'}`}
                  >
                    <GlassCard 
                      className={`h-full p-4 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 ${zone.bgColor}`}
                      onClick={() => handleZoneExpand(zone.name)}
                    >
                      {/* Zone Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h4 className={`font-semibold ${zone.color} ${isFullscreen ? 'text-xl' : 'text-lg'}`}>
                          {zone.name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-500/20 text-green-400">
                            Active
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleZoneExpand(zone.name);
                            }}
                          >
                            <FullscreenButton
                              isFullscreen={false}
                              onToggle={() => {}}
                            />
                          </Button>
                        </div>
                      </div>

                      {/* Zone Preview Content */}
                      <div className={`text-gray-400 space-y-2 ${isFullscreen ? 'text-base' : 'text-sm'}`}>
                        <div className="flex justify-between">
                          <span>Delivery Quality:</span>
                          <span className="text-white font-medium">
                            {85 + Math.floor(Math.random() * 15)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Loops:</span>
                          <span className="text-white font-medium">
                            {2 + Math.floor(Math.random() * 4)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Update:</span>
                          <span className="text-white font-medium">
                            {Math.floor(Math.random() * 6) + 1}h ago
                          </span>
                        </div>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className={`text-white font-medium ${isFullscreen ? 'text-lg' : ''}`}>Click to expand</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZoneSnapshotGrid;
