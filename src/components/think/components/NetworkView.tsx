
import React, { useEffect, useRef } from 'react';
import CytoScape from 'react-cytoscapejs';
import { Actor } from '../types/sna-types';
import { useTheme } from '@/hooks/use-theme';

interface NetworkViewProps {
  nodes: Actor[];
  edges: { source: string; target: string; weight: number }[];
  onNodeClick: (nodeId: string) => void;
  onNodeHover?: (event: any) => void;
  onEdgeHover?: (event: any) => void;
  onMouseOut?: () => void;
  highlightedActors: string[];
  cyRef?: React.MutableRefObject<any>;
}

const NetworkView: React.FC<NetworkViewProps> = ({ 
  nodes, 
  edges, 
  onNodeClick, 
  onNodeHover,
  onEdgeHover,
  onMouseOut,
  highlightedActors = [], 
  cyRef: externalCyRef 
}) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const internalCyRef = useRef<any>(null);
  
  // Use external ref if provided, otherwise use internal
  const cyRef = externalCyRef || internalCyRef;

  // Convert nodes and edges to cytoscape format
  const cytoElements = [
    ...nodes.map(node => {
      // Use new deterministic layered position calculation
      const position = calculateNodePosition(node.id, node.type);
      
      return {
        data: {
          id: node.id,
          label: node.label,
          type: node.type,
          color: node.color || getNodeColor(node.type),
          degree: node.degree,
          betweenness: node.betweenness,
          closeness: node.closeness,
          // Store position data to maintain consistency
          positionX: position.x,
          positionY: position.y,
          // Add z-index related to degree (more connected nodes on top)
          zIndex: node.degree || 1
        },
        position: position,
        // Add classes for selection and grabbing
        classes: []
      };
    }),
    ...edges.map((edge, index) => ({
      data: {
        id: `e${index}`,
        source: edge.source,
        target: edge.target,
        weight: edge.weight
      }
    }))
  ];

  function getNodeColor(type: "government" | "private" | "ngo" | "academic"): string {
    switch (type) {
      case 'government':
        return '#14b8a6'; // teal-500
      case 'private':
        return '#3b82f6'; // blue-500
      case 'ngo':
        return '#a855f7'; // purple-500
      case 'academic':
        return '#f59e0b'; // amber-500
      default:
        return '#64748b'; // slate-500
    }
  }
  
  // Calculate a deterministic position for nodes with better spacing to avoid stacking
  function calculateNodePosition(id: string, type: "government" | "private" | "ngo" | "academic") {
    // Use the node id's character codes to create a deterministic position within type groups
    let idSum = 0;
    for (let i = 0; i < id.length; i++) {
      idSum += id.charCodeAt(i);
    }
    
    // Base positioning adjustments for wider spacing
    let baseX = 300; // Increased center x
    let baseY = 250; // Increased center y
    
    // Organize nodes into distinct clusters by type with more spacing
    const typeOffsets = {
      'government': { x: -120, y: -100 },
      'private': { x: 120, y: -100 },
      'ngo': { x: -120, y: 100 },
      'academic': { x: 120, y: 100 },
    };
    
    // Apply basic offset based on node type for clustering
    baseX += typeOffsets[type].x;
    baseY += typeOffsets[type].y;
    
    // Use idSum to create variance within each cluster (with more spacing)
    // This prevents nodes from stacking directly on top of each other
    const angleVariance = (idSum % 360) * Math.PI / 180; // Convert to radians
    const radiusVariance = 40 + (idSum % 50); // Increased radius variance for better distribution
    
    return {
      x: baseX + Math.cos(angleVariance) * radiusVariance,
      y: baseY + Math.sin(angleVariance) * radiusVariance
    };
  }

  // Enhanced glass-like styling for nodes and edges
  const cytoStyle = [
    {
      selector: 'node',
      style: {
        // Glass node style with gradient border
        'width': 'mapData(degree, 1, 10, 40, 70)', 
        'height': 'mapData(degree, 1, 10, 40, 70)',
        'background-color': isDarkMode ? 'rgba(42, 42, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        'background-opacity': 0.7,
        'background-blur': '8px',
        'shape': 'ellipse',
        'border-width': '3px',
        'border-color': 'data(color)',
        'border-opacity': 0.9,
        'box-shadow': '0px 0px 15px rgba(255, 255, 255, 0.15)',
        // Text handling - only show on hover
        'text-opacity': 0,
        'label': 'data(label)',
        'color': isDarkMode ? '#FFFFFF' : '#000000',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '80px',
        'font-size': '12px',
        'font-family': 'Inter, Noto Sans, sans-serif',
        'font-weight': 600,
        'text-outline-color': isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        'text-outline-width': '2px',
        'z-index': 'data(zIndex)' // Use the z-index for stacking nodes
      }
    },
    {
      // Show labels on hover
      selector: 'node:hover',
      style: {
        'text-opacity': 1,
        'border-width': '4px',
        'border-color': 'data(color)',
        'border-opacity': 1,
        'background-opacity': 0.8,
        'box-shadow': '0px 0px 20px rgba(255, 255, 255, 0.3)',
        'z-index': 9999 // Bring hovered nodes to the front
      }
    },
    {
      // Glassy edges with improved styling
      selector: 'edge',
      style: {
        'width': 'mapData(weight, 0, 1, 2, 7)', 
        'line-color': isDarkMode ? 'rgba(180, 190, 210, 0.4)' : 'rgba(100, 120, 150, 0.3)', 
        'line-gradient-stop-colors': function(ele: any) {
          const weight = ele.data('weight');
          const opacity = 0.3 + weight * 0.5;
          return isDarkMode 
            ? [`rgba(180, 190, 210, ${opacity})`, `rgba(140, 160, 190, ${opacity})`]
            : [`rgba(100, 120, 150, ${opacity})`, `rgba(80, 100, 140, ${opacity})`];
        },
        'line-gradient-stop-positions': [0, 100],
        'curve-style': 'bezier',
        'opacity': 0.7,
        'target-arrow-shape': 'none',
        'arrow-scale': 0.8
      }
    },
    {
      selector: 'edge:hover',
      style: {
        'width': function(ele: any) {
          return Math.min(ele.data('weight') * 10 + 2, 12);
        },
        'opacity': 1,
        'line-color': isDarkMode ? 'rgba(220, 230, 240, 0.7)' : 'rgba(80, 100, 140, 0.7)',
        'z-index': 999
      }
    },
    {
      // Special styling for highlighted/selected nodes
      selector: 'node:selected, node.highlighted',
      style: {
        'text-opacity': 1,
        'border-width': '5px',
        'border-color': function(ele: any) {
          return ele.data('color');
        },
        'border-opacity': 1,
        'background-opacity': 0.85,
        'background-color': function(ele: any) {
          const color = ele.data('color');
          return isDarkMode 
            ? `rgba(42, 42, 42, 0.85)`
            : `rgba(255, 255, 255, 0.85)`;
        },
        'box-shadow': '0px 0px 25px rgba(255, 255, 255, 0.4)',
        'z-index': 10000 // Always bring selected nodes to the absolute front
      }
    },
    {
      // Connected edges get highlighted when their nodes are selected
      selector: 'node:selected ~ edge, edge[source = "highlighted"], edge[target = "highlighted"]',
      style: {
        'line-color': isDarkMode ? 'rgba(220, 230, 255, 0.85)' : 'rgba(100, 120, 180, 0.85)',
        'opacity': 1,
        'width': function(ele: any) {
          return Math.min(ele.data('weight') * 8 + 3, 10);
        },
        'z-index': 999
      }
    }
  ];

  const handleCyNodeClick = (e: any) => {
    const nodeId = e.target.id();
    onNodeClick(nodeId);
  };

  // Use a preset layout with smooth transitions
  const cytoOptions = {
    layout: {
      name: 'preset',
      fit: true,
      padding: 40,
      animate: true,
      animationDuration: 500,
      animationEasing: 'ease-out'
    }
  };

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      
      // Register event handlers
      cy.on('tap', 'node', handleCyNodeClick);
      
      // Register hover handlers if provided
      if (onNodeHover) {
        cy.on('mouseover', 'node', onNodeHover);
      }
      
      if (onEdgeHover) {
        cy.on('mouseover', 'edge', onEdgeHover);
      }
      
      if (onMouseOut) {
        cy.on('mouseout', 'node', onMouseOut);
        cy.on('mouseout', 'edge', onMouseOut);
      }

      // Highlight selected actors
      if (highlightedActors && highlightedActors.length > 0) {
        // Reset all nodes and edges to default style
        cy.elements().removeClass('highlighted');
        
        // Highlight the selected nodes
        highlightedActors.forEach(actorId => {
          const node = cy.getElementById(actorId);
          if (node) {
            node.addClass('highlighted');
            
            // Also highlight connected edges
            node.connectedEdges().addClass('highlighted');
          }
        });
      }

      // Enable smooth zooming
      cy.userZoomingEnabled(true);
      cy.userPanningEnabled(true);
      cy.zoomingEnabled(true);
      cy.boxSelectionEnabled(false);
      cy.autounselectify(false);
      
      // Set stricter zoom limits for better control
      cy.minZoom(0.4);
      cy.maxZoom(2.5);
      
      // Add double-click to center handler
      cy.on('dbltap', 'node', function(e: any) {
        cy.animate({
          center: { eles: e.target },
          zoom: 1.5,
          duration: 500
        });
        e.preventDefault();
      });
      
      // Double click on background to reset view
      cy.on('dbltap', function(e: any) {
        if (e.target === cy) {
          cy.animate({
            fit: {
              eles: cy.elements(),
              padding: 50
            },
            duration: 500
          });
        }
      });

      return () => {
        cy.removeListener('tap');
        cy.removeListener('mouseover');
        cy.removeListener('mouseout');
        cy.removeListener('dbltap');
      };
    }
  }, [onNodeClick, highlightedActors, onNodeHover, onEdgeHover, onMouseOut]);

  return (
    <div className="w-full h-full">
      <CytoScape
        elements={cytoElements}
        style={{ width: '100%', height: '100%' }}
        stylesheet={cytoStyle}
        cy={(cy) => {
          cyRef.current = cy;
          
          // Configure the initial rendering
          cy.on('tap', 'node', handleCyNodeClick);
          
          // Register hover handlers
          if (onNodeHover) {
            cy.on('mouseover', 'node', onNodeHover);
          }
          
          if (onEdgeHover) {
            cy.on('mouseover', 'edge', onEdgeHover);
          }
          
          if (onMouseOut) {
            cy.on('mouseout', 'node', onMouseOut);
            cy.on('mouseout', 'edge', onMouseOut);
          }
          
          // Add double-tap gesture recognition
          cy.on('dbltap', 'node', function(e: any) {
            cy.animate({
              center: { eles: e.target },
              zoom: 1.5,
              duration: 500
            });
          });
          
          // Use preset layout with animation
          cy.layout({
            name: 'preset',
            fit: true,
            padding: 40,
            animate: true,
            animationDuration: 500,
            animationEasing: 'ease-out'
          }).run();
          
          // Configure user interaction
          cy.userZoomingEnabled(true);
          cy.userPanningEnabled(true);
          
          // Limit the zoom level
          cy.minZoom(0.4);
          cy.maxZoom(2.5);
          
          // Make all nodes manually draggable
          cy.nodes().grabify();
          
          // Initial fit to view
          cy.fit(undefined, 40);
        }}
        wheelSensitivity={0.3}
      />
    </div>
  );
};

export default NetworkView;
