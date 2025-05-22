
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, PlusSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ConceptBlock = {
  id: string;
  name: string;
  description: string;
  category: string;
};

// Sample concept blocks for demonstration
const CONCEPT_BLOCKS: ConceptBlock[] = [
  { id: 'ubi', name: 'Universal Basic Income', description: 'Unconditional payment to all citizens', category: 'economic' },
  { id: 'doughnut', name: 'Doughnut Economy', description: 'Balance social needs and planetary boundaries', category: 'sustainability' },
  { id: 'commons', name: 'Digital Commons', description: 'Shared resources managed by community', category: 'governance' },
  { id: 'circular', name: 'Circular Economy', description: 'Eliminate waste and continual resource use', category: 'environmental' },
  { id: 'timebank', name: 'Time Banking', description: 'Exchange time and skills, not money', category: 'social' },
  { id: 'participatory', name: 'Participatory Budgeting', description: 'Community decides on budget allocation', category: 'governance' },
];

export const ConceptBlocksPalette: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const filteredBlocks = CONCEPT_BLOCKS.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          block.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? block.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  const categories = Array.from(new Set(CONCEPT_BLOCKS.map(block => block.category)));

  // Helper function to get the correct translation key for categories
  const getCategoryTranslationKey = (category: string) => {
    const keySuffix = 'Category';
    return `${category}${keySuffix}`;
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">{t('conceptBlocksPalette')}</h3>
        <div className="relative w-1/3">
          <Input
            placeholder={t('searchConceptBlocks')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8"
          />
          <Search className="absolute left-2 top-1.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <div className="flex gap-2 mb-2">
        {categories.map(category => (
          <Badge 
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveCategory(activeCategory === category ? null : category)}
          >
            {t(getCategoryTranslationKey(category))}
          </Badge>
        ))}
      </div>
      
      <div className="flex overflow-x-auto gap-2 pb-1">
        {filteredBlocks.map(block => (
          <div 
            key={block.id} 
            className="flex flex-col items-center p-2 rounded-lg bg-white/10 dark:bg-white/5 border 
                      border-white/20 min-w-[120px] cursor-move hover:bg-white/20 
                      transition-all animate-pulse-subtle"
            draggable="true"
            title={block.description}
          >
            <div className="text-sm font-medium truncate w-full text-center">{block.name}</div>
            <Badge variant="outline" className="mt-1 text-xs">{t(getCategoryTranslationKey(block.category))}</Badge>
          </div>
        ))}
        
        <Button variant="ghost" className="flex-col h-auto min-w-[80px] border border-dashed border-muted-foreground/30">
          <PlusSquare className="h-5 w-5 mb-1" />
          <span className="text-xs">{t('customConcept')}</span>
        </Button>
      </div>
    </div>
  );
};
