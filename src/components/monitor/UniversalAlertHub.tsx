
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Settings, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface Alert {
  id: number;
  indicator: string;
  deviation: string;
  timestamp: string;
  category: 'Strategic' | 'Operational';
  severity: 'high' | 'medium' | 'low';
}

interface UniversalAlertHubProps {
  className?: string;
}

const UniversalAlertHub: React.FC<UniversalAlertHubProps> = ({ className }) => {
  const { t } = useTranslation();
  
  // Mock alert data
  const alerts: Alert[] = [
    {
      id: 1,
      indicator: 'Resource Efficiency',
      deviation: '-4.2%',
      timestamp: '05/14 09:23',
      category: 'Operational',
      severity: 'high'
    },
    {
      id: 2,
      indicator: 'Social Cohesion',
      deviation: '-2.8%',
      timestamp: '05/14 10:15',
      category: 'Strategic',
      severity: 'medium'
    },
    {
      id: 3,
      indicator: 'Governance Participation',
      deviation: '+1.7%',
      timestamp: '05/14 11:42',
      category: 'Strategic',
      severity: 'low'
    },
    {
      id: 4,
      indicator: 'System Response Time',
      deviation: '+15.3%',
      timestamp: '05/14 12:05',
      category: 'Operational',
      severity: 'medium'
    }
  ];

  const getDeviationColor = (deviation: string) => {
    const value = parseFloat(deviation);
    if (value < -5) return 'text-red-400';
    if (value > 5) return 'text-green-400';
    return 'text-amber-400';
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const handleAlertAction = (alertId: number, action: 'investigate' | 'manage' | 'chart') => {
    console.log(`Alert ${alertId}: ${action}`);
  };

  return (
    <motion.div 
      className={cn('h-full', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div 
        className="h-full rounded-2xl border border-white/20 overflow-hidden"
        style={{
          background: 'rgba(20,30,50,0.6)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 16px 32px rgba(0,0,0,0.4)'
        }}
      >
        {/* Header */}
        <div 
          className="h-8 flex items-center px-4"
          style={{ background: 'rgba(10,20,40,0.8)' }}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-[#00FFC3]" />
            <h3 className="text-base font-bold text-[#00FFC3] font-['Noto_Sans']">
              Universal Alert Hub
            </h3>
          </div>
        </div>

        {/* Alert Table */}
        <div className="p-4 h-full overflow-auto">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-300 font-['Noto_Sans'] text-xs">Indicator</TableHead>
                  <TableHead className="text-gray-300 font-['Noto_Sans'] text-xs">Deviation</TableHead>
                  <TableHead className="text-gray-300 font-['Noto_Sans'] text-xs">Time</TableHead>
                  <TableHead className="text-gray-300 font-['Noto_Sans'] text-xs">Category</TableHead>
                  <TableHead className="text-right text-gray-300 font-['Noto_Sans'] text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert, index) => (
                  <motion.tr 
                    key={alert.id}
                    className="border-white/10 hover:bg-[rgba(0,255,195,0.1)] transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                  >
                    <TableCell className="font-medium text-white text-xs font-['Noto_Sans']">
                      {alert.indicator}
                    </TableCell>
                    <TableCell className={cn('text-xs font-medium', getDeviationColor(alert.deviation))}>
                      {alert.deviation}
                    </TableCell>
                    <TableCell className="text-gray-300 text-xs font-['Noto_Sans']">
                      {alert.timestamp}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={alert.category === 'Strategic' ? 'default' : 'secondary'}
                        className="text-xs font-['Noto_Sans']"
                      >
                        {alert.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAlertAction(alert.id, 'investigate')}
                          className="text-gray-400 hover:text-[#00FFC3] h-6 w-6 p-0"
                        >
                          <Search size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAlertAction(alert.id, 'manage')}
                          className="text-gray-400 hover:text-[#00FFC3] h-6 w-6 p-0"
                        >
                          <Settings size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAlertAction(alert.id, 'chart')}
                          className="text-gray-400 hover:text-[#00FFC3] h-6 w-6 p-0"
                        >
                          <TrendingUp size={12} />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-4 pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#00B8FF] hover:text-white font-['Noto_Sans'] text-sm"
            >
              View All Alerts ▶
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UniversalAlertHub;
