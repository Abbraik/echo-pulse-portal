
import React, { useState, useEffect } from 'react';
import { useTeamsIntegration } from '@/hooks/useTeamsIntegration';
import { logger } from '@/utils/logger';
import { 
  MessageSquare, 
  FileText, 
  BarChart3, 
  X, 
  Users, 
  Upload, 
  FileIcon, 
  Plus,
  Bell,
  ExternalLink,
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamsCollaborationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bundleId: string;
  bundleName: string;
}

const TeamsCollaborationPanel: React.FC<TeamsCollaborationPanelProps> = ({
  isOpen,
  onClose,
  bundleId,
  bundleName
}) => {
  const [activeTab, setActiveTab] = useState<'discussions' | 'files' | 'insights'>('discussions');
  const [unreadMentions, setUnreadMentions] = useState(0);
  const [escalations, setEscalations] = useState([
    { id: '1', task: 'Resource Audit Review', assignee: 'Sarah Chen', daysPending: 3 },
    { id: '2', task: 'Sustainability Metrics', assignee: 'Mohammed Al-Farsi', daysPending: 2 }
  ]);

  // Simulate polling for Teams mentions
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        // Simulate API call to check for mentions
        setUnreadMentions(prev => Math.random() > 0.7 ? prev + 1 : prev);
      }, 60000); // Poll every 60 seconds

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleStartMeeting = () => {
    // Generate Teams meeting link for the bundle
    const teamsUrl = `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${bundleId}`;
    window.open(teamsUrl, '_blank');
  };

  const handleNotifyLead = (escalation: any) => {
    // Send Teams mention notification
    console.log(`Notifying lead about escalation: ${escalation.task}`);
    // In real implementation, this would call Teams API
  };

  const handleCreateSubTask = () => {
    // Open Teams task creation
    const tasksUrl = `https://teams.microsoft.com/l/entity/com.microsoft.teamspace.tab.planner`;
    window.open(tasksUrl, '_blank');
  };

  const tabs = [
    {
      id: 'discussions',
      label: 'Discussions',
      icon: MessageSquare,
      badge: unreadMentions > 0 ? unreadMentions : null
    },
    {
      id: 'files',
      label: 'Files',
      icon: FileText,
      badge: null
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: BarChart3,
      badge: null
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-96 z-50 flex flex-col"
          style={{
            background: 'rgba(20, 30, 50, 0.85)',
            backdropFilter: 'blur(24px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Header */}
          <div 
            className="p-4 border-b border-white/20"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-white text-sm">
                Teams Collaboration
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-xs text-gray-300 mb-3">
              {bundleName}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartMeeting}
                className="flex-1 text-xs bg-white/5 border-white/20 text-white hover:bg-white/10"
                title="Start quick huddle in Teams"
              >
                <Video className="h-3 w-3 mr-1" />
                Quick Huddle
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateSubTask}
                className="flex-1 text-xs bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <Plus className="h-3 w-3 mr-1" />
                Sub-Task
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 p-3 text-xs flex items-center justify-center gap-1 transition-colors relative ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                  {tab.badge && (
                    <Badge className="h-4 px-1 text-xs bg-teal-500 text-white ml-1">
                      {tab.badge}
                    </Badge>
                  )}
                  {tab.id === 'discussions' && unreadMentions > 0 && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'discussions' && (
              <div className="h-full flex flex-col">
                <div 
                  className="p-2 border-b border-white/10"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(16px)'
                  }}
                >
                  <div className="text-xs text-white font-medium">
                    Bundle Discussion Channel
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="h-full bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                    <div className="text-center text-gray-400 text-sm">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <div>Teams Chat Embed</div>
                      <div className="text-xs mt-1">
                        Connect to view bundle discussions
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="h-full flex flex-col">
                <div 
                  className="p-2 border-b border-white/10 flex gap-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(16px)'
                  }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-white hover:bg-white/10"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-white hover:bg-white/10"
                  >
                    <FileIcon className="h-3 w-3 mr-1" />
                    New Doc
                  </Button>
                </div>
                <div className="flex-1 p-4">
                  <div className="h-full bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                    <div className="text-center text-gray-400 text-sm">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <div>Teams Files Embed</div>
                      <div className="text-xs mt-1">
                        Connect to view bundle files
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="h-full flex flex-col">
                {/* KPI Mini Cards */}
                <div className="p-3 space-y-2 border-b border-white/10">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                      <div className="text-xs text-gray-300">DEI Stability</div>
                      <div className="text-lg font-bold text-teal-400">87%</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                      <div className="text-xs text-gray-300">Bundle Progress</div>
                      <div className="text-lg font-bold text-blue-400">65%</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                      <div className="text-xs text-gray-300">Escalations</div>
                      <div className="text-lg font-bold text-amber-400">{escalations.length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-4">
                  <div className="h-full bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                    <div className="text-center text-gray-400 text-sm">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <div>KPI Dashboard Embed</div>
                      <div className="text-xs mt-1">
                        Connect Power BI or Analytics
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Escalations Panel */}
          {escalations.length > 0 && (
            <div className="border-t border-white/10 p-3">
              <div className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                <Bell className="h-3 w-3" />
                Escalations
              </div>
              <div className="space-y-2">
                {escalations.map((escalation) => (
                  <div 
                    key={escalation.id}
                    className="bg-amber-500/10 border border-amber-400/20 rounded-lg p-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">
                          {escalation.task}
                        </div>
                        <div className="text-xs text-gray-400">
                          {escalation.assignee} • {escalation.daysPending}d pending
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNotifyLead(escalation)}
                        className="h-6 px-2 text-xs text-amber-400 hover:bg-amber-500/20"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        Notify
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeamsCollaborationPanel;
