
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Map, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export const CoordinationTracker: React.FC = () => {
  const { t } = useTranslation();
  
  // Mock data for the coordination matrix
  const interventions = ['Water Policy', 'Social Welfare', 'Urban Development', 'Education'];
  const actors = ['Ministry of Environment', 'Local Authorities', 'Private Sector', 'Civil Society'];
  
  // Coordination strength: 0-3 (none, weak, moderate, strong)
  const matrix = [
    [3, 2, 1, 0],
    [1, 3, 0, 2],
    [2, 3, 3, 1],
    [0, 1, 2, 3],
  ];
  
  const getCellColor = (value: number) => {
    switch (value) {
      case 0: return 'bg-red-500/20 hover:bg-red-500/30';
      case 1: return 'bg-amber-500/20 hover:bg-amber-500/30';
      case 2: return 'bg-blue-500/20 hover:bg-blue-500/30';
      case 3: return 'bg-green-500/20 hover:bg-green-500/30';
      default: return 'bg-gray-500/20 hover:bg-gray-500/30';
    }
  };
  
  const handleCellClick = (intervention: string, actor: string, value: number) => {
    if (value < 2) {
      toast({
        title: t('coordinationGap' as any),
        description: `${intervention} + ${actor}: ${t('scheduleMeeting' as any)}?`,
        action: (
          <Button size="sm" variant="outline" onClick={() => {
            toast({
              title: t('meetingScheduled' as any),
              description: t('meetingScheduledDescription' as any),
            });
          }}>
            <Calendar className="mr-1" size={14} />
            {t('schedule' as any)}
          </Button>
        ),
      });
    } else {
      toast({
        title: t('strongCoordination' as any),
        description: `${intervention} + ${actor}: ${t('coordinationStrong' as any)}`,
      });
    }
  };
  
  return (
    <GlassCard className="p-6 h-full">
      <h2 className="text-lg font-semibold mb-4 text-left flex items-center">
        <Map className="mr-2 text-teal-400" size={18} />
        {t('coordinationTracker' as any)}
      </h2>
      
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className="px-3 py-2 border-b border-white/10"></th>
              {actors.map((actor, i) => (
                <th key={i} className="px-3 py-2 border-b border-white/10 text-center">
                  <div className="flex flex-col items-center">
                    <Users size={16} className="mb-1" />
                    <span className="text-xs whitespace-nowrap">{actor}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {interventions.map((intervention, i) => (
              <tr key={i}>
                <td className="px-3 py-2 border-b border-white/10 whitespace-nowrap">
                  {intervention}
                </td>
                {matrix[i].map((value, j) => (
                  <td key={j} className="px-3 py-2 border-b border-white/10">
                    <div 
                      className={`cursor-pointer w-full h-10 rounded flex items-center justify-center transition-colors ${getCellColor(value)}`}
                      onClick={() => handleCellClick(intervention, actors[j], value)}
                    >
                      <span className="font-medium">{value > 0 ? value : '—'}</span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between mt-4 text-xs text-gray-400">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500/30 mr-1"></div>
          <span>{t('noCoordination' as any)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500/30 mr-1"></div>
          <span>{t('strongCoordination' as any)}</span>
        </div>
      </div>
    </GlassCard>
  );
};
