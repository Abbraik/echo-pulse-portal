
import React from 'react';
import { Button } from '@/components/ui/button';
import { Video, Users, Lightbulb, Mic } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export const CoCreateTab: React.FC = () => {
  const { t } = useTranslation();

  const mockInsightSparks = [
    'What if we prioritized peer-to-peer trust building over institutional approaches?',
    'How might cultural events serve as catalysts for sustained engagement?',
    'Could gamification elements increase long-term participation rates?'
  ];

  return (
    <div className="h-full p-6">
      <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Conference */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Video size={20} className="text-teal-400" />
                <h3 className="font-semibold">{t('trustRedesignWorkshop')}</h3>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">{t('live')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-gradient-to-br from-slate-900/30 to-slate-800/30 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Users size={32} className="text-teal-400" />
                </div>
                <div>
                  <div className="font-medium">{t('workshopInProgress')}</div>
                  <div className="text-sm text-muted-foreground">5 {t('participants')} {t('online')}</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center justify-center gap-4">
                <Button size="sm" variant="outline" disabled>
                  <Mic size={16} />
                </Button>
                <Button size="sm" variant="outline" disabled>
                  <Video size={16} />
                </Button>
                <Button size="sm" className="bg-red-500 hover:bg-red-600">
                  {t('joinWorkshop')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sketchpad & Insights */}
        <div className="space-y-6">
          {/* Shared Sketchpad */}
          <div className="glass-panel rounded-xl h-64">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-semibold">{t('sharedSketchpad')}</h3>
            </div>
            <div className="h-48 bg-gradient-to-br from-slate-900/20 to-slate-800/20 relative overflow-hidden">
              <div className="absolute inset-4 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-sm">{t('collaborativeDrawingArea')}</div>
                  <div className="text-xs mt-1">{t('clickToStartDrawing')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Insight Sparks */}
          <div className="glass-panel rounded-xl">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Lightbulb size={20} className="text-yellow-400" />
                <h3 className="font-semibold">{t('insightSparks')}</h3>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-48 overflow-y-auto">
              {mockInsightSparks.map((spark, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg">
                  <p className="text-sm">{spark}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">AI Generated</span>
                    <Button size="sm" variant="ghost" className="h-6 text-xs">
                      {t('discuss')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Record Insight Button */}
      <div className="fixed bottom-6 right-6">
        <Button className="bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/25">
          <Mic size={16} className="mr-2" />
          {t('recordInsight')}
        </Button>
      </div>
    </div>
  );
};
