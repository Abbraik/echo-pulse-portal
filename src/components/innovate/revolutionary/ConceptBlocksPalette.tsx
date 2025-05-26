
import React, { useState } from 'react';
import { Search, Lightbulb, Leaf, Users, Recycle, Building, BookOpen, Archive, Play } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

interface ConceptBlocksPaletteProps {
  mode: 'lesson-driven' | 'freeform' | 'moonshot';
}

export const ConceptBlocksPalette: React.FC<ConceptBlocksPaletteProps> = ({ mode }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const conceptBlocks = [
    {
      id: 'uba',
      name: t('universalBasicAccess'),
      description: t('universalBasicAccessDesc'),
      icon: <Building size={16} />,
      color: 'teal',
      category: 'social',
      type: 'Lesson'
    },
    {
      id: 'doughnut',
      name: t('doughnutEconomy'),
      description: t('doughnutEconomyDesc'),
      icon: <Leaf size={16} />,
      color: 'emerald',
      category: 'environmental',
      type: 'Freeform'
    },
    {
      id: 'commons',
      name: t('commonsGovernance'),
      description: t('commonsGovernanceDesc'),
      icon: <Users size={16} />,
      color: 'blue',
      category: 'governance',
      type: 'Lesson'
    },
    {
      id: 'circular',
      name: t('circularValueStreams'),
      description: t('circularValueStreamsDesc'),
      icon: <Recycle size={16} />,
      color: 'purple',
      category: 'economic',
      type: 'Freeform'
    }
  ];

  const filteredConcepts = conceptBlocks.filter(concept =>
    concept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getColorClasses = (color: string) => {
    const colorMap = {
      teal: 'bg-teal-500/20 border-teal-500/30 text-teal-300',
      emerald: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
      blue: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      purple: 'bg-purple-500/20 border-purple-500/30 text-purple-300'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.teal;
  };

  const getTypeColor = (type: string) => {
    return type === 'Lesson' ? 'bg-orange-500/20 text-orange-300' : 'bg-cyan-500/20 text-cyan-300';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="relative mb-4 px-3">
        <Search className="absolute left-5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('searchConceptBlocks')}
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content - Only concept blocks */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2">
          {filteredConcepts.map((concept, index) => (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border backdrop-blur-sm ${getColorClasses(concept.color)} 
                hover:scale-[1.02] transition-all duration-200 cursor-grab active:cursor-grabbing`}
              draggable
            >
              <div className="flex items-start gap-2 mb-2">
                <div className="p-1 rounded bg-white/20">
                  {concept.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{concept.name}</h4>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${getTypeColor(concept.type)}`}>
                  {concept.type}
                </span>
              </div>
              <p className="text-xs text-gray-300 line-clamp-2">{concept.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 capitalize">
                  {concept.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
