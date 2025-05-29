
import React, { useState } from 'react';
import { Search, Tag, Calendar, ArrowRight, Star, Maximize2, Minimize2, ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion } from 'framer-motion';

export const SmartLibraryPanel: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Sample data for the library
  const libraryItems = [
    { 
      id: 'l1', 
      title: 'Resource Allocation Optimization', 
      sourceEvent: 'Policy Delay Analysis', 
      usageCount: 24, 
      successRate: 78,
      tags: ['resource', 'policy', 'optimization'],
      summary: 'Advanced framework for optimizing resource distribution across multiple policy domains with real-time adjustment capabilities.'
    },
    { 
      id: 'l2', 
      title: 'Stakeholder Engagement Framework', 
      sourceEvent: 'Community Feedback Session', 
      usageCount: 18, 
      successRate: 92,
      tags: ['stakeholder', 'community', 'engagement'],
      summary: 'Comprehensive methodology for sustainable stakeholder engagement with proven community integration strategies.'
    },
    { 
      id: 'l3', 
      title: 'Budget Constraint Management', 
      sourceEvent: 'Fiscal Review Meeting', 
      usageCount: 31, 
      successRate: 65,
      tags: ['budget', 'finance', 'management'],
      summary: 'Dynamic budget allocation system with predictive constraint modeling and risk assessment capabilities.'
    },
    { 
      id: 'l4', 
      title: 'Technology Access Equity', 
      sourceEvent: 'Digital Divide Assessment', 
      usageCount: 15, 
      successRate: 88,
      tags: ['technology', 'equity', 'access'],
      summary: 'Equity-focused technology deployment framework ensuring inclusive access across diverse demographic segments.'
    },
    { 
      id: 'l5', 
      title: 'Cross-Ministerial Collaboration', 
      sourceEvent: 'Governance Workshop', 
      usageCount: 22, 
      successRate: 79,
      tags: ['governance', 'collaboration', 'ministry'],
      summary: 'Streamlined inter-ministerial coordination protocol with automated workflow management and accountability tracking.'
    },
  ];
  
  // Available tags for filtering
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
  
  return (
    <motion.div
      layout
      className={`transition-all duration-300 ease-in-out ${isExpanded ? 'fixed inset-0 z-50 p-4' : ''}`}
    >
      <div 
        className={`overflow-hidden h-full rounded-2xl border border-white/20 ${isExpanded ? 'h-full' : ''}`}
        style={{
          background: 'rgba(20, 30, 50, 0.6)',
          backdropFilter: 'blur(24px)',
          boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <Collapsible open={!isCollapsed}>
          <div className="p-6 pb-4 flex justify-between items-center border-b border-white/10">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 font-noto-bold"
                style={{ letterSpacing: '0.05em' }}>
              {t('smartLibrary')}
            </h2>
            <div className="flex gap-2">
              <CollapsibleTrigger asChild onClick={toggleCollapse}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="text-teal-400 hover:bg-teal-500/20">
                    {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                  </Button>
                </motion.div>
              </CollapsibleTrigger>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" onClick={toggleExpand} className="text-teal-400 hover:bg-teal-500/20">
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </Button>
              </motion.div>
            </div>
          </div>
          
          <CollapsibleContent>
            <div className={`p-6 ${isExpanded ? 'h-[calc(100vh-160px)]' : ''}`}>
              {/* Enhanced Search and Filters */}
              <motion.div 
                className="flex flex-wrap gap-4 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-400" />
                  <Input
                    placeholder={t('searchLibraryPlaceholder')}
                    className="pl-9 bg-white/5 border-white/20 text-gray-200 placeholder:text-gray-400 focus:border-teal-400/50 focus:ring-teal-400/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Select>
                    <SelectTrigger className="w-[150px] bg-white/5 border-white/20 text-gray-200 focus:border-teal-400/50">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-teal-400" />
                        <SelectValue placeholder={t('filterByTag')} />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/95 border-white/20 backdrop-blur-xl">
                      {availableTags.map(tag => (
                        <SelectItem key={tag} value={tag} className="text-gray-200 focus:bg-teal-500/20 focus:text-teal-300">
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger className="w-[150px] bg-white/5 border-white/20 text-gray-200 focus:border-teal-400/50">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-teal-400" />
                        <SelectValue placeholder={t('dateRange')} />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/95 border-white/20 backdrop-blur-xl">
                      <SelectItem value="week" className="text-gray-200 focus:bg-teal-500/20 focus:text-teal-300">{t('lastWeek')}</SelectItem>
                      <SelectItem value="month" className="text-gray-200 focus:bg-teal-500/20 focus:text-teal-300">{t('lastMonth')}</SelectItem>
                      <SelectItem value="quarter" className="text-gray-200 focus:bg-teal-500/20 focus:text-teal-300">{t('lastQuarter')}</SelectItem>
                      <SelectItem value="year" className="text-gray-200 focus:bg-teal-500/20 focus:text-teal-300">{t('lastYear')}</SelectItem>
                      <SelectItem value="custom" className="text-gray-200 focus:bg-teal-500/20 focus:text-teal-300">{t('custom')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
              
              {/* Enhanced Results List with Card Hover Effects */}
              <div className={`overflow-auto ${isExpanded ? 'max-h-[calc(100vh-240px)]' : 'max-h-[calc(35vh-160px)]'}`}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <table className="w-full">
                    <thead className="text-left text-sm border-b border-white/20">
                      <tr>
                        <th className="py-4 px-4 text-teal-300 font-noto-medium">{t('title')}</th>
                        <th className="py-4 px-4 text-teal-300 font-noto-medium">{t('sourceEvent')}</th>
                        <th className="py-4 px-4 text-teal-300 font-noto-medium">{t('usageCount')}</th>
                        <th className="py-4 px-4 text-teal-300 font-noto-medium">{t('successRate')}</th>
                        <th className="py-4 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {libraryItems.map((item, index) => (
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
                          transition={{ delay: 0.3 + index * 0.1 }}
                          whileHover={{ 
                            y: -4,
                            boxShadow: '0 8px 25px rgba(20, 184, 166, 0.3)',
                            transition: { duration: 0.2 }
                          }}
                        >
                          <td className="py-4 px-4">
                            <motion.div
                              animate={hoveredItem === item.id ? { scale: 1.02 } : { scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="font-medium text-gray-200 font-noto-medium">{item.title}</div>
                              <div className="flex gap-1 mt-2">
                                {item.tags.map(tag => (
                                  <Badge key={tag} variant="outline" 
                                    className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              {hoveredItem === item.id && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-2 text-xs text-gray-400 font-noto-regular"
                                >
                                  {item.summary}
                                </motion.div>
                              )}
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
                                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                />
                              </div>
                              <span className="text-xs text-gray-300">{item.successRate}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <motion.div 
                              className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              initial={{ x: 20 }}
                              animate={{ x: hoveredItem === item.id ? 0 : 20 }}
                            >
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="ghost" size="sm" className="h-8 gap-1 text-teal-400 hover:bg-teal-500/20">
                                  <span className="font-noto-regular">{t('trace')}</span>
                                  <ArrowRight size={14} />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="ghost" size="sm" className="h-8 gap-1 text-blue-400 hover:bg-blue-500/20">
                                  <span className="font-noto-regular">{t('promote')}</span>
                                  <ArrowRight size={14} />
                                </Button>
                              </motion.div>
                            </motion.div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </motion.div>
  );
};
