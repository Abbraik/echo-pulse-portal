
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LeveragePointSelectorProps {
  bundleId: string;
  leveragePoints: string[];
  onUpdate: (points: string[]) => void;
}

const MEADOWS_LEVERAGE_POINTS = [
  { value: 'ConstantsAndParameters', label: 'Constants & Parameters' },
  { value: 'MaterialStocksAndFlows', label: 'Material Stocks & Flows' },
  { value: 'RegulatingNegativeFeedbackLoops', label: 'Regulating Negative Feedback Loops' },
  { value: 'DrivingPositiveFeedbackLoops', label: 'Driving Positive Feedback Loops' },
  { value: 'InformationFlows', label: 'Information Flows' },
  { value: 'RulesOfTheSystem', label: 'Rules of the System' },
  { value: 'DistributionOfPowerOverRuleMaking', label: 'Distribution of Power Over Rule-making' },
  { value: 'GoalsOfTheSystem', label: 'Goals of the System' },
  { value: 'ParadigmOrMindset', label: 'Paradigm or Mindset' },
  { value: 'PowerToTranscendParadigms', label: 'Power to Transcend Paradigms' },
  { value: 'BufferSizes', label: 'Buffer Sizes' },
  { value: 'StructureOfInformationFlows', label: 'Structure of Information Flows' }
];

const LeveragePointSelector: React.FC<LeveragePointSelectorProps> = ({
  bundleId,
  leveragePoints,
  onUpdate
}) => {
  const [selectedPoint, setSelectedPoint] = useState<string>('');
  const { toast } = useToast();

  const handleAddLeveragePoint = async (point: string) => {
    try {
      const { error } = await supabase.rpc('update_bundle_leverage', {
        bundle_id: bundleId,
        point: point
      });

      if (error) throw error;

      const newPoints = leveragePoints.includes(point) 
        ? leveragePoints.filter(p => p !== point)
        : [...leveragePoints, point];
      
      onUpdate(newPoints);
      setSelectedPoint('');
      
      toast({
        title: 'Leverage points updated',
        description: leveragePoints.includes(point) ? 'Point removed' : 'Point added',
      });
    } catch (error) {
      console.error('Error updating leverage points:', error);
      toast({
        title: 'Error',
        description: 'Failed to update leverage points',
        variant: 'destructive'
      });
    }
  };

  const removeLeveragePoint = async (point: string) => {
    await handleAddLeveragePoint(point); // Same function handles add/remove
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">Leverage Points</h4>
        <div className="flex items-center gap-2">
          <Select value={selectedPoint} onValueChange={setSelectedPoint}>
            <SelectTrigger className="w-64 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select leverage point..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              {MEADOWS_LEVERAGE_POINTS.map((point) => (
                <SelectItem 
                  key={point.value} 
                  value={point.value}
                  className="text-white hover:bg-white/10"
                >
                  {point.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => selectedPoint && handleAddLeveragePoint(selectedPoint)}
            disabled={!selectedPoint}
            size="sm"
            className="bg-teal-500 hover:bg-teal-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {leveragePoints.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {leveragePoints.map((point) => {
            const pointLabel = MEADOWS_LEVERAGE_POINTS.find(p => p.value === point)?.label || point;
            return (
              <Badge
                key={point}
                variant="outline"
                className="bg-white/10 border-teal-400/30 text-white hover:bg-white/20 cursor-pointer"
                onClick={() => removeLeveragePoint(point)}
              >
                {pointLabel}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeveragePointSelector;
