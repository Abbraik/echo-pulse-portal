
import React from 'react';
import { ExecutiveSummary } from '@/types/sg';
import { Button } from '@/components/ui/button';
import { Calendar, Download, FileText, Clock, CheckCircle, AlertCircle, Activity } from 'lucide-react';

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

  const getDeadlineIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return <FileText size={12} className="text-blue-400" />;
      case 'strategic':
        return <Activity size={12} className="text-teal-400" />;
      case 'directive':
        return <AlertCircle size={12} className="text-orange-400" />;
      default:
        return <Calendar size={12} className="text-gray-400" />;
    }
  };

  const getDeadlineUrgency = (dateString: string) => {
    const deadlineDate = new Date(dateString);
    const now = new Date();
    const timeDiff = deadlineDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff <= 1) return 'border-red-500/50 bg-red-500/10';
    if (daysDiff <= 3) return 'border-orange-500/50 bg-orange-500/10';
    return 'border-blue-500/30 bg-blue-500/5';
  };

  return (
    <div className="space-y-6">
      {/* Executive Highlights */}
      <div className="glass-panel-cinematic p-4">
        <h4 className="text-sm font-medium text-teal-400 mb-4 font-noto flex items-center">
          <Activity size={14} className="mr-2" />
          Executive Highlights
        </h4>
        <div className="space-y-3">
          {data.bullets.map((bullet, index) => (
            <div key={index} className="flex items-start space-x-3 group">
              <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-200" />
              <span className="text-sm text-gray-200 font-noto leading-relaxed group-hover:text-white transition-colors duration-200">
                {bullet}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Actions */}
      {data.recentActions && (
        <div className="glass-panel-cinematic p-4">
          <h4 className="text-sm font-medium text-teal-400 mb-4 font-noto flex items-center">
            <CheckCircle size={14} className="mr-2" />
            Recent Actions
          </h4>
          <div className="space-y-2">
            {data.recentActions.map((action, index) => (
              <div key={index} className="flex items-start space-x-3 group">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2.5 flex-shrink-0 group-hover:scale-125 transition-transform duration-200" />
                <span className="text-xs text-gray-300 font-noto leading-relaxed group-hover:text-gray-200 transition-colors duration-200">
                  {action}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Deadlines */}
      {data.upcomingDeadlines && (
        <div className="glass-panel-cinematic p-4">
          <h4 className="text-sm font-medium text-teal-400 mb-4 font-noto flex items-center">
            <Clock size={14} className="mr-2" />
            Upcoming Deadlines
          </h4>
          <div className="space-y-3">
            {data.upcomingDeadlines.map((deadline, index) => (
              <div key={index} className={`glass-panel p-3 border transition-all duration-300 hover:neon-border ${getDeadlineUrgency(deadline.date)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                      {getDeadlineIcon(deadline.type)}
                    </div>
                    <div>
                      <span className="text-sm text-white font-noto-medium">{deadline.title}</span>
                      <div className="text-xs text-gray-400 font-mono capitalize">{deadline.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Clock size={10} />
                    <span className="font-mono">{formatDate(deadline.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Briefing */}
      <div className="glass-panel-cinematic p-4 border border-teal-500/30">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 rounded-xl bg-teal-500/20 backdrop-blur-sm">
            <Calendar size={16} className="text-teal-400" />
          </div>
          <span className="text-sm font-medium text-teal-400 font-noto">Next Briefing</span>
        </div>
        <div className="pl-11">
          <span className="text-lg text-white font-noto-medium">{formatDate(data.nextBriefing)}</span>
        </div>
      </div>

      {/* Export Actions */}
      <div className="space-y-3">
        <Button 
          className="w-full bg-teal-600/20 hover:bg-teal-600/40 text-teal-400 border border-teal-500/30 hover:border-teal-400/50 backdrop-blur-sm transition-all duration-200"
          onClick={() => handleExport('pdf')}
        >
          <FileText size={14} className="mr-2" />
          Generate PDF Report
        </Button>
        <Button 
          variant="outline" 
          className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400/50 backdrop-blur-sm transition-all duration-200"
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
