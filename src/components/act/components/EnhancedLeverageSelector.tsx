import React, { useState, useEffect } from 'react';
import { Star, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLeveragePoints, useUpdateBundleLeverage } from '../hooks/useLeveragePoints';
import type { LeveragePoint, LeveragePointChipData } from '../types/leverage-types';
import LeveragePointChip from './LeveragePointChip';

interface EnhancedLeverageSelectorProps {
  bundleId: string;
  initialPoints: string[];
  onUpdate?: (points: string[]) => void;
}

const EnhancedLeverageSelector: React.FC<EnhancedLeverageSelectorProps> = ({
  bundleId,
  initialPoints,
  onUpdate
}) => {
  const [selectedPoints, setSelectedPoints] = useState<LeveragePointChipData[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);
  
  const { data: leveragePoints = [], isLoading } = useLeveragePoints();
  const updateMutation = useUpdateBundleLeverage();

  // Add debugging
  console.log('EnhancedLeverageSelector - bundleId:', bundleId);
  console.log('EnhancedLeverageSelector - initialPoints:', initialPoints);
  console.log('EnhancedLeverageSelector - leveragePoints:', leveragePoints);
  console.log('EnhancedLeverageSelector - selectedPoints:', selectedPoints);

  useEffect(() => {
    // Initialize selected points from bundle data
    if (leveragePoints.length > 0 && initialPoints) {
      const chips = initialPoints
        .map(pointId => {
          const point = leveragePoints.find(p => p.id === pointId);
          return point ? {
            id: point.id,
            name: point.name,
            recommended: point.recommended
          } : null;
        })
        .filter((chip): chip is LeveragePointChipData => chip !== null);
      
      setSelectedPoints(chips);
      // Immediately notify parent component
      onUpdate?.(chips.map(c => c.id));
    }
  }, [leveragePoints, initialPoints, onUpdate]);

  const handleAddPoint = (pointId: string) => {
    if (selectedPoints.length >= 5) return;
    
    const point = leveragePoints.find(p => p.id === pointId);
    if (point && !selectedPoints.some(sp => sp.id === pointId)) {
      const newPoints = [...selectedPoints, {
        id: point.id,
        name: point.name,
        recommended: point.recommended
      }];
      setSelectedPoints(newPoints);
      setSelectedValue('');
      setHasChanges(true);
      onUpdate?.(newPoints.map(p => p.id));
    }
  };

  const handleRemovePoint = (pointId: string) => {
    const newPoints = selectedPoints.filter(sp => sp.id !== pointId);
    setSelectedPoints(newPoints);
    setHasChanges(true);
    onUpdate?.(newPoints.map(p => p.id));
  };

  const handleSave = async () => {
    const pointIds = selectedPoints.map(p => p.id);
    try {
      await updateMutation.mutateAsync({ bundleId, points: pointIds });
      setHasChanges(false);
      onUpdate?.(pointIds);
    } catch (error) {
      console.error('Failed to save leverage points:', error);
    }
  };

  const handleReset = () => {
    // Reset to initial points
    if (leveragePoints.length > 0 && initialPoints) {
      const chips = initialPoints
        .map(pointId => {
          const point = leveragePoints.find(p => p.id === pointId);
          return point ? {
            id: point.id,
            name: point.name,
            recommended: point.recommended
          } : null;
        })
        .filter((chip): chip is LeveragePointChipData => chip !== null);
      
      setSelectedPoints(chips);
      setHasChanges(false);
      onUpdate?.(chips.map(c => c.id));
    }
  };

  const availablePoints = leveragePoints.filter(
    point => !selectedPoints.some(sp => sp.id === point.id)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        <span className="ml-2 text-white">Loading leverage points...</span>
      </div>
    );
  }

  return (
    <div className="leverage-container backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
            Edit Leverage Points
          </h3>
          <p className="text-sm text-gray-300">
            Select up to 5 Meadows' Leverage Points ({leveragePoints.length} available)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!hasChanges}
            className="bg-amber-500/20 border-amber-400/30 text-amber-200 hover:bg-amber-500/30"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateMutation.isPending}
            className="bg-blue-500/80 hover:bg-blue-600/80 text-white border-0"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Dropdown */}
      <div className="mb-6">
        <Select value={selectedValue} onValueChange={handleAddPoint}>
          <SelectTrigger className="w-72 backdrop-blur-sm bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Choose a leverage point…" />
          </SelectTrigger>
          <SelectContent className="backdrop-blur-xl bg-slate-900/90 border-white/20">
            {availablePoints.length > 0 ? (
              availablePoints.map((point) => (
                <SelectItem 
                  key={point.id} 
                  value={point.id}
                  className="text-white hover:bg-white/10 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {point.recommended && (
                      <Star className="h-3 w-3 text-teal-400 fill-current" />
                    )}
                    <div>
                      <div className="font-medium">{point.name}</div>
                      <div className="text-xs text-gray-400 max-w-xs truncate">
                        {point.description}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-options" disabled className="text-gray-400">
                No more points available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Validation Alert */}
      {selectedPoints.length >= 5 && (
        <Alert className="mb-4 bg-amber-500/20 border-amber-400/30 text-amber-200">
          <AlertDescription>
            Maximum of 5 leverage points reached. Remove a point to add another.
          </AlertDescription>
        </Alert>
      )}

      {/* Selected Points Chips */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">
          Selected Points ({selectedPoints.length}/5)
        </h4>
        {selectedPoints.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedPoints.map((point) => (
              <LeveragePointChip
                key={point.id}
                point={point}
                onRemove={handleRemovePoint}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <p>No leverage points selected</p>
            <p className="text-sm">Use the dropdown above to add points</p>
          </div>
        )}
      </div>

      {/* Recommended Points Helper */}
      {leveragePoints.some(p => p.recommended) && (
        <div className="mt-4 p-3 rounded-lg bg-teal-500/10 border border-teal-400/20">
          <div className="flex items-center gap-2 text-teal-300 text-sm">
            <Star className="h-4 w-4 fill-current" />
            <span>Recommended leverage points are marked with a star</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedLeverageSelector;
