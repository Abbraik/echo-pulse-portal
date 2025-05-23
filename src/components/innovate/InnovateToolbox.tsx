
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusSquare, BookOpen, Archive, Rocket, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConceptBlocksPalette } from './revolutionary/ConceptBlocksPalette';
import { LessonLaunchpad } from './evolutionary/LessonLaunchpad';
import { ScenarioLibrary } from './ScenarioLibrary';

interface InnovateToolboxProps {
  mode: 'lesson-driven' | 'freeform' | 'moonshot';
}

export const InnovateToolbox: React.FC<InnovateToolboxProps> = ({ mode }) => {
  const { t } = useTranslation();
  const [activeToolTab, setActiveToolTab] = useState(() => {
    // Set the default active tab based on the mode
    if (mode === 'lesson-driven') return 'lessons';
    if (mode === 'moonshot') return 'concepts';
    return 'concepts';
  });

  return (
    <GlassCard className="h-full shadow-[inset_0_0_15px_rgba(20,184,166,0.2)] backdrop-blur-xl flex flex-col">
      {/* Toolbox Header */}
      <div className="p-3 border-b border-white/10">
        <h3 className="text-lg font-semibold">{t('systemDesignToolbox')}</h3>
        
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchToolbox')}
            className="pl-9 bg-black/20 border-white/10"
          />
        </div>
      </div>
      
      {/* Toolbox Content */}
      <Tabs 
        defaultValue={activeToolTab} 
        onValueChange={setActiveToolTab}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <TabsList className="grid w-full grid-cols-3 p-0 h-10">
          <TabsTrigger 
            value="lessons"
            className="data-[state=active]:bg-teal-500/30 data-[state=active]:text-teal-300 rounded-none border-b data-[state=active]:border-teal-500"
          >
            <BookOpen className="mr-1 h-4 w-4" />
            {t('lessons')}
          </TabsTrigger>
          <TabsTrigger 
            value="concepts"
            className="data-[state=active]:bg-purple-500/30 data-[state=active]:text-purple-300 rounded-none border-b data-[state=active]:border-purple-500"
          >
            <PlusSquare className="mr-1 h-4 w-4" />
            {t('concepts')}
          </TabsTrigger>
          <TabsTrigger 
            value="scenarios"
            className="data-[state=active]:bg-blue-500/30 data-[state=active]:text-blue-300 rounded-none border-b data-[state=active]:border-blue-500"
          >
            <Archive className="mr-1 h-4 w-4" />
            {t('scenarios')}
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden">
          {/* Lessons Tab */}
          <TabsContent 
            value="lessons" 
            className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <ScrollArea className="flex-1 p-3">
              <LessonLaunchpad />
            </ScrollArea>
          </TabsContent>
          
          {/* Concepts Tab */}
          <TabsContent 
            value="concepts" 
            className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="flex-1 overflow-hidden">
              <ConceptBlocksPalette />
            </div>
          </TabsContent>
          
          {/* Scenarios Tab */}
          <TabsContent 
            value="scenarios" 
            className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="flex-1 overflow-hidden">
              <ScenarioLibrary vertical={true} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      {/* New Experiment Button - Fixed at Bottom */}
      <div className="p-3 border-t border-white/10">
        <Button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-md">
          <PlusSquare size={16} />
          {t('newExperiment')}
        </Button>
      </div>
    </GlassCard>
  );
};
