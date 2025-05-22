
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, FileJson, FileText, FileUp } from 'lucide-react';

interface MetaDesignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MetaDesignModal: React.FC<MetaDesignModalProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState('assumptions');
  
  // Mock data
  const assumptions = [
    'Resource Rights → Commons',
    'Market Access → Equitable',
    'Governance → Distributed',
    'Technology → Regenerative'
  ];
  
  const stocks = [
    { name: 'Social Trust', initial: 45, target: 82 },
    { name: 'Resource Commons', initial: 12, target: 68 },
    { name: 'Knowledge Capital', initial: 38, target: 76 }
  ];
  
  const outcomes = [
    'Social equity increases by 37% over baseline',
    'Environmental regeneration accelerated by 3.2x',
    'Economic stability improves with 45% lower volatility',
    'Governance participation increases by 2.8x'
  ];
  
  const risks = [
    'Transition period may create temporary resource allocation inefficiencies',
    'Resistance from incumbent economic actors',
    'Learning curve for participatory governance',
    'Need for new social contracts and agreements'
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel-deep sm:max-w-[700px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            {t('metaDesignBlueprint')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[60vh]">
          <Tabs defaultValue="assumptions" className="w-full h-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="assumptions">{t('coreAssumptions')}</TabsTrigger>
              <TabsTrigger value="stocks">{t('newStocksFlows')}</TabsTrigger>
              <TabsTrigger value="outcomes">{t('outcomes')}</TabsTrigger>
              <TabsTrigger value="risks">{t('risks')}</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[calc(100%-3rem)]">
              <TabsContent value="assumptions" className="mt-0 h-full">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">{t('coreAssumptions')}</h3>
                    <p className="text-sm text-muted-foreground">{t('coreAssumptionsDescription')}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {assumptions.map((assumption, index) => (
                        <li key={index} className="glass-panel p-3 flex justify-between items-center">
                          <span>{assumption}</span>
                          <Button variant="ghost" size="sm">✏️</Button>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full mt-4">
                      <span>+ {t('addAssumption')}</span>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="stocks" className="mt-0">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">{t('newStocksFlows')}</h3>
                    <p className="text-sm text-muted-foreground">{t('newStocksFlowsDescription')}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700/30">
                            <th className="text-left py-2">{t('name')}</th>
                            <th className="text-right py-2">{t('initial')}</th>
                            <th className="text-right py-2">{t('target')}</th>
                            <th className="text-right py-2">{t('change')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stocks.map((stock, index) => (
                            <tr key={index} className="border-b border-gray-700/10">
                              <td className="py-3">{stock.name}</td>
                              <td className="text-right py-3">{stock.initial}</td>
                              <td className="text-right py-3">{stock.target}</td>
                              <td className={`text-right py-3 ${stock.target > stock.initial ? 'text-green-400' : 'text-red-400'}`}>
                                {((stock.target - stock.initial) / stock.initial * 100).toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="outcomes" className="mt-0">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">{t('outcomes')}</h3>
                    <p className="text-sm text-muted-foreground">{t('outcomesDescription')}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {outcomes.map((outcome, index) => (
                        <li key={index} className="glass-panel p-3 flex justify-between items-center">
                          <span>{outcome}</span>
                          <Button variant="ghost" size="sm">✏️</Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="risks" className="mt-0">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">{t('risks')}</h3>
                    <p className="text-sm text-muted-foreground">{t('risksDescription')}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {risks.map((risk, index) => (
                        <li key={index} className="glass-panel p-3 flex justify-between items-center">
                          <span>{risk}</span>
                          <Button variant="ghost" size="sm">✏️</Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        
        <DialogFooter className="flex justify-between">
          <span className="text-sm text-muted-foreground">
            {t('blueprintSource')}: {t('revolutionarySandbox')}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1">
              <FileText size={16} />
              <span>PDF</span>
            </Button>
            <Button variant="outline" className="gap-1">
              <FileUp size={16} />
              <span>PPTX</span>
            </Button>
            <Button variant="default" className="gap-1">
              <FileJson size={16} />
              <span>JSON</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
