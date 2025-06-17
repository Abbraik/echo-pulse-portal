import React, { useState } from 'react';
import { ChevronDown, FileText, Search, ArrowRight, FilePlus } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
interface PlaybooksLibraryProps {
  expanded: boolean;
  onToggleExpanded: () => void;
}
interface Playbook {
  id: string;
  name: string;
  description: string;
  tags: string[];
}
const PlaybooksLibrary: React.FC<PlaybooksLibraryProps> = ({
  expanded,
  onToggleExpanded
}) => {
  const {
    t
  } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for playbooks
  const playbooks: Playbook[] = [{
    id: 'p1',
    name: 'Resource Optimization',
    description: 'Framework for optimizing resource allocation across sectors',
    tags: ['Resource', 'Optimization', 'Economic']
  }, {
    id: 'p2',
    name: 'Sustainability Pathway',
    description: 'Strategy template for improving sustainability metrics',
    tags: ['Sustainability', 'Environment', 'Long-term']
  }, {
    id: 'p3',
    name: 'Cohesion Builder',
    description: 'Methods for improving policy coherence and alignment',
    tags: ['Cohesion', 'Alignment', 'Governance']
  }, {
    id: 'p4',
    name: 'Economic Resilience',
    description: 'Templates for improving economic resilience and adaptability',
    tags: ['Economic', 'Resilience', 'Development']
  }];

  // Filter playbooks based on search query
  const filteredPlaybooks = playbooks.filter(playbook => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return playbook.name.toLowerCase().includes(query) || playbook.description.toLowerCase().includes(query) || playbook.tags.some(tag => tag.toLowerCase().includes(query));
  });
  return <div>
      
      
      <AnimatePresence>
        {expanded && <motion.div initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: 'auto',
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} transition={{
        duration: 0.3
      }} className="overflow-hidden">
            <GlassCard className="rounded-t-none border-t-0">
              <div className="p-4">
                <div className="flex items-center bg-white/5 border border-white/20 rounded-lg px-3 py-2 mb-4">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <input type="text" className="bg-transparent flex-1 focus:outline-none" placeholder={t('searchPlaybooks', {
                defaultValue: 'Search playbooks...'
              }) as string} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {filteredPlaybooks.map(playbook => <motion.div key={playbook.id} className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer" whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} drag dragConstraints={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }} dragElastic={0.1} dragTransition={{
                bounceStiffness: 300,
                bounceDamping: 20
              }}>
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-teal-400 mr-2 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium mb-1">{playbook.name}</h3>
                          <p className="text-sm text-gray-400 mb-2">{playbook.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {playbook.tags.map(tag => <span key={`${playbook.id}-${tag}`} className="bg-white/10 text-xs px-2 py-0.5 rounded-full">
                                {tag}
                              </span>)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button variant="ghost" size="sm" className="text-xs px-2">
                          {t('use', {
                      defaultValue: 'Use'
                    })}
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>)}
                  
                  {/* Add new playbook tile */}
                  <motion.div className="bg-white/5 border border-dashed border-white/20 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer" whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }}>
                    <FilePlus className="h-8 w-8 text-gray-400 mb-2" />
                    <span>{t('addNewPlaybook', {
                    defaultValue: 'Add New Playbook'
                  })}</span>
                  </motion.div>
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-400">
                  {t('dragPlaybookHint', {
                defaultValue: 'Drag a playbook to the Bundles Rail to create a new bundle'
              })}
                </div>
              </div>
            </GlassCard>
          </motion.div>}
      </AnimatePresence>
    </div>;
};
export default PlaybooksLibrary;