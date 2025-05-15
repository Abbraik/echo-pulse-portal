
import React, { useState } from 'react';
import { MessageSquare, Calendar, AtSign, Bell, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';

interface DeliveryChainsProps {
  highlightBundle: string | null;
}

const DeliveryChains: React.FC<DeliveryChainsProps> = ({ highlightBundle }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'kanban' | 'gantt'>('kanban');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  
  // Sample data for tasks
  const lanes = [
    { 
      id: 'l1', 
      title: 'Improve Resource Efficiency',
      tasks: [
        { id: 't1', title: 'Conduct Resource Audit', status: 'in-progress', assignee: 'Sarah Chen', dueDate: '2025-05-25', needsApproval: true },
        { id: 't2', title: 'Develop Allocation Model', status: 'planned', assignee: 'Alex Johnson', dueDate: '2025-06-10', needsApproval: false },
      ]
    },
    { 
      id: 'l2', 
      title: 'Increase Sustainability',
      tasks: [
        { id: 't3', title: 'Sustainability Assessment', status: 'completed', assignee: 'Mohammed Al-Farsi', dueDate: '2025-05-10', needsApproval: false },
        { id: 't4', title: 'Create Metrics Dashboard', status: 'in-progress', assignee: 'Priya Sharma', dueDate: '2025-05-30', needsApproval: true },
      ]
    },
    { 
      id: 'l3', 
      title: 'Reduce External Dependency',
      tasks: [
        { id: 't5', title: 'Local Resource Mapping', status: 'planned', assignee: 'David Wang', dueDate: '2025-06-15', needsApproval: false },
        { id: 't6', title: 'Capacity Building Program', status: 'planned', assignee: 'Fatima Al-Mazrouei', dueDate: '2025-07-01', needsApproval: false },
      ]
    }
  ];
  
  // Function to toggle task expansion
  const toggleTaskExpansion = (taskId: string) => {
    if (expandedTask === taskId) {
      setExpandedTask(null);
    } else {
      setExpandedTask(taskId);
    }
  };
  
  // Get color based on task status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'planned': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <GlassCard className="w-full">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-lg font-medium">{t('deliveryChainsManager', { defaultValue: 'Delivery Chains Manager' })}</h2>
        
        <div className="flex bg-white/5 rounded-lg p-1">
          <button 
            className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'kanban' ? 'bg-white/10' : ''}`}
            onClick={() => setActiveTab('kanban')}
          >
            {t('kanban', { defaultValue: 'Kanban' })}
          </button>
          <button 
            className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'gantt' ? 'bg-white/10' : ''}`}
            onClick={() => setActiveTab('gantt')}
          >
            {t('gantt', { defaultValue: 'Gantt' })}
          </button>
        </div>
      </div>
      
      {activeTab === 'kanban' && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lanes.map((lane) => (
              <div key={lane.id} className="bg-white/5 rounded-lg p-4">
                <h3 className="font-medium mb-3">{lane.title}</h3>
                
                <div className="space-y-3">
                  {lane.tasks.map((task) => (
                    <motion.div 
                      key={task.id}
                      className={`bg-white/5 border ${task.id === 't1' && highlightBundle ? 'border-teal-500 ring-1 ring-teal-500' : 'border-white/10'} rounded-lg p-3 cursor-grab active:cursor-grabbing`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      animate={task.id === 't1' && highlightBundle ? {
                        y: [0, -5, 0],
                        transition: {
                          duration: 0.5,
                          repeat: 3
                        }
                      } : {}}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)} mr-2`} />
                          <span className="font-medium">{task.title}</span>
                        </div>
                        
                        {task.needsApproval && (
                          <div className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full flex items-center">
                            <Bell className="w-3 h-3 mr-1" />
                            {t('needsApproval', { defaultValue: 'Needs Approval' })}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-400 mb-2">
                        {t('assignee', { defaultValue: 'Assignee' })}: {task.assignee}
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{t('dueDate', { defaultValue: 'Due' })}: {task.dueDate}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="p-1 h-auto text-xs hover:bg-white/10"
                          onClick={() => toggleTaskExpansion(task.id)}
                        >
                          {expandedTask === task.id ? t('collapse', { defaultValue: 'Collapse' }) : t('expand', { defaultValue: 'Expand' })}
                        </Button>
                      </div>
                      
                      {expandedTask === task.id && (
                        <motion.div 
                          className="mt-3 pt-3 border-t border-white/10"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="space-y-3">
                            {/* MS Teams collaboration tools */}
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center text-sm text-blue-400 mb-2">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                {t('teamsChat', { defaultValue: 'Teams Chat' })}
                              </div>
                              <div className="text-xs bg-white/5 rounded p-2">
                                <div className="mb-1"><span className="text-teal-400">Sarah:</span> Updated resource allocation sheet</div>
                                <div><span className="text-purple-400">Mohammed:</span> Will review tomorrow</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <div className="flex-1 mr-2">
                                <div className="flex items-center bg-white/5 rounded-lg p-2">
                                  <AtSign className="w-4 h-4 mr-2 text-blue-400" />
                                  <input 
                                    className="bg-transparent flex-1 text-sm focus:outline-none"
                                    placeholder={t('mentionTeamMember', { defaultValue: 'Mention someone...' }) as string}
                                  />
                                </div>
                              </div>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                              >
                                <Calendar className="w-4 h-4 mr-1" />
                                {t('scheduleMeeting', { defaultValue: 'Schedule' })}
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="text-sm mr-2">{t('needsApproval', { defaultValue: 'Needs Approval' })}</span>
                                <Switch checked={task.needsApproval} />
                              </div>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                {t('markComplete', { defaultValue: 'Complete' })}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                  
                  {/* Add task placeholder */}
                  <div className="border border-dashed border-white/20 rounded-lg p-3 text-center text-sm text-gray-400 cursor-pointer hover:bg-white/5">
                    + {t('addTask', { defaultValue: 'Add Task' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'gantt' && (
        <div className="p-4">
          {/* Simplified Gantt chart visualization */}
          <div className="relative">
            {/* Timeline header */}
            <div className="flex border-b border-white/10 pb-2">
              <div className="w-1/4">Task</div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`week-${i}`} className="flex-1 text-center text-sm">
                  {t('weekAbbr', { defaultValue: 'W' })} {i+1}
                </div>
              ))}
            </div>
            
            {/* Task rows */}
            {lanes.flatMap(lane => lane.tasks).map((task, i) => (
              <div key={task.id} className={`flex items-center h-12 ${i % 2 === 0 ? 'bg-white/5' : ''}`}>
                <div className="w-1/4 px-2 truncate">{task.title}</div>
                <div className="flex-1 relative">
                  {/* Task bar */}
                  <div 
                    className={`absolute h-6 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500/50' : 
                      task.status === 'in-progress' ? 'bg-blue-500/50' : 'bg-gray-500/50'
                    } border ${
                      task.status === 'completed' ? 'border-green-600' : 
                      task.status === 'in-progress' ? 'border-blue-600' : 'border-gray-600'
                    }`}
                    style={{
                      left: `${(i*10) % 60}%`, 
                      width: `${30 + (i*5) % 30}%`, 
                      top: '3px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-400">
            {t('ganttChartNote', { defaultValue: 'Drag task bars to reschedule or resize them to change duration' })}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default DeliveryChains;
