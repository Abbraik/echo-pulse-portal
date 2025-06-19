
import React from 'react';
import { ExecutiveSummary } from '@/types/sg';
import { Button } from '@/components/ui/button';
import { Calendar, Download, FileText } from 'lucide-react';

interface ExecutiveSummaryPanelProps {
  data: ExecutiveSummary;
}

const ExecutiveSummaryPanel: React.FC<ExecutiveSummaryPanelProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Key Bullets */}
      <div>
        <h4 className="text-sm font-medium text-teal-400 mb-3">Executive Highlights</h4>
        <div className="space-y-2">
          {data.bullets.map((bullet, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm text-gray-200">{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Briefing */}
      <div className="bg-white/5 rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Calendar size={14} className="text-teal-400" />
          <span className="text-sm font-medium text-teal-400">Next Briefing</span>
        </div>
        <span className="text-sm text-white">{formatDate(data.nextBriefing)}</span>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
          <FileText size={14} className="mr-2" />
          Generate Report
        </Button>
        <Button variant="outline" className="w-full border-gray-500 text-gray-300 hover:bg-white/10">
          <Download size={14} className="mr-2" />
          Export PDF
        </Button>
      </div>
    </div>
  );
};

export default ExecutiveSummaryPanel;
