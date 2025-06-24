
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  SkipBack, 
  Settings, 
  Zap,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useDemoManager } from '@/hooks/use-demo-manager';
import { GlassCard } from '@/components/ui/glass-card';

export const DemoControlPanel: React.FC = () => {
  const {
    isActive,
    currentScenario,
    currentStep,
    scenarios,
    isAutoPlaying,
    getCurrentProgress,
    startAutoPlay,
    stopAutoPlay,
    nextStep,
    previousStep,
    exitDemo,
    navigateToStep
  } = useDemoManager();

  const [autoPlaySpeed, setAutoPlaySpeed] = React.useState([8]);
  const currentScenarioData = scenarios.find(s => s.id === currentScenario);
  const progress = getCurrentProgress;

  if (!isActive || !currentScenarioData) return null;

  const handleAutoPlayToggle = () => {
    if (isAutoPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay(autoPlaySpeed[0] * 1000);
    }
  };

  const handleSpeedChange = (newSpeed: number[]) => {
    setAutoPlaySpeed(newSpeed);
    if (isAutoPlaying) {
      stopAutoPlay();
      startAutoPlay(newSpeed[0] * 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 z-[1001] max-w-xs"
    >
      <GlassCard className="p-4 space-y-4">
        {/* Scenario Info */}
        <div className="text-center">
          <h3 className="text-sm font-semibold text-white mb-1">
            {currentScenarioData.name}
          </h3>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <CheckCircle className="h-3 w-3" />
            <span>{progress.completed}/{progress.total} steps</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress.percentage} className="h-2" />
          <div className="text-xs text-center text-gray-400">
            {progress.percentage}% Complete
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousStep}
            disabled={currentStep === 0}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoPlayToggle}
            className={`bg-white/10 border-white/20 text-white hover:bg-white/20 ${
              isAutoPlaying ? 'bg-teal-500/20 border-teal-400/50' : ''
            }`}
          >
            {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextStep}
            disabled={currentStep >= currentScenarioData.steps.length - 1}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Auto-play Speed Control */}
        <AnimatePresence>
          {isAutoPlaying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>Speed: {autoPlaySpeed[0]}s</span>
              </div>
              <Slider
                value={autoPlaySpeed}
                onValueChange={handleSpeedChange}
                min={3}
                max={15}
                step={1}
                className="w-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <Badge variant="outline" className="text-xs text-teal-400 border-teal-400/50">
            <Zap className="h-3 w-3 mr-1" />
            Live Demo
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={exitDemo}
            className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
          >
            <Square className="h-3 w-3 mr-1" />
            Exit
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
};
