
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bundle } from '../../types/act-types';

interface CanvasHeaderProps {
  bundle: Bundle;
  onClose: () => void;
}

const CanvasHeader: React.FC<CanvasHeaderProps> = ({ bundle, onClose }) => {
  return (
    <div className="p-6 border-b border-white/10 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">{bundle.name}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Bundle Analysis & Configuration</span>
            <Badge variant="outline" className="capitalize">
              {bundle.status}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CanvasHeader;
