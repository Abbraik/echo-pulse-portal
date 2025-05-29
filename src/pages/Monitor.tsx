import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { 
  Monitor, BarChart2, AlertTriangle, Map, Info, 
  TrendingUp, TrendingDown, Search, Settings, Zap, 
  ArrowRight, Bell, Clock, Activity, FileText, ArrowUp
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import Gauge from '@/components/ui/custom/Gauge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { FadeInView, ScaleInView, Staggered } from '@/components/ui/motion';
import LoopNavigation from '@/components/home/LoopNavigation';

// Import components
import { SystemPulseOrb } from '@/components/monitor/SystemPulseOrb';
import { MicroSimPanel } from '@/components/monitor/MicroSimPanel';
import { AlertDetailPopup } from '@/components/monitor/AlertDetailPopup';
import { AnomalyDetailPanel } from '@/components/monitor/AnomalyDetailPanel';
import { RecommendationPopup } from '@/components/monitor/RecommendationPopup';

// 1. Create a mock RecommendationPopupProps interface to match the component
interface RecommendationPopupProps {
  recommendation: any;
  onDismiss: () => void;
  onApplyPlaybook: (id: string) => void;
  onCreateBundle: (id: string) => void;
}

const MonitorPage: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [showMicroSim, setShowMicroSim] = useState(false);
  const [alertDetailOpen, setAlertDetailOpen] = useState(false);
  const [selectedAlertData, setSelectedAlertData] = useState<any>(null);
  const [activeRecommendation, setActiveRecommendation] = useState<any>(null);
  const [anomalyDetailOpen, setAnomalyDetailOpen] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null);
  const [newAlertFlash, setNewAlertFlash] = useState<number | null>(null);
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Strategic monitoring data
  const compositeMetrics = [
    { id: 'dei', label: t('deiComposite'), value: 78, color: "teal" },
    { id: 'ndi', label: t('networkDevelopmentIndex'), value: 64, color: "amber" },
    { id: 'tri', label: t('trustRecoveryIndex'), value: 89, color: "blue" },
    { id: 'abc', label: t('averageBundleCoherence'), value: 72, color: "purple" }
  ];
  
  const pillars = [
    { id: 'social', label: t('social'), current: 82, target: 85, sparkline: [76, 78, 80, 82] },
    { id: 'economic', label: t('economic'), current: 68, target: 75, sparkline: [60, 65, 67, 68] },
    { id: 'environmental', label: t('environmental'), current: 91, target: 90, sparkline: [85, 87, 89, 91] },
    { id: 'governance', label: t('governance'), current: 73, target: 80, sparkline: [70, 69, 71, 73] }
  ];
  
  // Alert data
  const alerts = [
    { id: 1, indicator: t('resourceEfficiency'), deviation: "-4.2%", timestamp: "05/14 09:23", severity: "high" },
    { id: 2, indicator: t('socialCohesion'), deviation: "-2.8%", timestamp: "05/14 10:15", severity: "medium" },
    { id: 3, indicator: t('governanceParticipation'), deviation: "+1.7%", timestamp: "05/14 11:42", severity: "low" }
  ];
  
  // Anomalies data
  const anomalies = [
    {
      id: 1,
      title: t('socialTrustAnomaly'),
      severity: 'high',
      date: '2025-05-18',
      description: t('socialTrustDescription'),
      rootCause: t('socialTrustRootCause')
    },
    {
      id: 2,
      title: t('waterResourcesAnomaly'),
      severity: 'medium',
      date: '2025-05-17',
      description: t('waterResourcesDescription'),
      rootCause: t('waterResourcesRootCause')
    },
    {
      id: 3,
      title: t('economicActivityAnomaly'),
      severity: 'low',
      date: '2025-05-16',
      description: t('economicActivityDescription'),
      rootCause: t('economicActivityRootCause')
    }
  ];
  
  // Operational monitoring data
  const operationalMetrics = {
    claimVelocity: {
      rolesOpened: 42,
      rolesFilled: 35,
      avgTimeToClaimDays: 3.2,
      trend: 'up'
    },
    sprintThroughput: {
      tasksDelivered: 78,
      tasksPlanned: 85,
      onTimePercentage: 92,
      trend: 'stable'
    },
    entropyScanner: {
      entropyScore: 24,
      reworkEvents: 3,
      blockedHandoffs: 2,
      trend: 'down'
    },
    collaborationHealth: {
      messageCount: 1243,
      meetingHours: 32,
      avgResponseTime: '14m',
      trend: 'up'
    }
  };
  
  const operationalAlerts = [
    { id: 1, type: 'overdueTask', description: 'Community Feedback Integration', daysOverdue: 2 },
    { id: 2, type: 'abandonedBundle', description: 'Water Conservation Initiative', daysInactive: 5 },
    { id: 3, type: 'pendingApproval', description: 'Renewable Energy Transition Plan', daysWaiting: 3 }
  ];
  
  // Simulate a new alert appearing
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new alert
        const randomAlert = Math.floor(Math.random() * alerts.length);
        setNewAlertFlash(randomAlert);
        
        setTimeout(() => {
          setNewAlertFlash(null);
        }, 3000);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [alerts.length]);
  
  // Randomly show recommendations
  useEffect(() => {
    const recommendations = [
      { id: '1', message: t('recommendationOne') },
      { id: '2', message: t('recommendationTwo') },
      { id: '3', message: t('recommendationThree') }
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of showing a recommendation
        setActiveRecommendation(recommendations[index]);
        index = (index + 1) % recommendations.length;
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [t]);
  
  const handleAlertAction = (alertId: number, action: 'investigate' | 'recalibrate' | 'escalate') => {
    setSelectedAlert(String(alertId));
    const alertData = alerts.find(a => a.id === alertId);
    
    if (action === 'recalibrate') {
      setShowMicroSim(true);
      toast({
        title: t('recalibrationStarted'),
        description: t('recalibrationDescription'),
      });
    } else if (action === 'escalate') {
      toast({
        title: t('escalated'),
        description: t('escalatedDescription'),
      });
    } else if (action === 'investigate') {
      setSelectedAlertData(alertData);
      setAlertDetailOpen(true);
    }
  };

  const handleCloseMicroSim = () => {
    setShowMicroSim(false);
  };
  
  const handleViewAnomaly = (anomalyId: number) => {
    const anomaly = anomalies.find(a => a.id === anomalyId);
    if (anomaly) {
      setSelectedAnomaly(anomaly);
      setAnomalyDetailOpen(true);
    }
  };
  
  const handleTriggerPlaybook = (anomalyId: number) => {
    toast({
      title: t('playbookTriggered'),
      description: t('playbookTriggeredDescription'),
    });
  };
  
  const handleDismissRecommendation = () => {
    setActiveRecommendation(null);
  };
  
  const handleOperationalAction = (actionType: string, itemId: number) => {
    switch(actionType) {
      case 'reassign':
        toast({
          title: t('taskReassigned'),
          description: t('taskReassignedDescription'),
        });
        break;
      case 'escalate':
        toast({
          title: t('escalatedToLeadership'),
          description: t('escalatedToLeadershipDescription'),
        });
        break;
      case 'generate':
        toast({
          title: t('reportGenerated'),
          description: t('reportGeneratedDescription'),
        });
        break;
      default:
        break;
    }
  };

  // Added handlers for RecommendationPopup
  const handleApplyPlaybook = (id: string) => {
    // Placeholder function to satisfy the interface requirement
    console.log("Applying playbook:", id);
  };
  
  const handleCreateBundle = (id: string) => {
    // Placeholder function to satisfy the interface requirement
    console.log("Creating bundle:", id);
  };

  // Function to render severity badge
  const renderSeverityBadge = (severity: string) => {
    const variant = severity === 'high' ? 'destructive' : 
                   severity === 'medium' ? 'warning' : 'info';
    
    return <Badge variant={variant}>{severity}</Badge>;
  };

  // Function to render trend indicator
  const renderTrendIndicator = (trend: string) => {
    if (trend === 'up') {
      return <TrendingUp className="text-green-500" size={16} />;
    } else if (trend === 'down') {
      return <TrendingDown className="text-red-500" size={16} />;
    }
    return null;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced cinematic background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-teal-500/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
      </div>

      <AnimatedPage>
        {/* Cinematic Header Bar */}
        <motion.header 
          className="sticky top-0 z-50 w-full backdrop-blur-[24px] py-4 px-6 mb-8"
          style={{
            background: 'rgba(20, 30, 50, 0.6)',
            borderBottom: '1px solid rgba(20, 184, 166, 0.3)',
            boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
          }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: hideHeader ? -100 : 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="p-3 rounded-2xl bg-purple-500/20 text-purple-400"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Monitor size={28} />
              </motion.div>
              <div className="text-left">
                <motion.h1 
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-teal-500 font-noto-bold"
                  style={{ letterSpacing: '0.05em' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  MONITOR 📊: {t("operationalStrategicTracking", { defaultValue: "OPERATIONAL & STRATEGIC TRACKING" })}
                </motion.h1>
                <motion.p 
                  className="text-base text-gray-300 font-noto-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {t("monitorCoreDesc", { defaultValue: "Real-time system health and performance insights" })}
                </motion.p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <Info size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{t('monitorTooltip')}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.header>

        {/* Main Content Container */}
        <div className="max-w-[1440px] mx-auto px-6 pb-8 relative z-10">
          {/* Loop Navigation Ribbon */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LoopNavigation />
          </motion.div>
          
          {/* Strategic Monitoring Section */}
          <motion.section 
            className="mb-10"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <motion.h2 
              className="text-2xl font-bold mb-6 text-left text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500 font-noto-bold"
              style={{ letterSpacing: '0.05em' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {t('strategicMonitoring')}
            </motion.h2>
            
            {/* Composite Equilibrium Deck */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {compositeMetrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group"
                >
                  <div 
                    className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative p-6 h-full transition-all duration-300"
                    style={{
                      background: 'rgba(20, 30, 50, 0.6)',
                      boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <h3 className="text-lg font-semibold mb-4 text-left flex items-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 font-noto-medium">
                        {metric.label}
                      </h3>
                      <div className="flex justify-center items-center h-32">
                        {metric.id === 'dei' ? (
                          <SystemPulseOrb />
                        ) : (
                          <Gauge value={metric.value} size="lg" color={metric.color as any} showValue />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Pillar Snapshots */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3 + 0.1 * index, duration: 0.5 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group"
                >
                  <div 
                    className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative p-4 h-full transition-all duration-300"
                    style={{
                      background: 'rgba(20, 30, 50, 0.6)',
                      boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <h3 className="text-lg font-semibold mb-3 text-white font-noto-medium">{pillar.label}</h3>
                      <div className="flex justify-between items-center mb-2">
                        <motion.span 
                          className="text-2xl font-bold text-teal-400"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + 0.1 * index, type: "spring", stiffness: 200 }}
                        >
                          {pillar.current}
                        </motion.span>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-400 mr-1">{t('target')}:</span>
                          <span className="text-sm text-gray-300">{pillar.target}</span>
                        </div>
                      </div>
                      
                      {/* Enhanced Sparkline */}
                      <div className="h-8 flex items-end gap-1 mb-3">
                        {pillar.sparkline.map((value, i) => (
                          <motion.div 
                            key={i}
                            className="bg-gradient-to-t from-teal-500/40 to-teal-400/60 rounded-sm transition-all duration-500"
                            style={{ 
                              height: `${value}%`, 
                              width: '25%',
                              opacity: i === pillar.sparkline.length - 1 ? 1 : 0.7 - (0.1 * (pillar.sparkline.length - 1 - i))
                            }}
                            initial={{ height: 0 }}
                            animate={{ height: `${value}%` }}
                            transition={{ delay: 0.7 + 0.1 * i, duration: 0.6 }}
                          />
                        ))}
                      </div>
                      
                      <div className="mt-2 text-right">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-teal-400 transition-colors">
                              <Info size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold mb-1">{t('topIndicators')}:</p>
                            <ul className="text-sm text-left">
                              <li>• {t(`${pillar.id}Indicator1`)}</li>
                              <li>• {t(`${pillar.id}Indicator2`)}</li>
                              <li>• {t(`${pillar.id}Indicator3`)}</li>
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Alerts & Anomalies Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Alerts Table */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div 
                  className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative p-6"
                  style={{
                    background: 'rgba(20, 30, 50, 0.6)',
                    boxShadow: 'inset 0 0 30px rgba(239, 68, 68, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/5 rounded-2xl"></div>
                  <div className="relative">
                    <h3 className="text-xl font-bold mb-4 text-left flex items-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 font-noto-bold">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mr-3"
                      >
                        <AlertTriangle size={20} />
                      </motion.div>
                      {t('alertStream')}
                    </h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-gray-300">{t('indicator')}</TableHead>
                            <TableHead className="text-gray-300">{t('deviation')}</TableHead>
                            <TableHead className="text-gray-300">{t('timestamp')}</TableHead>
                            <TableHead className="text-right text-gray-300">{t('actions')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {alerts.map((alert, index) => (
                            <motion.tr 
                              key={alert.id}
                              className={`transition-all duration-500 border-white/10 ${
                                newAlertFlash === index ? 'bg-amber-500/20' : ''
                              } ${alert.id === Number(selectedAlert) ? 'bg-teal-500/10' : ''}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + 0.1 * index }}
                              whileHover={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}
                            >
                              <TableCell className="font-medium text-white">{alert.indicator}</TableCell>
                              <TableCell className={alert.deviation.startsWith('-') ? 'text-red-400' : 'text-green-400'}>
                                {alert.deviation}
                              </TableCell>
                              <TableCell className="text-gray-300">{alert.timestamp}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {[
                                    { action: 'investigate', icon: Search, tooltip: t('investigate') },
                                    { action: 'recalibrate', icon: Settings, tooltip: t('recalibrate') },
                                    { action: 'escalate', icon: TrendingUp, tooltip: t('escalate') }
                                  ].map(({ action, icon: Icon, tooltip }) => (
                                    <Tooltip key={action}>
                                      <TooltipTrigger asChild>
                                        <motion.div
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleAlertAction(alert.id, action as any)}
                                            className="text-gray-400 hover:text-teal-400 transition-colors"
                                          >
                                            <Icon size={16} />
                                          </Button>
                                        </motion.div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <span>{tooltip}</span>
                                      </TooltipContent>
                                    </Tooltip>
                                  ))}
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Enhanced Anomaly Detector */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div 
                  className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative p-6"
                  style={{
                    background: 'rgba(20, 30, 50, 0.6)',
                    boxShadow: 'inset 0 0 30px rgba(251, 191, 36, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 rounded-2xl"></div>
                  <div className="relative">
                    <h3 className="text-xl font-bold mb-4 text-left flex items-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 font-noto-bold">
                      <motion.div
                        animate={{ rotate: [0, 180, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="mr-3"
                      >
                        <Zap size={20} />
                      </motion.div>
                      {t('anomalyDetector')}
                    </h3>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {anomalies.map((anomaly, index) => (
                          <CarouselItem key={anomaly.id}>
                            <motion.div 
                              className="p-4 h-full rounded-xl border border-white/10"
                              style={{
                                background: 'rgba(20, 30, 50, 0.8)',
                                boxShadow: 'inset 0 0 20px rgba(251, 191, 36, 0.1)'
                              }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 + 0.1 * index }}
                              whileHover={{ y: -2, boxShadow: 'inset 0 0 30px rgba(251, 191, 36, 0.2), 0 8px 16px rgba(0, 0, 0, 0.3)' }}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="text-lg font-medium text-white font-noto-medium">{anomaly.title}</h4>
                                {renderSeverityBadge(anomaly.severity)}
                              </div>
                              <div className="mb-4">
                                <p className="text-sm text-gray-400 mb-1">{anomaly.date}</p>
                                <p className="text-sm text-gray-300">{anomaly.description.substring(0, 120)}...</p>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-xs border-teal-500/30 text-teal-400 hover:bg-teal-500/10" 
                                    onClick={() => handleViewAnomaly(anomaly.id)}
                                  >
                                    {t('investigate')}
                                    <ArrowRight size={12} className="ml-1" />
                                  </Button>
                                </motion.div>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    className="text-xs bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600" 
                                    onClick={() => handleTriggerPlaybook(anomaly.id)}
                                  >
                                    {t('triggerPlaybook')}
                                    <ArrowRight size={12} className="ml-1" />
                                  </Button>
                                </motion.div>
                              </div>
                            </motion.div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="flex justify-center mt-4">
                        <CarouselPrevious className="relative inset-auto mx-2 bg-white/10 border-white/20 hover:bg-white/20" />
                        <CarouselNext className="relative inset-auto mx-2 bg-white/10 border-white/20 hover:bg-white/20" />
                      </div>
                    </Carousel>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
          
          {/* Operational Monitoring Section */}
          <motion.section
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
          >
            <motion.h2 
              className="text-2xl font-bold mb-6 text-left text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-500 font-noto-bold"
              style={{ letterSpacing: '0.05em' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {t('operationalMonitoring')}
            </motion.h2>
            
            {/* Enhanced Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Claim Velocity Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div 
                  className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative p-6 h-full transition-all duration-300"
                  style={{
                    background: 'rgba(20, 30, 50, 0.6)',
                    boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <h3 className="text-lg font-semibold mb-4 text-left flex items-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 font-noto-medium">
                      <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 mr-3">
                        <Clock size={16} />
                      </div>
                      {t('claimVelocityDashboard')}
                      {renderTrendIndicator(operationalMetrics.claimVelocity.trend)}
                    </h3>
                    
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{t('rolesOpenedVsFilled')}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">{operationalMetrics.claimVelocity.rolesFilled}/{operationalMetrics.claimVelocity.rolesOpened}</span>
                          <div className="w-24">
                            <Progress value={(operationalMetrics.claimVelocity.rolesFilled / operationalMetrics.claimVelocity.rolesOpened) * 100} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{t('avgTimeToClaim')}</span>
                        <motion.span 
                          className="font-medium text-teal-400"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1, type: "spring" }}
                        >
                          {operationalMetrics.claimVelocity.avgTimeToClaimDays} {t('days')}
                        </motion.span>
                      </div>
                      
                      {/* Enhanced bar chart */}
                      <div className="h-20 flex items-end gap-2 mt-4">
                        <div className="flex-1 flex flex-col items-center">
                          <motion.div 
                            className="w-full bg-gradient-to-t from-teal-500/40 to-teal-400/60 rounded-sm"
                            initial={{ height: 0 }}
                            animate={{ height: `${(operationalMetrics.claimVelocity.rolesOpened / 50) * 100}%` }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                          ></motion.div>
                          <span className="text-xs mt-1 text-gray-400">{t('opened')}</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                          <motion.div 
                            className="w-full bg-gradient-to-t from-blue-500/40 to-blue-400/60 rounded-sm"
                            initial={{ height: 0 }}
                            animate={{ height: `${(operationalMetrics.claimVelocity.rolesFilled / 50) * 100}%` }}
                            transition={{ delay: 1.4, duration: 0.8 }}
                          ></motion.div>
                          <span className="text-xs mt-1 text-gray-400">{t('filled')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Sprint Throughput Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div 
                  className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative p-6 h-full transition-all duration-300"
                  style={{
                    background: 'rgba(20, 30, 50, 0.6)',
                    boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <h3 className="text-lg font-semibold mb-4 text-left flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 font-noto-medium">
                      <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 mr-3">
                        <BarChart2 size={16} />
                      </div>
                      {t('sprintThroughputMetrics')}
                    </h3>
                    
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{t('tasksDeliveredVsPlanned')}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">{operationalMetrics.sprintThroughput.tasksDelivered}/{operationalMetrics.sprintThroughput.tasksPlanned}</span>
                          <div className="w-24">
                            <Progress value={(operationalMetrics.sprintThroughput.tasksDelivered / operationalMetrics.sprintThroughput.tasksPlanned) * 100} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{t('onTimePercentage')}</span>
                        <motion.span 
                          className="font-medium text-blue-400"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.2, type: "spring" }}
                        >
                          {operationalMetrics.sprintThroughput.onTimePercentage}%
                        </motion.span>
                      </div>
                      
                      {/* Simplified Gantt-style chart */}
                      <div className="relative h-16 bg-gray-200/10 rounded-sm mt-2 overflow-hidden">
                        {/* Task blocks */}
                        <div className="absolute top-1 left-0 h-4 w-3/4 bg-teal-500/30 rounded-sm"></div>
                        <div className="absolute top-7 left-1/4 h-4 w-1/2 bg-blue-500/30 rounded-sm"></div>
                        <div className="absolute top-1 left-[80%] h-4 w-[15%] bg-amber-500/30 rounded-sm"></div>
                        
                        {/* Today marker */}
                        <div className="absolute top-0 left-[65%] h-full w-0.5 bg-red-400"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Entropy & Drift Scanner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div 
                  className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative p-6 h-full transition-all duration-300"
                  style={{
                    background: 'rgba(20, 30, 50, 0.6)',
                    boxShadow: 'inset 0 0 30px rgba(251, 191, 36, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <h3 className="text-lg font-semibold mb-4 text-left flex items-center text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 font-noto-medium">
                      <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mr-3">
                        <Map size={16} />
                      </div>
                      {t('entropyDriftScanner')}
                      {renderTrendIndicator(operationalMetrics.entropyScanner.trend)}
                    </h3>
                    
                    <div className="flex">
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <Gauge value={operationalMetrics.entropyScanner.entropyScore} max={100} size="md" color="amber" />
                        <span className="text-sm mt-2 text-gray-300">{t('entropyScore')}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-2 text-gray-300">{t('systemIssues')}</div>
                        <ul className="space-y-2">
                          <motion.li 
                            className="flex items-center text-xs text-gray-300"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.3 }}
                          >
                            <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                            {operationalMetrics.entropyScanner.reworkEvents} {t('reworkEvents')}
                          </motion.li>
                          <motion.li 
                            className="flex items-center text-xs text-gray-300"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.4 }}
                          >
                            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                            {operationalMetrics.entropyScanner.blockedHandoffs} {t('blockedHandoffs')}
                          </motion.li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Collaboration Health Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div 
                  className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative p-6 h-full transition-all duration-300"
                  style={{
                    background: 'rgba(20, 30, 50, 0.6)',
                    boxShadow: 'inset 0 0 30px rgba(147, 51, 234, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <h3 className="text-lg font-semibold mb-4 text-left flex items-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-noto-medium">
                      <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 mr-3">
                        <Activity size={16} />
                      </div>
                      {t('collaborationHealthIndicators')}
                      {renderTrendIndicator(operationalMetrics.collaborationHealth.trend)}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="glass-panel-deep p-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <Bell size={14} className="text-blue-400 mr-2" />
                          <span className="text-xs">{t('messageCount')}</span>
                        </div>
                        <span className="font-medium">{operationalMetrics.collaborationHealth.messageCount}</span>
                      </div>
                      
                      <div className="glass-panel-deep p-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock size={14} className="text-teal-400 mr-2" />
                          <span className="text-xs">{t('meetingHoursPerTask')}</span>
                        </div>
                        <span className="font-medium">{operationalMetrics.collaborationHealth.meetingHours}</span>
                      </div>
                      
                      <div className="glass-panel-deep p-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <Activity size={14} className="text-amber-400 mr-2" />
                          <span className="text-xs">{t('avgChatResponseTime')}</span>
                        </div>
                        <span className="font-medium">{operationalMetrics.collaborationHealth.avgResponseTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Enhanced Operational Alerts & Quick-Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <div 
                className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative p-8"
                style={{
                  background: 'rgba(20, 30, 50, 0.6)',
                  boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-2xl"></div>
                <div className="relative">
                  <h3 className="text-2xl font-bold mb-6 text-left text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-noto-bold">
                    {t('operationalAlertsQuickActions')}
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Operational Alerts */}
                    <div>
                      <h4 className="text-lg font-medium mb-4 text-left text-gray-200 font-noto-medium">{t('operationalAlerts')}</h4>
                      
                      <div className="space-y-3">
                        <Staggered staggerDelay={0.1}>
                          {operationalAlerts.map((alert, index) => (
                            <motion.div 
                              key={alert.id} 
                              className="p-4 rounded-xl border border-white/10 transition-all duration-300"
                              style={{
                                background: 'rgba(20, 30, 50, 0.8)',
                                boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.1)'
                              }}
                              whileHover={{ 
                                y: -2, 
                                boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.2), 0 8px 16px rgba(0, 0, 0, 0.3)' 
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="flex items-center mb-1">
                                    {alert.type === 'overdueTask' && <Badge variant="destructive">{t('overdueTask')}</Badge>}
                                    {alert.type === 'abandonedBundle' && <Badge variant="warning">{t('abandonedBundle')}</Badge>}
                                    {alert.type === 'pendingApproval' && <Badge variant="info">{t('pendingApproval')}</Badge>}
                                  </div>
                                  <p className="text-sm mt-1 text-gray-300">{alert.description}</p>
                                </div>
                                
                                <div className="text-xs text-gray-400">
                                  {alert.type === 'overdueTask' && `${alert.daysOverdue} ${t('daysOverdue')}`}
                                  {alert.type === 'abandonedBundle' && `${alert.daysInactive} ${t('daysInactive')}`}
                                  {alert.type === 'pendingApproval' && `${alert.daysWaiting} ${t('daysWaiting')}`}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </Staggered>
                      </div>
                    </div>
                    
                    {/* Quick-Actions */}
                    <div>
                      <h4 className="text-lg font-medium mb-4 text-left text-gray-200 font-noto-medium">{t('quickActions')}</h4>
                      
                      <div className="space-y-4" style={{
                        background: 'rgba(20, 30, 50, 0.8)',
                        boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.1)'
                      }} className="p-4 rounded-xl border border-white/10">
                        {[
                          {
                            action: 'reassign',
                            icon: Activity,
                            title: t('reassignTask'),
                            desc: t('reassignTaskDesc')
                          },
                          {
                            action: 'escalate',
                            icon: TrendingUp,
                            title: t('escalateToLeadership'),
                            desc: t('escalateToLeadershipDesc')
                          },
                          {
                            action: 'generate',
                            icon: FileText,
                            title: t('generateOpsReport'),
                            desc: t('generateOpsReportDesc')
                          }
                        ].map((item, index) => (
                          <motion.div
                            key={item.action}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.5 + 0.1 * index }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant="outline"
                              className="w-full justify-start hover:bg-white/5 border-white/20 text-gray-300 hover:text-white transition-all duration-300"
                              onClick={() => handleOperationalAction(item.action, index + 1)}
                            >
                              <item.icon className="mr-3 h-4 w-4 text-teal-400" />
                              <div className="text-left">
                                <div className="font-medium">{item.title}</div>
                                <div className="text-xs text-muted-foreground">{item.desc}</div>
                              </div>
                              <ArrowRight className="ml-auto h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>
        </div>
        
        {/* Enhanced Scroll to top button */}
        {showScrollToTop && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button 
              variant="outline"
              size="icon" 
              className="rounded-full h-12 w-12 backdrop-blur-[24px] border border-white/20 shadow-lg transition-all duration-300 hover:scale-110"
              style={{
                background: 'rgba(20, 184, 166, 0.8)',
                boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)'
              }}
              onClick={scrollToTop}
            >
              <ArrowUp className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        )}
        
        {/* Keep all existing popup components */}
        <MicroSimPanel 
          isOpen={showMicroSim}
          onClose={handleCloseMicroSim}
          selectedAlert={alerts.find(a => a.id === Number(selectedAlert))}
          isRTL={isRTL}
        />
        
        <AlertDetailPopup 
          isOpen={alertDetailOpen}
          onClose={() => setAlertDetailOpen(false)}
          alert={selectedAlertData}
        />
        
        <AnomalyDetailPanel
          isOpen={anomalyDetailOpen}
          onClose={() => setAnomalyDetailOpen(false)}
          anomaly={selectedAnomaly}
        />
        
        <RecommendationPopup
          recommendation={activeRecommendation}
          onDismiss={handleDismissRecommendation}
          onApplyPlaybook={handleApplyPlaybook}
          onCreateBundle={handleCreateBundle}
        />
      </AnimatedPage>
    </div>
  );
};

export default MonitorPage;
