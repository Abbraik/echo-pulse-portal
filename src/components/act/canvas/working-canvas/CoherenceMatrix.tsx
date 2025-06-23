
import React, { useState, useEffect } from 'react';
import { Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CoherenceScore {
  objective: string;
  leverage_point: string;
  score: number;
}

interface CoherenceMatrixProps {
  bundleId: string;
  objectives: string[];
  leveragePoints: string[];
}

const CoherenceMatrix: React.FC<CoherenceMatrixProps> = ({
  bundleId,
  objectives,
  leveragePoints
}) => {
  const [coherenceData, setCoherenceData] = useState<CoherenceScore[]>([]);
  const [hoveredCell, setHoveredCell] = useState<{ obj: string; lever: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCoherenceMatrix();
  }, [bundleId]);

  const fetchCoherenceMatrix = async () => {
    try {
      const { data, error } = await supabase.rpc('get_coherence_matrix', {
        bundle_id: bundleId
      });

      if (error) throw error;
      
      // Handle the response properly - it should be an array
      const parsedData = Array.isArray(data) ? data : [];
      setCoherenceData(parsedData);
    } catch (error) {
      console.error('Error fetching coherence matrix:', error);
      setCoherenceData([]);
    }
  };

  const getScoreForCell = (objective: string, leveragePoint: string): number => {
    const score = coherenceData.find(
      s => s.objective === objective && s.leverage_point === leveragePoint
    );
    return score?.score || Math.floor(Math.random() * 100); // Default random score for demo
  };

  const getScoreColor = (score: number): string => {
    if (score >= 75) return '#14B8A6'; // neon-teal
    if (score >= 50) return '#F59E0B'; // amber
    return '#EF4444'; // coral
  };

  const handleCellAction = async (objective: string, leveragePoint: string, action: 'edit' | 'details') => {
    if (action === 'edit') {
      // Open edit modal - for now just prompt for a new score
      const currentScore = getScoreForCell(objective, leveragePoint);
      const newScore = prompt(`Enter new coherence score (0-100) for ${objective} + ${leveragePoint}:`, currentScore.toString());
      
      if (newScore && !isNaN(Number(newScore))) {
        const score = Math.max(0, Math.min(100, Number(newScore)));
        
        try {
          const { error } = await supabase.rpc('update_coherence_score', {
            bundle_id: bundleId,
            objective: objective,
            leverage_point: leveragePoint,
            new_score: score
          });

          if (error) throw error;
          
          await fetchCoherenceMatrix();
          toast({
            title: 'Coherence score updated',
            description: `Updated score to ${score}`,
          });
        } catch (error) {
          console.error('Error updating coherence score:', error);
          toast({
            title: 'Error',
            description: 'Failed to update coherence score',
            variant: 'destructive'
          });
        }
      }
    } else {
      toast({
        title: 'Details View',
        description: 'Detailed coherence report would open here',
      });
    }
  };

  if (objectives.length === 0 || leveragePoints.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>Add objectives and leverage points to see the coherence matrix</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-white">Coherence Matrix</h4>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid gap-1" style={{ 
            gridTemplateColumns: `200px repeat(${leveragePoints.length}, 80px)`,
            gridTemplateRows: `40px repeat(${objectives.length}, 60px)`
          }}>
            {/* Header row */}
            <div className="bg-white/5 p-2 text-xs font-medium text-gray-300 rounded">
              Objectives / Leverage
            </div>
            {leveragePoints.map((lever) => (
              <div key={lever} className="bg-white/5 p-2 text-xs font-medium text-gray-300 rounded text-center">
                {lever.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            ))}
            
            {/* Matrix cells */}
            {objectives.map((objective) => (
              <React.Fragment key={objective}>
                <div className="bg-white/5 p-2 text-sm text-white rounded flex items-center">
                  {objective}
                </div>
                {leveragePoints.map((lever) => {
                  const score = getScoreForCell(objective, lever);
                  const isHovered = hoveredCell?.obj === objective && hoveredCell?.lever === lever;
                  
                  return (
                    <div
                      key={`${objective}-${lever}`}
                      className="relative bg-white/5 p-2 rounded flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                      onMouseEnter={() => setHoveredCell({ obj: objective, lever })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: getScoreColor(score) }}
                      >
                        {score}
                      </div>
                      
                      {isHovered && (
                        <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 rounded">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 hover:bg-white/20"
                            onClick={() => handleCellAction(objective, lever, 'edit')}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 hover:bg-white/20"
                            onClick={() => handleCellAction(objective, lever, 'details')}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-500"></div>
          <span>≥75% Coherent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span>50-75% Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>&lt;50% Low</span>
        </div>
      </div>
    </div>
  );
};

export default CoherenceMatrix;
