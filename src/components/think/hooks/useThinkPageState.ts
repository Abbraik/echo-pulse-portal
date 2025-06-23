
import { useState, useCallback } from 'react';

export interface ThinkPageState {
  showAiAdvisor: boolean;
  selectedObjectives: number[];
  activeApproach: string;
  selectedActors: string[];
  highlightedPathway: string[] | null;
}

export const useThinkPageState = () => {
  const [state, setState] = useState<ThinkPageState>({
    showAiAdvisor: false,
    selectedObjectives: [1],
    activeApproach: 'balanced',
    selectedActors: [],
    highlightedPathway: null,
  });

  const updateState = useCallback((updates: Partial<ThinkPageState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleAiAdvisor = useCallback(() => {
    setState(prev => ({ ...prev, showAiAdvisor: !prev.showAiAdvisor }));
  }, []);

  const setSelectedObjectives = useCallback((objectives: number[]) => {
    setState(prev => ({ ...prev, selectedObjectives: objectives }));
  }, []);

  const setActiveApproach = useCallback((approach: string) => {
    setState(prev => ({ ...prev, activeApproach: approach }));
  }, []);

  const setSelectedActors = useCallback((actors: string[]) => {
    setState(prev => ({ ...prev, selectedActors: actors }));
  }, []);

  const setHighlightedPathway = useCallback((pathway: string[] | null) => {
    setState(prev => ({ ...prev, highlightedPathway: pathway }));
  }, []);

  return {
    state,
    updateState,
    toggleAiAdvisor,
    setSelectedObjectives,
    setActiveApproach,
    setSelectedActors,
    setHighlightedPathway,
  };
};
