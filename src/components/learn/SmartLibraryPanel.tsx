
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card';
import { Search, Archive, BookOpen, Filter, Calendar, RefreshCw, Star, TrendingUp, Users, Eye, MessageSquare, ThumbsUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

export const SmartLibraryPanel: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('recent');
  const [selectedTag, setSelectedTag] = useState('all');
  
  // Sample library data with cinematic styling
  const libraryData = {
    archive: [
      {
        id: 'lesson-1',
        title: 'Digital Education Equity Framework',
        type: 'lesson',
        date: '2024-01-15',
        views: 347,
        rating: 4.8,
        tags: ['digital-equity', 'education', 'framework'],
        description: 'Comprehensive framework for ensuring digital access across all educational institutions.',
        author: 'Dr. Sarah Chen',
        comments: 23,
        promoted: true
      },
      {
        id: 'playbook-1',
        title: 'Community Engagement Best Practices',
        type: 'playbook',
        date: '2024-01-10',
        views: 245,
        rating: 4.6,
        tags: ['community', 'engagement', 'stakeholders'],
        description: 'Step-by-step guide for effective community stakeholder engagement.',
        author: 'Policy Team',
        comments: 18,
        promoted: false
      },
      {
        id: 'insight-1',
        title: 'Budget Allocation Impact Analysis',
        type: 'insight',
        date: '2024-01-08',
        views: 156,
        rating: 4.4,
        tags: ['budget', 'analysis', 'impact'],
        description: 'Data-driven insights on budget allocation effectiveness across departments.',
        author: 'Analytics Unit',
        comments: 12,
        promoted: false
      }
    ],
    popularTags: [
      { name: 'digital-equity', count: 24, trending: true },
      { name: 'community', count: 18, trending: false },
      { name: 'budget', count: 15, trending: true },
      { name: 'education', count: 21, trending: false },
      { name: 'stakeholders', count: 12, trending: true },
      { name: 'framework', count: 9, trending: false }
    ],
    reuseIndex: {
      total: 156,
      thisMonth: 23,
      trending: '+12%'
    }
  };

  const filterOptions = [
    { value: 'all', label: t('allTypes') },
    { value: 'lesson', label: t('lessons') },
    { value: 'playbook', label: t('playbooks') },
    { value: 'insight', label: t('insights') }
  ];

  const sortOptions = [
    { value: 'recent', label: t('mostRecent') },
    { value: 'popular', label: t('mostPopular') },
    { value: 'rating', label: t('highestRated') },
    { value: 'trending', label: t('trending') }
  ];

  const tagOptions = [
    { value: 'all', label: t('allTags') },
    ...libraryData.popularTags.map(tag => ({ 
      value: tag.name, 
      label: tag.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
    }))
  ];

  const filteredArchive = libraryData.archive.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    const matchesTag = selectedTag === 'all' || item.tags.includes(selectedTag);
    
    return matchesSearch && matchesFilter && matchesTag;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen size={16} className="text-purple-400" />;
      case 'playbook': return <Archive size={16} className="text-blue-400" />;
      case 'insight': return <TrendingUp size={16} className="text-emerald-400" />;
      default: return <BookOpen size={16} className="text-gray-400" />;
    }
  };

  return (
    <GlassCard className="overflow-hidden">
      <GlassCardHeader className="pb-4">
        <GlassCardTitle gradient>{t('smartLibraryPanel')}</GlassCardTitle>
      </GlassCardHeader>
      
      <GlassCardContent>
        <Tabs defaultValue="archive" className="w-full">
          {/* Enhanced Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 mb-6 p-1 bg-white/5 rounded-xl">
            <TabsTrigger 
              value="archive" 
              className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300 transition-all duration-300"
            >
              <Archive size={16} className="mr-2" />
              {t('archiveTab')}
            </TabsTrigger>
            <TabsTrigger 
              value="reuse" 
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 transition-all duration-300"
            >
              <RefreshCw size={16} className="mr-2" />
              {t('reuseIndexTab')}
            </TabsTrigger>
            <TabsTrigger 
              value="tags" 
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 transition-all duration-300"
            >
              <Star size={16} className="mr-2" />
              {t('tagExplorerTab')}
            </TabsTrigger>
          </TabsList>

          {/* Archive Tab Content */}
          <TabsContent value="archive" className="space-y-4">
            {/* Enhanced Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('searchLibrary')}
                  className="pl-9 bg-white/5 border-white/10 focus:border-teal-400/50 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-32 bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/10">
                    {filterOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedSort} onValueChange={setSelectedSort}>
                  <SelectTrigger className="w-32 bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/10">
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-32 bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/10">
                    {tagOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Enhanced Archive Grid */}
            <div className="grid gap-4">
              <AnimatePresence>
                {filteredArchive.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-teal-400/30 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(item.type)}
                        <div>
                          <h4 className="font-semibold text-white group-hover:text-teal-300 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-400">{t('by')} {item.author}</p>
                        </div>
                      </div>
                      {item.promoted && (
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                          <Star size={12} className="mr-1" />
                          {t('promoted')}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs bg-white/5 border-white/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {item.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={12} />
                          {item.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp size={12} />
                          {item.rating}
                        </span>
                      </div>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Reuse Index Tab Content */}
          <TabsContent value="reuse" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                className="p-6 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-xl border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-300 mb-2">
                    {libraryData.reuseIndex.total}
                  </div>
                  <div className="text-sm text-gray-300">{t('totalReuses')}</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-300 mb-2">
                    {libraryData.reuseIndex.thisMonth}
                  </div>
                  <div className="text-sm text-gray-300">{t('thisMonth')}</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300 mb-2">
                    {libraryData.reuseIndex.trending}
                  </div>
                  <div className="text-sm text-gray-300">{t('trendingGrowth')}</div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Tag Explorer Tab Content */}
          <TabsContent value="tags" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {libraryData.popularTags.map((tag, index) => (
                <motion.div
                  key={tag.name}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white group-hover:text-teal-300 transition-colors">
                      {tag.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {tag.trending && (
                      <TrendingUp size={14} className="text-emerald-400" />
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {tag.count} {t('items')}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </GlassCardContent>
    </GlassCard>
  );
};
