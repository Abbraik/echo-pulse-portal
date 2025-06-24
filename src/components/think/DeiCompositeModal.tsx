import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Calendar, ArrowRight, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/hooks/use-theme';
import { GlassCard } from '@/components/ui/glass-card';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import DeiGaugeChart from './components/DeiGaugeChart';
import DeiTrendChart from './components/DeiTrendChart';
import PillarRadialChart from './components/PillarRadialChart';
import SubIndicatorTable from './components/SubIndicatorTable';

interface DeiCompositeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deiValue: number;
  minBand: number;
  maxBand: number;
  pillars: {
    population: any;
    resources: any;
    goods: any;
    social: any;
  };
  equilibriumBands: any;
}

const DeiCompositeModal: React.FC<DeiCompositeModalProps> = ({
  open,
  onOpenChange,
  deiValue,
  minBand,
  maxBand,
  pillars,
  equilibriumBands,
}) => {
  const { t, isRTL, language, setLanguage } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const [showSubIndicators, setShowSubIndicators] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check for mobile view on mount and resize
  React.useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  // Generate mock historical data for the trend chart
  const historicalData = React.useMemo(() => {
    const now = new Date();
    return Array.from({ length: 24 }, (_, i) => {
      const date = new Date();
      date.setMonth(now.getMonth() - (23 - i));
      return {
        date: date.toISOString().split('T')[0],
        value: Math.round(65 + Math.random() * 20),
        event: i % 8 === 0 ? 'Policy Change' : null,
      };
    });
  }, []);

  // Prepare pillar data for the radial charts with safe access
  const pillarData = [
    {
      id: 'population',
      name: t('populationPillar'),
      value: pillars?.population?.value || 0,
      minBand: equilibriumBands?.population?.min || 65,
      maxBand: equilibriumBands?.population?.max || 80,
      subIndicators: pillars?.population?.subIndicators?.slice(0, 3) || [],
      icon: '👥',
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 'resources',
      name: t('resourcesPillar'),
      value: pillars?.resources?.value || 0,
      minBand: equilibriumBands?.resources?.min || 60,
      maxBand: equilibriumBands?.resources?.max || 75,
      subIndicators: pillars?.resources?.subIndicators?.slice(0, 3) || [],
      icon: '🌱',
      color: 'from-emerald-400 to-emerald-600',
    },
    {
      id: 'goods',
      name: t('goodsPillar'),
      value: pillars?.goods?.value || 0,
      minBand: equilibriumBands?.goods?.min || 75,
      maxBand: equilibriumBands?.goods?.max || 90,
      subIndicators: pillars?.goods?.subIndicators?.slice(0, 3) || [],
      icon: '📦',
      color: 'from-amber-400 to-amber-600',
    },
    {
      id: 'social',
      name: t('socialPillar'),
      value: pillars?.social?.value || 0,
      minBand: equilibriumBands?.social?.min || 70,
      maxBand: equilibriumBands?.social?.max || 85,
      subIndicators: pillars?.social?.subIndicators?.slice(0, 3) || [],
      icon: '🤝',
      color: 'from-purple-400 to-purple-600',
    },
  ];

  // Collect all sub-indicators for the table with safe access
  const allSubIndicators = React.useMemo(() => {
    const indicators: any[] = [];
    Object.keys(pillars || {}).forEach((key) => {
      const pillarKey = key as keyof typeof pillars;
      const pillarData = pillars?.[pillarKey];
      if (pillarData?.subIndicators) {
        pillarData.subIndicators.forEach((indicator: any) => {
          indicators.push({
            ...indicator,
            pillar: t(`${pillarKey}Pillar`),
          });
        });
      }
    });
    return indicators;
  }, [pillars, t]);

  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Toggle language handler
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const modalContent = (
    <div className={`dei-modal ${isRTL ? 'rtl' : ''}`}>
      <header className="flex items-center justify-between h-12 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            {t('deiCompositeIndicator')}
          </h2>
          <p className="text-xs text-muted-foreground">{t('dynamicEquilibriumStatus')}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={t('toggleLanguage')}
          >
            <span className="text-sm font-medium">{language === 'en' ? 'العربية' : 'EN'}</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={t('toggleTheme')}
          >
            {resolvedTheme === 'dark' ? '☀️' : '🌙'}
          </button>
          <DialogClose className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
            <span className="sr-only">{t('close')}</span>
          </DialogClose>
        </div>
      </header>

      <section className="mb-8">
        <div className="flex flex-col items-center">
          {/* Main DEI Gauge */}
          <motion.div 
            className="mb-4 w-full max-w-xs"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <DeiGaugeChart 
              value={deiValue} 
              minBand={minBand} 
              maxBand={maxBand} 
              pulsing={deiValue < minBand || deiValue > maxBand}
            />
          </motion.div>
          
          {/* DEI Score Display */}
          <div className="text-center">
            <div className="text-lg font-semibold">
              DEI = <span className="text-xl font-bold">{deiValue}</span> / {t('target')} [{minBand}–{maxBand}]
            </div>
            <div className={`text-sm mt-1 px-3 py-1 rounded-full inline-flex items-center gap-1
              ${deiValue >= minBand && deiValue <= maxBand 
                ? 'bg-teal-500/20 text-teal-400' 
                : deiValue < minBand 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {deiValue >= minBand && deiValue <= maxBand ? (
                t('inEquilibrium')
              ) : (
                <>
                  {deiValue < minBand ? 
                    `${Math.abs(deiValue - minBand)} ${t('pointsBelow')}` : 
                    `${Math.abs(deiValue - maxBand)} ${t('pointsAbove')}`
                  }
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4">{t('pillarBreakdown')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillarData.map((pillar) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: pillarData.indexOf(pillar) * 0.1 }}
              className="glass-panel-deep p-4"
            >
              <PillarRadialChart
                title={pillar.name}
                icon={pillar.icon}
                value={pillar.value}
                minBand={pillar.minBand}
                maxBand={pillar.maxBand}
                subIndicators={pillar.subIndicators}
                color={pillar.color}
              />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t('historicalTrend')}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={16} className="mr-1" />
            <span>{t('last24Months')}</span>
          </div>
        </div>
        <div className="glass-panel-deep p-4">
          <DeiTrendChart 
            data={historicalData} 
            minBand={minBand} 
            maxBand={maxBand} 
          />
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t('subIndicators')}</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowSubIndicators(!showSubIndicators)}
          >
            {showSubIndicators ? t('hide') : t('show')}
          </Button>
        </div>
        
        <AnimatePresence>
          {showSubIndicators && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-panel-deep p-4 overflow-hidden"
            >
              <SubIndicatorTable subIndicators={allSubIndicators} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-background via-background to-transparent">
        <div className="flex flex-wrap gap-2 justify-center md:justify-between">
          <Button className="glass-panel flex items-center gap-2">
            {t('viewPillarDetails')}
            <ArrowRight size={16} />
          </Button>
          <Button className="glass-panel flex items-center gap-2">
            {t('simulateImprovement')}
            <ArrowRight size={16} />
          </Button>
          <Button className="glass-panel flex items-center gap-2">
            {t('exportData')}
            <ArrowRight size={16} />
          </Button>
        </div>
      </footer>
    </div>
  );

  return (
    <>
      {/* Desktop/Tablet Dialog */}
      {!isMobileView && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto glass-panel-deep !p-6 border-none shadow-xl">
            {modalContent}
          </DialogContent>
        </Dialog>
      )}
      
      {/* Mobile Sheet */}
      {isMobileView && (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="h-[95vh] rounded-t-xl glass-panel-deep !p-6 border-none shadow-xl">
            {modalContent}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default DeiCompositeModal;
