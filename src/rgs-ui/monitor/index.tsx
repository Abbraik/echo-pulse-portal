import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Sparkline } from '@/components/ui/sparkline';
import { DEBandBadge } from '@/components/ui/de-band-badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFeatureFlags } from '@/hooks/use-feature-flags';
import { 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Filter,
  RefreshCw,
  BarChart3,
  Activity
} from 'lucide-react';

const loopData = [
  {
    id: 'healthcare-001',
    name: 'Healthcare Access Loop',
    tri: 2.3,
    deBand: 'critical' as const,
    sparklineData: [65, 59, 80, 81, 56, 55, 40, 35, 42, 28],
    status: 'critical',
    lastUpdate: '2 mins ago',
    relRecommendation: 'Increase funding allocation by 15%'
  },
  {
    id: 'education-002', 
    name: 'Education Quality Loop',
    tri: 6.7,
    deBand: 'warning' as const,
    sparklineData: [45, 52, 49, 58, 62, 65, 68, 70, 69, 72],
    status: 'warning',
    lastUpdate: '5 mins ago',
    relRecommendation: 'Strengthen teacher training programs'
  },
  {
    id: 'transport-003',
    name: 'Transport Infrastructure',
    tri: 8.2,
    deBand: 'healthy' as const,
    sparklineData: [78, 82, 85, 87, 89, 91, 88, 90, 92, 95],
    status: 'healthy',
    lastUpdate: '1 min ago',
    relRecommendation: 'Maintain current investment levels'
  },
  {
    id: 'housing-004',
    name: 'Housing Affordability',
    tri: 4.1,
    deBand: 'warning' as const,
    sparklineData: [42, 38, 45, 48, 52, 49, 46, 44, 41, 39],
    status: 'warning',
    lastUpdate: '8 mins ago',
    relRecommendation: 'Implement rent stabilization measures'
  },
  {
    id: 'environment-005',
    name: 'Environmental Sustainability',
    tri: 1.8,
    deBand: 'critical' as const,
    sparklineData: [25, 22, 28, 30, 27, 24, 21, 18, 15, 12],
    status: 'critical',
    lastUpdate: '3 mins ago',
    relRecommendation: 'Immediate carbon reduction initiatives'
  }
];

const RgsMonitorZone: React.FC = () => {
  const { flags } = useFeatureFlags();
  const [showLowTRI, setShowLowTRI] = useState(false);
  const [filteredLoops, setFilteredLoops] = useState(loopData);

  React.useEffect(() => {
    if (showLowTRI) {
      setFilteredLoops(loopData.filter(loop => loop.tri <= 3));
    } else {
      setFilteredLoops(loopData);
    }
  }, [showLowTRI]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-6"
    >
      {/* PulseBar at Top */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              System Pulse
            </h2>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <span className="text-2xl">😱</span>
              <div>
                <div className="text-sm font-medium">Loops in Distress</div>
                <div className="text-2xl font-bold text-red-400">2</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <span className="text-2xl">📅</span>
              <div>
                <div className="text-sm font-medium">Sprints Due</div>
                <div className="text-2xl font-bold text-yellow-400">3</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <span className="text-2xl">👥</span>
              <div>
                <div className="text-sm font-medium">Juror Approvals</div>
                <div className="text-2xl font-bold text-blue-400">7</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loop List with Controls */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <BarChart3 className="h-5 w-5 text-primary" />
              System Loops Overview
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm">Show TRI ≤3</span>
                <Switch 
                  checked={showLowTRI} 
                  onCheckedChange={setShowLowTRI}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loop Name</TableHead>
                  <TableHead>TRI Score</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>DE-Band</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoops.map((loop) => (
                  <TableRow key={loop.id} className="hover:bg-white/5">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <span>{loop.name}</span>
                        <div className="w-16 h-8">
                          <Sparkline 
                            data={loop.sparklineData} 
                            color={loop.tri <= 3 ? '#ef4444' : loop.tri <= 5 ? '#f59e0b' : '#22c55e'}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg">{loop.tri}</span>
                        {loop.tri <= 3 ? (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-12 h-6">
                        <Sparkline 
                          data={loop.sparklineData.slice(-5)} 
                          color={loop.tri <= 3 ? '#ef4444' : '#22c55e'}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                          <DEBandBadge status={loop.deBand} relRecommendation={loop.relRecommendation} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm font-medium">REL⁺ Recommendation:</p>
                          <p className="text-sm">{loop.relRecommendation}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          loop.status === 'critical' ? 'destructive' : 
                          loop.status === 'warning' ? 'secondary' : 
                          'default'
                        }
                      >
                        {loop.status === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {loop.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {loop.lastUpdate}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Primary CTA */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Button size="lg" className="w-full h-12 text-lg font-semibold">
              <Eye className="mr-2 h-5 w-5" />
              Review TRI
            </Button>
            <p className="text-sm text-muted-foreground">
              Analyze system responsiveness indicators across all loops
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Critical Loops Banner */}
      {filteredLoops.some(loop => loop.tri <= 3) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div>
              <p className="font-medium">Critical loops detected</p>
              <p className="text-sm text-muted-foreground">
                {filteredLoops.filter(loop => loop.tri <= 3).length} loops have TRI ≤ 3 for two consecutive cycles
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            See best practices →
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RgsMonitorZone;