import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  Panel,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Plus,
  MessageSquare,
  Download,
  History,
  Users,
  Circle,
  Square,
  Hexagon,
  ArrowRight,
  Save,
  Undo,
  Redo,
  X,
  Eye,
  EyeOff,
  Grid,
  ZoomIn,
  ZoomOut,
  Maximize,
  Settings
} from 'lucide-react';

// Types
interface CLDNode extends Node {
  data: {
    label: string;
    value?: number;
    unit?: string;
    deBandMin?: number;
    deBandMax?: number;
    srtEnabled?: boolean;
    nodeType: 'stock' | 'flow' | 'connector';
    templateType?: 'population' | 'resource' | 'service';
    comments?: Comment[];
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    fontSize?: number;
    fontWeight?: string;
  };
}

interface CLDEdge extends Edge {
  data: {
    polarity: 'positive' | 'negative';
    delay?: string;
    strength: number;
    comments?: Comment[];
    strokeColor?: string;
    strokeWidth?: number;
  };
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
  replies?: Comment[];
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  cursor?: { x: number; y: number };
  online: boolean;
}

interface Version {
  id: string;
  name: string;
  timestamp: Date;
  nodes: CLDNode[];
  edges: CLDEdge[];
}

// Mock data
const mockNodeTemplates = [
  { id: 'population', type: 'stock', label: 'Population A', value: 1000, unit: 'people', icon: Circle, color: 'bg-green-500' },
  { id: 'school-capacity', type: 'stock', label: 'School Capacity', value: 500, unit: 'students', icon: Square, color: 'bg-blue-500' },
  { id: 'housing-stock', type: 'stock', label: 'Housing Stock', value: 2000, unit: 'units', icon: Hexagon, color: 'bg-yellow-500' },
];

const mockCollaborators: Collaborator[] = [
  { id: '1', name: 'John Doe', avatar: 'JD', online: true, cursor: { x: 200, y: 150 } },
  { id: '2', name: 'Sarah Wilson', avatar: 'SW', online: true, cursor: { x: 400, y: 300 } },
  { id: '3', name: 'Alex Chen', avatar: 'AC', online: false, cursor: undefined },
];

const mockVersions: Version[] = [
  { id: 'v1', name: 'Initial Mock', timestamp: new Date('2024-01-15T10:00:00'), nodes: [], edges: [] },
  { id: 'v2', name: 'Adjusted SRT on Population A', timestamp: new Date('2024-01-15T11:30:00'), nodes: [], edges: [] },
  { id: 'v3', name: 'Added Housing Stock node', timestamp: new Date('2024-01-15T14:20:00'), nodes: [], edges: [] },
];

// Initial nodes and edges
const initialNodes: CLDNode[] = [
  {
    id: 'population-a',
    type: 'default',
    position: { x: 100, y: 100 },
    data: {
      label: 'Population A (1000)',
      value: 1000,
      unit: 'people',
      nodeType: 'stock',
      templateType: 'population',
      deBandMin: 800,
      deBandMax: 1200,
      srtEnabled: true,
    },
  },
  {
    id: 'school-capacity',
    type: 'default',
    position: { x: 400, y: 100 },
    data: {
      label: 'School Capacity (500)',
      value: 500,
      unit: 'students',
      nodeType: 'stock',
      templateType: 'resource',
      deBandMin: 400,
      deBandMax: 600,
      srtEnabled: false,
    },
  },
];

const initialEdges: CLDEdge[] = [
  {
    id: 'e1-2',
    source: 'population-a',
    target: 'school-capacity',
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    data: {
      polarity: 'positive',
      delay: '2 months',
      strength: 0.8,
    },
  },
];

export const CLDStudio: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<CLDNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<CLDEdge | null>(null);
  const [commentMode, setCommentMode] = useState(false);
  const [isGridVisible, setIsGridVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');
  const [newComment, setNewComment] = useState('');
  const [versions] = useState<Version[]>(mockVersions);
  const [collaborators] = useState<Collaborator[]>(mockCollaborators);
  const [isDragging, setIsDragging] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault();
            // Handle undo
            break;
          case 'y':
            event.preventDefault();
            // Handle redo
            break;
        }
      } else {
        switch (event.key) {
          case 'n':
            event.preventDefault();
            addNewNode('stock');
            break;
          case 'l':
            event.preventDefault();
            // Toggle link mode
            break;
          case 'c':
            event.preventDefault();
            setCommentMode(!commentMode);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commentMode]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: CLDEdge = {
        ...params,
        id: `edge-${edges.length + 1}`,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
        data: {
          polarity: 'positive',
          delay: '1 month',
          strength: 1.0,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [edges, setEdges]
  );

  const addNewNode = (nodeType: 'stock' | 'flow' | 'connector') => {
    const newNode: CLDNode = {
      id: `node-${nodes.length + 1}`,
      type: 'default',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: `New ${nodeType}`,
        nodeType,
        value: 0,
        unit: 'units',
        srtEnabled: false,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleDragFromPalette = (template: typeof mockNodeTemplates[0], event: React.DragEvent) => {
    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!reactFlowBounds) return;

    const position = {
      x: event.clientX - reactFlowBounds.left - 75,
      y: event.clientY - reactFlowBounds.top - 25,
    };

    const newNode: CLDNode = {
      id: `${template.id}-${Date.now()}`,
      type: 'default',
      position,
      data: {
        label: `${template.label} (${template.value})`,
        value: template.value,
        unit: template.unit,
        nodeType: template.type as 'stock',
        templateType: template.id as any,
        srtEnabled: false,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as CLDNode);
    setSelectedEdge(null);
    setActiveTab('properties');
  }, []);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge as CLDEdge);
    setSelectedNode(null);
    setActiveTab('properties');
  }, []);

  const updateNodeData = (nodeId: string, newData: Partial<CLDNode['data']>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
    if (selectedNode?.id === nodeId) {
      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, ...newData } });
    }
  };

  const exportToPNG = () => {
    // Mock export functionality
    console.log('Exporting to PNG...');
  };

  const exportToJSON = () => {
    const exportData = { nodes, edges, timestamp: new Date() };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cld-diagram.json';
    a.click();
  };

  const exportToORS = () => {
    // Mock ORS export functionality
    console.log('Exporting to ORS Bundle...');
  };

  return (
    <TooltipProvider>
      <div className="h-screen bg-glass backdrop-blur-20 bg-opacity-70 flex flex-col">
        {/* Toolbar */}
        <div className="h-16 bg-glass backdrop-blur-20 border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => addNewNode('stock')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stock
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add new stock node (N)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => addNewNode('flow')}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Add Flow
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add flow connector (L)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={commentMode ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setCommentMode(!commentMode)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comment Mode
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle comment mode (C)</TooltipContent>
            </Tooltip>

            <Button variant="ghost" size="sm">
              <History className="h-4 w-4 mr-2" />
              Version History
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={exportToPNG}>
                <Download className="h-4 w-4 mr-1" />
                PNG
              </Button>
              <Button variant="ghost" size="sm" onClick={exportToJSON}>
                <Download className="h-4 w-4 mr-1" />
                JSON
              </Button>
              <Button variant="ghost" size="sm" onClick={exportToORS}>
                <Download className="h-4 w-4 mr-1" />
                ORS Bundle
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {collaborators.filter(c => c.online).map((collaborator) => (
                <Tooltip key={collaborator.id}>
                  <TooltipTrigger asChild>
                    <Avatar className="w-8 h-8 border-2 border-primary">
                      <AvatarFallback className="text-xs">{collaborator.avatar}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>{collaborator.name} (online)</TooltipContent>
                </Tooltip>
              ))}
              <Badge variant="outline" className="ml-2">
                <Users className="h-3 w-3 mr-1" />
                {collaborators.filter(c => c.online).length} online
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Left Palette Drawer */}
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            className="w-64 bg-glass backdrop-blur-20 border-r border-white/10 p-4 overflow-auto"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Stock Templates</h3>
                <div className="space-y-2">
                  {mockNodeTemplates.map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <motion.div
                        key={template.id}
                        className={`p-3 rounded-lg border border-white/20 cursor-grab active:cursor-grabbing ${template.color}/20 hover:${template.color}/30 transition-colors`}
                        draggable
                        onDragEnd={(event) => handleDragFromPalette(template, event as any)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`h-5 w-5 text-${template.color.split('-')[1]}-400`} />
                          <div>
                            <div className="font-medium text-sm">{template.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {template.value} {template.unit}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Flow Connectors</h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-white/20 bg-yellow-500/20 cursor-pointer hover:bg-yellow-500/30">
                    <div className="flex items-center gap-3">
                      <ArrowRight className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm">Reinforcing</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-white/20 bg-red-500/20 cursor-pointer hover:bg-red-500/30">
                    <div className="flex items-center gap-3">
                      <ArrowRight className="h-5 w-5 text-red-400" />
                      <span className="text-sm">Balancing</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Versions</h3>
                <ScrollArea className="h-32">
                  <div className="space-y-1">
                    {versions.map((version) => (
                      <div key={version.id} className="p-2 rounded text-xs hover:bg-white/10 cursor-pointer">
                        <div className="font-medium">{version.name}</div>
                        <div className="text-muted-foreground">
                          {version.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </motion.div>

          {/* Main Canvas */}
          <div className="flex-1 relative" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              fitView
              attributionPosition="bottom-left"
              className="bg-transparent"
              snapToGrid
              snapGrid={[20, 20]}
            >
              <Background 
                color="#666" 
                gap={20} 
                size={1} 
                style={{ display: isGridVisible ? 'block' : 'none' }}
              />
              <Controls 
                className="bg-glass backdrop-blur-20 border border-white/10 rounded-lg"
              />
              <MiniMap 
                className="bg-glass backdrop-blur-20 border border-white/10 rounded-lg"
                nodeColor="#9333ea"
                maskColor="rgba(0, 0, 0, 0.5)"
              />
              
              {/* Collaborator Cursors */}
              {collaborators
                .filter(c => c.online && c.cursor)
                .map((collaborator) => (
                  <motion.div
                    key={collaborator.id}
                    className="absolute pointer-events-none z-50"
                    style={{
                      left: collaborator.cursor!.x,
                      top: collaborator.cursor!.y,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                      {collaborator.name}
                    </div>
                  </motion.div>
                ))}

              <Panel position="top-right">
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIsGridVisible(!isGridVisible)}
                      >
                        {isGridVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle grid</TooltipContent>
                  </Tooltip>
                </div>
              </Panel>
            </ReactFlow>
          </div>

          {/* Right Properties & Comments Panel */}
          <motion.div
            initial={{ x: 288 }}
            animate={{ x: 0 }}
            className="w-72 bg-glass backdrop-blur-20 border-l border-white/10 flex flex-col"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-background/20">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="properties" className="flex-1 p-4 space-y-4">
                {selectedNode ? (
                  <Card className="bg-background/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Node Properties</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="node-name" className="text-xs">Name</Label>
                        <Input
                          id="node-name"
                          value={selectedNode.data.label}
                          onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                          className="bg-background/50 border-white/20"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="node-value" className="text-xs">Value</Label>
                          <Input
                            id="node-value"
                            type="number"
                            value={selectedNode.data.value || 0}
                            onChange={(e) => updateNodeData(selectedNode.id, { value: Number(e.target.value) })}
                            className="bg-background/50 border-white/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="node-unit" className="text-xs">Unit</Label>
                          <Input
                            id="node-unit"
                            value={selectedNode.data.unit || ''}
                            onChange={(e) => updateNodeData(selectedNode.id, { unit: e.target.value })}
                            className="bg-background/50 border-white/20"
                          />
                        </div>
                      </div>

                      {/* Color Controls */}
                      <div>
                        <Label className="text-xs">Colors</Label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          <div>
                            <Label htmlFor="bg-color" className="text-xs text-muted-foreground">Background</Label>
                            <Input
                              id="bg-color"
                              type="color"
                              value={selectedNode.data.backgroundColor || '#3b82f6'}
                              onChange={(e) => updateNodeData(selectedNode.id, { backgroundColor: e.target.value })}
                              className="h-8 p-1 bg-background/50 border-white/20"
                            />
                          </div>
                          <div>
                            <Label htmlFor="text-color" className="text-xs text-muted-foreground">Text</Label>
                            <Input
                              id="text-color"
                              type="color"
                              value={selectedNode.data.textColor || '#ffffff'}
                              onChange={(e) => updateNodeData(selectedNode.id, { textColor: e.target.value })}
                              className="h-8 p-1 bg-background/50 border-white/20"
                            />
                          </div>
                          <div>
                            <Label htmlFor="border-color" className="text-xs text-muted-foreground">Border</Label>
                            <Input
                              id="border-color"
                              type="color"
                              value={selectedNode.data.borderColor || '#1e40af'}
                              onChange={(e) => updateNodeData(selectedNode.id, { borderColor: e.target.value })}
                              className="h-8 p-1 bg-background/50 border-white/20"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Font Controls */}
                      <div>
                        <Label className="text-xs">Font Style</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <Label htmlFor="font-size" className="text-xs text-muted-foreground">Size</Label>
                            <Input
                              id="font-size"
                              type="number"
                              min="8"
                              max="24"
                              value={selectedNode.data.fontSize || 14}
                              onChange={(e) => updateNodeData(selectedNode.id, { fontSize: Number(e.target.value) })}
                              className="bg-background/50 border-white/20"
                            />
                          </div>
                          <div>
                            <Label htmlFor="font-weight" className="text-xs text-muted-foreground">Weight</Label>
                            <select
                              id="font-weight"
                              value={selectedNode.data.fontWeight || 'normal'}
                              onChange={(e) => updateNodeData(selectedNode.id, { fontWeight: e.target.value })}
                              className="w-full h-8 bg-background/50 border border-white/20 rounded text-sm"
                            >
                              <option value="normal">Normal</option>
                              <option value="bold">Bold</option>
                              <option value="lighter">Light</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">DE-Band Bounds</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <Label htmlFor="de-min" className="text-xs text-muted-foreground">Min</Label>
                            <Input
                              id="de-min"
                              type="number"
                              value={selectedNode.data.deBandMin || 0}
                              onChange={(e) => updateNodeData(selectedNode.id, { deBandMin: Number(e.target.value) })}
                              className="bg-background/50 border-white/20"
                            />
                          </div>
                          <div>
                            <Label htmlFor="de-max" className="text-xs text-muted-foreground">Max</Label>
                            <Input
                              id="de-max"
                              type="number"
                              value={selectedNode.data.deBandMax || 0}
                              onChange={(e) => updateNodeData(selectedNode.id, { deBandMax: Number(e.target.value) })}
                              className="bg-background/50 border-white/20"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="srt-toggle"
                          checked={selectedNode.data.srtEnabled || false}
                          onCheckedChange={(checked) => updateNodeData(selectedNode.id, { srtEnabled: checked })}
                        />
                        <Label htmlFor="srt-toggle" className="text-xs">Enable SRT</Label>
                      </div>
                    </CardContent>
                  </Card>
                ) : selectedEdge ? (
                  <Card className="bg-background/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Edge Properties</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="edge-delay" className="text-xs">Delay</Label>
                        <Input
                          id="edge-delay"
                          value={selectedEdge.data.delay || ''}
                          onChange={(e) => {
                            setEdges((eds) =>
                              eds.map((edge) =>
                                edge.id === selectedEdge.id
                                  ? { ...edge, data: { ...edge.data, delay: e.target.value } }
                                  : edge
                              )
                            );
                          }}
                          className="bg-background/50 border-white/20"
                          placeholder="e.g., 2 months"
                        />
                      </div>

                      {/* Edge Color Controls */}
                      <div>
                        <Label className="text-xs">Edge Style</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <Label htmlFor="stroke-color" className="text-xs text-muted-foreground">Color</Label>
                            <Input
                              id="stroke-color"
                              type="color"
                              value={selectedEdge.data.strokeColor || '#9333ea'}
                              onChange={(e) => {
                                setEdges((eds) =>
                                  eds.map((edge) =>
                                    edge.id === selectedEdge.id
                                      ? { ...edge, data: { ...edge.data, strokeColor: e.target.value }, style: { ...edge.style, stroke: e.target.value } }
                                      : edge
                                  )
                                );
                              }}
                              className="h-8 p-1 bg-background/50 border-white/20"
                            />
                          </div>
                          <div>
                            <Label htmlFor="stroke-width" className="text-xs text-muted-foreground">Width</Label>
                            <Input
                              id="stroke-width"
                              type="number"
                              min="1"
                              max="10"
                              value={selectedEdge.data.strokeWidth || 2}
                              onChange={(e) => {
                                setEdges((eds) =>
                                  eds.map((edge) =>
                                    edge.id === selectedEdge.id
                                      ? { ...edge, data: { ...edge.data, strokeWidth: Number(e.target.value) }, style: { ...edge.style, strokeWidth: Number(e.target.value) } }
                                      : edge
                                  )
                                );
                              }}
                              className="bg-background/50 border-white/20"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center text-muted-foreground text-sm">
                    Select a node or edge to view properties
                  </div>
                )}
              </TabsContent>

              <TabsContent value="comments" className="flex-1 p-4 space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-comment" className="text-xs">Add Comment</Label>
                    <div className="flex gap-2 mt-1">
                      <Textarea
                        id="new-comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Type your comment..."
                        className="bg-background/50 border-white/20 resize-none"
                        rows={2}
                      />
                      <Button size="sm" onClick={() => setNewComment('')}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold">Recent Comments</h4>
                    <div className="space-y-2">
                      <div className="p-2 rounded bg-background/20 text-xs">
                        <div className="font-medium">Sarah Wilson</div>
                        <div className="text-muted-foreground">Check demographic projection accuracy.</div>
                        <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};