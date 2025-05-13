
import React, { useEffect } from 'react';
import CytoScape from 'react-cytoscapejs';
import { Actor } from '../types/sna-types';

interface NetworkViewProps {
  nodes: Actor[];
  edges: { source: string; target: string; weight: number }[];
  onNodeClick: (nodeId: string) => void;
  cyRef: React.MutableRefObject<any>;
}

const NetworkView: React.FC<NetworkViewProps> = ({ nodes, edges, onNodeClick, cyRef }) => {
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
      }
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

  function getNodeColor(type: string): string {
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
        'width': 'mapData(degree, 1, 10, 30, 80)',
        'height': 'mapData(degree, 1, 10, 30, 80)',
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
        'border-width': '1px',
        'border-color': '#ffffff',
        'border-opacity': 0.5
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 'mapData(weight, 0, 1, 1, 5)',
        'line-color': 'rgba(203, 213, 225, 0.7)',
        'curve-style': 'bezier'
      }
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': '3px',
        'border-color': '#ffffff',
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
      fit: true,
      padding: 30,
      concentric: function(node: any) {
        return node.data('degree');
      },
      levelWidth: function() { return 2; }
    }
  };

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      
      // Register event handlers
      cy.on('tap', 'node', handleCyNodeClick);
      
      // Use proper method for styling nodes on hover
      cy.on('mouseover', 'node', function(e: any) {
        e.target.style('border-width', '2px');
        e.target.style('border-color', '#fff');
      });
      
      cy.on('mouseout', 'node', function(e: any) {
        if (!e.target.selected()) {
          e.target.style('border-width', '1px');
        }
      });

      return () => {
        cy.removeListener('tap');
        cy.removeListener('mouseover');
        cy.removeListener('mouseout');
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
          cy.layout(cytoOptions.layout).run();
        }}
      />
    </div>
  );
};

export default NetworkView;
