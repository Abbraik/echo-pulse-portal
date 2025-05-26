
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Download, Edit } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export const BlueprintTab: React.FC = () => {
  const { t } = useTranslation();

  const mockAssumptions = [
    'Youth engagement correlates directly with social trust levels',
    'Community programs show measurable impact within 6 months',
    'Policy changes require 3-month implementation buffer'
  ];

  const mockStocksFlows = [
    { type: 'Stock', name: 'Youth Engagement', value: 45, unit: 'index' },
    { type: 'Stock', name: 'Social Trust', value: 72, unit: 'index' },
    { type: 'Flow', name: 'Trust Building Rate', value: 2.3, unit: 'points/month' },
    { type: 'Flow', name: 'Engagement Decay', value: -0.8, unit: 'points/month' }
  ];

  const mockRisks = [
    { risk: 'Implementation delays', impact: 'High', mitigation: 'Buffer periods in timeline' },
    { risk: 'Stakeholder resistance', impact: 'Medium', mitigation: 'Early engagement strategy' },
    { risk: 'Resource constraints', impact: 'Medium', mitigation: 'Phased rollout approach' }
  ];

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t('systemBlueprint')}</h2>
          <Button className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600">
            <Download size={16} />
            {t('exportBlueprint')}
          </Button>
        </div>

        <Accordion type="multiple" className="space-y-4">
          {/* Core Assumptions */}
          <AccordionItem value="assumptions" className="glass-panel rounded-xl">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">{t('coreAssumptions')}</span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Edit size={12} />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="space-y-3">
                {mockAssumptions.map((assumption, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-6 h-6 bg-teal-500/20 text-teal-300 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="flex-1 text-sm">{assumption}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Stocks & Flows */}
          <AccordionItem value="stocks-flows" className="glass-panel rounded-xl">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="text-lg font-semibold">{t('stocksAndFlows')}</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-sm font-medium">{t('type')}</th>
                      <th className="text-left py-2 text-sm font-medium">{t('name')}</th>
                      <th className="text-right py-2 text-sm font-medium">{t('value')}</th>
                      <th className="text-left py-2 text-sm font-medium">{t('unit')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStocksFlows.map((item, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.type === 'Stock' 
                              ? 'bg-blue-500/20 text-blue-300' 
                              : 'bg-green-500/20 text-green-300'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 text-sm">{item.name}</td>
                        <td className="py-3 text-sm text-right font-mono">{item.value}</td>
                        <td className="py-3 text-sm text-muted-foreground">{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Outcomes & Risks */}
          <AccordionItem value="risks" className="glass-panel rounded-xl">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="text-lg font-semibold">{t('outcomesAndRisks')}</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="space-y-3">
                {mockRisks.map((item, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.risk}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.impact === 'High' 
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {item.impact} {t('impact')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.mitigation}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
