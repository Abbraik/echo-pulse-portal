
import React, { useState, useMemo } from 'react';
import { MousePointer2, Circle, ArrowRight, Plus, Save, RotateCcw, Redo2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface CLDNode {
  id: string;
  name: string;
  value: number;
  x: number;
  y: number;
  type: 'stock' | 'variable';
}

interface CLDFlow {
  id: string;
  from: string;
  to: string;
  type: 'positive' | 'negative';
  label: string;
}

interface ConceptBlock {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
  type: string;
}

interface ScenarioForkData {
  id: string;
  name: string;
  active: boolean;
}

interface CLDSketchCanvasProps {
  mode: 'lesson-driven' | 'freeform' | 'moonshot';
  selectedBlock?: ConceptBlock | null;
  selectedFork?: ScenarioForkData | null;
}

export const CLDSketchCanvas: React.FC<CLDSketchCanvasProps> = ({ 
  mode, 
  selectedBlock,
  selectedFork 
}) => {
  const { t } = useTranslation();
  const [selectedTool, setSelectedTool] = useState<'select' | 'stock' | 'variable' | 'link'>('select');
  
  // Dynamic CLD data based on selected context
  const contextualData = useMemo(() => {
    if (selectedBlock) {
      // Return different node configurations based on the selected block
      switch (selectedBlock.id) {
        case 'uba':
          return {
            nodes: [
              {
                id: 'basic-access',
                name: 'Basic Access Coverage',
                value: 68,
                x: 120,
                y: 80,
                type: 'stock' as const
              },
              {
                id: 'equality-index',
                name: 'Equality Index',
                value: 72,
                x: 280,
                y: 140,
                type: 'variable' as const
              },
              {
                id: 'policy-support',
                name: 'Policy Support',
                value: 45,
                x: 200,
                y: 220,
                type: 'stock' as const
              }
            ],
            flows: [
              {
                id: 'flow-1',
                from: 'basic-access',
                to: 'equality-index',
                type: 'positive' as const,
                label: 'Access → + Equality'
              },
              {
                id: 'flow-2',
                from: 'policy-support',
                to: 'basic-access',
                type: 'positive' as const,
                label: 'Policy → + Access'
              }
            ],
            loopLabel: 'UBA Loop'
          };
        case 'doughnut':
          return {
            nodes: [
              {
                id: 'ecological-ceiling',
                name: 'Ecological Ceiling',
                value: 78,
                x: 120,
                y: 80,
                type: 'stock' as const
              },
              {
                id: 'social-foundation',
                name: 'Social Foundation',
                value: 65,
                x: 280,
                y: 140,
                type: 'variable' as const
              },
              {
                id: 'regenerative-practices',
                name: 'Regenerative Practices',
                value: 52,
                x: 200,
                y: 220,
                type: 'stock' as const
              }
            ],
            flows: [
              {
                id: 'flow-1',
                from: 'regenerative-practices',
                to: 'ecological-ceiling',
                type: 'positive' as const,
                label: 'Practices → + Ceiling'
              },
              {
                id: 'flow-2',
                from: 'social-foundation',
                to: 'regenerative-practices',
                type: 'positive' as const,
                label: 'Foundation → + Practices'
              }
            ],
            loopLabel: 'Doughnut Loop'
          };
        default:
          return getDefaultData();
      }
    } else if (selectedFork) {
      // Return different configurations based on the selected fork
      switch (selectedFork.id) {
        case 'fork2':
          return {
            nodes: [
              {
                id: 'resource-rights',
                name: 'Resource Rights',
                value: 85,
                x: 120,
                y: 80,
                type: 'stock' as const
              },
              {
                id: 'community-ownership',
                name: 'Community Ownership',
                value: 70,
                x: 280,
                y: 140,
                type: 'variable' as const
              },
              {
                id: 'legal-framework',
                name: 'Legal Framework',
                value: 60,
                x: 200,
                y: 220,
                type: 'stock' as const
              }
            ],
            flows: [
              {
                id: 'flow-1',
                from: 'legal-framework',
                to: 'resource-rights',
                type: 'positive' as const,
                label: 'Legal → + Rights'
              },
              {
                id: 'flow-2',
                from: 'resource-rights',
                to: 'community-ownership',
                type: 'positive' as const,
                label: 'Rights → + Ownership'
              }
            ],
            loopLabel: 'Resource Rights Loop'
          };
        default:
          return getDefaultData();
      }
    }
    return getDefaultData();
  }, [selectedBlock, selectedFork, t]);

  function getDefaultData() {
    return {
      nodes: [
        {
          id: 'social-trust',
          name: t('socialTrustNode'),
          value: 72,
          x: 120,
          y: 80,
          type: 'stock' as const
        },
        {
          id: 'youth-engagement',
          name: t('youthEngagementNode'),
          value: 45,
          x: 280,
          y: 140,
          type: 'variable' as const
        },
        {
          id: 'community-programs',
          name: t('communityProgramsNode'),
          value: 30,
          x: 200,
          y: 220,
          type: 'stock' as const
        }
      ],
      flows: [
        {
          id: 'flow-1',
          from: 'youth-engagement',
          to: 'social-trust',
          type: 'positive' as const,
          label: 'Youth → + Trust'
        },
        {
          id: 'flow-2',
          from: 'community-programs',
          to: 'youth-engagement',
          type: 'positive' as const,
          label: 'Programs → + Engagement'
        }
      ],
      loopLabel: t('engagementLoop')
    };
  }

  const { nodes, flows, loopLabel } = contextualData;

  const tools = [
    { id: 'select', icon: <MousePointer2 size={16} />, label: t('selectTool') },
    { id: 'stock', icon: <Circle size={16} />, label: t('stockTool') },
    { id: 'variable', icon: <ArrowRight size={16} />, label: t('variableTool') },
    { id: 'link', icon: <ArrowRight size={16} />, label: t('linkTool') }
  ];

  const getNodeById = (id: string) => nodes.find(node => node.id === id);

  const renderFlow = (flow: CLDFlow) => {
    const fromNode = getNodeById(flow.from);
    const toNode = getNodeById(flow.to);
    
    if (!fromNode || !toNode) return null;

    return (
      <g key={flow.id}>
        <line
          x1={fromNode.x + 30}
          y1={fromNode.y + 15}
          x2={toNode.x}
          y2={toNode.y + 15}
          stroke={flow.type === 'positive' ? '#14b8a6' : '#ef4444'}
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          className="drop-shadow-sm"
        />
        <text
          x={(fromNode.x + toNode.x) / 2}
          y={(fromNode.y + toNode.y) / 2 - 5}
          textAnchor="middle"
          className="text-xs fill-gray-300 font-medium"
        >
          {flow.type === 'positive' ? '+' : '−'}
        </text>
      </g>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{t('cldSketchCanvas')}</h3>
          <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 capitalize">
            {mode}
          </span>
          {(selectedBlock || selectedFork) && (
            <span className="text-xs px-2 py-1 rounded bg-teal-500/20 text-teal-300">
              {selectedBlock ? selectedBlock.name : selectedFork?.name}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {tools.map(tool => (
            <Button
              key={tool.id}
              size="sm"
              variant={selectedTool === tool.id ? "default" : "outline"}
              className="h-8 px-2"
              onClick={() => setSelectedTool(tool.id as any)}
            >
              {tool.icon}
            </Button>
          ))}
          
          <div className="w-px h-6 bg-gray-600 mx-2" />
          
          <Button size="sm" variant="outline" className="h-8 px-2">
            <RotateCcw size={14} />
          </Button>
          <Button size="sm" variant="outline" className="h-8 px-2">
            <Redo2 size={14} />
          </Button>
          <Button size="sm" variant="outline" className="h-8 px-2">
            <Save size={14} />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 dark:bg-white/5 rounded-md m-3">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 400 300"
            className="absolute inset-0"
          >
            {/* Grid pattern */}
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="0.5"
                />
              </pattern>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#14b8a6"
                />
              </marker>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Render flows */}
            {flows.map(renderFlow)}
            
            {/* Render nodes */}
            {nodes.map((node, index) => (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <circle
                  cx={node.x + 15}
                  cy={node.y + 15}
                  r={node.type === 'stock' ? 20 : 15}
                  fill={node.type === 'stock' ? 'rgba(20, 184, 166, 0.3)' : 'rgba(59, 130, 246, 0.3)'}
                  stroke={node.type === 'stock' ? '#14b8a6' : '#3b82f6'}
                  strokeWidth="2"
                  className="cursor-pointer hover:scale-110 transition-transform"
                />
                
                <text
                  x={node.x + 15}
                  y={node.y + 19}
                  textAnchor="middle"
                  className="text-xs fill-white font-medium pointer-events-none"
                >
                  {node.value}
                </text>
                
                <text
                  x={node.x + 15}
                  y={node.y + 50}
                  textAnchor="middle"
                  className="text-xs fill-gray-300 font-medium pointer-events-none max-w-[80px]"
                >
                  {node.name}
                </text>
              </motion.g>
            ))}
            
            {/* Loop indicator */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <ellipse
                cx="200"
                cy="150"
                rx="120"
                ry="80"
                fill="none"
                stroke="rgba(168, 85, 247, 0.4)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <text
                x="200"
                y="240"
                textAnchor="middle"
                className="text-sm fill-purple-400 font-medium"
              >
                R1: {loopLabel}
              </text>
            </motion.g>
          </svg>
          
          {/* Instructions overlay when no content */}
          {!selectedBlock && !selectedFork && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-muted-foreground max-w-md">
                <p className="text-sm mb-2">{t('selectBlockOrFork')}</p>
                <p className="text-xs">{t('dynamicContentInstructions')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
