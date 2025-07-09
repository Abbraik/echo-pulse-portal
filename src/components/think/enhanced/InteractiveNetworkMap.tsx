import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

interface NetworkNode {
  id: string;
  label: string;
  type: 'government' | 'private' | 'ngo' | 'academic';
  degree: number;
  betweenness: number;
  closeness: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
}

interface InteractiveNetworkMapProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  onNodeClick: (nodeId: string) => void;
  highlightedNodes: string[];
}

const InteractiveNetworkMap: React.FC<InteractiveNetworkMapProps> = ({
  nodes,
  edges,
  onNodeClick,
  highlightedNodes
}) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: NetworkNode | null;
  }>({ visible: false, x: 0, y: 0, data: null });
  const [simulationNodes, setSimulationNodes] = useState<NetworkNode[]>([]);

  // Force-directed layout simulation
  useEffect(() => {
    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;

    // Initialize positions if not set
    const initializedNodes = nodes.map(node => ({
      ...node,
      x: node.x || centerX + (Math.random() - 0.5) * 400,
      y: node.y || centerY + (Math.random() - 0.5) * 300,
      vx: 0,
      vy: 0
    }));

    setSimulationNodes(initializedNodes);

    const simulate = () => {
      const alpha = 0.02;
      const linkStrength = 0.1;
      const chargeStrength = -300;
      const centerStrength = 0.05;

      setSimulationNodes(prevNodes => {
        const newNodes = [...prevNodes];

        // Apply forces
        newNodes.forEach(node => {
          // Center force
          const dx = centerX - (node.x || 0);
          const dy = centerY - (node.y || 0);
          node.vx = (node.vx || 0) + dx * centerStrength;
          node.vy = (node.vy || 0) + dy * centerStrength;

          // Charge force (repulsion)
          newNodes.forEach(other => {
            if (node.id === other.id) return;
            const dx = (node.x || 0) - (other.x || 0);
            const dy = (node.y || 0) - (other.y || 0);
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = chargeStrength / (distance * distance);
            node.vx = (node.vx || 0) + (dx / distance) * force;
            node.vy = (node.vy || 0) + (dy / distance) * force;
          });
        });

        // Link forces
        edges.forEach(edge => {
          const source = newNodes.find(n => n.id === edge.source);
          const target = newNodes.find(n => n.id === edge.target);
          if (!source || !target) return;

          const dx = (target.x || 0) - (source.x || 0);
          const dy = (target.y || 0) - (source.y || 0);
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDistance = 100 * edge.weight;
          const force = (distance - targetDistance) * linkStrength;

          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;

          source.vx = (source.vx || 0) + fx;
          source.vy = (source.vy || 0) + fy;
          target.vx = (target.vx || 0) - fx;
          target.vy = (target.vy || 0) - fy;
        });

        // Apply velocity and damping
        newNodes.forEach(node => {
          node.vx = (node.vx || 0) * 0.9;
          node.vy = (node.vy || 0) * 0.9;
          node.x = (node.x || 0) + (node.vx || 0);
          node.y = (node.y || 0) + (node.vy || 0);

          // Boundary constraints
          node.x = Math.max(30, Math.min(width - 30, node.x));
          node.y = Math.max(30, Math.min(height - 30, node.y));
        });

        return newNodes;
      });

      animationRef.current = requestAnimationFrame(simulate);
    };

    simulate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, edges]);

  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
    gradient.addColorStop(1, 'rgba(30, 41, 59, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw edges
    edges.forEach(edge => {
      const source = simulationNodes.find(n => n.id === edge.source);
      const target = simulationNodes.find(n => n.id === edge.target);
      if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;

      const isHighlighted = highlightedNodes.includes(source.id) || highlightedNodes.includes(target.id);
      
      ctx.strokeStyle = isHighlighted 
        ? `rgba(20, 184, 166, ${0.8 * edge.weight})`
        : `rgba(255, 255, 255, ${0.3 * edge.weight})`;
      ctx.lineWidth = isHighlighted ? 3 : 1 + edge.weight * 2;
      
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
    });

    // Draw nodes
    simulationNodes.forEach(node => {
      if (!node.x || !node.y) return;

      const isHighlighted = highlightedNodes.includes(node.id);
      const radius = 8 + node.degree * 2;

      // Node shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(node.x + 2, node.y + 2, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Node background
      const typeColors = {
        government: '#3b82f6',
        private: '#10b981',
        ngo: '#8b5cf6',
        academic: '#f59e0b'
      };

      const color = typeColors[node.type];
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
      gradient.addColorStop(0, isHighlighted ? color : `${color}CC`);
      gradient.addColorStop(1, isHighlighted ? `${color}80` : `${color}60`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Node border
      ctx.strokeStyle = isHighlighted ? '#14b8a6' : color;
      ctx.lineWidth = isHighlighted ? 3 : 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.stroke();

      // Centrality indicator (inner circle)
      const centralityRadius = radius * node.betweenness;
      if (centralityRadius > 2) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, centralityRadius, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Draw labels for highlighted nodes
    highlightedNodes.forEach(nodeId => {
      const node = simulationNodes.find(n => n.id === nodeId);
      if (!node || !node.x || !node.y) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(node.x - 40, node.y - 35, 80, 20);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y - 20);
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked node
    const clickedNode = simulationNodes.find(node => {
      if (!node.x || !node.y) return false;
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      const radius = 8 + node.degree * 2;
      return distance <= radius;
    });

    if (clickedNode) {
      onNodeClick(clickedNode.id);
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find hovered node
    const hoveredNode = simulationNodes.find(node => {
      if (!node.x || !node.y) return false;
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      const radius = 8 + node.degree * 2;
      return distance <= radius;
    });

    if (hoveredNode) {
      setTooltip({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        data: hoveredNode
      });
    } else {
      setTooltip(prev => ({ ...prev, visible: false }));
    }
  };

  const exportCSV = () => {
    const csvContent = [
      'ID,Label,Type,Degree,Betweenness,Closeness',
      ...nodes.map(node => 
        `${node.id},${node.label},${node.type},${node.degree},${node.betweenness.toFixed(3)},${node.closeness.toFixed(3)}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network_analysis.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: t('dataExported'),
      description: t('networkDataDownloaded'),
      duration: 3000,
    });
  };

  useEffect(() => {
    drawNetwork();
  }, [simulationNodes, highlightedNodes]);

  return (
    <GlassCard className="p-6" variant="deep">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-500">
            {t('interactiveNetworkMap')}
          </h3>
          <Badge variant="secondary" className="ml-3 bg-purple-500/20 text-purple-400">
            {nodes.length} {t('actors')}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="border-white/20">
                  <Filter className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('filterNetwork')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            onClick={exportCSV}
            variant="outline"
            size="sm"
            className="border-white/20"
          >
            <Download className="w-4 h-4 mr-2" />
            {t('exportCSV')}
          </Button>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
          className="w-full h-[500px] bg-black/20 rounded-xl border border-white/20 cursor-pointer"
        />

        {/* Floating tooltip */}
        {tooltip.visible && tooltip.data && (
          <div
            className="fixed z-50 p-3 glass-panel-deep rounded-lg border border-white/20 pointer-events-none"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
              transform: 'translate(0, -100%)'
            }}
          >
            <div className="text-sm font-medium text-white">{tooltip.data.label}</div>
            <div className="text-xs text-gray-400 capitalize">{tooltip.data.type}</div>
            <div className="flex gap-4 mt-2 text-xs">
              <span>Degree: <strong>{tooltip.data.degree}</strong></span>
              <span>Betweenness: <strong>{tooltip.data.betweenness.toFixed(2)}</strong></span>
              <span>Closeness: <strong>{tooltip.data.closeness.toFixed(2)}</strong></span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
        <span>{t('clickNodeForDetails')}</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>{t('government')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>{t('private')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>{t('ngo')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>{t('academic')}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default InteractiveNetworkMap;