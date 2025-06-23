
import React, { useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Bundle } from '../../types/act-types';
import EnhancedLeverageSelector from '../../components/EnhancedLeverageSelector';
import LeveragePointDescriptions from '../../components/LeveragePointDescriptions';
import TaskGenerationModal from '../../components/TaskGenerationModal';
import { useLeveragePoints } from '../../hooks/useLeveragePoints';
import { useTaskGeneration } from '../../hooks/useTaskGeneration';
import type { LeveragePointChipData } from '../../types/leverage-types';

interface LeverageTabProps {
  bundle: Bundle;
}

const LeverageTab: React.FC<LeverageTabProps> = ({ bundle }) => {
  const { t } = useTranslation();
  const [selectedPointsForDescription, setSelectedPointsForDescription] = useState<LeveragePointChipData[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  const { data: leveragePoints = [] } = useLeveragePoints();
  const taskGeneration = useTaskGeneration();

  // Convert bundle.leveragePoints to string array if needed
  const leveragePointIds = Array.isArray(bundle.leveragePoints) 
    ? bundle.leveragePoints.filter((point): point is string => typeof point === 'string') 
    : [];

  const handleLeverageUpdate = (points: string[]) => {
    console.log('Leverage points updated:', points);
    
    // Update the selected points for description panel
    const updatedChips = points
      .map(pointId => {
        const point = leveragePoints.find(p => p.id === pointId);
        return point ? {
          id: point.id,
          name: point.name,
          recommended: point.recommended
        } : null;
      })
      .filter((chip): chip is LeveragePointChipData => chip !== null);
    
    setSelectedPointsForDescription(updatedChips);
  };

  const handleGenerateTasks = async () => {
    try {
      await taskGeneration.mutateAsync({
        bundleId: bundle.id,
        leveragePointIds: selectedPointsForDescription.map(p => p.id)
      });
      setShowTaskModal(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Leverage Point Selector Section */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">
            {t('leveragePoints', { defaultValue: 'Leverage Points' })}
          </h3>
          <Button variant="outline" size="sm" className="bg-white/5">
            <Sparkles className="h-4 w-4 mr-1" />
            {t('suggestPoints', { defaultValue: 'Suggest Points' })}
          </Button>
        </div>
        
        <EnhancedLeverageSelector 
          bundleId={bundle.id} 
          initialPoints={leveragePointIds} 
          onUpdate={handleLeverageUpdate} 
        />

        {/* Description Panel */}
        <LeveragePointDescriptions 
          selectedPoints={selectedPointsForDescription}
          leveragePoints={leveragePoints}
        />

        {/* Translate to Tasks Button */}
        {selectedPointsForDescription.length > 0 && (
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setShowTaskModal(true)}
              className="translate-btn bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/40 rounded-lg px-5 py-2.5 font-medium transition-all"
            >
              <Zap className="h-4 w-4 mr-2" />
              Translate to Tasks
            </Button>
          </div>
        )}
      </GlassCard>

      {/* Task Generation Confirmation Modal */}
      <TaskGenerationModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        selectedPoints={selectedPointsForDescription}
        onGenerateTasks={handleGenerateTasks}
        isGenerating={taskGeneration.isPending}
      />
    </div>
  );
};

export default LeverageTab;
