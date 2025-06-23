
import React, { useState } from 'react';
import { X, Calendar, User, Clock, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTasks } from '../hooks/useTasks';
import { useTranslation } from '@/hooks/use-translation';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  bundleId?: string;
  laneId?: string;
  laneTitle?: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  bundleId,
  laneId,
  laneTitle
}) => {
  const { t } = useTranslation();
  const { createTask, isCreating } = useTasks(bundleId);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    assignee_initial: '',
    due_date: '',
    status: 'to-do' as 'to-do' | 'in-progress' | 'completed',
    needs_approval: false,
    gantt_start: 0,
    gantt_duration: 7,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.assignee.trim()) {
      return;
    }

    try {
      await createTask({
        ...formData,
        bundle_id: bundleId,
        assignee_initial: formData.assignee.split(' ').map(n => n[0]).join('').toUpperCase(),
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        assignee: '',
        assignee_initial: '',
        due_date: '',
        status: 'to-do',
        needs_approval: false,
        gantt_start: 0,
        gantt_duration: 7,
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px] backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-white">
            {t('createNewTask', { defaultValue: 'Create New Task' })}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white font-medium">
              {t('taskTitle', { defaultValue: 'Task Title' })} *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={t('enterTaskTitle', { defaultValue: 'Enter task title...' })}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white font-medium">
              {t('description', { defaultValue: 'Description' })}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('enterTaskDescription', { defaultValue: 'Enter task description...' })}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[80px]"
              rows={3}
            />
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label htmlFor="assignee" className="text-white font-medium">
              {t('assignee', { defaultValue: 'Assignee' })} *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                id="assignee"
                value={formData.assignee}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
                placeholder={t('enterAssigneeName', { defaultValue: 'Enter assignee name...' })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pl-10"
                required
              />
            </div>
          </div>

          {/* Due Date & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date" className="text-white font-medium">
                {t('dueDate', { defaultValue: 'Due Date' })}
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => handleInputChange('due_date', e.target.value)}
                  className="bg-white/10 border-white/20 text-white pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-white font-medium">
                {t('status', { defaultValue: 'Status' })}
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="to-do">{t('toDo', { defaultValue: 'To Do' })}</SelectItem>
                  <SelectItem value="in-progress">{t('inProgress', { defaultValue: 'In Progress' })}</SelectItem>
                  <SelectItem value="completed">{t('completed', { defaultValue: 'Completed' })}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Gantt Settings Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gantt_start" className="text-white font-medium">
                {t('startDay', { defaultValue: 'Start Day' })}
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  id="gantt_start"
                  type="number"
                  value={formData.gantt_start}
                  onChange={(e) => handleInputChange('gantt_start', parseInt(e.target.value) || 0)}
                  className="bg-white/10 border-white/20 text-white pl-10"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gantt_duration" className="text-white font-medium">
                {t('duration', { defaultValue: 'Duration (days)' })}
              </Label>
              <div className="relative">
                <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  id="gantt_duration"
                  type="number"
                  value={formData.gantt_duration}
                  onChange={(e) => handleInputChange('gantt_duration', parseInt(e.target.value) || 1)}
                  className="bg-white/10 border-white/20 text-white pl-10"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Needs Approval Toggle */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="space-y-1">
              <Label className="text-white font-medium">
                {t('needsApproval', { defaultValue: 'Needs Approval' })}
              </Label>
              <p className="text-xs text-white/60">
                {t('approvalDescription', { defaultValue: 'Task requires approval before completion' })}
              </p>
            </div>
            <Switch
              checked={formData.needs_approval}
              onCheckedChange={(checked) => handleInputChange('needs_approval', checked)}
            />
          </div>

          {/* Lane Info */}
          {laneTitle && (
            <div className="p-3 bg-teal-500/20 border border-teal-500/30 rounded-lg">
              <p className="text-teal-300 text-sm">
                {t('taskWillBeAddedTo', { defaultValue: 'Task will be added to' })}: <span className="font-semibold">{laneTitle}</span>
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {t('cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || !formData.assignee.trim() || isCreating}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/40"
            >
              {isCreating ? t('creating', { defaultValue: 'Creating...' }) : t('createTask', { defaultValue: 'Create Task' })}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
