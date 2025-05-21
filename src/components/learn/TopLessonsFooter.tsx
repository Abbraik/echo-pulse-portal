
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

export const TopLessonsFooter: React.FC = () => {
  const { t } = useTranslation();
  
  // Sample top lessons
  const topLessons = [
    { 
      id: 'tl1', 
      title: 'Resource Allocation Optimization', 
      rating: 4.8, 
      impact: 'High DEI Improvement'
    },
    { 
      id: 'tl2', 
      title: 'Stakeholder Engagement Framework', 
      rating: 4.5, 
      impact: 'Strong Community Support'
    },
    { 
      id: 'tl3', 
      title: 'Cross-Ministerial Collaboration', 
      rating: 4.3, 
      impact: 'Reduced Policy Delays'
    },
    { 
      id: 'tl4', 
      title: 'Technology Access Equity', 
      rating: 4.2, 
      impact: 'Improved Rural Engagement'
    }
  ];
  
  // Render full or half stars based on rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={14} className="fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && (
          <svg width="14" height="14" viewBox="0 0 24 24" className="fill-amber-400 text-amber-400">
            <path d="M12 1l3.09 6.44 6.91.96-5 5 1.18 6.6L12 17.27 5.82 20l1.18-6.6-5-5 6.91-.96L12 1z" fill="url(#half-star)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="half-star" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0.5" stopColor="currentColor"/>
                <stop offset="0.5" stopColor="transparent" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} size={14} className="text-amber-400" />
        ))}
      </div>
    );
  };
  
  return (
    <GlassCard className="w-full min-w-max overflow-hidden flex items-center shadow-lg">
      <div className="p-4 text-sm font-semibold bg-gradient-to-r from-teal-500/20 to-blue-500/20 border-r border-white/10 min-w-[140px]">
        {t('topLessonsToPrototype')}
      </div>
      <div className="flex-1 overflow-x-auto py-2 px-3 flex gap-4">
        {topLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="flex-shrink-0 w-[250px] bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors group"
          >
            <h4 className="font-medium text-sm mb-1 truncate">{lesson.title}</h4>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                {renderStars(lesson.rating)}
                <span className="text-xs text-gray-400">{lesson.impact}</span>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="px-3 border-l border-white/10">
        <Button variant="outline" size="sm" className="whitespace-nowrap gap-1">
          {t('viewAllLessons')}
          <ArrowRight size={14} />
        </Button>
      </div>
    </GlassCard>
  );
};
