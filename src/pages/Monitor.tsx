
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { 
  Monitor, BarChart2, AlertTriangle, Map, Info, 
  TrendingUp, TrendingDown, Search, Settings, Zap, 
  ArrowRight, Bell, Gauge as GaugeIcon 
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import Gauge from '@/components/ui/custom/Gauge';
import { Button } from '@/components/ui/button';
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
import MonitorHeader from '@/components/monitor/MonitorHeader';
import { SystemPulseOrb } from '@/components/monitor/SystemPulseOrb';
import { AnomalyDetector } from '@/components/monitor/AnomalyDetector';
import { CoordinationTracker } from '@/components/monitor/CoordinationTracker';
import { SystemEventsTimeline } from '@/components/monitor/SystemEventsTimeline';

const MonitorPage: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [showRecalibration, setShowRecalibration] = useState(false);

  // Mock data for demonstration
  const indicators = [
    { id: 'ndi', value: 78, label: t('networkDevelopmentIndex'), color: "teal" },
    { id: 'tri', value: 64, label: t('trustRecoveryIndex'), color: "amber" },
    { id: 'abc', value: 89, label: t('averageBundleCoherence'), color: "blue" }
  ];
  
  const alerts = [
    { id: 1, metric: t('resourceEfficiency'), deviation: "-4.2%", time: "05/14 09:23", severity: "high" },
    { id: 2, metric: t('social'), deviation: "-2.8%", time: "05/14 10:15", severity: "medium" },
    { id: 3, metric: t('governance'), deviation: "+1.7%", time: "05/14 11:42", severity: "low" }
  ];
  
  const handleAlertAction = (alertId: number, action: 'view' | 'recalibrate' | 'escalate') => {
    setSelectedAlert(String(alertId));
    
    if (action === 'recalibrate') {
      setShowRecalibration(true);
      toast({
        title: t('recalibrationStarted'),
        description: t('recalibrationDescription'),
      });
    } else if (action === 'escalate') {
      toast({
        title: t('escalated'),
        description: t('escalatedDescription'),
      });
    } else {
      toast({
        title: t('viewingAlert'),
        description: t('viewingAlertDescription'),
      });
    }
  };

  const handleCloseRecalibration = () => {
    setShowRecalibration(false);
  };

  return (
    <AnimatedPage className={`${isRTL ? 'rtl' : ''}`}>
      {/* Monitor Zone Header */}
      <MonitorHeader />
      
      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Key Indicators Carousel */}
        <div className="lg:col-span-12">
          <Carousel className="w-full">
            <CarouselContent>
              {indicators.map((indicator) => (
                <CarouselItem key={indicator.id} className="md:basis-1/3 lg:basis-1/4">
                  <div className="glass-panel p-6 h-full">
                    <h3 className="text-lg font-semibold mb-4 text-left">{indicator.label}</h3>
                    <div className="flex justify-center mb-4">
                      <Gauge 
                        value={indicator.value} 
                        size="lg" 
                        color={indicator.color as any} 
                        showValue={true}
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="ghost" className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1">
                        {t('viewDetails')}
                        <ArrowRight size={12} />
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className={`${isRTL ? 'order-2' : 'order-1'} relative inset-auto mx-1`} />
              <CarouselNext className={`${isRTL ? 'order-1' : 'order-2'} relative inset-auto mx-1`} />
            </div>
          </Carousel>
        </div>
        
        {/* System Pulse Orb */}
        <div className="lg:col-span-4">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-left flex items-center">
              <GaugeIcon className="mr-2 text-teal-400" size={18} />
              {t('systemPulse')}
            </h2>
            <div className="h-64 flex items-center justify-center">
              <SystemPulseOrb />
            </div>
          </GlassCard>
        </div>
        
        {/* Alerts & Response Table */}
        <div className="lg:col-span-8">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-left flex items-center">
              <AlertTriangle className="mr-2 text-amber-400" size={18} />
              {t('alertStream')}
            </h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('metric')}</TableHead>
                    <TableHead>{t('deviation')}</TableHead>
                    <TableHead>{t('time')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id} className={`hover:bg-white/5 ${alert.id === Number(selectedAlert) ? 'bg-amber-500/10' : ''}`}>
                      <TableCell className="font-medium">{alert.metric}</TableCell>
                      <TableCell className={alert.deviation.startsWith('-') ? 'text-red-400' : 'text-green-400'}>
                        {alert.deviation}
                      </TableCell>
                      <TableCell>{alert.time}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleAlertAction(alert.id, 'view')}
                            title={t('viewInThink')}
                          >
                            <Search size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleAlertAction(alert.id, 'recalibrate')}
                            title={t('recalibrate')}
                          >
                            <Settings size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleAlertAction(alert.id, 'escalate')}
                            title={t('escalateToAct')}
                          >
                            <Zap size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </GlassCard>
        </div>
        
        {/* Anomaly Detector Feed */}
        <div className="lg:col-span-6">
          <AnomalyDetector />
        </div>
        
        {/* Coordination Gap Tracker */}
        <div className="lg:col-span-6">
          <CoordinationTracker />
        </div>
        
        {/* System Events Record Timeline */}
        <div className="lg:col-span-12">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-left flex items-center">
              <BarChart2 className="mr-2 text-teal-400" size={18} />
              {t('systemEventsRecord')}
            </h2>
            <SystemEventsTimeline />
          </GlassCard>
        </div>
      </div>
      
      {/* Micro-Sim Recalibration Panel */}
      <div className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} w-96 glass-panel-deep z-50 shadow-2xl transform transition-transform duration-300 ${showRecalibration ? 'translate-x-0' : isRTL ? '-translate-x-full' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-teal-400">{t('recalibration')}</h3>
            <Button variant="ghost" size="sm" onClick={handleCloseRecalibration}>
              {t('close')}
            </Button>
          </div>
          <div className="flex-grow overflow-y-auto">
            {selectedAlert && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">{t('parameter')}: {alerts.find(a => a.id === Number(selectedAlert))?.metric}</h4>
                  <input type="range" className="w-full" />
                  <div className="flex justify-between text-xs mt-1">
                    <span>-10%</span>
                    <span>0%</span>
                    <span>+10%</span>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-sm font-medium mb-2">{t('impact')}</h4>
                  <div className="flex justify-center py-4">
                    <Gauge value={72} size="md" color="teal" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4">
            <Button className="w-full">{t('applyChanges')}</Button>
          </div>
        </div>
      </div>
      
      {/* Next Zone CTA */}
      <div className="mt-8 flex justify-center">
        <Button 
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center"
        >
          {t('innovate')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </AnimatedPage>
  );
};

export default MonitorPage;
