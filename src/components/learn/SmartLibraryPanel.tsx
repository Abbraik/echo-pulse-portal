
import React, { useState } from 'react';
import { Search, Tag, Calendar, ArrowRight, Star } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export const SmartLibraryPanel: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data for the library
  const libraryItems = [
    { 
      id: 'l1', 
      title: 'Resource Allocation Optimization', 
      sourceEvent: 'Policy Delay Analysis', 
      usageCount: 24, 
      successRate: 78,
      tags: ['resource', 'policy', 'optimization']
    },
    { 
      id: 'l2', 
      title: 'Stakeholder Engagement Framework', 
      sourceEvent: 'Community Feedback Session', 
      usageCount: 18, 
      successRate: 92,
      tags: ['stakeholder', 'community', 'engagement']
    },
    { 
      id: 'l3', 
      title: 'Budget Constraint Management', 
      sourceEvent: 'Fiscal Review Meeting', 
      usageCount: 31, 
      successRate: 65,
      tags: ['budget', 'finance', 'management']
    },
    { 
      id: 'l4', 
      title: 'Technology Access Equity', 
      sourceEvent: 'Digital Divide Assessment', 
      usageCount: 15, 
      successRate: 88,
      tags: ['technology', 'equity', 'access']
    },
    { 
      id: 'l5', 
      title: 'Cross-Ministerial Collaboration', 
      sourceEvent: 'Governance Workshop', 
      usageCount: 22, 
      successRate: 79,
      tags: ['governance', 'collaboration', 'ministry']
    },
  ];
  
  // Available tags for filtering
  const availableTags = [
    'resource', 'policy', 'optimization', 'stakeholder', 'community', 
    'engagement', 'budget', 'finance', 'management', 'technology', 
    'equity', 'access', 'governance', 'collaboration', 'ministry'
  ];
  
  return (
    <GlassCard className="overflow-hidden h-full">
      <GlassCardHeader className="pb-4">
        <GlassCardTitle gradient>{t('smartLibrary')}</GlassCardTitle>
      </GlassCardHeader>
      
      <GlassCardContent>
        {/* Header with Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchLibraryPlaceholder')}
              className="pl-9 bg-white/5 border-white/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
                <div className="flex items-center gap-2">
                  <Tag size={14} />
                  <SelectValue placeholder={t('filterByTag')} />
                </div>
              </SelectTrigger>
              <SelectContent>
                {availableTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <SelectValue placeholder={t('dateRange')} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">{t('lastWeek')}</SelectItem>
                <SelectItem value="month">{t('lastMonth')}</SelectItem>
                <SelectItem value="quarter">{t('lastQuarter')}</SelectItem>
                <SelectItem value="year">{t('lastYear')}</SelectItem>
                <SelectItem value="custom">{t('custom')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Results List */}
        <div className="overflow-auto max-h-[calc(35vh-160px)]">
          <table className="w-full">
            <thead className="text-left text-xs border-b border-white/10">
              <tr>
                <th className="py-3 px-4">{t('title')}</th>
                <th className="py-3 px-4">{t('sourceEvent')}</th>
                <th className="py-3 px-4">{t('usageCount')}</th>
                <th className="py-3 px-4">{t('successRate')}</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {libraryItems.map((item) => (
                <tr 
                  key={item.id} 
                  className="group border-b border-white/5 hover:bg-white/5 transition-all duration-200 hover:shadow-md"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium">{item.title}</div>
                    <div className="flex gap-1 mt-1">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="bg-white/10 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{item.sourceEvent}</td>
                  <td className="py-3 px-4">{item.usageCount}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            item.successRate > 80 ? 'bg-emerald-500' : 
                            item.successRate > 60 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.successRate}%` }}
                        />
                      </div>
                      <span className="text-xs">{item.successRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <span>{t('trace')}</span>
                        <ArrowRight size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <span>{t('promote')}</span>
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
};
