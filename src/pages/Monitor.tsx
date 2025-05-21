
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { 
  Monitor, BarChart2, AlertTriangle, Map, Info, 
  TrendingUp, TrendingDown, Search, Settings, Zap, 
  ArrowRight, Bell, Clock, Activity, FileText 
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

  return (
    <AnimatedPage>
      <div className={`${isRTL ? 'rtl' : ''} px-4 sm:px-6 lg:px-8`}>
        {/* Loop Navigation Ribbon */}
        <div className="mb-6">
          <LoopNavigation />
        </div>
        
        {/* Title Bar */}
        <header className="mb-8">
          <div className="glass-panel p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400">
                <Monitor size={24} />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-extrabold">{t('monitor')}: {t('systemOperationsHealth')}</h1>
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
        </header>
        
        {/* Strategic Monitoring Sub-Zone (Top 60%) */}
        <section className="mb-10">
          <FadeInView>
            <h2 className="text-xl font-semibold mb-4 text-left">{t('strategicMonitoring')}</h2>
            
            {/* Composite Equilibrium Deck */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {compositeMetrics.map((metric, index) => (
                <GlassCard 
                  key={metric.id} 
                  className="p-4 hover:shadow-xl transition-all duration-300"
                  glowOnHover
                  glowColor={metric.color}
                >
                  <ScaleInView delay={index * 0.1}>
                    <h3 className="text-lg font-semibold mb-2">{metric.label}</h3>
                    <div className="flex justify-center items-center h-32">
                      {metric.id === 'dei' ? (
                        <SystemPulseOrb />
                      ) : (
                        <Gauge value={metric.value} size="lg" color={metric.color as any} showValue />
                      )}
                    </div>
                  </ScaleInView>
                </GlassCard>
              ))}
            </div>
            
            {/* Pillar Snapshots */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {pillars.map((pillar, index) => (
                <GlassCard key={pillar.id} className="p-4 hover:shadow-lg transition-all duration-300">
                  <ScaleInView delay={0.2 + index * 0.1}>
                    <h3 className="text-lg font-semibold mb-2">{pillar.label}</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold">{pillar.current}</span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400 mr-1">{t('target')}:</span>
                        <span className="text-sm">{pillar.target}</span>
                      </div>
                    </div>
                    
                    {/* Sparkline visualization - simplified representation */}
                    <div className="h-8 flex items-end gap-1 mb-2">
                      {pillar.sparkline.map((value, i) => (
                        <div 
                          key={i}
                          className="bg-teal-500/30 rounded-sm transition-all duration-500"
                          style={{ 
                            height: `${value}%`, 
                            width: '25%',
                            opacity: i === pillar.sparkline.length - 1 ? 1 : 0.7 - (0.1 * (pillar.sparkline.length - 1 - i))
                          }}
                        />
                      ))}
                    </div>
                    
                    <div className="mt-2 text-right">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Info size={14} className="text-gray-400" />
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
                  </ScaleInView>
                </GlassCard>
              ))}
            </div>
            
            {/* Alerts & Anomalies Section (Split View) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Alerts Table */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-4 text-left flex items-center">
                  <AlertTriangle className="mr-2 text-amber-400" size={18} />
                  {t('alertStream')}
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('indicator')}</TableHead>
                        <TableHead>{t('deviation')}</TableHead>
                        <TableHead>{t('timestamp')}</TableHead>
                        <TableHead className="text-right">{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alerts.map((alert, index) => (
                        <TableRow 
                          key={alert.id} 
                          className={`transition-all duration-500 ${
                            newAlertFlash === index ? 'bg-amber-500/20' : ''
                          } ${alert.id === Number(selectedAlert) ? 'bg-teal-500/10' : ''}`}
                        >
                          <TableCell className="font-medium">{alert.indicator}</TableCell>
                          <TableCell className={alert.deviation.startsWith('-') ? 'text-red-400' : 'text-green-400'}>
                            {alert.deviation}
                          </TableCell>
                          <TableCell>{alert.timestamp}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleAlertAction(alert.id, 'investigate')}
                                  >
                                    <Search size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <span>{t('investigate')}</span>
                                </TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleAlertAction(alert.id, 'recalibrate')}
                                  >
                                    <Settings size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <span>{t('recalibrate')}</span>
                                </TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleAlertAction(alert.id, 'escalate')}
                                  >
                                    <TrendingUp size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <span>{t('escalate')}</span>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </GlassCard>
              
              {/* Anomaly Detector Feed */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-4 text-left flex items-center">
                  <Zap className="mr-2 text-amber-400" size={18} />
                  {t('anomalyDetector')}
                </h3>
                <Carousel className="w-full">
                  <CarouselContent>
                    {anomalies.map((anomaly) => (
                      <CarouselItem key={anomaly.id}>
                        <div className="glass-panel-deep p-4 h-full">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-medium">{anomaly.title}</h4>
                            {renderSeverityBadge(anomaly.severity)}
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-gray-400">{anomaly.date}</p>
                            <p className="text-sm mt-2">{anomaly.description.substring(0, 120)}...</p>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs" 
                              onClick={() => handleViewAnomaly(anomaly.id)}
                            >
                              {t('investigate')}
                              <ArrowRight size={12} className="ml-1" />
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="text-xs bg-teal-500 hover:bg-teal-600" 
                              onClick={() => handleTriggerPlaybook(anomaly.id)}
                            >
                              {t('triggerPlaybook')}
                              <ArrowRight size={12} className="ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center mt-4">
                    <CarouselPrevious className="relative inset-auto mx-2" />
                    <CarouselNext className="relative inset-auto mx-2" />
                  </div>
                </Carousel>
              </GlassCard>
            </div>
          </FadeInView>
        </section>
        
        {/* Operational Monitoring Sub-Zone (Bottom 40%) */}
        <section>
          <FadeInView delay={0.3}>
            <h2 className="text-xl font-semibold mb-4 text-left">{t('operationalMonitoring')}</h2>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Claim Velocity Dashboard */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-3 text-left flex items-center">
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 mr-2">
                    <Clock size={16} />
                  </div>
                  {t('claimVelocityDashboard')}
                  {renderTrendIndicator(operationalMetrics.claimVelocity.trend)}
                </h3>
                
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('rolesOpenedVsFilled')}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">{operationalMetrics.claimVelocity.rolesFilled}/{operationalMetrics.claimVelocity.rolesOpened}</span>
                      <div className="w-24">
                        <Progress value={(operationalMetrics.claimVelocity.rolesFilled / operationalMetrics.claimVelocity.rolesOpened) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('avgTimeToClaim')}</span>
                    <span className="font-medium">{operationalMetrics.claimVelocity.avgTimeToClaimDays} {t('days')}</span>
                  </div>
                  
                  {/* Simplified bar chart for roles */}
                  <div className="h-20 flex items-end gap-2">
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-teal-500/40 rounded-sm" style={{ height: `${(operationalMetrics.claimVelocity.rolesOpened / 50) * 100}%` }}></div>
                      <span className="text-xs mt-1">{t('opened')}</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-blue-500/40 rounded-sm" style={{ height: `${(operationalMetrics.claimVelocity.rolesFilled / 50) * 100}%` }}></div>
                      <span className="text-xs mt-1">{t('filled')}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              {/* Sprint Throughput Metrics */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-3 text-left flex items-center">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 mr-2">
                    <Clock size={16} />
                  </div>
                  {t('sprintThroughputMetrics')}
                </h3>
                
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('tasksDeliveredVsPlanned')}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">{operationalMetrics.sprintThroughput.tasksDelivered}/{operationalMetrics.sprintThroughput.tasksPlanned}</span>
                      <div className="w-24">
                        <Progress value={(operationalMetrics.sprintThroughput.tasksDelivered / operationalMetrics.sprintThroughput.tasksPlanned) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('onTimePercentage')}</span>
                    <span className="font-medium">{operationalMetrics.sprintThroughput.onTimePercentage}%</span>
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
              </GlassCard>
              
              {/* Entropy & Drift Scanner */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-3 text-left flex items-center">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mr-2">
                    <Map size={16} />
                  </div>
                  {t('entropyDriftScanner')}
                  {renderTrendIndicator(operationalMetrics.entropyScanner.trend)}
                </h3>
                
                <div className="flex">
                  {/* Entropy dial */}
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <Gauge value={operationalMetrics.entropyScanner.entropyScore} max={100} size="md" color="amber" />
                    <span className="text-sm mt-2">{t('entropyScore')}</span>
                  </div>
                  
                  {/* List of issues */}
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-2">{t('systemIssues')}</div>
                    <ul className="space-y-2">
                      <li className="flex items-center text-xs">
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                        {operationalMetrics.entropyScanner.reworkEvents} {t('reworkEvents')}
                      </li>
                      <li className="flex items-center text-xs">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                        {operationalMetrics.entropyScanner.blockedHandoffs} {t('blockedHandoffs')}
                      </li>
                    </ul>
                  </div>
                </div>
              </GlassCard>
              
              {/* Collaboration Health Indicators */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-3 text-left flex items-center">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 mr-2">
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
              </GlassCard>
            </div>
            
            {/* Operational Alerts & Quick-Actions */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-left">{t('operationalAlertsQuickActions')}</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Operational Alerts */}
                <div>
                  <h4 className="text-lg font-medium mb-3 text-left">{t('operationalAlerts')}</h4>
                  
                  <div className="space-y-3">
                    <Staggered staggerDelay={0.1}>
                      {operationalAlerts.map((alert) => (
                        <div key={alert.id} className="glass-panel-deep p-3 flex justify-between items-center">
                          <div>
                            <div className="flex items-center">
                              {alert.type === 'overdueTask' && <Badge variant="destructive">{t('overdueTask')}</Badge>}
                              {alert.type === 'abandonedBundle' && <Badge variant="warning">{t('abandonedBundle')}</Badge>}
                              {alert.type === 'pendingApproval' && <Badge variant="info">{t('pendingApproval')}</Badge>}
                            </div>
                            <p className="text-sm mt-1">{alert.description}</p>
                          </div>
                          
                          <div className="text-xs text-gray-400">
                            {alert.type === 'overdueTask' && `${alert.daysOverdue} ${t('daysOverdue')}`}
                            {alert.type === 'abandonedBundle' && `${alert.daysInactive} ${t('daysInactive')}`}
                            {alert.type === 'pendingApproval' && `${alert.daysWaiting} ${t('daysWaiting')}`}
                          </div>
                        </div>
                      ))}
                    </Staggered>
                  </div>
                </div>
                
                {/* Quick-Actions */}
                <div>
                  <h4 className="text-lg font-medium mb-3 text-left">{t('quickActions')}</h4>
                  
                  <div className="glass-panel-deep p-4 space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-white/5"
                      onClick={() => handleOperationalAction('reassign', 1)}
                    >
                      <Activity className="mr-3 h-4 w-4" />
                      <div className="text-left">
                        <div>{t('reassignTask')}</div>
                        <div className="text-xs text-muted-foreground">{t('reassignTaskDesc')}</div>
                      </div>
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-white/5"
                      onClick={() => handleOperationalAction('escalate', 2)}
                    >
                      <TrendingUp className="mr-3 h-4 w-4" />
                      <div className="text-left">
                        <div>{t('escalateToLeadership')}</div>
                        <div className="text-xs text-muted-foreground">{t('escalateToLeadershipDesc')}</div>
                      </div>
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-white/5"
                      onClick={() => handleOperationalAction('generate', 3)}
                    >
                      <FileText className="mr-3 h-4 w-4" />
                      <div className="text-left">
                        <div>{t('generateOpsReport')}</div>
                        <div className="text-xs text-muted-foreground">{t('generateOpsReportDesc')}</div>
                      </div>
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </FadeInView>
        </section>
        
        {/* Micro-Sim Panel (slide-in) */}
        <MicroSimPanel 
          isOpen={showMicroSim}
          onClose={handleCloseMicroSim}
          selectedAlert={alerts.find(a => a.id === Number(selectedAlert))}
          isRTL={isRTL}
        />
        
        {/* Popups and Modals */}
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
      </div>
    </AnimatedPage>
  );
};

export default MonitorPage;
