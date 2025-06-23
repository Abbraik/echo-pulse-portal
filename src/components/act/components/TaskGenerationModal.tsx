
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { LeveragePointChipData } from '../types/leverage-types';

interface TaskGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPoints: LeveragePointChipData[];
  onGenerateTasks: () => void;
  isGenerating?: boolean;
}

const TaskGenerationModal: React.FC<TaskGenerationModalProps> = ({
  isOpen,
  onClose,
  selectedPoints,
  onGenerateTasks,
  isGenerating = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px] backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-white">
            Generate Action Tasks?
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-white/90 mb-4 font-medium">You've selected:</p>
          <ul className="space-y-2">
            {selectedPoints.map((point) => (
              <li key={point.id} className="flex items-start gap-2 text-white/80">
                <span className="text-teal-400 mt-1">•</span>
                <div>
                  <span className="font-semibold">{point.name}</span>
                  <span className="text-white/60"> – System leverage intervention point</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Cancel
          </Button>
          <Button
            onClick={onGenerateTasks}
            disabled={isGenerating}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/40"
          >
            {isGenerating ? 'Generating...' : 'Generate Tasks'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskGenerationModal;
