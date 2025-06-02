
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

  const handleAlertAction = (alertId: number, action: 'investigate' | 'manage' | 'chart') => {
    console.log(`Alert ${alertId}: ${action}`);
  };

  return (
    <motion.div 
      className={cn('h-full flex flex-col', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Gradient Header - matching ACT style */}
      <div 
        className="h-10 flex items-center px-6 flex-shrink-0"
        style={{ 
          background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)'
        }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-white" />
          <h3 className="text-base font-bold text-white font-['Noto_Sans']" style={{
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
            fontSize: '16px'
          }}>
            Universal Alert Hub
          </h3>
        </div>
      </div>

      {/* Enhanced Alert Table - matching ACT data table style */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow 
                className="border-white/10 hover:bg-transparent"
                style={{ 
                  background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
                  borderRadius: '8px'
                }}
              >
                <TableHead className="text-white font-['Noto_Sans'] font-bold" style={{
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                  fontSize: '12px'
                }}>Indicator</TableHead>
                <TableHead className="text-white font-['Noto_Sans'] font-bold" style={{
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                  fontSize: '12px'
                }}>Deviation</TableHead>
                <TableHead className="text-white font-['Noto_Sans'] font-bold" style={{
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                  fontSize: '12px'
                }}>Time</TableHead>
                <TableHead className="text-white font-['Noto_Sans'] font-bold" style={{
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                  fontSize: '12px'
                }}>Category</TableHead>
                <TableHead className="text-right text-white font-['Noto_Sans'] font-bold" style={{
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                  fontSize: '12px'
                }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert, index) => (
                <motion.tr 
                  key={alert.id}
                  className="border-white/10 cursor-pointer transition-all duration-200 h-12"
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
                  <TableCell className="font-medium text-white font-['Noto_Sans']" style={{ fontSize: '12px' }}>
                    {alert.indicator}
                  </TableCell>
                  <TableCell className={cn('font-medium', getDeviationColor(alert.deviation))} style={{ fontSize: '12px' }}>
                    {alert.deviation}
                  </TableCell>
                  <TableCell className="text-[#E0E0E0] font-['Noto_Sans']" style={{ fontSize: '12px' }}>
                    {alert.timestamp}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className="font-['Noto_Sans'] text-white"
                      style={{
                        background: alert.category === 'Strategic' ? '#00FFC3' : '#00B8FF',
                        fontSize: '10px',
                        height: '20px',
                        fontWeight: '500'
                      }}
                    >
                      {alert.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <motion.button
                        onClick={() => handleAlertAction(alert.id, 'investigate')}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                        style={{ background: '#00FFC3' }}
                        whileHover={{ 
                          boxShadow: '0 0 12px rgba(0,255,195,0.5)',
                          background: '#00E6B8'
                        }}
                      >
                        <Search size={14} className="text-white" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleAlertAction(alert.id, 'manage')}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                        style={{ background: '#00FFC3' }}
                        whileHover={{ 
                          boxShadow: '0 0 12px rgba(0,255,195,0.5)',
                          background: '#00E6B8'
                        }}
                      >
                        <Settings size={14} className="text-white" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleAlertAction(alert.id, 'chart')}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                        style={{ background: '#00FFC3' }}
                        whileHover={{ 
                          boxShadow: '0 0 12px rgba(0,255,195,0.5)',
                          background: '#00E6B8'
                        }}
                      >
                        <TrendingUp size={14} className="text-white" />
                      </motion.button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Enhanced Footer - matching ACT style */}
        <div className="flex justify-end mt-6 pt-4 border-t border-white/10">
          <motion.button
            className="text-[#00B8FF] hover:text-white font-['Noto_Sans'] transition-all duration-200"
            style={{ fontSize: '14px' }}
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
    </motion.div>
  );
};

export default UniversalAlertHub;
