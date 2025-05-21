
import React, { useEffect } from 'react';
import CytoScape from 'react-cytoscapejs';
import { Node, Edge } from '../types/system-framing-types';

interface CytoscapeViewProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick: (nodeId: string) => void;
  cyRef: React.MutableRefObject<any>;
}

const CytoscapeView: React.FC<CytoscapeViewProps> = ({ nodes, edges, onNodeClick, cyRef }) => {
  // Convert nodes and edges to cytoscape format
  const cytoElements = [
    ...nodes.map(node => ({
      data: {
        id: node.id,
        label: node.label,
        type: node.type,
        color: node.color,
        subIndicators: node.subIndicators,
        // Ensure positions are preserved in data
        positionX: node.position ? node.position.x : 100 + Math.floor(nodes.indexOf(node) / 2) * 200,
        positionY: node.position ? node.position.y : 100 + (nodes.indexOf(node) % 2) * 200
      },
      position: {
        x: node.position ? node.position.x : 100 + Math.floor(nodes.indexOf(node) / 2) * 200,
        y: node.position ? node.position.y : 100 + (nodes.indexOf(node) % 2) * 200
      },
      classes: [node.type]
    })),
    ...edges.map(edge => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: edge.type
      },
      classes: [edge.type]
    }))
  ];

  // Define style for the cytoscape elements
  const cytoStyle = [
    {
      selector: 'node',
      style: {
        'width': 120,
        'height': 120,
        'background-color': 'data(color)',
        'background-opacity': 0.2,
        'border-width': 2,
        'border-color': 'data(color)',
        'border-opacity': 0.8,
        'label': 'data(label)',
        'color': '#ffffff',
        'text-outline-color': '#222222',
        'text-outline-width': 2,
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '100px',
        'font-size': '12px'
      }
    },
    {
      selector: 'node.stock',
      style: {
        'shape': 'round-rectangle',
        'border-style': 'solid'
      }
    },
    {
      selector: 'node.subIndicator',
      style: {
        'shape': 'ellipse',
        'border-style': 'dashed'
      }
    },
    {
      selector: 'node.auxiliary',
      style: {
        'shape': 'diamond',
        'border-style': 'dotted'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'line-color': '#9BA1A6',
        'target-arrow-color': '#9BA1A6',
        'label': 'data(label)',
        'font-size': '12px',
        'color': '#ffffff',
        'text-outline-color': '#222222',
        'text-outline-width': 2,
        'text-background-opacity': 0.5,
        'text-background-color': '#222222'
      }
    },
    {
      selector: 'edge.reinforcing',
      style: {
        'line-color': '#3b82f6',
        'target-arrow-color': '#3b82f6',
        'line-style': 'solid'
      }
    },
    {
      selector: 'edge.balancing',
      style: {
        'line-color': '#ef4444',
        'target-arrow-color': '#ef4444', 
        'line-style': 'dashed'
      }
    },
    {
      selector: 'edge.auxiliary',
      style: {
        'line-color': '#a855f7',
        'target-arrow-color': '#a855f7',
        'line-style': 'dotted',
        'target-arrow-shape': 'none'
      }
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': 4,
        'border-color': '#ffffff',
        'border-opacity': 1
      }
    },
    {
      selector: 'node:active',
      style: {
        'overlay-color': '#ffffff',
        'overlay-opacity': 0.2
      }
    }
  ];

  const handleCyNodeClick = (e: any) => {
    const nodeId = e.target.id();
    onNodeClick(nodeId);
  };

  // Use a more stable grid-based layout
  const cytoOptions = {
    layout: {
      name: 'preset',
      fit: true,
      padding: 50
    }
  };

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      
      // Register event handlers
      cy.on('tap', 'node', handleCyNodeClick);
      
      // Save positions after node movement
      cy.on('dragfree', 'node', function(e: any) {
        const node = e.target;
        node.data('positionX', node.position().x);
        node.data('positionY', node.position().y);
      });

      // Add hover effects
      cy.on('mouseover', 'node', function(e: any) {
        e.target.animate({
          style: { 
            'border-width': '3px',
            'border-opacity': 1,
            'background-opacity': 0.3
          },
          duration: 150
        });
      });
      
      cy.on('mouseout', 'node', function(e: any) {
        if (!e.target.selected()) {
          e.target.animate({
            style: { 
              'border-width': '2px',
              'border-opacity': 0.8,
              'background-opacity': 0.2
            },
            duration: 150
          });
        }
      });

      // Make interaction smoother
      cy.userZoomingEnabled(true);
      cy.userPanningEnabled(true);
      cy.autoungrabify(false); // Allow nodes to be grabbed
      cy.autounselectify(false); // Allow nodes to be selected
      
      // Set zoom constraints
      cy.minZoom(0.4);
      cy.maxZoom(2.0);

      // Add damping to movement
      cy.nodes().on('drag', function() {
        const draggedNode = this;
        // Add damping factor for smoother movement
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
        cy.removeListener('dragfree');
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
          cy.on('tap', 'node', handleCyNodeClick);
          
          // Use preset layout to maintain positions
          cy.layout({
            name: 'preset',
            fit: true,
            padding: 50,
            animate: false
          }).run();
          
          // Make nodes draggable
          cy.nodes().grabify();
          
          // Fit the view with padding
          cy.fit(undefined, 40);
        }}
        userZoomingEnabled={true}
        userPanningEnabled={true}
      />
    </div>
  );
};

export default CytoscapeView;
