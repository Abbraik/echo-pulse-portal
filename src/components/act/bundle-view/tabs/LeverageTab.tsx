
import React, { useState, useCallback, useEffect } from 'react';
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
import { useRealBundleActions } from '../../hooks/useRealBundles';
import type { LeveragePointChipData } from '../../types/leverage-types';

interface LeverageTabProps {
  bundle: Bundle;
}

const LeverageTab: React.FC<LeverageTabProps> = ({ bundle }) => {
  const { t } = useTranslation();
  const [selectedPointsForDescription, setSelectedPointsForDescription] = useState<LeveragePointChipData[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [localLeveragePoints, setLocalLeveragePoints] = useState<any[]>([]);
  
  const { data: leveragePoints = [], isLoading, error } = useLeveragePoints();
  const taskGeneration = useTaskGeneration();
  const { updateBundle } = useRealBundleActions();

  // Convert bundle.leveragePoints to string array if needed
  const leveragePointIds = Array.isArray(bundle.leveragePoints) 
    ? bundle.leveragePoints.filter((point): point is string => typeof point === 'string') 
    : [];

  // Initialize local leverage points from server data
  useEffect(() => {
    if (leveragePoints.length > 0) {
      setLocalLeveragePoints([...leveragePoints]);
    }
  }, [leveragePoints.length]);

  // Initialize selectedPointsForDescription from bundle data only once when leverage points load
  useEffect(() => {
    if (localLeveragePoints.length > 0 && leveragePointIds.length > 0) {
      const chips = leveragePointIds
        .map(pointId => {
          const point = localLeveragePoints.find(p => p.id === pointId);
          return point ? {
            id: point.id,
            name: point.name,
            recommended: point.recommended
          } : null;
        })
        .filter((chip): chip is LeveragePointChipData => chip !== null);
      
      setSelectedPointsForDescription(chips);
    }
  }, [localLeveragePoints.length, leveragePointIds.length]);

  // Use useCallback to stabilize the function reference and prevent infinite loops
  const handleLeverageUpdate = useCallback(async (points: string[]) => {
    console.log('Leverage points updated:', points);
    
    // Update the selected points for description panel
    const updatedChips = points
      .map(pointId => {
        const point = localLeveragePoints.find(p => p.id === pointId);
        return point ? {
          id: point.id,
          name: point.name,
          recommended: point.recommended
        } : null;
      })
      .filter((chip): chip is LeveragePointChipData => chip !== null);
    
    console.log('Updated chips for description:', updatedChips);
    setSelectedPointsForDescription(updatedChips);

    // Persist the changes to the bundle
    try {
      await updateBundle.mutateAsync({
        bundleId: bundle.id,
        updates: {
          leveragePoints: points
        }
      });
      console.log('Bundle leverage points updated successfully');
    } catch (error) {
      console.error('Failed to update bundle leverage points:', error);
    }
  }, [localLeveragePoints, updateBundle, bundle.id]);

  const handleDescriptionUpdate = useCallback((pointId: string, newDescription: string) => {
    console.log('Updating description for point:', pointId, 'New description:', newDescription);
    
    // Update local leverage points state
    setLocalLeveragePoints(prev => 
      prev.map(point => 
        point.id === pointId 
          ? { ...point, description: newDescription }
          : point
      )
    );
  }, []);

  const handleGenerateTasks = async () => {
    try {
      await taskGeneration.mutateAsync({
        bundleId: bundle.id,
        leveragePointIds: selectedPointsForDescription.map(p => p.id)
      });
      setShowTaskModal(false);
    } catch (error) {
      console.error('Task generation error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-400">Failed to load leverage points</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Leverage Point Selector Section */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white">
            {t('leveragePoints', { defaultValue: 'Leverage Points' })}
          </h3>
          <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
            <Sparkles className="h-4 w-4 mr-1" />
            {t('suggestPoints', { defaultValue: 'Suggest Points' })}
          </Button>
        </div>
        
        <EnhancedLeverageSelector 
          bundleId={bundle.id} 
          initialPoints={leveragePointIds} 
          onUpdate={handleLeverageUpdate} 
        />

        {/* Description Panel - Always show for selected points */}
        <LeveragePointDescriptions 
          selectedPoints={selectedPointsForDescription}
          leveragePoints={localLeveragePoints}
          onDescriptionUpdate={handleDescriptionUpdate}
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
