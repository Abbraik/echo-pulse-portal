import React from 'react';
import { Lightbulb, Rocket, Cog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface InnovateContextPanelProps {
  entityId: string;
}

export const InnovateContextPanel: React.FC<InnovateContextPanelProps> = ({ entityId }) => {
  // For now, show a placeholder since Innovate zone entities aren't fully defined
  // This can be extended when the Innovate zone data structure is implemented
  
  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-blue-400" />
        <h4 className="font-medium text-foreground">Innovate Zone Context</h4>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-medium text-foreground mb-1">Innovation Entity</h5>
          <p className="text-sm text-muted-foreground font-mono">{entityId.slice(0, 8)}...</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-500/20 text-blue-300">
            <Rocket className="h-3 w-3 mr-1" />
            Innovation
          </Badge>
        </div>

        <div className="glass-card p-3 text-center">
          <Cog className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground">
            Innovate zone context panel is under development.
            Extended functionality will be available soon.
          </p>
        </div>

        <div className="text-xs text-muted-foreground">
          Entity ID: {entityId}
        </div>
      </div>
    </div>
  );
};