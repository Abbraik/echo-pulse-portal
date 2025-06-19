
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PanelHeader from '../shared/PanelHeader';

interface ExecutiveSummaryPanelProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isHovered: boolean;
}

const todayDigest = [
  'DEI score improved by 2.3% this week',
  'Resource allocation optimized across 3 zones',
  'Emergency protocol activated in region 7',
  'Cabinet meeting scheduled for Thursday'
];

const ExecutiveSummaryPanel: React.FC<ExecutiveSummaryPanelProps> = ({
  isFullscreen,
  onToggleFullscreen,
  isHovered
}) => {
  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        title="Executive Summary"
        subtitle="Today's Overview"
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />

      <div className="flex-1 p-4 space-y-4">
        {/* Today's Digest */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3 flex items-center">
            <FileText size={14} className="mr-2" />
            Today's Digest
          </h4>
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            {todayDigest.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Export PDF */}
        <div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg shadow-lg">
              <Download size={14} className="mr-2" />
              Export Executive Report
            </Button>
          </motion.div>
        </div>

        {/* Upcoming Briefing */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3 flex items-center">
            <Calendar size={14} className="mr-2" />
            Upcoming
          </h4>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-sm font-medium text-white mb-1">Cabinet Meeting</p>
            <p className="text-xs text-gray-400 mb-2">In 2 days • 10:00 AM</p>
            <Button size="sm" variant="outline" className="text-xs border-teal-500/50 text-teal-400 hover:bg-teal-500/20">
              View Agenda ▶
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummaryPanel;
