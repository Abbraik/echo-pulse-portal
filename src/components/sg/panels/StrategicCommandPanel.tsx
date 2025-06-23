
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, TrendingUp, TrendingDown, AlertTriangle, Target, Activity, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import SparklineChart from '@/components/think/components/SparklineChart';

interface StrategicCommandData {
  dei: { current: number; target: number; history: number[] };
  trust: { current: number; target: number; history: number[] };
  psiu: Record<'Producer'|'Stabilizer'|'Innovator'|'Unifier', { value: number; target: number }>;
  entropy: { zone: string; deltaPct: number; history: number[] }[];
}

interface StrategicCommandPanelProps {
  data?: StrategicCommandData;
  onToggleFullscreen?: () => void;
}

const StrategicCommandPanel: React.FC<StrategicCommandPanelProps> = ({ 
  data, 
  onToggleFullscreen 
}) => {
  const [showDEIModal, setShowDEIModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showPSIUModal, setShowPSIUModal] = useState<string | null>(null);
  const [showEntropyModal, setShowEntropyModal] = useState<string | null>(null);
  const [draggedPSIU, setDraggedPSIU] = useState<string | null>(null);
  const { toast } = useToast();

  // Fallback data for development
  const fallbackData: StrategicCommandData = {
    dei: { current: 82, target: 85, history: [79, 80, 81, 82] },
    trust: { current: 74, target: 80, history: [70, 72, 73, 74] },
    psiu: {
      Producer: { value: 0.65, target: 0.7 },
      Stabilizer: { value: 0.72, target: 0.75 },
      Innovator: { value: 0.58, target: 0.6 },
      Unifier: { value: 0.61, target: 0.65 }
    },
    entropy: [
      { zone: "Think", deltaPct: 2.5, history: [0.30, 0.35, 0.32, 0.34] },
      { zone: "Act", deltaPct: 1.0, history: [0.40, 0.42, 0.41, 0.42] },
      { zone: "Monitor", deltaPct: -0.5, history: [0.25, 0.28, 0.26, 0.25] },
      { zone: "Learn", deltaPct: 0.8, history: [0.20, 0.22, 0.21, 0.22] },
      { zone: "Innovate", deltaPct: 1.5, history: [0.35, 0.37, 0.36, 0.38] }
    ]
  };

  const strategicData = data || fallbackData;

  // Calculate combined score
  const combinedScore = Math.round((strategicData.dei.current + strategicData.trust.current) / 2);
  const maxScore = Math.round((strategicData.dei.target + strategicData.trust.target) / 2);

  // Calculate arc percentages
  const deiPercentage = (strategicData.dei.current / strategicData.dei.target) * 100;
  const trustPercentage = (strategicData.trust.current / strategicData.trust.target) * 100;

  const handlePSIUDragStart = useCallback((psiuType: string) => {
    setDraggedPSIU(psiuType);
  }, []);

  const handlePSIUDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (draggedPSIU) {
      toast({
        title: "PSIU Risk Updated",
        description: `${draggedPSIU} risk assessment updated successfully`,
      });
      setDraggedPSIU(null);
    }
  }, [draggedPSIU, toast]);

  const handleReviewDEIStrategy = () => {
    toast({
      title: "Navigating to Think Zone",
      description: "Opening scenario builder with current DEI parameters",
    });
    // In real app: navigate to /think/scenario-builder
  };

  const handleSendAlert = () => {
    setShowAlertModal(true);
  };

  const handlePromoteLoop = (psiuType: string) => {
    toast({
      title: "Loop Promoted",
      description: `${psiuType} loop promoted to strategic objective`,
    });
    setShowPSIUModal(null);
  };

  const handleLaunchEfficiencyReview = (zone: string) => {
    toast({
      title: "Efficiency Review Initiated",
      description: `Launching comprehensive review for ${zone} zone`,
    });
    setShowEntropyModal(null);
  };

  return (
    <div className="h-full">
      {/* Header Strip */}
      <div className="h-10 bg-gradient-to-r from-teal-400 to-blue-500 rounded-t-xl px-4 flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-sm font-noto drop-shadow-md">
          Strategic Command
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFullscreen}
          className="text-white hover:bg-white/20 p-1 h-8 w-8"
        >
          <Maximize2 size={16} />
        </Button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[calc(100%-4rem)]">
        
        {/* DEI + Trust Composite Gauge - spans 2 columns, 1 row */}
        <div className="col-span-2 glass-panel-cinematic p-6 flex flex-col items-center">
          {/* Dual Arc Gauge */}
          <div className="relative w-32 h-32 mb-4">
            {/* DEI Outer Arc */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="rgba(20, 184, 166, 0.2)"
                strokeWidth="8"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="#14B8A6"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(deiPercentage / 100) * 351.86} 351.86`}
                className="transition-all duration-1000 drop-shadow-lg"
                style={{ filter: 'drop-shadow(0 0 8px rgba(20, 184, 166, 0.6))' }}
              />
            </svg>
            
            {/* Trust Inner Arc */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="40"
                fill="none"
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="6"
              />
              <circle
                cx="64"
                cy="64"
                r="40"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(trustPercentage / 100) * 251.33} 251.33`}
                className="transition-all duration-1000 drop-shadow-lg"
                style={{ filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.6))' }}
              />
            </svg>
            
            {/* Center Score */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-noto">
                  {combinedScore}
                </div>
                <div className="text-xs text-gray-300 font-noto">
                  / {maxScore}
                </div>
              </div>
            </div>
          </div>

          {/* Sparkline */}
          <div className="w-full h-8 mb-4">
            <SparklineChart 
              data={[...strategicData.dei.history, ...strategicData.trust.history].slice(-12)}
              height={32}
              width={200}
              color="#14B8A6"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handleReviewDEIStrategy}
              className="bg-blue-600/80 hover:bg-blue-600 text-white font-medium text-sm px-4 py-2 backdrop-blur-sm border border-blue-500/30"
            >
              <Target className="mr-2 h-4 w-4" />
              Review DEI Strategy
            </Button>
            <Button
              onClick={handleSendAlert}
              className="bg-amber-600/80 hover:bg-amber-600 text-white font-medium text-sm px-4 py-2 backdrop-blur-sm border border-amber-500/30"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Send Alert
            </Button>
          </div>

          {/* Hover Tooltip Area */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none group">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-4 right-4 glass-panel p-2 text-xs text-white font-mono">
              DEI: {strategicData.dei.current} / {strategicData.dei.target} ({strategicData.dei.current - strategicData.dei.target > 0 ? '+' : ''}{strategicData.dei.current - strategicData.dei.target})<br/>
              Trust: {strategicData.trust.current} / {strategicData.trust.target} ({strategicData.trust.current - strategicData.trust.target > 0 ? '+' : ''}{strategicData.trust.current - strategicData.trust.target})
            </div>
          </div>
        </div>

        {/* PSIU 2x2 Matrix */}
        <div className="glass-panel-cinematic p-4">
          <h4 className="text-sm font-medium text-teal-400 mb-3 font-noto flex items-center">
            <Activity className="mr-2 h-3 w-3" />
            PSIU Matrix
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(strategicData.psiu).map(([type, data]) => {
              const isAboveTarget = data.value >= data.target;
              return (
                <motion.div
                  key={type}
                  draggable
                  onDragStart={() => handlePSIUDragStart(type)}
                  onDrop={handlePSIUDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => setShowPSIUModal(type)}
                  className={`glass-panel p-3 cursor-pointer hover:neon-border transition-all duration-300 relative ${
                    draggedPSIU === type ? 'scale-105 shadow-lg' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-xs text-gray-300 text-center mb-1 font-noto">
                    {type}
                  </div>
                  <div className={`text-lg font-bold text-center font-noto ${
                    isAboveTarget ? 'text-teal-400' : 'text-amber-400'
                  }`} style={{ textShadow: isAboveTarget ? '0 0 8px rgba(20, 184, 166, 0.6)' : '0 0 8px rgba(245, 158, 11, 0.6)' }}>
                    {data.value.toFixed(2)}
                  </div>
                  <div className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
                    isAboveTarget ? 'bg-green-400' : data.value > data.target * 0.8 ? 'bg-amber-400' : 'bg-red-400'
                  }`} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Entropy Trend Sparklines - spans remaining space */}
        <div className="col-span-3 glass-panel-cinematic p-4">
          <h4 className="text-sm font-medium text-teal-400 mb-3 font-noto flex items-center">
            <Zap className="mr-2 h-3 w-3" />
            Zone Entropy Trends
          </h4>
          <div className="grid grid-cols-5 gap-3">
            {strategicData.entropy.map((entropyData) => (
              <motion.div
                key={entropyData.zone}
                onClick={() => setShowEntropyModal(entropyData.zone)}
                className="glass-panel p-3 cursor-pointer hover:neon-border transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-xs text-gray-300 text-center mb-2 font-noto">
                  {entropyData.zone}
                </div>
                <div className="h-8 mb-2">
                  <SparklineChart
                    data={entropyData.history}
                    height={32}
                    width={80}
                    color={entropyData.deltaPct >= 0 ? "#10b981" : "#ef4444"}
                  />
                </div>
                <div className="flex items-center justify-center text-xs">
                  {entropyData.deltaPct >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400 mr-1" />
                  )}
                  <span className={`font-medium ${entropyData.deltaPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {entropyData.deltaPct > 0 ? '+' : ''}{entropyData.deltaPct}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* DEI Strategy Modal */}
      <AnimatePresence>
        {showDEIModal && (
          <Dialog open={showDEIModal} onOpenChange={setShowDEIModal}>
            <DialogContent className="glass-panel-cinematic border border-teal-500/30 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-teal-400 font-noto">DEI Strategy Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="h-48 glass-panel p-4">
                  <h4 className="text-sm text-gray-300 mb-2">90-Day DEI Trend</h4>
                  {/* Extended sparkline would go here */}
                </div>
                <div className="flex justify-end space-x-3">
                  <Button onClick={() => setShowDEIModal(false)} variant="outline">
                    Close
                  </Button>
                  <Button onClick={handleReviewDEIStrategy} className="bg-teal-600 hover:bg-teal-700">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Open Strategy Builder
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Alert Modal */}
      <AnimatePresence>
        {showAlertModal && (
          <Dialog open={showAlertModal} onOpenChange={setShowAlertModal}>
            <DialogContent className="glass-panel-cinematic border border-amber-500/30">
              <DialogHeader>
                <DialogTitle className="text-amber-400 font-noto">Send Strategic Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="glass-panel p-4">
                  <p className="text-gray-300 text-sm">
                    DEI composite score is {strategicData.dei.target - strategicData.dei.current} points below target.
                    Send urgent directive to zone leads?
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button onClick={() => setShowAlertModal(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Alert Sent",
                        description: "Strategic alert dispatched to all zone leads",
                      });
                      setShowAlertModal(false);
                    }}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Send Alert
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* PSIU Modal */}
      <AnimatePresence>
        {showPSIUModal && (
          <Dialog open={!!showPSIUModal} onOpenChange={() => setShowPSIUModal(null)}>
            <DialogContent className="glass-panel-cinematic border border-blue-500/30">
              <DialogHeader>
                <DialogTitle className="text-blue-400 font-noto">{showPSIUModal} Loop Analysis</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="glass-panel p-4">
                  <p className="text-gray-300 text-sm">
                    Detailed loop analysis for {showPSIUModal} dynamics. Current performance: {strategicData.psiu[showPSIUModal as keyof typeof strategicData.psiu]?.value.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button onClick={() => setShowPSIUModal(null)} variant="outline">
                    Close
                  </Button>
                  <Button 
                    onClick={() => handlePromoteLoop(showPSIUModal!)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Promote to Objective
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Entropy Modal */}
      <AnimatePresence>
        {showEntropyModal && (
          <Dialog open={!!showEntropyModal} onOpenChange={() => setShowEntropyModal(null)}>
            <DialogContent className="glass-panel-cinematic border border-purple-500/30">
              <DialogHeader>
                <DialogTitle className="text-purple-400 font-noto">{showEntropyModal} Zone Entropy</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="glass-panel p-4">
                  <p className="text-gray-300 text-sm">
                    Entropy analysis for {showEntropyModal} zone. Current trend: {strategicData.entropy.find(e => e.zone === showEntropyModal)?.deltaPct}% change.
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button onClick={() => setShowEntropyModal(null)} variant="outline">
                    Close
                  </Button>
                  <Button 
                    onClick={() => handleLaunchEfficiencyReview(showEntropyModal!)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    Launch Efficiency Review
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StrategicCommandPanel;
