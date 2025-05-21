
import React from 'react';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const PatternIntelligenceLayer: React.FC = () => {
  const { t } = useTranslation();
  
  // Sample data for demonstration
  const archiveData = [
    { driftType: 'Policy Delay', bundle: 'Resource Allocation Bundle', deiThreshold: '12%', date: '2025-03-10' },
    { driftType: 'Stakeholder Resistance', bundle: 'Community Engagement Bundle', deiThreshold: '8%', date: '2025-02-25' },
    { driftType: 'Budget Constraint', bundle: 'Budget Reallocation Bundle', deiThreshold: '15%', date: '2025-01-15' },
    { driftType: 'Technical Barrier', bundle: 'Technology Access Bundle', deiThreshold: '10%', date: '2025-03-05' },
  ];
  
  const reuseData = [
    { bundle: 'Resource Allocation Bundle', frequency: 12, successRate: 78 },
    { bundle: 'Community Engagement Bundle', frequency: 8, successRate: 84 },
    { bundle: 'Budget Reallocation Bundle', frequency: 15, successRate: 62 },
    { bundle: 'Technology Access Bundle', frequency: 7, successRate: 90 },
    { bundle: 'Education Integration Bundle', frequency: 11, successRate: 75 },
  ];
  
  const delayData = [
    { ministry: 'Education', delay: 8, notes: 'Budget approval delay' },
    { ministry: 'Health', delay: 4, notes: 'Stakeholder consultation' },
    { ministry: 'Finance', delay: 12, notes: 'Policy review process' },
    { ministry: 'Technology', delay: 6, notes: 'Implementation complexity' },
  ];
  
  const tags = [
    { name: 'budget', size: 'text-lg', count: 28 },
    { name: 'policy', size: 'text-2xl', count: 42 },
    { name: 'education', size: 'text-xl', count: 35 },
    { name: 'technology', size: 'text-lg', count: 24 },
    { name: 'health', size: 'text-base', count: 19 },
    { name: 'equity', size: 'text-xl', count: 31 },
    { name: 'inclusion', size: 'text-2xl', count: 40 },
    { name: 'governance', size: 'text-base', count: 22 },
  ];
  
  return (
    <GlassCard className="p-6 h-[30vh] overflow-y-auto">
      <GlassCardHeader className="pb-4">
        <GlassCardTitle gradient>{t('memoryPatternIntelligence')}</GlassCardTitle>
      </GlassCardHeader>
      
      <GlassCardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pattern Sheet */}
          <div className="glass-panel p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">{t('patternSheet')}</h3>
            
            <div className="flex items-center mb-3 space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="flex-1 bg-white/5 border border-white/10 pl-9" 
                  placeholder={t('searchPatterns')}
                />
              </div>
              
              <Select>
                <SelectTrigger className="w-[180px] bg-white/5 border border-white/10">
                  <SelectValue placeholder={t('filterByDrift')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="policy">Policy Drift</SelectItem>
                  <SelectItem value="budget">Budget Drift</SelectItem>
                  <SelectItem value="stakeholder">Stakeholder Drift</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left py-2">{t('driftType')}</th>
                    <th className="text-left py-2">{t('bundle')}</th>
                    <th className="text-left py-2">{t('deiThreshold')}</th>
                  </tr>
                </thead>
                <tbody>
                  {archiveData.map((item, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2">{item.driftType}</td>
                      <td className="py-2">{item.bundle}</td>
                      <td className="py-2">{item.deiThreshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Reuse Index */}
          <div className="glass-panel p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">{t('reuseIndex')}</h3>
            
            <div className="h-32 w-full mb-4">
              <div className="flex h-full items-end space-x-2">
                {reuseData.map((item, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-blue-500/50 rounded-t"
                      style={{ height: `${item.frequency * 4}px` }} 
                    ></div>
                    <div className="text-xs mt-1 truncate w-full text-center">
                      {item.bundle.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <h4 className="text-sm font-medium mb-2">{t('topReusedBundles')}</h4>
            <div className="space-y-2">
              {reuseData.slice(0, 5).map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <span className="text-sm">{item.bundle}</span>
                    <div className="flex items-center">
                      <div className="h-1.5 bg-gradient-to-r from-amber-500 to-green-500 rounded-full w-24 mt-1">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${item.successRate}%` }} 
                        />
                      </div>
                      <span className="text-xs ml-2">{item.successRate}%</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    {t('viewDetails')} <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Delay Log */}
          <div className="glass-panel p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">{t('delayLog')}</h3>
            
            <div className="space-y-3">
              {delayData.map((item, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-24 text-sm font-medium">{item.ministry}</div>
                  <div className="flex-1 mx-2">
                    <div className="h-2 bg-white/10 rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          item.delay > 10 ? 'bg-rose-500' : 
                          item.delay > 6 ? 'bg-amber-500' : 'bg-teal-500'
                        }`}
                        style={{ width: `${Math.min(item.delay * 8, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-6 text-sm font-mono">{item.delay}d</div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">{t('interMinisterialLatency')}</h4>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="aspect-square rounded"
                    style={{ 
                      backgroundColor: `rgba(45, 212, 191, ${Math.random() * 0.7 + 0.1})`,
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Tagging Layer */}
          <div className="glass-panel p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">{t('taggingLayer')}</h3>
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.name}
                  className={`${tag.size} px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">{t('popularCategories')}</h4>
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-white/10 rounded-full">
                  <div className="h-full w-3/4 bg-blue-500 rounded-full" />
                </div>
                <span className="text-xs">Policy</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex-1 h-2 bg-white/10 rounded-full">
                  <div className="h-full w-2/3 bg-teal-500 rounded-full" />
                </div>
                <span className="text-xs">Inclusion</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex-1 h-2 bg-white/10 rounded-full">
                  <div className="h-full w-1/2 bg-amber-500 rounded-full" />
                </div>
                <span className="text-xs">Budget</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
};
