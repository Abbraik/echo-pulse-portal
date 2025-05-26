
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Package, GitBranch, Wrench } from 'lucide-react';
import { ConceptBlocksPalette } from './revolutionary/ConceptBlocksPalette';
import { ScenarioFork } from './revolutionary/ScenarioFork';
import { AddCustomBlocksModal } from './AddCustomBlocksModal';

interface ConceptBlock {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
  type: string;
}

interface ScenarioForkData {
  id: string;
  name: string;
  active: boolean;
}

interface CustomBlock {
  id: string;
  title: string;
  type: 'text' | 'image' | 'chart' | 'widget' | 'html';
  content: string;
}

interface InnovateToolboxProps {
  mode: 'lesson-driven' | 'freeform' | 'moonshot';
  onBlockSelect?: (block: ConceptBlock) => void;
  onForkSelect?: (fork: ScenarioForkData) => void;
  onCustomBlocksAdded?: (blocks: CustomBlock[]) => void;
}

export const InnovateToolbox: React.FC<InnovateToolboxProps> = ({ 
  mode, 
  onBlockSelect,
  onForkSelect,
  onCustomBlocksAdded
}) => {
  const { t } = useTranslation();
  const [isCustomBlocksModalOpen, setIsCustomBlocksModalOpen] = useState(false);

  const handleCustomBlocksSave = (blocks: CustomBlock[]) => {
    onCustomBlocksAdded?.(blocks);
    console.log('Custom blocks saved:', blocks);
  };

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-4">System Redesign</h2>
      
      <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="blocks" className="flex items-center gap-1">
            <Package size={14} />
            <span className="hidden sm:inline">Blocks</span>
          </TabsTrigger>
          <TabsTrigger value="forks" className="flex items-center gap-1">
            <GitBranch size={14} />
            <span className="hidden sm:inline">Forks</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden mb-4">
          <TabsContent value="blocks" className="h-full m-0">
            <ScrollArea className="h-full">
              <ConceptBlocksPalette 
                mode={mode} 
                onBlockSelect={onBlockSelect}
              />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="forks" className="h-full m-0">
            <ScrollArea className="h-full">
              <ScenarioFork onForkSelect={onForkSelect} />
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
      
      {/* System Redesign Button with Custom Blocks functionality */}
      <Button 
        onClick={() => setIsCustomBlocksModalOpen(true)}
        className="w-full flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        size="lg"
      >
        <Wrench size={18} />
        New system redesign
      </Button>

      {/* Custom Blocks Modal */}
      <AddCustomBlocksModal
        open={isCustomBlocksModalOpen}
        onOpenChange={setIsCustomBlocksModalOpen}
        onSaveBlocks={handleCustomBlocksSave}
      />
    </div>
  );
};
