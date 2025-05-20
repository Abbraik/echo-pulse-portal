
import React, { useRef, useEffect } from 'react';
import CytoScape from 'react-cytoscapejs';
import { Node, Edge } from '../types/system-framing-types';
import { useTheme } from '@/hooks/use-theme';

interface CytoscapeViewProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick: (nodeId: string) => void;
  cyRef: React.MutableRefObject<any>;
}

const CytoscapeView: React.FC<CytoscapeViewProps> = ({ nodes, edges, onNodeClick, cyRef }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  // Convert nodes and edges to cytoscape format
  const cytoElements = [
    ...nodes.map(node => ({
      data: {
        id: node.id,
        label: node.label,
        type: node.type,
        color: node.color,
        subIndicators: node.subIndicators
      },
      position: {
        x: node.position?.x || 0,
        y: node.position?.y || 0
      },
      classes: []
    })),
    ...edges.map(edge => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        label: edge.label
      }
    }))
  ];

  const cytoStyle = [
    {
      selector: 'node',
      style: {
        'width': 80,
        'height': 80,
        'background-color': isDarkMode ? 'rgba(42, 42, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        'background-opacity': 0.5,
        'background-blur': '8px',
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
        'border-width': '2px',
        'border-color': 'data(color)',
        'border-opacity': 0.9,
        'border-style': 'solid',
        'box-shadow': '0px 4px 8px rgba(0, 0, 0, 0.1)',
        'shape': 'roundrectangle',
        'border-radius': '12px',
        'ghost': 'yes',
        'ghost-opacity': 0.2,
        'ghost-offset-x': 0,
        'ghost-offset-y': 2
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
        'width': 6,
        'curve-style': 'bezier',
        'line-color': 'mapData(type, "reinforcing", "balancing", "#14B8A6", "#F97316")',
        'line-opacity': 0.3,
        'target-arrow-color': 'mapData(type, "reinforcing", "balancing", "#14B8A6", "#F97316")',
        'target-arrow-shape': 'triangle',
        'target-arrow-opacity': 0.5,
        'control-point-step-size': 40,
        'label': 'data(label)',
        'font-size': '10px',
        'font-family': 'Inter, sans-serif',
        'color': isDarkMode ? '#F5F7FA' : '#1E1E1E',
        'text-outline-color': isDarkMode ? '#1E293B' : '#FFFFFF',
        'text-outline-width': '2px',
        'text-outline-opacity': 0.8,
        'text-background-opacity': 0.7,
        'text-background-color': isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        'text-background-shape': 'roundrectangle',
        'text-background-padding': '3px',
        'arrow-scale': 1.2
      }
    },
    {
      selector: 'edge:hover',
      style: {
        'line-opacity': 0.8,
        'width': 8,
        'target-arrow-opacity': 0.8,
        'overlay-opacity': 0.1,
        'overlay-color': 'data(color)'
      }
    },
    {
      selector: 'edge.reinforcing',
      style: {
        'line-color': '#14B8A6',
        'target-arrow-color': '#14B8A6'
      }
    },
    {
      selector: 'edge.balancing',
      style: {
        'line-color': '#F97316',
        'target-arrow-color': '#F97316'
      }
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': '4px',
        'border-color': '#14B8A6',
        'border-opacity': 1,
        'background-opacity': 0.7,
        'overlay-opacity': 0.2,
        'overlay-color': '#14B8A6',
        'box-shadow': '0px 6px 10px rgba(20, 184, 166, 0.3)'
      }
    },
    {
      selector: '.pulse',
      style: {
        'overlay-opacity': 0,
        'overlay-color': '#14B8A6'
      }
    }
  ];

  const handleCyNodeClick = (e: any) => {
    const nodeId = e.target.id();
    onNodeClick(nodeId);
  };

  // Completely disable any auto layout
  const cytoOptions = {
    layout: {
      name: 'preset',
      fit: false, // Don't adjust zoom to fit all elements
      padding: 30,
      animate: false, // Don't animate when adding new nodes
      positions: function(node: any) {
        // Use the exact positions from node data
        return { x: node.position().x, y: node.position().y };
      }
    },
    style: cytoStyle
  };

  // Add animation effects through Cytoscape
  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      
      // Add hover animations
      cy.on('mouseover', 'node', function(e: any) {
        e.target.animate({
          style: { 'border-opacity': 1, 'overlay-opacity': 0.1 },
          duration: 200
        });
      });
      
      cy.on('mouseout', 'node', function(e: any) {
        if (!e.target.selected()) {
          e.target.animate({
            style: { 'border-opacity': 0.9, 'overlay-opacity': 0 },
            duration: 200
          });
        }
      });
      
      // Edge hover effect
      cy.on('mouseover', 'edge', function(e: any) {
        e.target.animate({
          style: { 'line-opacity': 0.8, 'width': 8 },
          duration: 200
        });
      });
      
      cy.on('mouseout', 'edge', function(e: any) {
        e.target.animate({
          style: { 'line-opacity': 0.3, 'width': 6 },
          duration: 200
        });
      });
      
      // Setup pulse animation
      const setupPulseAnimation = () => {
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
      setupPulseAnimation();
      
      // This is crucial: save positions after node movement
      cy.on('dragfree', 'node', function(e: any) {
        const node = e.target;
        // Update the node's position data to maintain its position
        node.data('position', { x: node.position().x, y: node.position().y });
      });
      
      // Disable any automatic layout forces
      cy.userZoomingEnabled(true);
      cy.userPanningEnabled(true);
      cy.autoungrabify(false); // Allow users to grab nodes
      // Removed: cy.autopanOnDrag(true) - This function doesn't exist in the current Cytoscape version
      
      return () => {
        cy.off('mouseover');
        cy.off('mouseout');
        cy.off('dragfree');
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

export default CytoscapeView;
