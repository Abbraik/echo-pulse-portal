import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Calendar, AtSign, Bell, Check, ChevronDown, Plus, Search, Users, Filter, Clock, ArrowRight, Download, Share2, X, Send, Video, ExternalLink } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import TeamsCollaborationPanel from './components/TeamsCollaborationPanel';
import CreateTaskModal from './components/CreateTaskModal';
import TaskDetailsModal from './components/TaskDetailsModal';
import { useTasks, parseChatHistory } from './hooks/useTasks';

interface DeliveryChainsProps {
  highlightBundle: string | null;
}

// Define task interface
interface Task {
  id: string;
  title: string;
  status: 'to-do' | 'in-progress' | 'completed';
  assignee: string;
  assigneeAvatar?: string;
  assigneeInitial?: string;
  dueDate: string;
  needsApproval: boolean;
  teamsChatHistory?: {
    user: string;
    userColor: string;
    message: string;
  }[];
  dependencies?: string[];
  ganttStart?: number; // Day offset
  ganttDuration?: number; // Days
}

// Define lane/objective interface
interface Lane {
  id: string;
  title: string;
  icon?: string;
  color?: string;
  tasks: Task[];
}

const DeliveryChains: React.FC<DeliveryChainsProps> = ({
  highlightBundle
}) => {
  const {
    t,
    isRTL,
    language
  } = useTranslation();
  const [activeTab, setActiveTab] = useState<'kanban' | 'gantt'>('kanban');
  const [displayMode, setDisplayMode] = useState<'simple' | 'pro'>('simple');
  const [ganttTimeScale, setGanttTimeScale] = useState<number>(14); // Days visible
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);
  const [showTeamsPanel, setShowTeamsPanel] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedLaneForTask, setSelectedLaneForTask] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Get tasks from backend
  const {
    tasks: backendTasks,
    isLoading: tasksLoading
  } = useTasks();

  // Refs for drag interaction
  const dragTaskRef = useRef<string | null>(null);
  const dragOverLaneRef = useRef<string | null>(null);

  // Sample data for lanes/objectives with tasks - now we'll merge with backend tasks
  const [lanes, setLanes] = useState<Lane[]>([{
    id: 'l1',
    title: 'Improve Resource Efficiency',
    color: '#38bdf8',
    tasks: [{
      id: 't1',
      title: 'Conduct Resource Audit',
      status: 'in-progress',
      assignee: 'Sarah Chen',
      assigneeAvatar: 'https://i.pravatar.cc/150?img=1',
      assigneeInitial: 'SC',
      dueDate: '2025-05-25',
      needsApproval: true,
      teamsChatHistory: [{
        user: 'Sarah',
        userColor: 'text-teal-400',
        message: 'Updated resource allocation sheet'
      }, {
        user: 'Mohammed',
        userColor: 'text-purple-400',
        message: 'Will review tomorrow'
      }],
      ganttStart: 0,
      ganttDuration: 14
    }, {
      id: 't2',
      title: 'Develop Allocation Model',
      status: 'to-do',
      assignee: 'Alex Johnson',
      assigneeAvatar: 'https://i.pravatar.cc/150?img=2',
      assigneeInitial: 'AJ',
      dueDate: '2025-06-10',
      needsApproval: false,
      teamsChatHistory: [],
      ganttStart: 14,
      ganttDuration: 21,
      dependencies: ['t1']
    }]
  }, {
    id: 'l2',
    title: 'Increase Sustainability',
    color: '#4ade80',
    tasks: [{
      id: 't3',
      title: 'Sustainability Assessment',
      status: 'completed',
      assignee: 'Mohammed Al-Farsi',
      assigneeAvatar: 'https://i.pravatar.cc/150?img=3',
      assigneeInitial: 'MA',
      dueDate: '2025-05-10',
      needsApproval: false,
      teamsChatHistory: [],
      ganttStart: 0,
      ganttDuration: 7
    }, {
      id: 't4',
      title: 'Create Metrics Dashboard',
      status: 'in-progress',
      assignee: 'Priya Sharma',
      assigneeAvatar: 'https://i.pravatar.cc/150?img=4',
      assigneeInitial: 'PS',
      dueDate: '2025-05-30',
      needsApproval: true,
      teamsChatHistory: [{
        user: 'Priya',
        userColor: 'text-blue-400',
        message: 'Dashboard mock ready for review'
      }],
      ganttStart: 7,
      ganttDuration: 14,
      dependencies: ['t3']
    }]
  }, {
    id: 'l3',
    title: 'Reduce External Dependency',
    color: '#a78bfa',
    tasks: [{
      id: 't5',
      title: 'Local Resource Mapping',
      status: 'to-do',
      assignee: 'David Wang',
      assigneeAvatar: 'https://i.pravatar.cc/150?img=5',
      assigneeInitial: 'DW',
      dueDate: '2025-06-15',
      needsApproval: false,
      teamsChatHistory: [],
      ganttStart: 21,
      ganttDuration: 14
    }, {
      id: 't6',
      title: 'Capacity Building Program',
      status: 'to-do',
      assignee: 'Fatima Al-Mazrouei',
      assigneeAvatar: 'https://i.pravatar.cc/150?img=6',
      assigneeInitial: 'FM',
      dueDate: '2025-07-01',
      needsApproval: false,
      teamsChatHistory: [],
      ganttStart: 35,
      ganttDuration: 21,
      dependencies: ['t5']
    }]
  }]);

  // Merge backend tasks with frontend lanes
  const getMergedLanes = () => {
    if (!backendTasks || tasksLoading) return lanes;
    const mergedLanes = [...lanes];

    // Add backend tasks to appropriate lanes or create new ones
    backendTasks.forEach(backendTask => {
      const mappedTask: Task = {
        id: backendTask.id,
        title: backendTask.title,
        status: backendTask.status,
        assignee: backendTask.assignee,
        assigneeAvatar: backendTask.assignee_avatar,
        assigneeInitial: backendTask.assignee_initial || backendTask.assignee.split(' ').map(n => n[0]).join('').toUpperCase(),
        dueDate: backendTask.due_date || new Date().toISOString().split('T')[0],
        needsApproval: backendTask.needs_approval,
        teamsChatHistory: parseChatHistory(backendTask.teams_chat_history),
        dependencies: backendTask.dependencies || [],
        ganttStart: backendTask.gantt_start || 0,
        ganttDuration: backendTask.gantt_duration || 7
      };

      // Add to first lane for now (in real app, you'd have lane assignment logic)
      if (mergedLanes[0]) {
        const existingTaskIndex = mergedLanes[0].tasks.findIndex(t => t.id === mappedTask.id);
        if (existingTaskIndex === -1) {
          mergedLanes[0].tasks.push(mappedTask);
        }
      }
    });
    return mergedLanes;
  };

  // Calculate completed task counts for lane progress badges
  const getLaneProgress = (lane: Lane) => {
    const totalTasks = lane.tasks.length;
    const completedTasks = lane.tasks.filter(t => t.status === 'completed').length;
    return `${completedTasks}/${totalTasks}`;
  };

  // Function to toggle task expansion
  const toggleTaskExpansion = (taskId: string) => {
    

    
  };

  // Function to toggle chat panel
  const toggleChatPanel = (taskId: string) => {
    

    
  };

  // Get color based on task status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'to-do':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get translated status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('completed', {
          defaultValue: 'Completed'
        });
      case 'in-progress':
        return t('inProgress', {
          defaultValue: 'In Progress'
        });
      case 'to-do':
        return t('toDo', {
          defaultValue: 'To Do'
        });
      default:
        return status;
    }
  };

  // Function to handle drag start
  const handleDragStart = (taskId: string) => {
    dragTaskRef.current = taskId;
  };

  // Function to handle drag over lane
  const handleDragOver = (laneId: string, e: React.DragEvent) => {
    e.preventDefault();
    dragOverLaneRef.current = laneId;
  };

  // Function to handle drop
  const handleDrop = (laneId: string) => {
    if (dragTaskRef.current && dragOverLaneRef.current) {
      // Find the task and its current lane
      let taskToMove: Task | null = null;
      let sourceLaneId: string | null = null;
      const newLanes = [...lanes];

      // Find the task and source lane
      newLanes.forEach(lane => {
        const taskIndex = lane.tasks.findIndex(t => t.id === dragTaskRef.current);
        if (taskIndex >= 0) {
          taskToMove = {
            ...lane.tasks[taskIndex]
          };
          sourceLaneId = lane.id;
          // Remove task from source lane
          lane.tasks.splice(taskIndex, 1);
        }
      });

      // Add task to target lane
      if (taskToMove && sourceLaneId) {
        const targetLaneIndex = newLanes.findIndex(l => l.id === laneId);
        if (targetLaneIndex >= 0) {
          newLanes[targetLaneIndex].tasks.push(taskToMove);
          setLanes(newLanes);
        }
      }

      // Reset refs
      dragTaskRef.current = null;
      dragOverLaneRef.current = null;
    }
  };

  // Filter tasks based on search and status filter
  const getFilteredLanes = () => {
    const mergedLanes = getMergedLanes();
    if (!searchTerm && !filteredStatus) return mergedLanes;
    return mergedLanes.map(lane => {
      const filteredTasks = lane.tasks.filter(task => {
        const matchesSearch = !searchTerm || task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !filteredStatus || task.status === filteredStatus;
        return matchesSearch && matchesStatus;
      });
      return {
        ...lane,
        tasks: filteredTasks
      };
    });
  };

  // Find a task by ID across all lanes (updated for merged data)
  const findTaskById = (taskId: string) => {
    const mergedLanes = getMergedLanes();
    for (const lane of mergedLanes) {
      const task = lane.tasks.find(t => t.id === taskId);
      if (task) return task;
    }
    return null;
  };
  const handleCreateTask = (laneId: string, laneTitle: string) => {
    setSelectedLaneForTask({
      id: laneId,
      title: laneTitle
    });
    setShowCreateTaskModal(true);
  };
  const handleCloseTaskModal = () => {
    setShowCreateTaskModal(false);
    setSelectedLaneForTask(null);
  };

  // Handle task click to open details modal
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowTaskDetailsModal(true);
  };

  // Handle closing task details modal
  const handleCloseTaskDetails = () => {
    setShowTaskDetailsModal(false);
    setSelectedTaskId(null);
  };

  return <>
      <GlassCard className="w-full">
        {/* Header with view switcher */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-lg font-medium">{t('deliveryChainsManager', {
              defaultValue: 'Delivery Chains Manager'
            })}</h2>
            
            {/* Mini-loop ribbon */}
            <div className="ml-4 hidden md:flex bg-white/5 rounded-full overflow-hidden">
              
              
              
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Teams Collaboration Toggle */}
            <Button variant="outline" size="sm" onClick={() => setShowTeamsPanel(!showTeamsPanel)} className={`gap-1 text-xs ${showTeamsPanel ? 'bg-blue-500/20 border-blue-500/40' : 'bg-white/5 border-white/20'}`}>
              <MessageSquare className="h-3.5 w-3.5" />
              Teams
            </Button>

            {/* View mode toggle */}
            
            
            {/* Simple/Pro mode toggle */}
            
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row justify-between gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('searchTasks', {
            defaultValue: 'Search tasks...'
          }) as string} className="pl-9 bg-white/5 border-white/10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => setFilteredStatus(filteredStatus === 'in-progress' ? null : 'in-progress')}>
              <Filter className="h-3 w-3" />
              {t('inProgress', {
              defaultValue: 'In Progress'
            })}
              {filteredStatus === 'in-progress' && <Badge className="h-2 w-2 p-0 bg-blue-500 rounded-full" />}
            </Button>
            
            <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => setFilteredStatus(filteredStatus === 'to-do' ? null : 'to-do')}>
              <Clock className="h-3 w-3" />
              {t('toDo', {
              defaultValue: 'To Do'
            })}
              {filteredStatus === 'to-do' && <Badge className="h-2 w-2 p-0 bg-gray-500 rounded-full" />}
            </Button>
            
            <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => setFilteredStatus(filteredStatus === 'completed' ? null : 'completed')}>
              <Check className="h-3 w-3" />
              {t('completed', {
              defaultValue: 'Completed'
            })}
              {filteredStatus === 'completed' && <Badge className="h-2 w-2 p-0 bg-green-500 rounded-full" />}
            </Button>
          </div>
        </div>
        
        {/* Kanban View */}
        {activeTab === 'kanban' && <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getFilteredLanes().map(lane => <div key={lane.id} className="bg-white/5 rounded-lg p-4" onDragOver={e => handleDragOver(lane.id, e)} onDrop={() => handleDrop(lane.id)}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{lane.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-white/10">
                        {getLaneProgress(lane)}
                      </Badge>
                      {/* Updated sub-task creation button */}
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10" onClick={() => handleCreateTask(lane.id, lane.title)} title={t('createTask', {
                  defaultValue: 'Create Task'
                })}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {lane.tasks.map(task => <motion.div key={task.id} className={`bg-white/5 border ${task.id === 't1' && highlightBundle ? 'border-teal-500 ring-1 ring-teal-500' : 'border-white/10'} rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-colors`} whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} draggable onDragStart={() => handleDragStart(task.id)} onClick={() => handleTaskClick(task.id)} animate={task.id === 't1' && highlightBundle ? {
                y: [0, -5, 0],
                transition: {
                  duration: 0.5,
                  repeat: 3
                }
              } : {}}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)} mr-2`} />
                            <span className="font-medium">{task.title}</span>
                          </div>
                          
                          {task.needsApproval && <div className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full flex items-center">
                              <Bell className="w-3 h-3 mr-1" />
                              {t('needsApproval', {
                      defaultValue: 'Needs Approval'
                    })}
                            </div>}
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              {task.assigneeAvatar && <AvatarImage src={task.assigneeAvatar} />}
                              <AvatarFallback className="text-xs">{task.assigneeInitial}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-400">{task.assignee}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-400">
                          <div className="px-2 py-0.5 rounded bg-white/5">
                            {t('dueDate', {
                      defaultValue: 'Due'
                    })}: {task.dueDate}
                          </div>
                          <div className="text-xs text-blue-400 hover:text-blue-300">
                            Click to open
                          </div>
                        </div>
                      </motion.div>)}
                    
                    {/* Updated add task placeholder */}
                    <div className="border border-dashed border-white/20 rounded-lg p-3 text-center text-sm text-gray-400 cursor-pointer hover:bg-white/5 flex items-center justify-center" onClick={() => handleCreateTask(lane.id, lane.title)}>
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      {t('addTask', {
                  defaultValue: 'Add Task'
                })}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>}
        
        {/* Gantt Chart */}
        {activeTab === 'gantt' && <div className="p-4">
            {/* Time scale slider */}
            <div className="mb-3 flex items-center gap-3 p-2 bg-white/5 rounded-lg">
              <span className="text-xs">{t('timeScale', {
              defaultValue: 'Time Scale'
            })}</span>
              <div className="flex-1">
                <Slider value={[ganttTimeScale]} min={7} max={60} step={7} onValueChange={value => setGanttTimeScale(value[0])} className="w-[120px]" />
              </div>
              <span className="text-xs whitespace-nowrap">
                {ganttTimeScale <= 7 ? t('days', {
              defaultValue: 'Days'
            }) : ganttTimeScale <= 28 ? t('weeks', {
              defaultValue: 'Weeks'
            }) : t('months', {
              defaultValue: 'Months'
            })}
              </span>
              
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Share2 className="h-3.5 w-3.5" />
                  {t('syncToPlanner', {
                defaultValue: 'Sync to Planner'
              })}
                </Button>
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Download className="h-3.5 w-3.5" />
                  {t('export', {
                defaultValue: 'Export'
              })}
                </Button>
              </div>
            </div>
            
            {/* Gantt chart visualization */}
            <div className="relative overflow-x-auto">
              {/* Timeline header */}
              <div className="flex border-b border-white/10 pb-2">
                <div className="w-1/5 min-w-[200px]">{t('task', {
                defaultValue: 'Task'
              })}</div>
                <div className="flex-1">
                  <div className="flex">
                    {Array.from({
                  length: Math.min(8, Math.ceil(ganttTimeScale / 7))
                }).map((_, i) => <div key={`week-${i}`} className="flex-1 text-center text-sm">
                        {t('weekAbbr', {
                    defaultValue: 'W'
                  })} {i + 1}
                      </div>)}
                  </div>
                </div>
              </div>
              
              {/* Task rows */}
              {getFilteredLanes().flatMap(lane => lane.tasks).map((task, i) => <div key={task.id} className={`flex items-center h-12 ${i % 2 === 0 ? 'bg-white/5' : ''}`}>
                  <div className="w-1/5 min-w-[200px] px-2 truncate flex items-center">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)} mr-2`} />
                    {task.title}
                  </div>
                  <div className="flex-1 relative">
                    {/* Task dependencies (arrows) if in Pro mode */}
                    {displayMode === 'pro' && task.dependencies?.map(depId => {
                const depTask = findTaskById(depId);
                if (!depTask) return null;

                // Simple arrow visualization (in real app would use vector graphics)
                return <div key={`${depId}-${task.id}`} className="absolute top-1/2 h-0.5 bg-white/30 z-0" style={{
                  left: `${depTask.ganttStart}%`,
                  width: `${task.ganttStart - depTask.ganttStart}%`,
                  transform: 'translateY(-50%)'
                }}>
                          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 border-t-2 border-r-2 border-white/30" />
                        </div>;
              })}
                    
                    {/* Task bar */}
                    <motion.div className={`absolute h-6 rounded-full ${task.status === 'completed' ? 'bg-green-500/50' : task.status === 'in-progress' ? 'bg-blue-500/50' : 'bg-gray-500/50'} border ${task.status === 'completed' ? 'border-green-600' : task.status === 'in-progress' ? 'border-blue-600' : 'border-gray-600'} z-10 cursor-move flex items-center justify-center text-xs whitespace-nowrap px-2`} style={{
                left: `${task.ganttStart}%`,
                width: `${task.ganttDuration}%`,
                top: '3px'
              }} whileHover={{
                y: -2,
                boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
              }} whileTap={{
                scale: 0.98
              }}>
                      {task.title.length > 15 ? task.title.substring(0, 15) + '...' : task.title}
                    </motion.div>
                  </div>
                </div>)}
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-400">
              {t('ganttChartNote', {
            defaultValue: 'Drag task bars to reschedule or resize them to change duration'
          })}
            </div>
          </div>}
        
        {/* Footer with collaboration info */}
        <div className="p-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-white/5 px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs">5 {t('usersOnline', {
                defaultValue: 'users online'
              })}</span>
            </div>
            
            <div className="flex -space-x-2">
              <Avatar className="border-2 border-background h-6 w-6">
                <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                <AvatarFallback className="text-xs">SC</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background h-6 w-6">
                <AvatarImage src="https://i.pravatar.cc/150?img=2" />
                <AvatarFallback className="text-xs">AJ</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background h-6 w-6">
                <AvatarImage src="https://i.pravatar.cc/150?img=3" />
                <AvatarFallback className="text-xs">MA</AvatarFallback>
              </Avatar>
              <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                +2
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Share2 className="h-3.5 w-3.5 mr-1" />
              {t('shareDeliveryPlan', {
              defaultValue: 'Share Delivery Plan'
            })}
            </Button>
            
            <Button className="text-xs" size="sm">
              <ArrowRight className="h-3.5 w-3.5 mr-1" />
              {t('publishToMonitor', {
              defaultValue: 'Publish to Monitor'
            })}
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Teams Collaboration Panel */}
      <TeamsCollaborationPanel isOpen={showTeamsPanel} onClose={() => setShowTeamsPanel(false)} bundleId="education-hub" bundleName="Education Innovation Hub" />

      {/* Create Task Modal */}
      <CreateTaskModal isOpen={showCreateTaskModal} onClose={handleCloseTaskModal} bundleId="education-hub" laneId={selectedLaneForTask?.id} laneTitle={selectedLaneForTask?.title} />

      {/* Task Details Modal */}
      <TaskDetailsModal 
        isOpen={showTaskDetailsModal} 
        onClose={handleCloseTaskDetails} 
        taskId={selectedTaskId}
        bundleId="education-hub"
      />
    </>;
};

export default DeliveryChains;
