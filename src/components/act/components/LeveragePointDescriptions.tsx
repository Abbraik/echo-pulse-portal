
import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { LeveragePointChipData } from '../types/leverage-types';

interface LeveragePointDescriptionsProps {
  selectedPoints: LeveragePointChipData[];
  leveragePoints: any[];
  onDescriptionUpdate?: (pointId: string, newDescription: string) => void;
}

const LeveragePointDescriptions: React.FC<LeveragePointDescriptionsProps> = ({
  selectedPoints,
  leveragePoints,
  onDescriptionUpdate
}) => {
  const [editingPointId, setEditingPointId] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState<string>('');

  console.log('LeveragePointDescriptions - selectedPoints:', selectedPoints);
  console.log('LeveragePointDescriptions - leveragePoints:', leveragePoints);

  const handleEditStart = (pointId: string, currentDescription: string) => {
    setEditingPointId(pointId);
    setEditingDescription(currentDescription);
  };

  const handleEditSave = (pointId: string) => {
    if (onDescriptionUpdate) {
      onDescriptionUpdate(pointId, editingDescription);
    }
    setEditingPointId(null);
    setEditingDescription('');
  };

  const handleEditCancel = () => {
    setEditingPointId(null);
    setEditingDescription('');
  };

  if (selectedPoints.length === 0) {
    return (
      <div className="mt-6 backdrop-blur-sm bg-white/10 rounded-2xl p-4 border border-white/20">
        <h4 className="text-sm font-medium text-gray-300 mb-2">
          Selected Point Details
        </h4>
        <p className="text-xs text-gray-400">
          Select leverage points above to see their detailed descriptions
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 backdrop-blur-sm bg-white/20 rounded-2xl p-4 border border-white/20">
      <h4 className="text-sm font-medium text-gray-300 mb-4">
        Selected Point Details
      </h4>
      <div className="space-y-4">
        {selectedPoints.map((selectedPoint) => {
          const fullPoint = leveragePoints.find(p => p.id === selectedPoint.id);
          const description = fullPoint?.description || 'System leverage intervention point';
          const isEditing = editingPointId === selectedPoint.id;
          
          return (
            <div key={selectedPoint.id} className="point-description group">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-white text-sm">
                  {selectedPoint.name}
                </h4>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditStart(selectedPoint.id, description)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-auto p-1 text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-xs resize-none"
                    rows={3}
                    placeholder="Enter description for this leverage point..."
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSave(selectedPoint.id)}
                      className="h-auto p-1 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditCancel}
                      className="h-auto p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-white/80 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeveragePointDescriptions;
