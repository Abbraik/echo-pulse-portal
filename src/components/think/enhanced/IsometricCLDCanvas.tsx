import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Move, ZoomIn, ZoomOut, MousePointer, Plus, Undo, Redo } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';

interface Node {
  id: string;
  x: number;
  y: number;
  z: number;
  label: string;
  type: 'variable' | 'stock' | 'flow' | 'connector';
  connections: string[];
}

interface Tool {
  id: string;
  name: string;
  icon: React.ElementType;
  active: boolean;
}

interface IsometricCLDCanvasProps {
  nodes: Node[];
  onNodeUpdate: (nodes: Node[]) => void;
  onToolChange: (tool: string) => void;
}

const IsometricCLDCanvas: React.FC<IsometricCLDCanvasProps> = ({
  nodes,
  onNodeUpdate,
  onToolChange
}) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tools, setTools] = useState<Tool[]>([
    { id: 'select', name: 'Select', icon: MousePointer, active: true },
    { id: 'pan', name: 'Pan', icon: Move, active: false },
    { id: 'zoom', name: 'Zoom', icon: ZoomIn, active: false },
    { id: 'addNode', name: 'Add Node', icon: Plus, active: false }
  ]);
  
  const [camera, setCamera] = useState({
    x: 0,
    y: 0,
    zoom: 1,
    rotationY: 45,
    rotationX: 35
  });
  
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    lastX: number;
    lastY: number;
    draggedNode: string | null;
  }>({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    draggedNode: null
  });

  const [history, setHistory] = useState<Node[][]>([nodes]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Convert 3D coordinates to 2D isometric projection
  const project3DTo2D = (x: number, y: number, z: number) => {
    const angleY = (camera.rotationY * Math.PI) / 180;
    const angleX = (camera.rotationX * Math.PI) / 180;
    
    // Apply Y rotation
    const rotatedX = x * Math.cos(angleY) - z * Math.sin(angleY);
    const rotatedZ = x * Math.sin(angleY) + z * Math.cos(angleY);
    
    // Apply X rotation
    const finalY = y * Math.cos(angleX) - rotatedZ * Math.sin(angleX);
    
    return {
      x: (rotatedX * camera.zoom) + camera.x,
      y: (finalY * camera.zoom) + camera.y
    };
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up isometric background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
    gradient.addColorStop(1, 'rgba(30, 41, 59, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.1)';
    ctx.lineWidth = 1;
    
    const gridSize = 50;
    const centerX = width / 2 + camera.x;
    const centerY = height / 2 + camera.y;
    
    for (let i = -10; i <= 10; i++) {
      for (let j = -10; j <= 10; j++) {
        const gridPoint = project3DTo2D(i * gridSize, 0, j * gridSize);
        const x = centerX + gridPoint.x;
        const y = centerY + gridPoint.y;
        
        if (x >= 0 && x <= width && y >= 0 && y <= height) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }

    // Draw connections first (so they appear behind nodes)
    nodes.forEach(node => {
      node.connections.forEach(connectedId => {
        const connectedNode = nodes.find(n => n.id === connectedId);
        if (!connectedNode) return;

        const startPos = project3DTo2D(node.x, node.y, node.z);
        const endPos = project3DTo2D(connectedNode.x, connectedNode.y, connectedNode.z);
        
        const startX = centerX + startPos.x;
        const startY = centerY + startPos.y;
        const endX = centerX + endPos.x;
        const endY = centerY + endPos.y;

        // Draw connection line
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw arrow
        const angle = Math.atan2(endY - startY, endX - startX);
        const arrowLength = 10;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowLength * Math.cos(angle - Math.PI / 6),
          endY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowLength * Math.cos(angle + Math.PI / 6),
          endY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      });
    });

    // Draw nodes
    nodes.forEach(node => {
      const pos = project3DTo2D(node.x, node.y, node.z);
      const x = centerX + pos.x;
      const y = centerY + pos.y;

      if (x < -50 || x > width + 50 || y < -50 || y > height + 50) return;

      // Node shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(x + 3, y + 8, 20, 8, 0, 0, 2 * Math.PI);
      ctx.fill();

      // Node background
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 25);
      gradient.addColorStop(0, 'rgba(20, 184, 166, 0.8)');
      gradient.addColorStop(1, 'rgba(20, 184, 166, 0.4)');
      ctx.fillStyle = gradient;
      
      if (node.type === 'stock') {
        ctx.fillRect(x - 20, y - 15, 40, 30);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Node border
      ctx.strokeStyle = '#14b8a6';
      ctx.lineWidth = 2;
      if (node.type === 'stock') {
        ctx.strokeRect(x - 20, y - 15, 40, 30);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Node label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, x, y + 4);
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const activeTool = tools.find(t => t.active);
    if (!activeTool) return;

    if (activeTool.id === 'addNode') {
      // Add new node at click position
      const centerX = canvas.width / 2 + camera.x;
      const centerY = canvas.height / 2 + camera.y;
      
      const relativeX = (clickX - centerX) / camera.zoom;
      const relativeY = (clickY - centerY) / camera.zoom;
      
      const newNode: Node = {
        id: `node_${Date.now()}`,
        x: relativeX,
        y: relativeY,
        z: 0,
        label: `Node ${nodes.length + 1}`,
        type: 'variable',
        connections: []
      };

      const updatedNodes = [...nodes, newNode];
      onNodeUpdate(updatedNodes);
      
      // Add to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(updatedNodes);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDragState({
      isDragging: true,
      lastX: event.clientX,
      lastY: event.clientY,
      draggedNode: null
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragState.isDragging) return;

    const deltaX = event.clientX - dragState.lastX;
    const deltaY = event.clientY - dragState.lastY;

    const activeTool = tools.find(t => t.active);
    if (activeTool?.id === 'pan') {
      setCamera(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
    }

    setDragState(prev => ({
      ...prev,
      lastX: event.clientX,
      lastY: event.clientY
    }));
  };

  const handleMouseUp = () => {
    setDragState(prev => ({ ...prev, isDragging: false, draggedNode: null }));
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    setCamera(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(3, prev.zoom * zoomFactor))
    }));
  };

  const handleToolSelect = (toolId: string) => {
    setTools(prev => prev.map(tool => ({
      ...tool,
      active: tool.id === toolId
    })));
    onToolChange(toolId);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onNodeUpdate(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onNodeUpdate(history[historyIndex + 1]);
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [nodes, camera, tools]);

  return (
    <GlassCard className="p-6" variant="deep">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
          {t('isometricCLDCanvas')}
        </h3>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {tools.map(tool => (
              <Button
                key={tool.id}
                onClick={() => handleToolSelect(tool.id)}
                variant={tool.active ? "default" : "outline"}
                size="sm"
                className={tool.active ? "bg-teal-500/20 border-teal-500/50" : "border-white/20"}
              >
                <tool.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
          
          <div className="flex gap-1">
            <Button
              onClick={handleUndo}
              variant="outline"
              size="sm"
              disabled={historyIndex === 0}
              className="border-white/20"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleRedo}
              variant="outline"
              size="sm"
              disabled={historyIndex === history.length - 1}
              className="border-white/20"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-[500px] bg-black/20 rounded-xl border border-white/20 cursor-crosshair"
        />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-black/50 text-white">
            Zoom: {(camera.zoom * 100).toFixed(0)}%
          </Badge>
          <Badge variant="secondary" className="bg-black/50 text-white">
            Nodes: {nodes.length}
          </Badge>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <p><strong>Controls:</strong> Select tool from toolbar, click to add nodes, drag to move camera, scroll to zoom</p>
      </div>
    </GlassCard>
  );
};

export default IsometricCLDCanvas;