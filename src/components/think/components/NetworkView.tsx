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
    ...nodes.map(node => ({
      data: {
        id: node.id,
        label: node.label,
        type: node.type,
        color: node.color || getNodeColor(node.type),
        degree: node.degree,
        betweenness: node.betweenness,
        closeness: node.closeness
      },
      position: {
        x: Math.random() * 500, // Random initial position if no position exists
        y: Math.random() * 400
      },
      // Add classes for selection and grabbing
      classes: []
    })),
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

  const cytoStyle = [
    {
      selector: 'node',
      style: {
        'width': 'mapData(degree, 1, 10, 30, 64)', // Min 24px, max 64px as requested
        'height': 'mapData(degree, 1, 10, 30, 64)',
        'background-color': isDarkMode ? 'rgba(42, 42, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        'background-opacity': 0.5,
        'background-blur': '8px',
        'shape': 'ellipse', // Perfect circle as requested
        'border-width': '2px',
        'border-color': 'data(color)',
        'border-opacity': 0.9,
        'ghost': 'yes',
        'ghost-opacity': 0.2,
        'ghost-offset-x': 0,
        'ghost-offset-y': 2,
        'box-shadow': '0px 4px 8px rgba(0, 0, 0, 0.1)',
        'label': 'data(label)',
        'color': isDarkMode ? '#F5F7FA' : '#1E1E1E',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '70px',
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
        'width': 'mapData(weight, 0, 1, 6, 12)', // Edge width proportional to weight, 6-12px
        'line-color': 'rgba(203, 213, 225, 0.3)', 
        'curve-style': 'bezier',
        'line-gradient-stop-colors': ['#3b82f6', '#14b8a6', '#3b82f6'], // Electric Blue → Teal → Electric Blue
        'line-gradient-stop-positions': [0, 50, 100],
        'opacity': 0.7,
        'overlay-color': 'rgba(203, 213, 225, 0.7)',
        'overlay-opacity': 0.1
      }
    },
    {
      selector: 'edge:hover',
      style: {
        'width': function(ele: any) {
          return Math.min(ele.data('weight') * 10 + 6, 14);
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
        'background-opacity': 0.7,
        'overlay-opacity': 0.3,
        'overlay-color': function(ele: any) {
          return ele.data('color');
        },
        'box-shadow': '0px 6px 10px rgba(0, 0, 0, 0.2)'
      }
    },
    {
      selector: '.pulse',
      style: {
        'width': 6,
        'height': 6,
        'background-color': '#FFFFFF',
        'border-width': 0,
        'opacity': 0.8
      }
    }
  ];

  const handleCyNodeClick = (e: any) => {
    const nodeId = e.target.id();
    onNodeClick(nodeId);
  };

  // Disable all automatic layout forces
  const cytoOptions = {
    layout: {
      name: 'preset',
      fit: false,
      padding: 30,
      animate: false,
      positions: function(node: any) {
        // Use the exact positions from node data
        return { x: node.position().x, y: node.position().y };
      }
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
          duration: 200
        });
      });
      
      cy.on('mouseout', 'node', function(e: any) {
        if (!e.target.selected()) {
          e.target.animate({
            style: { 'border-width': '2px', 'border-opacity': 0.9, 'overlay-opacity': 0 },
            duration: 200
          });
        }
      });
      
      // Edge hover animation
      cy.on('mouseover', 'edge', function(e: any) {
        e.target.animate({
          style: { 'opacity': 1, 'overlay-opacity': 0.2 },
          duration: 200
        });
      });
      
      cy.on('mouseout', 'edge', function(e: any) {
        e.target.animate({
          style: { 'opacity': 0.7, 'overlay-opacity': 0.1 },
          duration: 200
        });
      });

      // Setup flow pulses on edges
      const setupEdgePulses = () => {
        cy.edges().forEach((edge) => {
          const source = edge.source();
          const target = edge.target();
          
          setInterval(() => {
            if (!cy || cy.destroyed()) return;
            
            const pulseDot = cy.add({
              group: 'nodes',
              data: { id: `pulse-${Date.now()}-${Math.random()}` },
              position: source.position(),
              classes: 'pulse'
            });
            
            pulseDot.animate({
              position: target.position(),
              style: { 'opacity': 0 },
              duration: 1000,
              easing: 'ease-in-out',
              complete: function() {
                if (!cy || cy.destroyed()) return;
                cy.remove(pulseDot);
              }
            });
          }, 3000);
        });
      };
      
      // Start pulse animations
      setupEdgePulses();

      // This is crucial: save positions after node movement
      cy.on('dragfree', 'node', function(e: any) {
        const node = e.target;
        // Update the node's position data to maintain its position
        node.data('position', { x: node.position().x, y: node.position().y });
      });
      
      // Disable any automatic layout forces
      cy.userZoomingEnabled(true);
      cy.userPanningEnabled(true);
      cy.autoungrabify(false);
      cy.autopanOnDrag(true);

      return () => {
        cy.removeListener('tap');
        cy.removeListener('mouseover');
        cy.removeListener('mouseout');
        cy.removeListener('dragfree');
      };
    }
  }, []);

  return (
    <div className="w-full h-full">
      <CytoScape
        elements={cytoElements}
        style={{ width: '100%', height: '100%' }}
        stylesheet={cytoStyle}
        cy={(cy) => {
          cyRef.current = cy;
          cy.on('tap', 'node', handleCyNodeClick);
          
          // Completely disable auto layout
          cy.layout({
            name: 'preset',
            fit: false,
            animate: false
          }).run();
          
          // Set nodes to be draggable
          cy.nodes().grabify();
        }}
        userZoomingEnabled={true}
        userPanningEnabled={true}
      />
    </div>
  );
};

export default NetworkView;
