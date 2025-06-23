
import React, { useState } from 'react';
import { Video, Users, AtSign, ExternalLink, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface TeamsTaskActionsProps {
  taskId: string;
  taskTitle: string;
  assignee: string;
  bundleId: string;
}

const TeamsTaskActions: React.FC<TeamsTaskActionsProps> = ({
  taskId,
  taskTitle,
  assignee,
  bundleId
}) => {
  const [notifyAssignee, setNotifyAssignee] = useState(false);
  const { toast } = useToast();

  const handleStartMeeting = () => {
    const teamsUrl = `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${taskId}`;
    window.open(teamsUrl, '_blank');
    
    toast({
      title: "Teams Meeting Started",
      description: `Opening meeting for "${taskTitle}"`,
    });
  };

  const handleOpenInTeams = () => {
    const taskUrl = `https://teams.microsoft.com/l/entity/com.microsoft.teamspace.tab.planner/_djb2_msteams_prefix_${taskId}`;
    window.open(taskUrl, '_blank');
  };

  const handleNotifyAssignee = (enabled: boolean) => {
    setNotifyAssignee(enabled);
    if (enabled) {
      // In real implementation, this would send a Teams mention
      toast({
        title: "Assignee Notified",
        description: `@${assignee} will be mentioned in Teams`,
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Teams Meeting Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleStartMeeting}
        className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
      >
        <Video className="w-4 h-4 mr-2" />
        Start Teams Meeting
      </Button>

      {/* Open in Teams */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpenInTeams}
        className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Open in Teams
      </Button>

      {/* Notify Assignee Toggle */}
      <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
        <div className="flex items-center gap-2">
          <AtSign className="w-4 h-4 text-teal-400" />
          <span className="text-sm text-white">Notify Assignee</span>
        </div>
        <Switch
          checked={notifyAssignee}
          onCheckedChange={handleNotifyAssignee}
        />
      </div>

      {/* Quick @ Mention */}
      <div className="flex items-center bg-white/5 rounded-lg p-2">
        <Users className="w-4 h-4 mr-2 text-blue-400" />
        <input 
          className="bg-transparent flex-1 text-sm focus:outline-none text-white placeholder:text-gray-400"
          placeholder={`@${assignee} Quick mention...`}
        />
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-blue-400 hover:bg-blue-500/20"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default TeamsTaskActions;
