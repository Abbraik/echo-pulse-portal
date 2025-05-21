
import React from 'react';
import { MessageSquareText, AlertTriangle, Activity, FileText, ArrowRight } from 'lucide-react';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const ReflexIntegrationLayer: React.FC = () => {
  const { t } = useTranslation();
  
  // Sample data for demonstration
  const discussionThreads = [
    { 
      id: 1, 
      user: 'Maria K.', 
      role: 'Policy Analyst', 
      message: 'The resource allocation drift seems to align with seasonal budget cycles.', 
      timestamp: '2h ago',
      votes: 4
    },
    { 
      id: 2, 
      user: 'Ahmed L.', 
      role: 'Data Scientist', 
      message: 'Analysis shows strong correlation between engagement delay and resource effectiveness.', 
      timestamp: '4h ago',
      votes: 7
    },
    { 
      id: 3, 
      user: 'Sophia T.', 
      role: 'Community Lead', 
      message: 'Local stakeholders report policy fatigue in the education sector.', 
      timestamp: '1d ago',
      votes: 2
    },
  ];
  
  const ethicalDriftLog = [
    { event: 'Gender Bias in Resource Distribution', severity: 'high', date: '2025-03-18', description: 'Women in Region B received 30% fewer resources despite equal needs assessment.' },
    { event: 'Rural Access Inequality', severity: 'medium', date: '2025-03-12', description: 'Digital components created unintentional access barriers in rural communities.' },
    { event: 'Language Exclusion', severity: 'low', date: '2025-03-05', description: 'Policy materials not translated into regional dialects, limiting reach.' },
  ];
  
  const traceabilityItems = [
    { event: 'Causal Analysis Run', target: 'Education Sector DEI', timestamp: '2025-03-19 14:32' },
    { event: 'Pattern Recognition Applied', target: 'Resource-Impact Correlation', timestamp: '2025-03-18 09:15' },
    { event: 'Bundle Fatigue Detection', target: 'Community Workshop Models', timestamp: '2025-03-17 16:48' },
  ];
  
  return (
    <GlassCard className="p-6 h-[30vh] overflow-y-auto">
      <GlassCardHeader className="pb-4">
        <GlassCardTitle gradient>{t('humanAiReflexIntegration')}</GlassCardTitle>
      </GlassCardHeader>
      
      <GlassCardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Collaborative Drift Diagnostic Hub */}
          <div className="glass-panel p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <MessageSquareText className="h-4 w-4 mr-2" />
              {t('collaborativeDriftHub')}
            </h3>
            
            {/* Discussion Thread */}
            <div className="space-y-3 max-h-[calc(100%-3rem)] overflow-y-auto">
              {discussionThreads.map((thread) => (
                <div key={thread.id} className="glass-panel-dark p-3 rounded-lg">
                  <div className="flex items-start">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback>{thread.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium">{thread.user}</span>
                        <span className="text-[10px] text-gray-400 ml-1">• {thread.role}</span>
                      </div>
                      <p className="text-xs mt-1">{thread.message}</p>
                      <div className="flex items-center mt-1 text-[10px] text-gray-400">
                        <span>{thread.timestamp}</span>
                        <span className="mx-1">•</span>
                        <button className="flex items-center text-blue-400 hover:text-blue-300">
                          ↑ {thread.votes}
                        </button>
                        <span className="mx-1">•</span>
                        <button className="text-blue-400 hover:text-blue-300">
                          {t('reply')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3">
              <div className="flex items-center mb-2">
                <h4 className="text-xs font-medium">{t('classifyDrift')}</h4>
                <Badge variant="outline" className="ml-2 text-[10px] bg-blue-500/20 text-blue-300">
                  3/5 {t('consensus')}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <Button variant="outline" size="sm" className="text-xs h-7 justify-start">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
                  {t('policyDrift')}
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-7 justify-start bg-white/10">
                  <span className="h-2 w-2 rounded-full bg-teal-500 mr-1"></span>
                  {t('resourceDrift')}
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-7 justify-start">
                  <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
                  {t('timingDrift')}
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-7 justify-start">
                  <span className="h-2 w-2 rounded-full bg-rose-500 mr-1"></span>
                  {t('stakeholderDrift')}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Ethical Drift Log */}
          <div className="glass-panel p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {t('ethicalDriftLog')}
            </h3>
            
            <div className="space-y-3">
              {ethicalDriftLog.map((item, i) => (
                <div 
                  key={i} 
                  className="glass-panel-dark p-3 rounded-lg border-l-2 border-r-0 border-y-0"
                  style={{ 
                    borderLeftColor: item.severity === 'high' ? 'rgb(244, 63, 94)' :
                                    item.severity === 'medium' ? 'rgb(245, 158, 11)' :
                                    'rgb(45, 212, 191)'
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-medium">{item.event}</h4>
                    <span className="text-[10px] text-gray-400">{item.date}</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                  <Button variant="ghost" size="sm" className="mt-1 text-xs h-6 text-blue-400">
                    {t('flagForReview')} <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Meta-Learning Audit Trigger */}
          <div className="glass-panel p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              {t('metaLearningAudit')}
            </h3>
            
            <div className="flex flex-col items-center justify-center h-[calc(100%-3rem)]">
              <div className="mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-teal-500 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-teal-300">87%</span>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <h4 className="text-sm font-medium">{t('reflexHealth')}</h4>
                  <p className="text-xs text-gray-400">{t('goodStanding')}</p>
                </div>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-500">
                {t('runAudit')} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              
              <div className="w-full mt-3">
                <div className="flex justify-between items-center text-xs">
                  <span>{t('lastAudit')}</span>
                  <span className="text-gray-400">7 {t('daysAgo')}</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-1">
                  <div className="h-full w-1/4 bg-teal-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Simulation Traceability Ledger */}
          <div className="glass-panel p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              {t('simulationTraceability')}
            </h3>
            
            <div className="space-y-2">
              {traceabilityItems.map((item, i) => (
                <div key={i} className="flex flex-col text-xs p-2 bg-white/5 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.event}</span>
                    <span className="text-[10px] text-gray-400">{item.timestamp.split(' ')[0]}</span>
                  </div>
                  <span className="text-gray-400 mt-0.5">{item.target}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" size="sm" className="text-xs">
                {t('viewAll')}
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                {t('export')} <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
};
