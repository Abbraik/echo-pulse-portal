
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Search, Calendar, Archive } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const LessonLaunchpad: React.FC = () => {
  const { t } = useTranslation();
  
  // Mock lesson data
  const lessons = [
    { id: 1, title: 'Energy Market Reform', source: 'Climate Task Force', date: '2024-12-05', success: 84, usage: 23 },
    { id: 2, title: 'Education Equity Project', source: 'Social Policy Team', date: '2025-01-12', success: 72, usage: 15 },
    { id: 3, title: 'Urban Mobility Initiative', source: 'Transport Authority', date: '2025-02-20', success: 91, usage: 42 },
  ];
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <Input 
            placeholder={t('searchLibraryPlaceholder')}
            startContent={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue placeholder={t('filterByTag')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all')}</SelectItem>
            <SelectItem value="social">{t('social')}</SelectItem>
            <SelectItem value="economic">{t('economic')}</SelectItem>
            <SelectItem value="environmental">{t('environmental')}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon">
          <Calendar className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-2 overflow-y-auto flex-1">
        {lessons.map(lesson => (
          <div 
            key={lesson.id}
            className="glass-panel border border-gray-700/20 p-3 rounded-lg hover:shadow-md hover:border-teal-500/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between">
              <h3 className="text-sm font-medium">{lesson.title}</h3>
              <span className="text-xs bg-gray-700/30 px-1.5 rounded-full">{lesson.usage}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{lesson.source}</span>
              <span>{lesson.date}</span>
            </div>
            <div className="h-1 w-full bg-gray-700/20 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                style={{ width: `${lesson.success}%` }}
              ></div>
            </div>
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
              <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                <Archive className="w-3 h-3" />
                <span>{t('archiveAsMemory')}</span>
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                {t('launchExperiment')}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
