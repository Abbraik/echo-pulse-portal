import React, { useEffect, useRef } from 'react';
import CytoScape from 'react-cytoscapejs';
import { Actor } from '../types/sna-types';
import { useTheme } from '@/hooks/use-theme';

interface NetworkViewProps {
  nodes: Actor[];
  edges: { source: string; target: string; weight: number }[];
  onNodeClick: (nodeId: string) => void;
  highlightedActors?: string[]; // Added this prop
  cyRef?: React.MutableRefObject<any>; // Made optional
}

const NetworkView: React.FC<NetworkViewProps> = ({ 
  nodes, 
  edges, 
  onNodeClick, 
  highlightedActors = [], // Default to empty array
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

  const cytoStyle = [
    {
      selector: 'node',
      style: {
        'width': 'mapData(degree, 1, 10, 30, 60)', 
        'height': 'mapData(degree, 1, 10, 30, 60)',
        'background-color': isDarkMode ? 'rgba(42, 42, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        'background-opacity': 0.7,
        'background-blur': '8px',
        'shape': 'ellipse',
        'border-width': '2px',
        'border-color': 'data(color)',
        'border-opacity': 0.9,
        'box-shadow': '0px 4px 8px rgba(0, 0, 0, 0.1)',
        'label': 'data(label)',
        'color': isDarkMode ? '#F5F7FA' : '#1E1E1E',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '80px',
        'font-size': '11px',
        'font-family': 'Inter, Noto Sans, sans-serif',
        'font-weight': 500,
        'text-outline-color': isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        'text-outline-width': '2px',
        'z-index': 'data(zIndex)' // Use the z-index for stacking nodes
      }
    },
    {
      selector: 'node:hover',
      style: {
        'border-width': '3px',
        'border-opacity': 1,
        'color': isDarkMode ? '#FFFFFF' : '#000000',
        'text-outline-opacity': 0.8,
        'overlay-opacity': 0.2,
        'overlay-color': 'data(color)',
        'z-index': 9999 // Bring hovered nodes to the front
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 'mapData(weight, 0, 1, 2, 6)', 
        'line-color': 'rgba(203, 213, 225, 0.5)', 
        'curve-style': 'bezier',
        'opacity': 0.6,
        'overlay-color': 'rgba(203, 213, 225, 0.7)',
        'overlay-opacity': 0.1
      }
    },
    {
      selector: 'edge:hover',
      style: {
        'width': function(ele: any) {
          return Math.min(ele.data('weight') * 8 + 2, 8);
        },
        'opacity': 1,
        'overlay-opacity': 0.2
      }
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': '4px',
        'border-color': function(ele: any) {
          return ele.data('color');
        },
        'border-opacity': 1,
        'background-opacity': 0.8,
        'overlay-opacity': 0.3,
        'overlay-color': function(ele: any) {
          return ele.data('color');
        },
        'box-shadow': '0px 6px 10px rgba(0, 0, 0, 0.2)',
        'z-index': 10000 // Always bring selected nodes to the absolute front
      }
    }
  ];

  const handleCyNodeClick = (e: any) => {
    const nodeId = e.target.id();
    onNodeClick(nodeId);
  };

  // Use a static preset layout with no animation
  const cytoOptions = {
    layout: {
      name: 'preset',
      fit: true,
      padding: 30,
      animate: false,
      animationDuration: 0
    }
  };

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      
      // Register event handlers
      cy.on('tap', 'node', handleCyNodeClick);
      
      // Remove animations for more stability
      cy.on('mouseover', 'node', function(e: any) {
        e.target.style({
          'border-width': '3px', 
          'border-opacity': 1, 
          'overlay-opacity': 0.1,
          'z-index': 9999 // Ensure the hovered node is on top
        });
      });
      
      // Edge hover - simplified with no animations
      cy.on('mouseover', 'edge', function(e: any) {
        e.target.style({
          'opacity': 1, 
          'overlay-opacity': 0.2
        });
      });
      
      cy.on('mouseout', 'edge', function(e: any) {
        e.target.style({
          'opacity': 0.6, 
          'overlay-opacity': 0.1
        });
      });

      // Highlight selected actors if provided
      if (highlightedActors && highlightedActors.length > 0) {
        // Reset all nodes to default style first
        cy.nodes().forEach((node: any) => {
          node.style({
            'border-width': '2px',
            'border-opacity': 0.9,
            'background-opacity': 0.7
          });
        });
        
        // Highlight the selected nodes
        highlightedActors.forEach(actorId => {
          const node = cy.getElementById(actorId);
          if (node) {
            node.style({
              'border-width': '4px',
              'border-color': node.data('color'),
              'border-opacity': 1,
              'background-opacity': 0.9,
              'z-index': 10000
            });
          }
        });
      }

      // Enable manual node movement but initially keep them fixed
      cy.autoungrabify(false); // Allow nodes to be moved manually

      // Configure user interaction - allow pan, zoom and dragging
      cy.userZoomingEnabled(true);
      cy.userPanningEnabled(true);
      cy.autounselectify(false); // Allow selection
      
      // Set strict zoom limits for stability
      cy.minZoom(0.5);
      cy.maxZoom(2.0);

      // Save node positions after manual movement
      cy.on('dragfree', 'node', function(e: any) {
        const node = e.target;
        node.data('positionX', node.position().x);
        node.data('positionY', node.position().y);
      });

      return () => {
        cy.removeListener('tap');
        cy.removeListener('mouseover');
        cy.removeListener('mouseout');
        cy.removeListener('dragfree');
      };
    }
  }, [onNodeClick, highlightedActors]); // Added highlightedActors dependency

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
          
          // Use preset layout with no animation for stability
          cy.layout({
            name: 'preset',
            fit: true,
            padding: 30,
            animate: false,
          }).run();
          
          // Don't lock nodes so they can be manually moved
          cy.nodes().ungrabify(); // Initially make nodes not draggable
          
          // Fit the view to the elements with some padding
          cy.fit(undefined, 40);
          
          // Limit the zoom level to prevent extreme zooming
          cy.minZoom(0.5);
          cy.maxZoom(2.0);
          
          // Make nodes manually draggable after a delay
          setTimeout(() => {
            cy.nodes().grabify(); // Allow manual movement after initial render
          }, 500);
        }}
        userZoomingEnabled={true}
        userPanningEnabled={true}
      />
    </div>
  );
};

export default NetworkView;
