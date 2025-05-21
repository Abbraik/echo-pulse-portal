
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, AlertTriangle, ArrowRight, Star, Maximize2, Minimize2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion } from 'framer-motion';

export const InsightReviewPanel: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('comments');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Sample comment data
  const comments = [
    {
      id: 'c1',
      author: 'Aisha Al-Mansoori',
      avatar: '/placeholder.svg',
      content: 'The resource allocation patterns show strong correlation with implementation delays across ministries.',
      timestamp: '2 hours ago',
      votes: 12,
      replies: [
        {
          id: 'r1',
          author: 'Mohammed Kazim',
          avatar: '/placeholder.svg',
          content: 'Agreed. We should examine the approval workflows that create these bottlenecks.',
          timestamp: '1 hour ago',
          votes: 8,
        },
        {
          id: 'r2',
          author: 'AI Assistant',
          avatar: '/placeholder.svg',
          content: 'Analysis shows that 68% of delays occur during the final approval stage. Recommend streamlining this process.',
          timestamp: '45 minutes ago',
          votes: 15,
          isAI: true
        }
      ]
    },
    {
      id: 'c2',
      author: 'Fatima Al-Zaabi',
      avatar: '/placeholder.svg',
      content: 'Knowledge graph is showing repeated stakeholder engagement failures when technology initiatives are involved.',
      timestamp: '5 hours ago',
      votes: 7,
      replies: []
    }
  ];
  
  // Sample ethics incidents
  const ethicsIncidents = [
    {
      id: 'e1',
      title: 'DEI Goal Trade-off',
      description: 'Budget optimization resulted in decreased accessibility for rural communities.',
      severity: 'medium',
      date: '2025-03-15',
      status: 'under-review',
      assignedTo: 'Ethics Review Board'
    },
    {
      id: 'e2',
      title: 'Data Privacy Concern',
      description: 'Stakeholder engagement survey collected unnecessary personal information.',
      severity: 'high',
      date: '2025-03-10',
      status: 'flagged',
      assignedTo: 'Data Protection Officer'
    },
    {
      id: 'e3',
      title: 'Algorithmic Bias',
      description: 'Resource allocation algorithm showing geographical bias in recommendations.',
      severity: 'medium',
      date: '2025-03-08',
      status: 'resolved',
      assignedTo: 'AI Ethics Committee'
    },
  ];
  
  // Severity color mapping
  const severityColors = {
    low: 'bg-blue-600',
    medium: 'bg-amber-600',
    high: 'bg-rose-600'
  };
  
  // Status color mapping
  const statusColors = {
    'flagged': 'bg-rose-600',
    'under-review': 'bg-amber-600',
    'resolved': 'bg-emerald-600'
  };

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
      <GlassCard className={`overflow-hidden h-full ${isExpanded ? 'h-full' : ''}`}>
        <Collapsible open={!isCollapsed}>
          <GlassCardHeader className="pb-4 flex justify-between items-center">
            <GlassCardTitle gradient>{t('insightReview')}</GlassCardTitle>
            <div className="flex gap-2">
              <CollapsibleTrigger asChild onClick={toggleCollapse}>
                <Button variant="ghost" size="icon">
                  {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </Button>
              </CollapsibleTrigger>
              <Button variant="ghost" size="icon" onClick={toggleExpand}>
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </Button>
            </div>
          </GlassCardHeader>
          
          <CollapsibleContent>
            <GlassCardContent className={isExpanded ? 'h-[calc(100vh-160px)]' : ''}>
              <Tabs defaultValue="comments" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="comments" className="flex-1">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} />
                      <span>{t('commentsAndVotes')}</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="ethics" className="flex-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} />
                      <span>{t('ethicsAndAudits')}</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="comments" className={`${isExpanded ? 'h-[calc(100vh-220px)]' : 'h-[calc(100%-56px)]'} overflow-y-auto`}>
                  <div className="space-y-6">
                    {comments.map(comment => (
                      <div key={comment.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <img src={comment.avatar} alt={comment.author} />
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">{comment.author}</h4>
                              <span className="text-xs text-gray-400">{comment.timestamp}</span>
                            </div>
                            <p className="my-2 text-sm">{comment.content}</p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-sm">
                                <button className="hover:text-primary transition-colors">
                                  <Star size={14} />
                                </button>
                                <span>{comment.votes}</span>
                              </div>
                              <button className="text-sm text-gray-400 hover:text-primary transition-colors">
                                {t('reply')}
                              </button>
                            </div>
                            
                            {/* Replies */}
                            {comment.replies.length > 0 && (
                              <div className="mt-4 space-y-4 pl-4 border-l border-white/10">
                                {comment.replies.map(reply => (
                                  <div key={reply.id} className="flex items-start gap-3">
                                    <Avatar className="h-6 w-6">
                                      <img src={reply.avatar} alt={reply.author} />
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <h5 className="font-medium text-sm">{reply.author}</h5>
                                        {reply.isAI && (
                                          <Badge variant="outline" className="h-5 text-xs bg-blue-500/20 border-blue-500/30">
                                            AI
                                          </Badge>
                                        )}
                                        <span className="text-xs text-gray-400">{reply.timestamp}</span>
                                      </div>
                                      <p className="my-1 text-sm">{reply.content}</p>
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 text-xs">
                                          <button className="hover:text-primary transition-colors">
                                            <Star size={12} />
                                          </button>
                                          <span>{reply.votes}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center">
                      <Button variant="outline" size="sm" className="gap-1">
                        <span>{t('aiSummarize')}</span>
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ethics" className={`${isExpanded ? 'h-[calc(100vh-220px)]' : 'h-[calc(100%-56px)]'} overflow-y-auto`}>
                  <div className="space-y-4">
                    <div className="flex justify-between mb-4">
                      <h3 className="text-lg font-medium">{t('ethicalDriftLog')}</h3>
                      <Button className="gap-1" size="sm">
                        <span>{t('runMetaAudit')}</span>
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                    
                    {ethicsIncidents.map(incident => (
                      <div key={incident.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={severityColors[incident.severity as keyof typeof severityColors]}>
                              {t(incident.severity)}
                            </Badge>
                            <h4 className="font-medium">{incident.title}</h4>
                          </div>
                          <Badge className={statusColors[incident.status as keyof typeof statusColors]}>
                            {t(incident.status)}
                          </Badge>
                        </div>
                        
                        <p className="mb-2 text-sm">{incident.description}</p>
                        
                        <div className="flex justify-between text-sm text-gray-400">
                          <div>{t('date')}: {incident.date}</div>
                          <div>{t('assignedTo')}: {incident.assignedTo}</div>
                        </div>
                        
                        <div className="mt-3 flex justify-end">
                          <Button variant="outline" size="sm" className="gap-1">
                            <span>{t('flagForReview')}</span>
                            <ArrowRight size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </GlassCardContent>
          </CollapsibleContent>
        </Collapsible>
      </GlassCard>
    </motion.div>
  );
};
