
import React, { useRef, useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card';
import { Search, ZoomIn, ZoomOut, Filter, ArrowRight, Maximize2, Minimize2, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KnowledgeGraph } from './KnowledgeGraph';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';

export const KnowledgeGraphPanel: React.FC = () => {
  const { t } = useTranslation();
  const graphRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Sample diagnostics data
  const diagnosticsData = {
    hubs: [
      { id: 'h1', name: 'Ministry of Education', type: 'actor', connections: 14 },
      { id: 'h2', name: 'Resource Allocation', type: 'lesson', connections: 11 },
      { id: 'h3', name: 'Community Engagement', type: 'playbook', connections: 9 },
      { id: 'h4', name: 'Budget Constraints', type: 'variable', connections: 7 },
      { id: 'h5', name: 'Technology Access', type: 'lesson', connections: 6 },
    ],
    criticalPaths: [
      { 
        id: 'p1', 
        name: 'Education Equity Pathway', 
        nodes: ['Ministry of Education', 'Resource Allocation', 'Technology Access', 'DEI Score'],
        confidence: 86
      },
      { 
        id: 'p2', 
        name: 'Budget Optimization Pathway', 
        nodes: ['Ministry of Finance', 'Budget Constraints', 'Resource Allocation', 'Policy Implementation'],
        confidence: 72
      },
      { 
        id: 'p3', 
        name: 'Stakeholder Engagement Pathway', 
        nodes: ['Community Leaders', 'Feedback Sessions', 'Community Engagement', 'Satisfaction Index'],
        confidence: 68
      },
    ],
    knowledgeGaps: [
      { id: 'g1', name: 'Inter-Ministry Coordination', description: 'Limited insight on cross-ministry workflows' },
      { id: 'g2', name: 'Long-term Impact Measurement', description: 'Insufficient data on multi-year outcomes' },
    ]
  };
  
  // Filter node types
  const nodeTypes = ['lesson', 'playbook', 'actor', 'variable'];
  
  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoomIn();
    }
  };
  
  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoomOut();
    }
  };
  
  const handleNodeTypeFilter = (type: string) => {
    setSelectedNodeType(selectedNodeType === type ? null : type);
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
        <GlassCardHeader className="pb-4 flex justify-between items-center">
          <GlassCardTitle gradient>{t('knowledgeGraphDiagnostics')}</GlassCardTitle>
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
        
        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
            <GlassCardContent className={`${isExpanded ? 'h-[calc(100vh-160px)]' : 'h-[calc(100%-84px)]'}`}>
              <div className="flex h-full">
                {/* Knowledge Graph Visualization (Left 60%) */}
                <div className="w-3/5 pr-4 h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t('searchNodes')}
                        className="pl-9 bg-white/5 border-white/10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-1">
                      {nodeTypes.map(type => (
                        <Badge 
                          key={type}
                          variant={selectedNodeType === type ? "default" : "outline"} 
                          className={`cursor-pointer ${selectedNodeType === type ? '' : 'bg-white/5'}`}
                          onClick={() => handleNodeTypeFilter(type)}
                        >
                          {t(type)}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex">
                      <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                        <ZoomIn size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                        <ZoomOut size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg border border-white/10 h-[calc(100%-40px)]">
                    <KnowledgeGraph ref={graphRef} searchQuery={searchQuery} nodeTypeFilter={selectedNodeType} />
                  </div>
                </div>
                
                {/* Diagnostics Summary (Right 40%) */}
                <div className="w-2/5 pl-4 h-full overflow-y-auto">
                  {/* Top Hubs Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">{t('topHubs')}</h3>
                    <div className="space-y-2">
                      {diagnosticsData.hubs.map(hub => (
                        <div key={hub.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{hub.name}</span>
                              <Badge variant="outline" className="bg-white/10 text-xs">
                                {t(hub.type)}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {t('connectionsCount', { count: hub.connections })}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Filter size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Critical Paths Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">{t('criticalPaths')}</h3>
                    <div className="space-y-3">
                      {diagnosticsData.criticalPaths.map(path => (
                        <div key={path.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">{path.name}</span>
                            <Badge className={path.confidence > 80 ? 'bg-emerald-600' : 'bg-amber-600'}>
                              {path.confidence}%
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm mb-3">
                            {path.nodes.map((node, i, arr) => (
                              <React.Fragment key={i}>
                                <span className="text-gray-300">{node}</span>
                                {i < arr.length - 1 && <ArrowRight size={12} className="text-gray-500" />}
                              </React.Fragment>
                            ))}
                          </div>
                          <Button size="sm" className="gap-1 w-full justify-center">
                            <span>{t('applyPathway')}</span>
                            <ArrowRight size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Knowledge Gaps Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">{t('knowledgeGaps')}</h3>
                    <div className="space-y-3">
                      {diagnosticsData.knowledgeGaps.map(gap => (
                        <div key={gap.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="font-medium mb-1">{gap.name}</div>
                          <p className="text-sm text-gray-400 mb-2">{gap.description}</p>
                          <Button variant="outline" size="sm" className="gap-1 w-full justify-center">
                            <span>{t('captureNewLessons')}</span>
                            <ArrowRight size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCardContent>
          </CollapsibleContent>
        </Collapsible>
      </GlassCard>
    </motion.div>
  );
};
