
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useRef } from 'react';
import CytoScape from 'react-cytoscapejs';
import { useTranslation } from '@/hooks/use-translation';

interface KnowledgeGraphProps {
  searchQuery?: string;
  nodeTypeFilter?: string | null;
}

interface GraphNode {
  id: string;
  label: string;
  type: 'lesson' | 'playbook' | 'actor' | 'variable';
  size?: number;
  color?: string;
  metadata?: {
    date?: string;
    successRate?: number;
    description?: string;
    [key: string]: any;
  };
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  type: 'direct' | 'indirect' | 'causal';
}

export const KnowledgeGraph = forwardRef<any, KnowledgeGraphProps>((props, ref) => {
  const { searchQuery = '', nodeTypeFilter } = props;
  const { t } = useTranslation();
  const cyRef = useRef<any>(null);
  
  // Sample knowledge graph data
  const [nodes] = useState<GraphNode[]>([
    // Actors (People/Organizations)
    { id: 'a1', label: 'Ministry of Education', type: 'actor', size: 35, color: '#3b82f6' },
    { id: 'a2', label: 'Ministry of Finance', type: 'actor', size: 30, color: '#3b82f6' },
    { id: 'a3', label: 'Community Leaders', type: 'actor', size: 25, color: '#3b82f6' },
    { id: 'a4', label: 'Technology Providers', type: 'actor', size: 20, color: '#3b82f6' },
    
    // Lessons
    { id: 'l1', label: 'Resource Allocation', type: 'lesson', size: 32, color: '#10b981' },
    { id: 'l2', label: 'Stakeholder Engagement', type: 'lesson', size: 28, color: '#10b981' },
    { id: 'l3', label: 'Budget Optimization', type: 'lesson', size: 25, color: '#10b981' },
    { id: 'l4', label: 'Technology Access', type: 'lesson', size: 22, color: '#10b981' },
    
    // Playbooks
    { id: 'p1', label: 'Resource Allocation Bundle', type: 'playbook', size: 30, color: '#8b5cf6' },
    { id: 'p2', label: 'Community Engagement', type: 'playbook', size: 26, color: '#8b5cf6' },
    { id: 'p3', label: 'Budget Management', type: 'playbook', size: 24, color: '#8b5cf6' },
    
    // Variables/Metrics
    { id: 'v1', label: 'DEI Score', type: 'variable', size: 28, color: '#f59e0b' },
    { id: 'v2', label: 'Budget Constraints', type: 'variable', size: 25, color: '#f59e0b' },
    { id: 'v3', label: 'Policy Implementation', type: 'variable', size: 23, color: '#f59e0b' },
    { id: 'v4', label: 'Satisfaction Index', type: 'variable', size: 20, color: '#f59e0b' },
  ]);
  
  const [edges] = useState<GraphEdge[]>([
    // Actor to Lesson connections
    { id: 'e1', source: 'a1', target: 'l1', weight: 3, type: 'direct' },
    { id: 'e2', source: 'a1', target: 'l4', weight: 2, type: 'direct' },
    { id: 'e3', source: 'a2', target: 'l3', weight: 3, type: 'direct' },
    { id: 'e4', source: 'a3', target: 'l2', weight: 3, type: 'direct' },
    { id: 'e5', source: 'a4', target: 'l4', weight: 2, type: 'direct' },
    
    // Lesson to Playbook connections
    { id: 'e6', source: 'l1', target: 'p1', weight: 3, type: 'direct' },
    { id: 'e7', source: 'l2', target: 'p2', weight: 3, type: 'direct' },
    { id: 'e8', source: 'l3', target: 'p3', weight: 3, type: 'direct' },
    { id: 'e9', source: 'l4', target: 'p1', weight: 2, type: 'indirect' },
    
    // Playbook to Variable connections
    { id: 'e10', source: 'p1', target: 'v1', weight: 3, type: 'causal' },
    { id: 'e11', source: 'p2', target: 'v4', weight: 2, type: 'causal' },
    { id: 'e12', source: 'p3', target: 'v2', weight: 3, type: 'causal' },
    { id: 'e13', source: 'p1', target: 'v3', weight: 2, type: 'causal' },
    
    // Cross connections
    { id: 'e14', source: 'l1', target: 'v2', weight: 1, type: 'indirect' },
    { id: 'e15', source: 'l2', target: 'v4', weight: 1, type: 'indirect' },
    { id: 'e16', source: 'a2', target: 'v2', weight: 2, type: 'direct' },
    { id: 'e17', source: 'p2', target: 'l1', weight: 1, type: 'indirect' },
  ]);
  
  // Expose cytoscape instance methods via ref
  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (cyRef.current) {
        const currentZoom = cyRef.current.zoom();
        cyRef.current.zoom({
          level: currentZoom * 1.2,
          renderedPosition: { x: cyRef.current.width() / 2, y: cyRef.current.height() / 2 }
        });
      }
    },
    zoomOut: () => {
      if (cyRef.current) {
        const currentZoom = cyRef.current.zoom();
        cyRef.current.zoom({
          level: currentZoom / 1.2,
          renderedPosition: { x: cyRef.current.width() / 2, y: cyRef.current.height() / 2 }
        });
      }
    },
    spotlight: (nodeId: string) => {
      if (cyRef.current) {
        const node = cyRef.current.getElementById(nodeId);
        if (node.length > 0) {
          cyRef.current.fit(node, 50);
          node.select();
        }
      }
    }
  }));
  
  // Filter nodes based on search and type filter
  const getFilteredElements = () => {
    let filteredNodes = [...nodes];
    
    // Apply search filter
    if (searchQuery) {
      filteredNodes = filteredNodes.filter(node => 
        node.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply node type filter
    if (nodeTypeFilter) {
      filteredNodes = filteredNodes.filter(node => node.type === nodeTypeFilter);
    }
    
    // Get node IDs for edge filtering
    const nodeIds = filteredNodes.map(node => node.id);
    
    // Filter edges to only include those connecting filtered nodes
    const filteredEdges = edges.filter(edge => 
      nodeIds.includes(edge.source) && nodeIds.includes(edge.target)
    );
    
    // Convert to cytoscape format
    return [
      ...filteredNodes.map(node => ({
        data: {
          id: node.id,
          label: node.label,
          type: node.type,
          color: node.color,
          size: node.size
        }
      })),
      ...filteredEdges.map(edge => ({
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          weight: edge.weight,
          type: edge.type
        }
      }))
    ];
  };

  // Define styles for cytoscape elements
  const cytoStyle = [
    {
      selector: 'node',
      style: {
        'width': 'data(size)',
        'height': 'data(size)',
        'background-color': 'data(color)',
        'background-opacity': 0.2,
        'border-width': 2,
        'border-color': 'data(color)',
        'border-opacity': 0.8,
        'label': 'data(label)',
        'color': '#ffffff',
        'text-outline-color': '#222222',
        'text-outline-width': 1,
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '80px',
        'font-size': '10px'
      }
    },
    {
      selector: 'node[type = "lesson"]',
      style: {
        'shape': 'ellipse',
        'border-style': 'solid'
      }
    },
    {
      selector: 'node[type = "playbook"]',
      style: {
        'shape': 'round-rectangle',
        'border-style': 'dashed'
      }
    },
    {
      selector: 'node[type = "actor"]',
      style: {
        'shape': 'diamond',
        'border-style': 'solid'
      }
    },
    {
      selector: 'node[type = "variable"]',
      style: {
        'shape': 'hexagon',
        'border-style': 'dotted'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 'data(weight)',
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'line-opacity': 0.6,
        'target-arrow-color': '#9BA1A6',
        'line-gradient-stop-colors': ['#3b82f6', '#10b981'],
        'line-gradient-stop-positions': [0, 100]
      }
    },
    {
      selector: 'edge[type = "direct"]',
      style: {
        'line-style': 'solid',
        'line-color': '#3b82f6',
        'target-arrow-color': '#3b82f6'
      }
    },
    {
      selector: 'edge[type = "indirect"]',
      style: {
        'line-style': 'dashed',
        'line-color': '#8b5cf6',
        'target-arrow-color': '#8b5cf6'
      }
    },
    {
      selector: 'edge[type = "causal"]',
      style: {
        'line-style': 'solid',
        'line-color': '#10b981',
        'target-arrow-color': '#10b981',
        'target-arrow-shape': 'triangle'
      }
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': 4,
        'border-color': '#ffffff',
        'border-opacity': 1
      }
    }
  ];
  
  // Handle search highlighting effect
  useEffect(() => {
    if (cyRef.current && searchQuery) {
      cyRef.current.elements().removeClass('highlighted').removeClass('faded');
      
      const matchedNodes = cyRef.current.nodes().filter(node => 
        node.data('label').toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchedNodes.length > 0) {
        // Highlight matched nodes and their connected edges and nodes
        const neighborhood = matchedNodes.neighborhood().add(matchedNodes);
        neighborhood.addClass('highlighted');
        
        // Fade all other elements
        cyRef.current.elements().difference(neighborhood).addClass('faded');
        
        // Center on matched nodes
        cyRef.current.fit(matchedNodes, 50);
      }
    } else if (cyRef.current) {
      // Remove any existing highlighting
      cyRef.current.elements().removeClass('highlighted').removeClass('faded');
      cyRef.current.fit();
    }
  }, [searchQuery]);
  
  // Update on node type filter change
  useEffect(() => {
    if (cyRef.current && nodeTypeFilter) {
      cyRef.current.elements().removeClass('highlighted').removeClass('faded');
      
      const matchedNodes = cyRef.current.nodes().filter(node => 
        node.data('type') === nodeTypeFilter
      );
      
      if (matchedNodes.length > 0) {
        // Highlight matched nodes and their connected edges and nodes
        const neighborhood = matchedNodes.neighborhood().add(matchedNodes);
        neighborhood.addClass('highlighted');
        
        // Fade all other elements
        cyRef.current.elements().difference(neighborhood).addClass('faded');
      }
    }
  }, [nodeTypeFilter]);
  
  return (
    <div className="w-full h-full">
      <style jsx global>{`
        .highlighted {
          opacity: 1 !important;
        }
        .faded {
          opacity: 0.25 !important;
        }
        .cytoscape-container:hover {
          cursor: grab;
        }
        .cytoscape-container:active {
          cursor: grabbing;
        }
      `}</style>
      <CytoScape
        elements={getFilteredElements()}
        className="cytoscape-container"
        style={{ width: '100%', height: '100%' }}
        stylesheet={cytoStyle}
        cy={(cy) => {
          cyRef.current = cy;
          
          // Initialize with force-directed layout
          const layout = cy.layout({
            name: 'cose',
            randomize: false,
            animate: true,
            animationDuration: 1000,
            nodeDimensionsIncludeLabels: true,
            refresh: 20,
            fit: true,
            padding: 30,
            componentSpacing: 100,
            nodeRepulsion: function(node) { return 400000 * (node.data('size') || 25); },
            nodeOverlap: 20,
            idealEdgeLength: function(edge) { return 100 * (edge.data('weight') || 1); },
            edgeElasticity: function(edge) { return 100 * (edge.data('weight') || 1); },
            nestingFactor: 1.2,
            gravity: 80,
            numIter: 1000
          });
          
          layout.run();
          
          // Add node hover effects
          cy.on('mouseover', 'node', function(e) {
            e.target.animate({
              style: { 
                'border-width': '3px',
                'border-opacity': 1,
                'background-opacity': 0.3
              },
              duration: 150
            });
          });
          
          cy.on('mouseout', 'node', function(e) {
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
        }}
        userZoomingEnabled={true}
        userPanningEnabled={true}
      />
    </div>
  );
});

KnowledgeGraph.displayName = 'KnowledgeGraph';
