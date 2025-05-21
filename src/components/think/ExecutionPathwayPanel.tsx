
import React from 'react';
import { GitBranch, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExecutionPathway } from './types/sna-types';
import { toast } from '@/components/ui/use-toast';

interface ExecutionPathwayPanelProps {
  pathways: ExecutionPathway[];
  onHighlightPathway: (actorIds: string[]) => void;
  onAdoptPathway: (pathway: ExecutionPathway) => void;
}

const ExecutionPathwayPanel: React.FC<ExecutionPathwayPanelProps> = ({
  pathways,
  onHighlightPathway,
  onAdoptPathway
}) => {
  const { t, isRTL } = useTranslation();
  
  const handleAdoptPathway = (pathway: ExecutionPathway) => {
    onAdoptPathway(pathway);
    toast({
      title: t("pathwayAdopted"),
      description: t("pathwayAdoptedDesc", { pathway: pathway.title }),
      duration: 3000,
    });
  };
  
  const handleViewOnMap = (pathway: ExecutionPathway) => {
    onHighlightPathway(pathway.actors);
    toast({
      title: t("pathwayHighlighted"),
      description: t("pathwayHighlightedDesc", { pathway: pathway.title }),
      duration: 3000,
    });
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-md font-medium mb-3">{t("suggestedExecutionPathways")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pathways.map((pathway) => (
          <motion.div
            key={pathway.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-panel-dark p-4 rounded-lg border border-white/10"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium">{pathway.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{pathway.description}</p>
              </div>
              <Badge variant="outline" className="border-teal-500/30 text-teal-400 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {pathway.coordinationTime} {t("months")}
              </Badge>
            </div>
            
            {/* Actor chain visualization */}
            <div className="flex items-center my-4 flex-wrap">
              {pathway.actors.map((actorId, index) => (
                <React.Fragment key={actorId}>
                  {index > 0 && (
                    <ArrowRight className="mx-2 text-gray-400 h-4 w-4 flex-shrink-0" />
                  )}
                  <div className="bg-white/10 rounded-lg px-2 py-1 text-xs my-1">
                    {actorId}
                  </div>
                </React.Fragment>
              ))}
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs"
                onClick={() => handleViewOnMap(pathway)}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                {t("viewOnMap")}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs border-teal-500/30 text-teal-400"
                onClick={() => handleAdoptPathway(pathway)}
              >
                <GitBranch className="h-3 w-3 mr-1" />
                {t("adoptPathway")}
              </Button>
            </div>
          </motion.div>
        ))}
        
        {pathways.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-6">
            <GitBranch size={36} className="mx-auto mb-3 opacity-30" />
            <p>{t("noPathwaysAvailable")}</p>
            <p className="text-sm mt-1">{t("selectApproachForPathways")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionPathwayPanel;
