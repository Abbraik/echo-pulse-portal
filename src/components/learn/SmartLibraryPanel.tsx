import React, { useState } from 'react';
import { Search, Tag, Calendar, ArrowRight, Star, Maximize2, Minimize2, ChevronUp, ChevronDown, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';

export const SmartLibraryPanel: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'archive' | 'reuse' | 'tags'>('archive');
  
  // Sample data for the library with enhanced metadata
  const libraryItems = [
    { 
      id: 'l1', 
      title: 'Resource Allocation Optimization', 
      sourceEvent: 'Policy Delay Analysis', 
      usageCount: 24, 
      successRate: 78,
      tags: ['resource', 'policy', 'optimization'],
      summary: 'Advanced framework for optimizing resource distribution across multiple policy domains with real-time adjustment capabilities.',
      category: 'archive',
      lastUsed: '2024-05-28',
      trending: true
    },
    { 
      id: 'l2', 
      title: 'Stakeholder Engagement Framework', 
      sourceEvent: 'Community Feedback Session', 
      usageCount: 18, 
      successRate: 92,
      tags: ['stakeholder', 'community', 'engagement'],
      summary: 'Comprehensive methodology for sustainable stakeholder engagement with proven community integration strategies.',
      category: 'reuse',
      lastUsed: '2024-05-29',
      trending: false
    },
    { 
      id: 'l3', 
      title: 'Budget Constraint Management', 
      sourceEvent: 'Fiscal Review Meeting', 
      usageCount: 31, 
      successRate: 65,
      tags: ['budget', 'finance', 'management'],
      summary: 'Dynamic budget allocation system with predictive constraint modeling and risk assessment capabilities.',
      category: 'archive',
      lastUsed: '2024-05-27',
      trending: true
    },
    { 
      id: 'l4', 
      title: 'Technology Access Equity', 
      sourceEvent: 'Digital Divide Assessment', 
      usageCount: 15, 
      successRate: 88,
      tags: ['technology', 'equity', 'access'],
      summary: 'Equity-focused technology deployment framework ensuring inclusive access across diverse demographic segments.',
      category: 'reuse',
      lastUsed: '2024-05-30',
      trending: false
    },
    { 
      id: 'l5', 
      title: 'Cross-Ministerial Collaboration', 
      sourceEvent: 'Governance Workshop', 
      usageCount: 22, 
      successRate: 79,
      tags: ['governance', 'collaboration', 'ministry'],
      summary: 'Streamlined inter-ministerial coordination protocol with automated workflow management and accountability tracking.',
      category: 'archive',
      lastUsed: '2024-05-26',
      trending: false
    },
  ];
  
  // Available tags for filtering with enhanced styling
  const availableTags = [
    'resource', 'policy', 'optimization', 'stakeholder', 'community', 
    'engagement', 'budget', 'finance', 'management', 'technology', 
    'equity', 'access', 'governance', 'collaboration', 'ministry'
  ];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || item.tags.includes(selectedTag);
    const matchesTab = activeTab === 'tags' || item.category === activeTab;
    return matchesSearch && matchesTag && matchesTab;
  });

  const tabVariants = {
    inactive: { opacity: 0.6, scale: 0.95 },
    active: { opacity: 1, scale: 1 }
  };
  
  return (
    <motion.div
      layout
      className={`transition-all duration-500 ease-in-out ${isExpanded ? 'fixed inset-4 z-50' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div 
        className={`overflow-hidden h-full rounded-2xl border border-white/20 relative ${isExpanded ? 'h-full' : ''}`}
        style={{
          background: 'rgba(20, 30, 50, 0.6)',
          backdropFilter: 'blur(24px)',
          boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(37, 99, 235, 0.1))',
            backgroundSize: '400% 400%'
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <Collapsible open={!isCollapsed}>
          <div className="p-6 pb-4 flex justify-between items-center border-b border-white/10 relative z-10">
            <motion.h2 
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 font-noto-bold"
              style={{ letterSpacing: '0.05em' }}
              whileHover={{ scale: 1.02 }}
            >
              {t('smartLibrary')}
            </motion.h2>
            <div className="flex gap-2">
              <CollapsibleTrigger asChild onClick={toggleCollapse}>
                <motion.div 
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(20, 184, 166, 0.2)' }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="icon" className="text-teal-400 hover:bg-teal-500/20 transition-all duration-200">
                    <motion.div
                      animate={{ rotate: isCollapsed ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </motion.div>
                  </Button>
                </motion.div>
              </CollapsibleTrigger>
              <motion.div 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(20, 184, 166, 0.2)' }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon" onClick={toggleExpand} className="text-teal-400 hover:bg-teal-500/20 transition-all duration-200">
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </div>
          
          <CollapsibleContent>
            <motion.div 
              className={`p-6 ${isExpanded ? 'h-[calc(100vh-160px)]' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Enhanced Tab Navigation */}
              <motion.div 
                className="flex gap-1 mb-6 p-1 rounded-xl bg-white/5 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {[
                  { key: 'archive', label: 'Archive', icon: '📚' },
                  { key: 'reuse', label: 'Reuse Index', icon: '♻️' },
                  { key: 'tags', label: 'Tag Explorer', icon: '🏷️' }
                ].map((tab) => (
                  <motion.button
                    key={tab.key}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                      activeTab === tab.key 
                        ? 'text-teal-300 bg-teal-500/20' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`}
                    onClick={() => setActiveTab(tab.key as any)}
                    variants={tabVariants}
                    animate={activeTab === tab.key ? 'active' : 'inactive'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {activeTab === tab.key && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-lg"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <span>{tab.icon}</span>
                      {tab.label}
                      {activeTab === tab.key && (
                        <motion.div
                          className="w-1 h-1 bg-teal-400 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        />
                      )}
                    </span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Enhanced Search and Filters */}
              <motion.div 
                className="flex flex-wrap gap-4 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative flex-1 min-w-[200px]">
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="relative"
                  >
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-400" />
                    <Input
                      placeholder={t('searchLibraryPlaceholder') || 'Search knowledge library...'}
                      className="pl-9 bg-white/5 border-white/20 text-gray-200 placeholder:text-gray-400 focus:border-teal-400/50 focus:ring-teal-400/20 transition-all duration-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    {/* Search input glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-md pointer-events-none"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.1), transparent)',
                        backgroundSize: '200% 100%'
                      }}
                      animate={{
                        backgroundPosition: searchQuery ? ['0% 0%', '200% 0%'] : '0% 0%'
                      }}
                      transition={{ duration: 1.5, repeat: searchQuery ? Infinity : 0 }}
                    />
                  </motion.div>
                </div>
                
                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger className="w-[150px] bg-white/5 border-white/20 text-gray-200 focus:border-teal-400/50">
                        <div className="flex items-center gap-2">
                          <Tag size={14} className="text-teal-400" />
                          <SelectValue placeholder={t('filterByTag') || 'Filter by tag'} />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900/95 border-white/20 backdrop-blur-xl z-50">
                        <SelectItem value="all" className="text-gray-200 focus:bg-teal-500/20 focus:text-teal-300">
                          All tags
                        </SelectItem>
                        {availableTags.map(tag => (
                          <SelectItem key={tag} value={tag} className="text-gray-200 focus:bg-teal-500/20 focus:text-teal-300">
                            #{tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Select>
                      <SelectTrigger className="w-[150px] bg-white/5 border-white/20 text-gray-200 focus:border-teal-400/50">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-teal-400" />
                          <SelectValue placeholder={t('dateRange') || 'Date range'} />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900/95 border-white/20 backdrop-blur-xl z-50">
                        <SelectItem value="week" className="text-gray-200 focus:bg-teal-500/20 focus:text-teal-300">Last Week</SelectItem>
                        <SelectItem value="month" className="text-gray-200 focus:bg-teal-500/20 focus:text-teal-300">Last Month</SelectItem>
                        <SelectItem value="quarter" className="text-gray-200 focus:bg-teal-500/20 focus:text-teal-300">Last Quarter</SelectItem>
                        <SelectItem value="year" className="text-gray-200 focus:bg-teal-500/20 focus:text-teal-300">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Enhanced Results List with Premium Card Effects */}
              <div className={`overflow-auto ${isExpanded ? 'max-h-[calc(100vh-280px)]' : 'max-h-[calc(35vh-160px)]'}`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'tags' ? (
                      // Tag Explorer Cloud
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {availableTags.map((tag, index) => (
                          <motion.div
                            key={tag}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                              selectedTag === tag 
                                ? 'border-teal-400/50 bg-teal-500/20' 
                                : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                            }`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ 
                              scale: 1.05,
                              boxShadow: '0 8px 25px rgba(20, 184, 166, 0.2)'
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                          >
                            <div className="text-center">
                              <div className="text-lg mb-1">🏷️</div>
                              <div className="text-sm font-medium text-gray-200">#{tag}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                {libraryItems.filter(item => item.tags.includes(tag)).length} items
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      // Archive & Reuse Index Table
                      <table className="w-full">
                        <thead className="text-left text-sm border-b border-white/20">
                          <tr>
                            <th className="py-4 px-4 text-teal-300 font-noto-medium">Title</th>
                            <th className="py-4 px-4 text-teal-300 font-noto-medium">Source Event</th>
                            <th className="py-4 px-4 text-teal-300 font-noto-medium">Usage</th>
                            <th className="py-4 px-4 text-teal-300 font-noto-medium">Success Rate</th>
                            <th className="py-4 px-4"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <AnimatePresence>
                            {filteredItems.map((item, index) => (
                              <motion.tr 
                                key={item.id} 
                                className="group border-b border-white/5 transition-all duration-300 relative overflow-hidden rounded-lg"
                                style={{
                                  background: hoveredItem === item.id ? 'rgba(20, 184, 166, 0.1)' : 'transparent'
                                }}
                                onMouseEnter={() => setHoveredItem(item.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ 
                                  y: -2,
                                  boxShadow: '0 8px 25px rgba(20, 184, 166, 0.2)',
                                  transition: { duration: 0.2 }
                                }}
                                layout
                              >
                                <td className="py-4 px-4">
                                  <motion.div
                                    animate={hoveredItem === item.id ? { scale: 1.01 } : { scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="font-medium text-gray-200 font-noto-medium">{item.title}</div>
                                      {item.trending && (
                                        <motion.div
                                          animate={{ scale: [1, 1.1, 1] }}
                                          transition={{ duration: 1, repeat: Infinity }}
                                        >
                                          <TrendingUp size={14} className="text-emerald-400" />
                                        </motion.div>
                                      )}
                                    </div>
                                    <div className="flex gap-1 mt-2">
                                      {item.tags.map(tag => (
                                        <motion.div
                                          key={tag}
                                          whileHover={{ scale: 1.05 }}
                                        >
                                          <Badge variant="outline" 
                                            className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs cursor-pointer"
                                            onClick={() => setSelectedTag(tag)}
                                          >
                                            #{tag}
                                          </Badge>
                                        </motion.div>
                                      ))}
                                    </div>
                                    <AnimatePresence>
                                      {hoveredItem === item.id && (
                                        <motion.div 
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="mt-2 text-xs text-gray-400 font-noto-regular"
                                        >
                                          {item.summary}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </motion.div>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-300 font-noto-regular">{item.sourceEvent}</td>
                                <td className="py-4 px-4 text-gray-200">{item.usageCount}</td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                                      <motion.div 
                                        className={`h-full rounded-full ${
                                          item.successRate > 80 ? 'bg-emerald-500' : 
                                          item.successRate > 60 ? 'bg-amber-500' : 'bg-rose-500'
                                        }`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.successRate}%` }}
                                        transition={{ delay: 0.3 + index * 0.05, duration: 0.8 }}
                                      />
                                    </div>
                                    <span className="text-xs text-gray-300">{item.successRate}%</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <AnimatePresence>
                                    {hoveredItem === item.id && (
                                      <motion.div 
                                        className="flex gap-2 items-center"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                          <Button variant="ghost" size="sm" className="h-8 gap-1 text-teal-400 hover:bg-teal-500/20">
                                            <span className="font-noto-regular">Trace</span>
                                            <ArrowRight size={14} />
                                          </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                          <Button variant="ghost" size="sm" className="h-8 gap-1 text-blue-400 hover:bg-blue-500/20">
                                            <span className="font-noto-regular">Promote</span>
                                            <ArrowRight size={14} />
                                          </Button>
                                        </motion.div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </motion.div>
  );
};
