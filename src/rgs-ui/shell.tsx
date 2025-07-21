import React, { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Settings, 
  ArrowRight, 
  Play, 
  Zap, 
  Target, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  HelpCircle,
  Bell,
  Activity,
  Users,
  Package,
  Heart
} from 'lucide-react';
import { useFeatureFlags } from '@/hooks/use-feature-flags';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import RgsThinkZone from './think';
import RgsActZone from './act';
import RgsMonitorZone from './monitor';
import RgsInnovateLearnZone from './innovate-learn';

// Mock data and types
type UserRole = 'Champion' | 'Analyst' | 'Custodian' | 'Juror';

const mockData = {
  sprint: {
    currentWeek: 2,
    totalWeeks: 8,
    daysRemaining: 12,
    title: "Q1 Healthcare Reform Sprint"
  },
  systemHealth: {
    healthy: 12,
    warning: 3,
    critical: 1,
    pillars: [
      { name: 'Population', trend: 'up' as const, value: 85 },
      { name: 'Resources', trend: 'stable' as const, value: 72 },
      { name: 'Goods & Services', trend: 'down' as const, value: 67 },
      { name: 'Social', trend: 'up' as const, value: 91 }
    ]
  },
  insights: [
    { id: 1, title: 'Healthcare access optimization shows 23% improvement potential', timestamp: '2h ago' },
    { id: 2, title: 'Education quality correlates with teacher training cycles', timestamp: '5h ago' },
    { id: 3, title: 'Transport infrastructure timing affects economic development', timestamp: '1d ago' }
  ],
  notifications: [
    { id: 1, type: 'approval', title: 'Bundle #247 awaiting juror approval', timestamp: '30m ago', icon: Users },
    { id: 2, type: 'alert', title: 'DE-Band breach detected in Loop SDG-11', timestamp: '1h ago', icon: AlertTriangle },
    { id: 3, type: 'success', title: 'Sprint milestone achieved ahead of schedule', timestamp: '2h ago', icon: CheckCircle }
  ]
};

// Home component for new RGS UI
const RgsHome = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState<UserRole>('Champion');

  const getQuickActionsForRole = (role: UserRole) => {
    switch (role) {
      case 'Champion':
        return [
          { label: 'Publish Bundle', variant: 'default' as const, action: () => navigate('/act') },
          { label: 'Start Sprint', variant: 'outline' as const, action: () => navigate('/think') },
          { label: 'Run Simulation', variant: 'outline' as const, action: () => navigate('/innovate') }
        ];
      case 'Analyst':
        return [
          { label: 'Start Sprint', variant: 'default' as const, action: () => navigate('/think') },
          { label: 'Run Simulation', variant: 'outline' as const, action: () => navigate('/innovate') },
          { label: 'View Analysis', variant: 'outline' as const, action: () => navigate('/monitor') }
        ];
      case 'Custodian':
        return [
          { label: 'View Monitor', variant: 'default' as const, action: () => navigate('/monitor') },
          { label: 'System Health', variant: 'outline' as const, action: () => navigate('/monitor') },
          { label: 'Generate Report', variant: 'outline' as const, action: () => {} }
        ];
      case 'Juror':
        return [
          { label: 'Review Approvals', variant: 'default' as const, action: () => navigate('/act') },
          { label: 'View Bundles', variant: 'outline' as const, action: () => navigate('/act') },
          { label: 'System Status', variant: 'outline' as const, action: () => navigate('/monitor') }
        ];
    }
  };

  const PulseChip = ({ count, label, status, tooltip }: { count: number; label: string; status: 'healthy' | 'warning' | 'critical'; tooltip: string }) => {
    const colors = {
      healthy: 'bg-green-500/20 text-green-400 border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      critical: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    return (
      <Tooltip>
        <TooltipTrigger>
          <motion.div
            className={`px-3 py-1 rounded-full border text-sm font-medium ${colors[status]} animate-pulse`}
            whileHover={{ scale: 1.05 }}
          >
            {status === 'healthy' ? '🟢' : status === 'warning' ? '🟡' : '🔴'} {count}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  const Sparkline = ({ data, trend }: { data: number; trend: 'up' | 'down' | 'stable' }) => {
    const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-yellow-400';
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-8 bg-gradient-to-r from-primary/20 to-accent/20 rounded flex items-center justify-center">
          <TrendingUp className={`h-4 w-4 ${trendColor}`} />
        </div>
        <span className="text-sm font-medium">{data}%</span>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-6 space-y-6"
      >
        {/* Top Row - Status Overview */}
        <div className="grid grid-cols-5 gap-6">
          
          {/* Sprint Status Card - 60% width */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="col-span-3"
          >
            <GlassCard className="p-6 bg-glass backdrop-blur-20 bg-opacity-70 rounded-2xl shadow-lg shadow-black/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-primary mb-1">Current Sprint</h2>
                  <p className="text-base text-muted-foreground">
                    Week {mockData.sprint.currentWeek} of {mockData.sprint.totalWeeks} – Due in {mockData.sprint.daysRemaining} days
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sprint tracking shows current progress and remaining time</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{Math.round((mockData.sprint.currentWeek / mockData.sprint.totalWeeks) * 100)}%</span>
                </div>
                <Progress 
                  value={(mockData.sprint.currentWeek / mockData.sprint.totalWeeks) * 100} 
                  className="h-3"
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Week 1</span>
                  <span>Week {mockData.sprint.totalWeeks}</span>
                </div>
              </div>

              <Button 
                className="bg-primary rounded-lg py-2 px-4 hover:bg-primary/90"
                onClick={() => navigate('/think')}
              >
                Go to Think
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </GlassCard>
          </motion.div>

          {/* System Health Card - 40% width */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
            className="col-span-2"
          >
            <GlassCard className="p-6 bg-glass backdrop-blur-20 bg-opacity-70 rounded-2xl shadow-lg shadow-black/30">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary">System Health</h2>
                <Activity className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex gap-2 mb-4 flex-wrap">
                <PulseChip 
                  count={mockData.systemHealth.healthy} 
                  label="Healthy" 
                  status="healthy"
                  tooltip={`${mockData.systemHealth.healthy} loops operating normally`}
                />
                <PulseChip 
                  count={mockData.systemHealth.warning} 
                  label="Warning" 
                  status="warning"
                  tooltip={`${mockData.systemHealth.warning} loops showing warning indicators`}
                />
                <PulseChip 
                  count={mockData.systemHealth.critical} 
                  label="Critical" 
                  status="critical"
                  tooltip={`${mockData.systemHealth.critical} loop in critical state`}
                />
              </div>

              <div className="space-y-3 mb-4">
                {mockData.systemHealth.pillars.map((pillar, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{pillar.name}</span>
                    <Sparkline data={pillar.value} trend={pillar.trend} />
                  </div>
                ))}
              </div>

              <Button 
                variant="link" 
                className="text-primary underline p-0"
                onClick={() => navigate('/monitor')}
              >
                View Monitor
              </Button>
            </GlassCard>
          </motion.div>
        </div>

        {/* Bottom Row - Quick Actions & Insights */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* Quick Actions Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <GlassCard className="p-6 bg-glass backdrop-blur-20 bg-opacity-70 rounded-2xl shadow-lg shadow-black/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Quick Actions</h3>
                <select 
                  value={currentRole} 
                  onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                  className="text-sm bg-background/50 border border-white/20 rounded px-2 py-1"
                >
                  <option value="Champion">Champion</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Custodian">Custodian</option>
                  <option value="Juror">Juror</option>
                </select>
              </div>
              
              <div className="space-y-3">
                {getQuickActionsForRole(currentRole).map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    className="w-full justify-start h-12"
                    onClick={action.action}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Insights Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.25 }}
          >
            <GlassCard className="p-6 bg-glass backdrop-blur-20 bg-opacity-70 rounded-2xl shadow-lg shadow-black/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Recent Insights
              </h3>
              
              <div className="space-y-3">
                {mockData.insights.map((insight) => (
                  <div key={insight.id} className="p-3 bg-background/30 rounded-lg">
                    <p className="text-sm font-medium mb-2">{insight.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {insight.timestamp}
                      </span>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-accent underline p-0 h-auto"
                        onClick={() => navigate('/innovate')}
                      >
                        Try Experiment ▶
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Notifications Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <GlassCard className="p-6 bg-glass backdrop-blur-20 bg-opacity-70 rounded-2xl shadow-lg shadow-black/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </h3>
              
              <div className="space-y-3">
                {mockData.notifications.map((notification) => {
                  const IconComponent = notification.icon;
                  const typeColors = {
                    approval: 'text-blue-400',
                    alert: 'text-red-400',
                    success: 'text-green-400'
                  };
                  
                  return (
                    <div key={notification.id} className="p-3 bg-background/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <IconComponent className={`h-4 w-4 mt-0.5 ${typeColors[notification.type as keyof typeof typeColors]}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">{notification.title}</p>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {notification.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

const RgsUIShell: React.FC = () => {
  const { flags, toggleFlag } = useFeatureFlags();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header with Settings */}
      <header className="h-16 border-b border-white/10 backdrop-blur-md bg-black/20 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="text-xl font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            RGS System
          </Link>
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

      <Routes>
        <Route path="/" element={<RgsHome />} />
        <Route path="/think" element={<RgsThinkZone />} />
        <Route path="/act" element={<RgsActZone />} />
        <Route path="/monitor" element={<RgsMonitorZone />} />
        <Route path="/innovate" element={<RgsInnovateLearnZone />} />
        <Route path="/learn" element={<RgsInnovateLearnZone />} />
      </Routes>
    </div>
  );
};

export default RgsUIShell;