
import React from 'react';
import { ExecutiveSummary } from '@/types/sg';
import { Button } from '@/components/ui/button';
import { Calendar, Download, FileText, Clock } from 'lucide-react';

interface ExecutiveSummaryPanelProps {
  data: ExecutiveSummary;
  actions?: {
    exportSummary: (format: 'pdf' | 'xlsx') => Promise<void>;
  };
}

const ExecutiveSummaryPanel: React.FC<ExecutiveSummaryPanelProps> = ({ data, actions }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExport = async (format: 'pdf' | 'xlsx') => {
    if (actions?.exportSummary) {
      await actions.exportSummary(format);
    }
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

      {/* Recent Actions */}
      {data.recentActions && (
        <div>
          <h4 className="text-sm font-medium text-teal-400 mb-3">Recent Actions</h4>
          <div className="space-y-1">
            {data.recentActions.map((action, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-blue-400 rounded-full mt-2.5 flex-shrink-0" />
                <span className="text-xs text-gray-300">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Deadlines */}
      {data.upcomingDeadlines && (
        <div>
          <h4 className="text-sm font-medium text-teal-400 mb-3">Upcoming Deadlines</h4>
          <div className="space-y-2">
            {data.upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="bg-white/5 rounded p-2 flex items-center justify-between">
                <div>
                  <span className="text-xs text-white font-medium">{deadline.title}</span>
                  <div className="text-xs text-gray-400">{deadline.type}</div>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Clock size={10} />
                  <span>{formatDate(deadline.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
        <Button 
          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          onClick={() => handleExport('pdf')}
        >
          <FileText size={14} className="mr-2" />
          Generate PDF Report
        </Button>
        <Button 
          variant="outline" 
          className="w-full border-gray-500 text-gray-300 hover:bg-white/10"
          onClick={() => handleExport('xlsx')}
        >
          <Download size={14} className="mr-2" />
          Export Excel
        </Button>
      </div>
    </div>
  );
};

export default ExecutiveSummaryPanel;
