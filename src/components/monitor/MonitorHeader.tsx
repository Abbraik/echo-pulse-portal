
import React from 'react';
import { Monitor, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const narrativeMessages = [
  'monitorNarrativeOne',
  'monitorNarrativeTwo',
  'monitorNarrativeThree'
];

const MonitorHeader: React.FC = () => {
  const { t } = useTranslation();
  const [activeNarrative, setActiveNarrative] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveNarrative((prev) => (prev + 1) % narrativeMessages.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="mb-8">
      <div className="glass-panel p-6 flex items-center space-x-4">
        <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
          <Monitor size={24} />
        </div>
        <div className="text-left">
          <h1 className="text-3xl font-extrabold">{t('monitor')}</h1>
          <p className="text-gray-400">
            {t('monitorDesc')}
          </p>
        </div>
      </div>
      
      {/* Narrative Banner */}
      <div className="mt-6 glass-panel-deep p-4 border-l-4 border-teal-500">
        <div className="flex items-center justify-between">
          <p className="text-left animate-fade-in font-medium text-lg">
            {t(narrativeMessages[activeNarrative] as any)}
          </p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-4">
                <Info size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{t('monitorInfoTooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default MonitorHeader;
