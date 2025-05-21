
import React, { useEffect } from 'react';
import CytoScape from 'react-cytoscapejs';
import { Actor } from '../types/sna-types';
import { useTheme } from '@/hooks/use-theme';

interface NetworkViewProps {
  nodes: Actor[];
  edges: { source: string; target: string; weight: number }[];
  onNodeClick: (nodeId: string) => void;
  cyRef: React.MutableRefObject<any>;
}

const NetworkView: React.FC<NetworkViewProps> = ({ nodes, edges, onNodeClick, cyRef }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

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
  
  // Calculate a deterministic position for nodes with layered stacking effect
  function calculateNodePosition(id: string, type: "government" | "private" | "ngo" | "academic") {
    // Use the node id's character codes to create a deterministic position within type groups
    let idSum = 0;
    for (let i = 0; i < id.length; i++) {
      idSum += id.charCodeAt(i);
    }
    
    // Base positioning adjustments to create a clustered, layered effect by node type
    let baseX = 250; // Center x
    let baseY = 200; // Center y
    
    // Organize nodes into distinct clusters by type
    const typeOffsets = {
      'government': { x: -80, y: -60 },
      'private': { x: 80, y: -60 },
      'ngo': { x: -80, y: 60 },
      'academic': { x: 80, y: 60 },
    };
    
    // Apply basic offset based on node type for clustering
    baseX += typeOffsets[type].x;
    baseY += typeOffsets[type].y;
    
    // Use idSum to create variance within each cluster (but not too much)
    // This creates a more organic, stacked appearance within each group
    const angleVariance = (idSum % 360) * Math.PI / 180; // Convert to radians
    const radiusVariance = 20 + (idSum % 30); // Small radius variance 
    
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
      animationDuration: 0,
      stop: function() {
        // After layout completes, ensure nodes are locked in place
        if (cyRef.current) {
          cyRef.current.nodes().lock();
        }
      }
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
      
      cy.on('mouseout', 'node', function(e: any) {
        if (!e.target.selected()) {
          e.target.style({
            'border-width': '2px', 
            'border-opacity': 0.9, 
            'overlay-opacity': 0,
            'z-index': e.target.data('zIndex') // Return to original z-index
          });
        }
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

      // Disable drag movement for stability
      cy.autoungrabify(true); // Prevent nodes from being moved

      // Configure user interaction - allow pan and zoom only
      cy.userZoomingEnabled(true);
      cy.userPanningEnabled(true);
      cy.autounselectify(false); // Still allow selection
      
      // Set strict zoom limits for stability
      cy.minZoom(0.5);
      cy.maxZoom(2.0);

      return () => {
        cy.removeListener('tap');
        cy.removeListener('mouseover');
        cy.removeListener('mouseout');
      };
    }
  }, [onNodeClick]);

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
          
          // Lock nodes in position
          cy.nodes().lock();
          
          // Fit the view to the elements with some padding
          cy.fit(undefined, 40);
          
          // Limit the zoom level to prevent extreme zooming
          cy.minZoom(0.5);
          cy.maxZoom(2.0);
        }}
        userZoomingEnabled={true}
        userPanningEnabled={true}
      />
    </div>
  );
};

export default NetworkView;
