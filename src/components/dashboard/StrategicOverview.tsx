import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Target, Play, Brain, Monitor, 
  BookOpen, Zap, Users, Download, FileText, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Gauge from '@/components/ui/custom/Gauge';

interface StrategicOverviewProps {
  data?: {
    deiScore: number;
    deiTarget: number;
    deiTrend: number[];
    populationStability: number;
    resourceEfficiency: number;
    socialCohesion: number;
    hasStrategicAlert: boolean;
    psiu: {
      producer: number;
      stabilizer: number;
      innovator: number;
      unifier: number;
    };
    entropyTrend: number[];
    zones: {
      monitor: any;
      think: any;
      act: any;
      learn: any;
      innovate: any;
    };
  };
}

const StrategicOverview: React.FC<StrategicOverviewProps> = ({ data }) => {
  const { t, isRTL } = useTranslation();
  const [activeZone, setActiveZone] = useState('monitor');
  const [autoRotate, setAutoRotate] = useState(false);

  // Mock data if not provided
  const mockData = {
    deiScore: 78.5,
    deiTarget: 85,
    deiTrend: [72, 74, 76, 78, 78.5],
    populationStability: -2.1,
    resourceEfficiency: 12.3,
    socialCohesion: 82.7,
    hasStrategicAlert: true,
    psiu: {
      producer: 82,
      stabilizer: 76,
      innovator: 68,
      unifier: 85
    },
    entropyTrend: [0.3, 0.28, 0.32, 0.29, 0.31, 0.27],
    zones: {
      monitor: {
        alerts: 3,
        criticalSystems: 2,
        uptime: 99.7
      },
      think: {
        targetAlignment: 78,
        loopDrifts: [
          { name: 'Population & Development', drift: -5.2 },
          { name: 'Resource Allocation', drift: 3.8 }
        ]
      },
      act: {
        pendingApprovals: 5,
        successRate: 82,
        riskFlags: 2
      },
      learn: {
        topLessons: 12,
        patternFlags: 3,
        insights: 8
      },
      innovate: {
        activePrototypes: 7,
        redesignFlags: 4,
        readyForPromotion: 2
      }
    }
  };

  // Ensure we have proper data structure with fallbacks
  const displayData = {
    deiScore: data?.deiScore ?? mockData.deiScore,
    deiTarget: data?.deiTarget ?? mockData.deiTarget,
    deiTrend: data?.deiTrend ?? mockData.deiTrend,
    populationStability: data?.populationStability ?? mockData.populationStability,
    resourceEfficiency: data?.resourceEfficiency ?? mockData.resourceEfficiency,
    socialCohesion: data?.socialCohesion ?? mockData.socialCohesion,
    hasStrategicAlert: data?.hasStrategicAlert ?? mockData.hasStrategicAlert,
    psiu: data?.psiu ?? mockData.psiu,
    entropyTrend: data?.entropyTrend ?? mockData.entropyTrend,
    zones: data?.zones ?? mockData.zones
  };

  const zones = [
    { 
      id: 'monitor', 
      name: 'MONITOR', 
      icon: Monitor, 
      color: 'purple',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400'
    },
    { 
      id: 'think', 
      name: 'THINK', 
      icon: Brain, 
      color: 'teal',
      bgColor: 'bg-teal-500/20',
      textColor: 'text-teal-400'
    },
    { 
      id: 'act', 
      name: 'ACT', 
      icon: Play, 
      color: 'blue',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400'
    },
    { 
      id: 'learn', 
      name: 'LEARN', 
      icon: BookOpen, 
      color: 'orange',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-400'
    },
    { 
      id: 'innovate', 
      name: 'INNOVATE', 
      icon: Zap, 
      color: 'green',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400'
    }
  ];

  // Auto-rotate zones when idle
  useEffect(() => {
    if (autoRotate) {
      const interval = setInterval(() => {
        setActiveZone(prev => {
          const currentIndex = zones.findIndex(z => z.id === prev);
          const nextIndex = (currentIndex + 1) % zones.length;
          return zones[nextIndex].id;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRotate, zones]);

  const renderPSIUBalance = () => {
    const psiuData = displayData.psiu;
    const total = psiuData.producer + psiuData.stabilizer + psiuData.innovator + psiuData.unifier;
    
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">PSIU Balance</h4>
        <div className="flex h-6 rounded-full overflow-hidden bg-white/10">
          <div 
            className="bg-teal-500 transition-all duration-500"
            style={{ width: `${(psiuData.producer / total) * 100}%` }}
          />
          <div 
            className="bg-blue-500 transition-all duration-500"
            style={{ width: `${(psiuData.stabilizer / total) * 100}%` }}
          />
          <div 
            className="bg-purple-500 transition-all duration-500"
            style={{ width: `${(psiuData.innovator / total) * 100}%` }}
          />
          <div 
            className="bg-orange-500 transition-all duration-500"
            style={{ width: `${(psiuData.unifier / total) * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <div className="text-teal-400 font-medium">{psiuData.producer}</div>
            <div className="text-gray-400">Producer</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-medium">{psiuData.stabilizer}</div>
            <div className="text-gray-400">Stabilizer</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-medium">{psiuData.innovator}</div>
            <div className="text-gray-400">Innovator</div>
          </div>
          <div className="text-center">
            <div className="text-orange-400 font-medium">{psiuData.unifier}</div>
            <div className="text-gray-400">Unifier</div>
          </div>
        </div>
      </div>
    );
  };

  const renderEntropyTrend = () => {
    const trend = displayData.entropyTrend;
    const isIncreasing = trend[trend.length - 1] > trend[0];
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-300">Entropy Trend (6 cycles)</h4>
          <div className="flex items-center space-x-1">
            {isIncreasing ? (
              <TrendingUp size={12} className="text-red-400" />
            ) : (
              <TrendingDown size={12} className="text-teal-400" />
            )}
            <span className={`text-xs ${isIncreasing ? 'text-red-400' : 'text-teal-400'}`}>
              {isIncreasing ? '+' : '-'}{Math.abs(trend[trend.length - 1] - trend[0]).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="h-8 flex items-end space-x-1">
          {trend.map((value, index) => (
            <div
              key={index}
              className={`flex-1 rounded-sm ${
                isIncreasing ? 'bg-gradient-to-t from-red-500/50 to-red-400/30' : 'bg-gradient-to-t from-teal-500/50 to-teal-400/30'
              }`}
              style={{ height: `${(value / Math.max(...trend)) * 100}%` }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderZoneSnapshot = () => {
    // Ensure zones exist and get the zone data safely
    const zoneData = displayData.zones?.[activeZone as keyof typeof displayData.zones];
    const zone = zones.find(z => z.id === activeZone);
    
    // If no zone data is available, show a fallback
    if (!zoneData) {
      return (
        <div className="space-y-4 text-center">
          <div className="text-gray-400">No data available for this zone</div>
        </div>
      );
    }
    
    switch (activeZone) {
      case 'monitor':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {renderPSIUBalance()}
              </div>
              <div className="space-y-2">
                {renderEntropyTrend()}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className={`${displayData.hasStrategicAlert ? 'animate-pulse bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'} flex-1`}
              >
                <AlertTriangle size={14} className="mr-2" />
                Review Strategic Alert ▶
              </Button>
            </div>
          </div>
        );
        
      case 'think':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Target Alignment</h4>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-400">{zoneData.targetAlignment}%</div>
                  <div className="text-xs text-gray-400">Current vs Simulation</div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Loop Drift Highlights</h4>
                <div className="space-y-1">
                  {zoneData.loopDrifts?.map((loop: any, index: number) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-gray-300 truncate">{loop.name}</span>
                      <span className={`${loop.drift > 0 ? 'text-orange-400' : 'text-teal-400'}`}>
                        {loop.drift > 0 ? '+' : ''}{loop.drift}%
                      </span>
                    </div>
                  )) || <div className="text-xs text-gray-400">No drift data</div>}
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full border-teal-500/50 text-teal-400">
              Explore Loop Analysis ▶
            </Button>
          </div>
        );
        
      case 'act':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{zoneData.pendingApprovals || 0}</div>
                <div className="text-xs text-gray-400">Pending Approvals</div>
                {(zoneData.riskFlags || 0) > 0 && (
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 mt-1">
                    {zoneData.riskFlags} Risk Flags
                  </Badge>
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{zoneData.successRate || 0}%</div>
                <div className="text-xs text-gray-400">Bundle Success Rate</div>
              </div>
            </div>
            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
              Review Strategy Bundles ▶
            </Button>
          </div>
        );
        
      case 'learn':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{zoneData.topLessons || 0}</div>
                <div className="text-xs text-gray-400">Top Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{zoneData.patternFlags || 0}</div>
                <div className="text-xs text-gray-400">Pattern Flags</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1 border-orange-500/50 text-orange-400">
                View Insights ▶
              </Button>
              <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                Open Learn ▶
              </Button>
            </div>
          </div>
        );
        
      case 'innovate':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{zoneData.activePrototypes || 0}</div>
                <div className="text-xs text-gray-400">Active Prototypes</div>
                <div className="flex justify-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{zoneData.redesignFlags || 0}</div>
                <div className="text-xs text-gray-400">Redesign Flags</div>
                {(zoneData.readyForPromotion || 0) > 0 && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 mt-1">
                    {zoneData.readyForPromotion} Ready
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full border-green-500/50 text-green-400">
                Review Redesign Flags ▶
              </Button>
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                  Authorize Redesign
                </Button>
                <Button size="sm" variant="outline" className="flex-1 border-red-500/50 text-red-400">
                  Veto
                </Button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="h-full">
      <GlassCard className="h-full" variant="deep" style={{ 
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '2rem',
        boxShadow: 'inset 0 1px 0 0 rgba(56, 178, 172, 0.1), 0 0 30px rgba(56, 178, 172, 0.15)'
      }}>
        <div className="p-6 h-full flex flex-col">
          {/* Header with Zone Carousel and Controls */}
          <div className="flex items-center justify-between mb-6">
            {/* Zone Icon Carousel */}
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                STRATEGIC OVERVIEW
              </h2>
              <div className="flex items-center space-x-2 bg-white/5 rounded-full p-1">
                {zones.map((zone) => (
                  <Button
                    key={zone.id}
                    variant="ghost"
                    size="sm"
                    className={`rounded-full p-2 transition-all duration-300 ${
                      activeZone === zone.id 
                        ? `${zone.bgColor} ${zone.textColor} scale-110` 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setActiveZone(zone.id)}
                    aria-label={`Switch to ${zone.name} snapshot`}
                  >
                    <zone.icon size={16} />
                  </Button>
                ))}
              </div>
            </div>

            {/* Executive Controls */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="border-gray-500/50 text-gray-400"
                onClick={() => setAutoRotate(!autoRotate)}
              >
                <Settings size={14} className="mr-1" />
                Auto-Rotate
              </Button>
              <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400">
                <Download size={14} className="mr-1" />
                Daily Digest
              </Button>
              <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-400">
                <Users size={14} className="mr-1" />
                Zone Leads Council
              </Button>
            </div>
          </div>

          {/* Dynamic Zone Snapshot */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeZone}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <div className="glass-panel p-6 rounded-xl border border-white/20 h-full">
                  <div className="flex items-center space-x-3 mb-4">
                    {(() => {
                      const zone = zones.find(z => z.id === activeZone);
                      return zone ? (
                        <>
                          <div className={`p-2 rounded-xl ${zone.bgColor} ${zone.textColor}`}>
                            <zone.icon size={20} />
                          </div>
                          <h3 className={`text-lg font-bold ${zone.textColor}`}>
                            {zone.name} SNAPSHOT
                          </h3>
                        </>
                      ) : null;
                    })()}
                  </div>
                  {renderZoneSnapshot()}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer with Live Feeds */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Sync Active</span>
              </div>
              <div>Last Update: {new Date().toLocaleTimeString()}</div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" className="text-xs text-gray-400 hover:text-white">
                <FileText size={12} className="mr-1" />
                Export Briefing ▶
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default StrategicOverview;
