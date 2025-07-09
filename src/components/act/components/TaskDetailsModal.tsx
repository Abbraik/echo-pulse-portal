
import React, { useState, useEffect } from 'react';
import { useTeamsIntegration } from '@/hooks/useTeamsIntegration';
import { logger } from '@/utils/logger';
import { X, Video, Users, AtSign, ExternalLink, Calendar, MessageSquare, Send, Check, Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { useTasks } from '../hooks/useTasks';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
  bundleId: string;
}

interface ChatMessage {
  user: string;
  userColor: string;
  message: string;
  timestamp?: string;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  taskId,
  bundleId
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { tasks, updateTask, isLoading } = useTasks();
  
  const [editMode, setEditMode] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [mentionInput, setMentionInput] = useState('');
  const [notifyAssignee, setNotifyAssignee] = useState(false);
  
  // Form state for editing
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'to-do' as 'to-do' | 'in-progress' | 'completed',
    assignee: '',
    due_date: '',
    needs_approval: false
  });

  // Find the current task
  const currentTask = tasks?.find(task => task.id === taskId);

  useEffect(() => {
    if (currentTask) {
      setFormData({
        title: currentTask.title,
        description: currentTask.description || '',
        status: currentTask.status,
        assignee: currentTask.assignee,
        due_date: currentTask.due_date || '',
        needs_approval: currentTask.needs_approval
      });
    }
  }, [currentTask]);

  const handleSaveTask = async () => {
    if (!taskId) return;
    
    try {
      await updateTask(taskId, formData);
      setEditMode(false);
      toast({
        title: "Task Updated",
        description: "Task details have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartMeeting = () => {
    const teamsUrl = `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${taskId}`;
    window.open(teamsUrl, '_blank');
    
    toast({
      title: "Teams Meeting Started",
      description: `Opening meeting for "${currentTask?.title}"`,
    });
  };

  const handleOpenInTeams = () => {
    const taskUrl = `https://teams.microsoft.com/l/entity/com.microsoft.teamspace.tab.planner/_djb2_msteams_prefix_${taskId}`;
    window.open(taskUrl, '_blank');
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !taskId) return;

    const message: ChatMessage = {
      user: 'You',
      userColor: 'text-blue-400',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    try {
      const currentHistory = currentTask?.teams_chat_history || [];
      const updatedHistory = [...currentHistory, message];
      
      await updateTask(taskId, {
        teams_chat_history: updatedHistory
      });
      
      setNewMessage('');
      toast({
        title: "Message Sent",
        description: "Your message has been added to the Teams chat.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMention = async () => {
    if (!mentionInput.trim() || !taskId) return;

    const mention: ChatMessage = {
      user: 'System',
      userColor: 'text-purple-400',
      message: `@${mentionInput} has been mentioned`,
      timestamp: new Date().toISOString()
    };

    try {
      const currentHistory = currentTask?.teams_chat_history || [];
      const updatedHistory = [...currentHistory, mention];
      
      await updateTask(taskId, {
        teams_chat_history: updatedHistory
      });
      
      setMentionInput('');
      toast({
        title: "Mention Sent",
        description: `@${mentionInput} has been notified`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send mention. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'to-do': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (!currentTask) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden bg-black/90 border-white/20 backdrop-blur-xl">
        <DialogHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(currentTask.status)}`} />
              <DialogTitle className="text-xl font-bold text-white">
                {editMode ? (
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-xl font-bold bg-white/10 border-white/20"
                  />
                ) : (
                  currentTask.title
                )}
              </DialogTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(!editMode)}
                className="bg-white/10 border-white/20"
              >
                {editMode ? 'Cancel' : 'Edit'}
              </Button>
              {editMode && (
                <Button
                  size="sm"
                  onClick={handleSaveTask}
                  className="bg-teal-500 hover:bg-teal-600"
                  disabled={isLoading}
                >
                  Save
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden grid grid-cols-2 gap-6 p-6">
          {/* Left Column - Task Details */}
          <div className="space-y-6 overflow-y-auto">
            {/* Basic Info */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-4">Task Details</h3>
              
              <div className="space-y-4">
                {/* Assignee */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    {currentTask.assignee_avatar && <AvatarImage src={currentTask.assignee_avatar} />}
                    <AvatarFallback className="text-xs">
                      {currentTask.assignee_initial || currentTask.assignee.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">
                      {editMode ? (
                        <Input
                          value={formData.assignee}
                          onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                          className="bg-white/10 border-white/20"
                        />
                      ) : (
                        currentTask.assignee
                      )}
                    </p>
                    <p className="text-sm text-gray-400">Assignee</p>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Status</label>
                  {editMode ? (
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger className="bg-white/10 border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="to-do">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`${getStatusColor(currentTask.status)} text-white`}>
                      {currentTask.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Due Date</label>
                  {editMode ? (
                    <Input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="bg-white/10 border-white/20"
                    />
                  ) : (
                    <p className="text-white">{currentTask.due_date || 'No due date set'}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Description</label>
                  {editMode ? (
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-white/10 border-white/20"
                      rows={3}
                    />
                  ) : (
                    <p className="text-white">{currentTask.description || 'No description'}</p>
                  )}
                </div>

                {/* Needs Approval */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Needs Approval</span>
                  <Switch
                    checked={editMode ? formData.needs_approval : currentTask.needs_approval}
                    onCheckedChange={(checked) => {
                      if (editMode) {
                        setFormData({ ...formData, needs_approval: checked });
                      }
                    }}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>

            {/* Teams Integration Actions */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-4">Teams Integration</h3>
              
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  onClick={handleStartMeeting}
                  className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Start Teams Meeting
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleOpenInTeams}
                  className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Teams
                </Button>

                <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-teal-400" />
                    <span className="text-sm text-white">Notify Assignee</span>
                  </div>
                  <Switch
                    checked={notifyAssignee}
                    onCheckedChange={setNotifyAssignee}
                  />
                </div>

                <div className="flex items-center bg-white/5 rounded-lg p-2">
                  <AtSign className="w-4 h-4 mr-2 text-blue-400" />
                  <Input 
                    className="bg-transparent border-none text-sm focus:outline-none text-white placeholder:text-gray-400 flex-1"
                    placeholder="Quick mention..."
                    value={mentionInput}
                    onChange={(e) => setMentionInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleMention()}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMention}
                    className="h-6 px-2 text-blue-400 hover:bg-blue-500/20"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Teams Chat */}
          <div className="bg-white/5 rounded-lg border border-white/10 flex flex-col">
            <div className="border-b border-white/10 p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-medium text-white">Teams Chat</h3>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {currentTask.teams_chat_history && currentTask.teams_chat_history.length > 0 ? (
                  currentTask.teams_chat_history.map((msg: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`font-medium ${msg.userColor || 'text-white'}`}>
                          {msg.user}
                        </span>
                        {msg.timestamp && (
                          <span className="text-xs text-gray-400">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">{msg.message}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Message Input */}
            <div className="border-t border-white/10 p-4">
              <div className="flex items-center space-x-2">
                <Input
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
