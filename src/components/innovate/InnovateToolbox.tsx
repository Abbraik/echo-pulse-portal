
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '../ui/glass-card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScenarioLibrary } from './ScenarioLibrary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InnovateToolboxProps {
  mode: 'lesson-driven' | 'freeform' | 'moonshot';
}

export const InnovateToolbox: React.FC<InnovateToolboxProps> = ({ mode }) => {
  const { t } = useTranslation();
  
  return (
    <GlassCard className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-2">{t('systemDesignToolbox')}</h2>
      
      {/* Search for tools, concepts, scenarios */}
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('searchToolbox')}
          className="pl-8"
        />
      </div>
      
      {/* Tabs for different toolbox sections */}
      <Tabs defaultValue="lessons" className="flex-1">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="lessons">{t('lessons')}</TabsTrigger>
          <TabsTrigger value="concepts">{t('concepts')}</TabsTrigger>
          <TabsTrigger value="scenarios">{t('scenarios')}</TabsTrigger>
        </TabsList>
        
        <div className="mt-2 overflow-auto flex-1">
          <TabsContent value="lessons" className="h-full">
            {/* Placeholder for lessons content */}
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Lesson content based on mode: {mode}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="concepts" className="h-full">
            {/* Placeholder for concepts */}
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Concept blocks will appear here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="scenarios" className="h-full">
            <ScenarioLibrary mode={mode} />
          </TabsContent>
        </div>
      </Tabs>
      
      {/* New Experiment Button - fixed at bottom */}
      <div className="mt-4">
        <Button className="w-full" size="sm">
          <Plus size={16} className="mr-2" />
          {t('newExperiment')}
        </Button>
      </div>
    </GlassCard>
  );
};
