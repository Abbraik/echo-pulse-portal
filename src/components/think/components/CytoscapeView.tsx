
import React, { useRef } from 'react';
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
        subIndicators: node.subIndicators
      },
      position: {
        x: node.position?.x || 0,
        y: node.position?.y || 0
      }
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
        'background-color': 'data(color)',
        'label': 'data(label)',
        'color': '#ffffff',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '70px',
        'font-size': '10px',
        'text-outline-color': '#000000',
        'text-outline-width': '1px',
        'border-width': '2px',
        'border-color': '#ffffff',
        'border-opacity': 0.5
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': (ele: any) => ele.data('type') === 'reinforcing' ? '#14B8A6' : 
                               ele.data('type') === 'balancing' ? '#F97316' : '#94A3B8',
        'target-arrow-color': (ele: any) => ele.data('type') === 'reinforcing' ? '#14B8A6' : 
                               ele.data('type') === 'balancing' ? '#F97316' : '#94A3B8',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'control-point-step-size': 40,
        'label': 'data(label)',
        'font-size': '12px',
        'color': '#ffffff',
        'text-outline-color': (ele: any) => ele.data('type') === 'reinforcing' ? '#14B8A6' : 
                               ele.data('type') === 'balancing' ? '#F97316' : '#94A3B8',
        'text-outline-width': '2px',
        'text-outline-opacity': 0.8,
        'text-background-opacity': 1,
        'text-background-shape': 'round-rectangle',
        'text-background-padding': '2px'
      }
    },
    {
      selector: 'node:hover',
      style: {
        'border-width': '3px',
        'border-color': '#14B8A6',
        'box-shadow': '0 0 15px #14B8A6'
      }
    }
  ];

  const handleCyNodeClick = (e: any) => {
    const nodeId = e.target.id();
    onNodeClick(nodeId);
  };

  const cytoOptions = {
    layout: {
      name: 'concentric',
      concentric: function(node: any) {
        return node.data('type') === 'stock' ? 2 : 1;
      },
      levelWidth: function() { return 1; }
    },
    style: cytoStyle
  };

  return (
    <div className="w-full h-full">
      <CytoScape
        elements={cytoElements}
        style={{ width: '100%', height: '100%' }}
        stylesheet={cytoStyle}
        cy={(cy) => {
          cyRef.current = cy;
          cy.on('tap', 'node', handleCyNodeClick);
          cy.layout(cytoOptions.layout).run();
        }}
      />
    </div>
  );
};

export default CytoscapeView;
