
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, PlusSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  { id: 'platform', name: 'Platform Cooperatives', description: 'User-owned digital platforms', category: 'economic' },
  { id: 'commons2', name: 'Knowledge Commons', description: 'Shared intellectual resources', category: 'social' },
];

export const ConceptBlocksPalette: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>('economic');
  
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
    <div className="flex flex-col h-full p-3">
      {/* Search and filters section */}
      <div className="flex flex-col gap-2 sticky top-0 z-10 mb-3">
        <div className="relative w-full">
          <Input
            placeholder={t('searchConceptBlocks')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 bg-black/20 border-white/10"
          />
          <Search className="absolute left-2 top-1.5 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex gap-1.5 flex-wrap">
          {categories.map(category => (
            <Badge 
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`cursor-pointer text-xs ${activeCategory === category ? 'bg-teal-500/30 hover:bg-teal-500/40 text-white' : 'text-muted-foreground'}`}
              onClick={() => setActiveCategory(activeCategory === category ? null : category)}
            >
              {t(getCategoryTranslationKey(category))}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Concept blocks list - vertical list for sidebar */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 pr-3">
          {filteredBlocks.map((block, index) => (
            <motion.div 
              key={block.id} 
              className="flex flex-col items-center p-2 rounded-lg bg-white/10 dark:bg-white/5 border 
                        border-white/20 cursor-move hover:bg-white/20 
                        transition-all hover:scale-[1.03] group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              draggable="true"
              title={block.description}
            >
              <div className="text-sm font-medium truncate w-full text-center">{block.name}</div>
              <Badge variant="outline" className="mt-1 text-xs">{t(getCategoryTranslationKey(block.category))}</Badge>
              <motion.div 
                className="absolute inset-0 rounded-lg bg-teal-500/0 group-hover:bg-teal-500/5 transition-all"
                whileHover={{ 
                  boxShadow: "0 0 15px rgba(20,184,166,0.3)",
                  scale: 1.03
                }}
              ></motion.div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Add New Concept button at bottom */}
      <Button className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-md">
        <PlusSquare size={16} />
        {t('createNewConcept')}
      </Button>
    </div>
  );
};
