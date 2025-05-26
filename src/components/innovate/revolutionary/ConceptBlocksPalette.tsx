
import React, { useState } from 'react';
import { Search, Lightbulb, Leaf, Users, Recycle, Building, BookOpen, Archive, Play } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

export const ConceptBlocksPalette: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'concepts' | 'lessons' | 'scenarios'>('concepts');

  const conceptBlocks = [
    {
      id: 'uba',
      name: t('universalBasicAccess'),
      description: t('universalBasicAccessDesc'),
      icon: <Building size={16} />,
      color: 'teal',
      category: 'social'
    },
    {
      id: 'doughnut',
      name: t('doughnutEconomy'),
      description: t('doughnutEconomyDesc'),
      icon: <Leaf size={16} />,
      color: 'emerald',
      category: 'environmental'
    },
    {
      id: 'commons',
      name: t('commonsGovernance'),
      description: t('commonsGovernanceDesc'),
      icon: <Users size={16} />,
      color: 'blue',
      category: 'governance'
    },
    {
      id: 'circular',
      name: t('circularValueStreams'),
      description: t('circularValueStreamsDesc'),
      icon: <Recycle size={16} />,
      color: 'purple',
      category: 'economic'
    }
  ];

  const lessonCards = [
    {
      id: 'youth-trust',
      title: t('youthSocialTrustCampaign'),
      date: 'Mar 2025',
      success: 4,
      tag: t('socialCategory'),
      color: 'teal'
    },
    {
      id: 'water-conservation',
      title: t('waterConservationIncentives'),
      date: 'Jan 2025',
      success: 3,
      tag: t('environmentalCategory'),
      color: 'blue'
    }
  ];

  const scenarioTree = {
    baseline: {
      name: 'Baseline',
      children: [
        {
          id: 'social-trust-revamp',
          name: t('socialTrustRevamp'),
          delta: '+3',
          type: 'fork'
        },
        {
          id: 'water-tax-adjust',
          name: t('waterTaxAdjust'),
          delta: '+2',
          type: 'fork'
        }
      ]
    },
    moonshot: {
      name: 'Moonshot',
      children: [
        {
          id: 'uba-model',
          name: t('ubaModelV1'),
          type: 'moonshot'
        },
        {
          id: 'doughnut-test',
          name: t('doughnutTestV2'),
          type: 'moonshot'
        }
      ]
    }
  };

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

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < count ? 'text-amber-400' : 'text-gray-600'}>★</span>
    ));
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

      {/* Tabs */}
      <div className="flex mb-4 px-3">
        <div className="bg-white/5 rounded-lg p-1 flex w-full">
          {(['concepts', 'lessons', 'scenarios'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white/20 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t(tab)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-3">
        {activeTab === 'concepts' && (
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
        )}

        {activeTab === 'lessons' && (
          <div className="space-y-3">
            {lessonCards.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-3 rounded-lg hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <BookOpen size={16} className="text-blue-400" />
                  <span className="text-xs text-gray-400">{lesson.date}</span>
                </div>
                <h4 className="text-sm font-medium mb-2 line-clamp-2">{lesson.title}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {renderStars(lesson.success)}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded bg-${lesson.color}-500/20 text-${lesson.color}-300`}>
                    {lesson.tag}
                  </span>
                </div>
                <div className="flex gap-1 mt-3">
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                    <Play size={12} className="mr-1" />
                    {t('launchBtn')}
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 px-2">
                    <Archive size={12} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="space-y-4">
            {/* Baseline Tree */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-300">
                {scenarioTree.baseline.name}
              </h4>
              <div className="space-y-2 ml-4">
                {scenarioTree.baseline.children.map((scenario, index) => (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel p-2 rounded-lg text-sm group hover:scale-[1.02] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{scenario.name}</span>
                      {scenario.delta && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300">
                          Δ DEI {scenario.delta}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                        🚀
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                        🗄️
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Moonshot Tree */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-300">
                {scenarioTree.moonshot.name}
              </h4>
              <div className="space-y-2 ml-4">
                {scenarioTree.moonshot.children.map((scenario, index) => (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 2) * 0.1 }}
                    className="glass-panel p-2 rounded-lg text-sm group hover:scale-[1.02] transition-all border-purple-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{scenario.name}</span>
                      <Lightbulb size={12} className="text-purple-400" />
                    </div>
                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                        🚀
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                        🗄️
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* New Experiment Button */}
            <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Play size={16} className="mr-2" />
              + {t('newExperiment')}
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
