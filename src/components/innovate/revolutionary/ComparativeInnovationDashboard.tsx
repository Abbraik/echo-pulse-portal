
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export const ComparativeInnovationDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [view, setView] = React.useState('spider');
  
  // Mock frameworks to compare
  const frameworks = [
    { id: 'baseline', name: 'Baseline', checked: true },
    { id: 'fork1', name: 'Resource Commons', checked: true },
    { id: 'fork2', name: 'Distributed Governance', checked: false },
    { id: 'fork3', name: 'Regenerative Economics', checked: true },
  ];
  
  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t('comparativeInnovationDashboard')}</h3>
        <Button variant="outline" size="sm">
          {t('analyze')}
        </Button>
      </div>
      
      <div className="grid grid-cols-4 h-[calc(100%-3rem)]">
        <div className="pr-4 border-r border-gray-700/20">
          <h4 className="text-sm font-medium mb-2">{t('frameworkPicker')}</h4>
          <div className="space-y-2">
            {frameworks.map(framework => (
              <div key={framework.id} className="flex items-center space-x-2">
                <Checkbox id={framework.id} defaultChecked={framework.checked} />
                <label htmlFor={framework.id} className="text-sm">
                  {framework.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-span-3 pl-4">
          <Tabs defaultValue={view} onValueChange={setView} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="spider">{t('spiderGraph')}</TabsTrigger>
              <TabsTrigger value="bar">{t('barMatrix')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="spider" className="mt-0">
              <div className="bg-gray-800/30 rounded-lg p-4 h-[200px] flex items-center justify-center">
                {t('spiderChartPlaceholder')}
              </div>
            </TabsContent>
            
            <TabsContent value="bar" className="mt-0">
              <div className="bg-gray-800/30 rounded-lg p-4 h-[200px] flex items-center justify-center">
                {t('barChartPlaceholder')}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-5 gap-2 mt-4">
            {['equity', 'resilience', 'sustainability', 'cohesion', 'growth'].map(metric => (
              <div key={metric} className="text-center">
                <div className="h-1 w-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-1"></div>
                <span className="text-xs capitalize">{t(metric)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
