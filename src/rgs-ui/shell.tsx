import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { useFeatureFlags } from '@/hooks/use-feature-flags';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';

// Placeholder components for new RGS UI zones
const RgsThink = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.15 }}
    className="p-6"
  >
    <GlassCard className="p-8 text-center" variant="deep">
      <h1 className="text-2xl font-semibold text-primary mb-4">New RGS Think Zone</h1>
      <p className="text-muted-foreground">Sprint Progress • Tension Signals • Leverage Points</p>
      <Button className="mt-6">Start Sprint</Button>
    </GlassCard>
  </motion.div>
);

const RgsAct = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.15 }}
    className="p-6"
  >
    <GlassCard className="p-8 text-center" variant="deep">
      <h1 className="text-2xl font-semibold text-primary mb-4">New RGS Act Zone</h1>
      <p className="text-muted-foreground">Bundle Summary • Intervention Picker • Smart Roles</p>
      <Button className="mt-6">Publish Bundle</Button>
    </GlassCard>
  </motion.div>
);

const RgsMonitor = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.15 }}
    className="p-6"
  >
    <GlassCard className="p-8 text-center" variant="deep">
      <h1 className="text-2xl font-semibold text-primary mb-4">New RGS Monitor Zone</h1>
      <p className="text-muted-foreground">PulseBar • Loop List • DE-Band Badges</p>
      <Button className="mt-6">Review TRI</Button>
    </GlassCard>
  </motion.div>
);

const RgsInnovateLearn = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.15 }}
    className="p-6"
  >
    <GlassCard className="p-8 text-center" variant="deep">
      <h1 className="text-2xl font-semibold text-primary mb-4">New RGS Innovate-Learn Zone</h1>
      <p className="text-muted-foreground">Insight Feed • Quick-Run Simulation • Experiment Templates</p>
      <Button className="mt-6">Run Simulation</Button>
    </GlassCard>
  </motion.div>
);

const RgsHome = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.15 }}
    className="p-6"
  >
    <GlassCard className="p-8 text-center" variant="deep">
      <h1 className="text-3xl font-bold text-primary mb-4">New RGS Interface</h1>
      <p className="text-muted-foreground mb-6">Modern glassmorphic design with streamlined workflows</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-20 flex flex-col">
          <span className="text-lg mb-1">🧠</span>
          <span>Think</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col">
          <span className="text-lg mb-1">⚡</span>
          <span>Act</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col">
          <span className="text-lg mb-1">📊</span>
          <span>Monitor</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col">
          <span className="text-lg mb-1">🚀</span>
          <span>Innovate</span>
        </Button>
      </div>
    </GlassCard>
  </motion.div>
);

const RgsUIShell: React.FC = () => {
  const { flags, toggleFlag } = useFeatureFlags();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header with Settings */}
      <header className="h-16 border-b border-white/10 backdrop-blur-md bg-black/20 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary">RGS System</h1>
          <span className="text-sm text-muted-foreground bg-primary/20 px-2 py-1 rounded">New UI</span>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>UI Settings</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="new-rgs-ui" className="text-sm font-medium">
                  New RGS UI
                </Label>
                <Switch
                  id="new-rgs-ui"
                  checked={flags.newRgsUI}
                  onCheckedChange={() => toggleFlag('newRgsUI')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="advanced-settings" className="text-sm font-medium">
                  Advanced Settings
                </Label>
                <Switch
                  id="advanced-settings"
                  checked={flags.newRgsAdvancedSettings}
                  onCheckedChange={() => toggleFlag('newRgsAdvancedSettings')}
                />
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Phase 1: Core UI Shell & Feature Flag System
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<RgsHome />} />
        <Route path="/think" element={<RgsThink />} />
        <Route path="/act" element={<RgsAct />} />
        <Route path="/monitor" element={<RgsMonitor />} />
        <Route path="/innovate" element={<RgsInnovateLearn />} />
        <Route path="/learn" element={<RgsInnovateLearn />} />
      </Routes>
    </div>
  );
};

export default RgsUIShell;