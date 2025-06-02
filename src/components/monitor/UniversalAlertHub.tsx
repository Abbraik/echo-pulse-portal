
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
    if (value > 5) return 'text-green-400';
    if (value < -5) return 'text-red-400';
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
      {/* Enhanced Two-Layer Glass Container */}
      <div 
        className="h-full rounded-[1.5rem] border overflow-hidden"
        style={{
          // Outer frame
          background: 'rgba(10, 20, 40, 0.45)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(0,255,195,0.15)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Inner fill container */}
        <div 
          className="h-full m-0.5 rounded-[1.25rem] overflow-hidden"
          style={{
            background: 'rgba(20, 30, 50, 0.6)',
            backdropFilter: 'blur(32px)'
          }}
        >
          {/* Gradient Header */}
          <div 
            className="h-10 flex items-center px-4"
            style={{ 
              background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)'
            }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-white" />
              <h3 className="text-base font-bold text-white font-['Noto_Sans']" style={{
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)'
              }}>
                Universal Alert Hub
              </h3>
            </div>
          </div>

          {/* Enhanced Alert Table */}
          <div className="p-4 h-full overflow-auto">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow 
                    className="border-white/10"
                    style={{ background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)' }}
                  >
                    <TableHead className="text-white font-['Noto_Sans'] text-xs font-bold" style={{
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
                    }}>Indicator</TableHead>
                    <TableHead className="text-white font-['Noto_Sans'] text-xs font-bold" style={{
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
                    }}>Deviation</TableHead>
                    <TableHead className="text-white font-['Noto_Sans'] text-xs font-bold" style={{
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
                    }}>Time</TableHead>
                    <TableHead className="text-white font-['Noto_Sans'] text-xs font-bold" style={{
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
                    }}>Category</TableHead>
                    <TableHead className="text-right text-white font-['Noto_Sans'] text-xs font-bold" style={{
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
                    }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert, index) => (
                    <motion.tr 
                      key={alert.id}
                      className="border-white/10 cursor-pointer transition-all duration-150 h-12"
                      style={{
                        background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.4 }}
                      whileHover={{
                        backgroundColor: 'rgba(0,255,195,0.10)',
                        transform: 'translateY(-2px)'
                      }}
                    >
                      <TableCell className="font-medium text-white text-xs font-['Noto_Sans']">
                        {alert.indicator}
                      </TableCell>
                      <TableCell className={cn('text-xs font-medium', getDeviationColor(alert.deviation))}>
                        {alert.deviation}
                      </TableCell>
                      <TableCell className="text-[#E0E0E0] text-xs font-['Noto_Sans']">
                        {alert.timestamp}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className="text-xs font-['Noto_Sans'] text-white"
                          style={{
                            background: '#00FFC3',
                            height: '16px'
                          }}
                        >
                          {alert.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <motion.button
                            onClick={() => handleAlertAction(alert.id, 'investigate')}
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                            style={{ background: '#00FFC3' }}
                            whileHover={{ 
                              boxShadow: '0 0 12px rgba(0,255,195,0.5)',
                              background: '#00E6B8'
                            }}
                          >
                            <Search size={12} className="text-white" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleAlertAction(alert.id, 'manage')}
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                            style={{ background: '#00FFC3' }}
                            whileHover={{ 
                              boxShadow: '0 0 12px rgba(0,255,195,0.5)',
                              background: '#00E6B8'
                            }}
                          >
                            <Settings size={12} className="text-white" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleAlertAction(alert.id, 'chart')}
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                            style={{ background: '#00FFC3' }}
                            whileHover={{ 
                              boxShadow: '0 0 12px rgba(0,255,195,0.5)',
                              background: '#00E6B8'
                            }}
                          >
                            <TrendingUp size={12} className="text-white" />
                          </motion.button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Enhanced Footer */}
            <div className="flex justify-end mt-4 pt-4 border-t border-white/10">
              <motion.button
                className="text-[#00B8FF] hover:text-white font-['Noto_Sans'] text-sm transition-all duration-200"
                whileHover={{
                  textDecoration: 'underline',
                  textDecorationColor: '#00FFC3',
                  textDecorationThickness: '2px'
                }}
              >
                View All Alerts ▶
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UniversalAlertHub;
