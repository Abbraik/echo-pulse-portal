
import React from 'react';
import { WorkingCanvasContainer } from './canvas/WorkingCanvasContainer';

interface ConceptBlock {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
  type: string;
}

interface ScenarioForkData {
  id: string;
  name: string;
  active: boolean;
}

interface WorkingCanvasProps {
  selectedItem: ConceptBlock | ScenarioForkData | null;
  onClose: () => void;
}

export const WorkingCanvas: React.FC<WorkingCanvasProps> = ({ selectedItem, onClose }) => {
  return (
    <WorkingCanvasContainer 
      selectedItem={selectedItem} 
      onClose={onClose} 
    />
  );
};
