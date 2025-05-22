
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { 
  PlusSquare, Undo, Redo, Square, Circle, ArrowRight, 
  MinusCircle, PlusCircle, Save
} from 'lucide-react';

type Point = { x: number; y: number };
type Node = { id: string; type: 'stock' | 'variable'; label: string; position: Point; };
type Link = { id: string; from: string; to: string; polarity: '+' | '-'; };

export const CLDSketchCanvas: React.FC = () => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [mode, setMode] = useState<'select' | 'stock' | 'variable' | 'link'>('select');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [linkStart, setLinkStart] = useState<string | null>(null);
  const [history, setHistory] = useState<{ nodes: Node[], links: Link[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Save current state to history
  const saveToHistory = (newNodes: Node[], newLinks: Link[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...newNodes], links: [...newLinks] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo and redo functions
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setLinks(prevState.links);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setLinks(nextState.links);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Handle canvas clicks for adding nodes
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (mode === 'select') return;
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (mode === 'stock' || mode === 'variable') {
        const newNode: Node = {
          id: `node-${Date.now()}`,
          type: mode,
          label: `New ${mode}`,
          position: { x, y }
        };
        
        const newNodes = [...nodes, newNode];
        setNodes(newNodes);
        saveToHistory(newNodes, links);
        setSelectedNodeId(newNode.id);
      }
    }
  };
  
  // Handle node click for selecting or linking
  const handleNodeClick = (nodeId: string) => {
    if (mode === 'select') {
      setSelectedNodeId(nodeId);
    } else if (mode === 'link') {
      if (linkStart === null) {
        setLinkStart(nodeId);
      } else {
        // Create a new link
        const newLink: Link = {
          id: `link-${Date.now()}`,
          from: linkStart,
          to: nodeId,
          polarity: '+' // Default to positive polarity
        };
        
        const newLinks = [...links, newLink];
        setLinks(newLinks);
        saveToHistory(nodes, newLinks);
        setLinkStart(null);
      }
    }
  };
  
  // Handle polarity change for links
  const togglePolarity = (linkId: string) => {
    const newLinks = links.map(link => {
      if (link.id === linkId) {
        return { ...link, polarity: link.polarity === '+' ? '-' : '+' };
      }
      return link;
    });
    
    setLinks(newLinks);
    saveToHistory(nodes, newLinks);
  };

  // Initialize history with empty state
  useEffect(() => {
    saveToHistory([], []);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">{t('cldSketchCanvas')}</h3>
        <div className="flex items-center gap-2">
          <div className="flex bg-secondary/40 rounded-md p-0.5">
            <Toggle 
              pressed={mode === 'select'} 
              onPressedChange={() => mode !== 'select' && setMode('select')}
              className="data-[state=on]:bg-white/20 data-[state=on]:text-foreground"
              size="sm"
              aria-label={t('selectTool')}
            >
              <Circle size={16} />
            </Toggle>
            <Toggle 
              pressed={mode === 'stock'} 
              onPressedChange={() => mode !== 'stock' && setMode('stock')}
              className="data-[state=on]:bg-white/20 data-[state=on]:text-foreground"
              size="sm"
              aria-label={t('stockTool')}
            >
              <Square size={16} />
            </Toggle>
            <Toggle 
              pressed={mode === 'variable'} 
              onPressedChange={() => mode !== 'variable' && setMode('variable')}
              className="data-[state=on]:bg-white/20 data-[state=on]:text-foreground"
              size="sm"
              aria-label={t('variableTool')}
            >
              <Circle size={16} />
            </Toggle>
            <Toggle 
              pressed={mode === 'link'} 
              onPressedChange={() => mode !== 'link' && setMode('link')}
              className="data-[state=on]:bg-white/20 data-[state=on]:text-foreground"
              size="sm"
              aria-label={t('linkTool')}
            >
              <ArrowRight size={16} />
            </Toggle>
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
            >
              <Undo size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo size={16} />
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Save size={14} />
            {t('saveDiagram')}
          </Button>
        </div>
      </div>
      
      <div 
        ref={canvasRef}
        className="flex-1 relative border border-white/10 rounded-lg bg-black/5 dark:bg-white/5 overflow-hidden"
        onClick={handleCanvasClick}
      >
        {/* Render nodes */}
        {nodes.map(node => (
          <div 
            key={node.id}
            className={`absolute cursor-move ${
              selectedNodeId === node.id ? 'ring-2 ring-teal-500' : ''
            } ${
              linkStart === node.id ? 'ring-2 ring-blue-500 animate-pulse' : ''
            }`}
            style={{ 
              left: node.position.x - (node.type === 'stock' ? 40 : 30),
              top: node.position.y - (node.type === 'stock' ? 25 : 30),
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleNodeClick(node.id);
            }}
          >
            {node.type === 'stock' ? (
              <div className="h-[50px] w-[80px] bg-white/20 dark:bg-white/10 border border-white/30 rounded flex items-center justify-center text-sm">
                {node.label}
              </div>
            ) : (
              <div className="h-[60px] w-[60px] rounded-full bg-white/20 dark:bg-white/10 border border-white/30 flex items-center justify-center text-sm">
                {node.label}
              </div>
            )}
          </div>
        ))}

        {/* Render links as SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow-positive" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
            <marker id="arrow-negative" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <line x1="0" y1="0" x2="10" y2="7" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="7" x2="10" y2="0" stroke="currentColor" strokeWidth="1.5" />
            </marker>
          </defs>
          {links.map(link => {
            const fromNode = nodes.find(n => n.id === link.from);
            const toNode = nodes.find(n => n.id === link.to);
            
            if (fromNode && toNode) {
              // Calculate link path
              const x1 = fromNode.position.x;
              const y1 = fromNode.position.y;
              const x2 = toNode.position.x;
              const y2 = toNode.position.y;
              
              return (
                <g key={link.id}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    markerEnd={link.polarity === '+' ? 'url(#arrow-positive)' : 'url(#arrow-negative)'}
                  />
                  {/* Polarity indicators */}
                  <g
                    transform={`translate(${(x1 + x2) / 2}, ${(y1 + y2) / 2})`}
                    className="cursor-pointer"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      togglePolarity(link.id);
                    }}
                  >
                    <circle r="10" fill="white" opacity="0.8" />
                    {link.polarity === '+' ? (
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="14"
                        fontWeight="bold"
                        fill="green"
                      >+</text>
                    ) : (
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="14"
                        fontWeight="bold"
                        fill="red"
                      >−</text>
                    )}
                  </g>
                </g>
              );
            }
            return null;
          })}
        </svg>
        
        {/* Canvas instructions */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <div className="text-lg mb-2">{t('startDrawingCLD')}</div>
            <div className="text-sm">{t('cldInstructions')}</div>
          </div>
        )}

        {/* Link in progress indicator */}
        {linkStart && mode === 'link' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
            <div className="bg-black/70 text-white px-3 py-2 rounded-lg">
              {t('selectDestinationNode')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
