
import { SNAData as SNADataFromSNATypes, Actor } from '../types/sna-types';
import { SNAData as SNADataFromSystemFraming, Node, Edge } from '../types/system-framing-types';

/**
 * Adapter function to convert SNAData from sna-types.ts to SNAData from system-framing-types.ts
 */
export const adaptSNADataToSystemFraming = (snaData: SNADataFromSNATypes): SNADataFromSystemFraming => {
  // Convert Actor[] to Node[]
  const nodes: Node[] = snaData.nodes.map(actor => ({
    id: actor.id,
    label: actor.label,
    // Map the government/private/ngo/academic type to stock/subIndicator/auxiliary
    // Using 'stock' as the default type
    type: 'stock' as const,
    // Set color from the actor or generate based on type
    color: actor.color || getColorForActorType(actor.type),
    // Add additional properties that Node requires
    size: actor.degree * 10, // Scale the size based on degree
    position: { x: Math.random() * 500, y: Math.random() * 400 },
    subIndicators: []
  }));

  // Convert Connection[] to Edge[]
  const edges: Edge[] = snaData.edges.map((connection, index) => ({
    id: `e${index}`,
    source: connection.source,
    target: connection.target,
    // Default to 'reinforcing' type for edges
    type: 'reinforcing' as const,
    label: `R${index + 1}`
  }));

  return { nodes, edges };
};

/**
 * Helper function to get a color based on actor type
 */
function getColorForActorType(type: 'government' | 'private' | 'ngo' | 'academic'): string {
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
