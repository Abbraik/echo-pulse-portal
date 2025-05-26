
import React from 'react';
import { X, Home, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WorkingCanvasHeaderProps {
  itemName: string;
  itemType: string;
  activeTab: string;
  onClose: () => void;
}

export const WorkingCanvasHeader: React.FC<WorkingCanvasHeaderProps> = ({
  itemName,
  itemType,
  activeTab,
  onClose
}) => {
  const { t, isRTL } = useTranslation();

  const getTabDisplayName = (tab: string) => {
    const tabNames: Record<string, string> = {
      sketch: t('sketch'),
      simulate: t('simulate'),
      results: t('results'),
      blueprint: t('blueprint'),
      compare: t('compare'),
      'co-create': t('coCreate'),
      ensemble: t('ensemble'),
      breakpoints: t('breakpoints'),
      pathways: t('pathways')
    };
    return tabNames[tab] || tab;
  };

  return (
    <div className="h-15 px-6 py-4 border-b border-white/10 flex items-center justify-between">
      <div className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Home size={14} />
          <ChevronRight size={12} />
          <span>{t('innovate')}</span>
          <ChevronRight size={12} />
          <span className="truncate">{itemName}</span>
          <ChevronRight size={12} />
          <span>{getTabDisplayName(activeTab)}</span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold truncate">{itemName}</h1>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {itemType}
          </Badge>
        </div>
      </div>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="shrink-0 h-8 w-8 hover:bg-red-500/20"
      >
        <X size={16} />
      </Button>
    </div>
  );
};
