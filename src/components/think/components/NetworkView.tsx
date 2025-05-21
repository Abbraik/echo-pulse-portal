
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
      // Determine position - either use existing position or calculate in a grid/circle
      const position = node.position || calculateNodePosition(node.id, nodes.length);
      
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
          positionY: position.y
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
  
  // Calculate a deterministic position for a node based on its index
  function calculateNodePosition(id: string, totalNodes: number) {
    // Use the node id's character codes to create a deterministic position
    // This ensures nodes will always be positioned the same way
    let idSum = 0;
    for (let i = 0; i < id.length; i++) {
      idSum += id.charCodeAt(i);
    }
    
    // Create a circular layout
    const radius = 150;
    const index = idSum % totalNodes; // Get a consistent index
    const angleStep = (2 * Math.PI) / totalNodes;
    const angle = index * angleStep;
    
    return {
      x: Math.cos(angle) * radius + 250, // Center x = 250
      y: Math.sin(angle) * radius + 200  // Center y = 200
    };
  }

  const cytoStyle = [
    {
      selector: 'node',
      style: {
        'width': 'mapData(degree, 1, 10, 30, 60)', // Slightly reduced size range for less chaos
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
        'overlay-color': 'data(color)'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 'mapData(weight, 0, 1, 2, 6)', // Thinner edges for less visual chaos
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
          return Math.min(ele.data('weight') * 8 + 2, 8); // More moderate hover effect
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
        'box-shadow': '0px 6px 10px rgba(0, 0, 0, 0.2)'
      }
    }
  ];

  const handleCyNodeClick = (e: any) => {
    const nodeId = e.target.id();
    onNodeClick(nodeId);
  };

  // Use a more static layout with reduced forces for stability
  const cytoOptions = {
    layout: {
      name: 'preset', // Use preset layout to maintain positions
      fit: true,
      padding: 30
    }
  };

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      
      // Register event handlers
      cy.on('tap', 'node', handleCyNodeClick);
      
      // Use proper method for styling nodes on hover
      cy.on('mouseover', 'node', function(e: any) {
        e.target.animate({
          style: { 'border-width': '3px', 'border-opacity': 1, 'overlay-opacity': 0.1 },
          duration: 150
        });
      });
      
      cy.on('mouseout', 'node', function(e: any) {
        if (!e.target.selected()) {
          e.target.animate({
            style: { 'border-width': '2px', 'border-opacity': 0.9, 'overlay-opacity': 0 },
            duration: 150
          });
        }
      });
      
      // Edge hover animation
      cy.on('mouseover', 'edge', function(e: any) {
        e.target.animate({
          style: { 'opacity': 1, 'overlay-opacity': 0.2 },
          duration: 150
        });
      });
      
      cy.on('mouseout', 'edge', function(e: any) {
        e.target.animate({
          style: { 'opacity': 0.6, 'overlay-opacity': 0.1 },
          duration: 150
        });
      });

      // Removed the flow pulses on edges which were causing visual chaos

      // This is crucial: save positions after node movement
      cy.on('dragfree', 'node', function(e: any) {
        const node = e.target;
        // Update the node's position data to maintain its position
        node.data('positionX', node.position().x);
        node.data('positionY', node.position().y);
      });
      
      // Configure user interaction
      cy.userZoomingEnabled(true);
      cy.userPanningEnabled(true);
      cy.autoungrabify(false); // Allow nodes to be grabbed
      cy.autounselectify(false); // Allow nodes to be selected
      
      // Add resistance to node movements to make dragging feel more stable
      cy.nodes().on('drag', function() {
        const draggedNode = this;
        // Add damping/resistance factor to make movement more controlled
        const dampingFactor = 0.8;
        const dx = (draggedNode.position().x - draggedNode.data('positionX')) * dampingFactor;
        const dy = (draggedNode.position().y - draggedNode.data('positionY')) * dampingFactor;
        
        draggedNode.position({
          x: draggedNode.data('positionX') + dx,
          y: draggedNode.data('positionY') + dy
        });
      });

      return () => {
        cy.removeListener('tap');
        cy.removeListener('mouseover');
        cy.removeListener('mouseout');
        cy.removeListener('dragfree');
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
          
          // Use preset layout to maintain node positions
          cy.layout({
            name: 'preset',
            fit: true,
            padding: 30,
            animate: false,
          }).run();
          
          // Make nodes draggable
          cy.nodes().grabify();
          
          // Fit the view to the elements with some padding
          cy.fit(undefined, 40);
          
          // Limit the zoom level to prevent extreme zooming
          cy.minZoom(0.5);
          cy.maxZoom(2.5);
        }}
        userZoomingEnabled={true}
        userPanningEnabled={true}
      />
    </div>
  );
};

export default NetworkView;
