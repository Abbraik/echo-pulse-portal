// ACT Zone Implementation - Fixed drag handle import
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { useFeatureFlags } from '@/hooks/use-feature-flags';
import { format } from 'date-fns';
import {
  Send,
  Search,
  Plus,
  Edit,
  ChevronDown,
  Calendar as CalendarIcon,
  Settings,
  Shield,
  Users,
  Target,
  X,
  GripVertical
} from 'lucide-react';

const availableInterventions = [
  { id: 'policy-01', name: 'Healthcare Policy Update', category: 'Policy', complexity: 'medium', impact: 'high' },
  { id: 'resource-01', name: 'Budget Reallocation Framework', category: 'Resources', complexity: 'high', impact: 'high' },
  { id: 'engage-01', name: 'Community Engagement Protocol', category: 'Stakeholder', complexity: 'low', impact: 'medium' },
  { id: 'tech-01', name: 'Digital Service Integration', category: 'Technology', complexity: 'medium', impact: 'medium' },
  { id: 'training-01', name: 'Staff Training Initiative', category: 'Capacity', complexity: 'low', impact: 'medium' },
  { id: 'monitor-01', name: 'Performance Monitoring System', category: 'Governance', complexity: 'medium', impact: 'high' },
];

const roleOptions = ['Dr. Sarah Chen', 'Mike Rodriguez', 'Lisa Park', 'Alex Thompson', 'Maria Garcia'];

const RgsActZone: React.FC = () => {
  const { flags } = useFeatureFlags();
  const { toast } = useToast();
  
  // Bundle state
  const [nInterventions] = useState(7);
  const [weeksLeft] = useState(3);
  const [selectedInterventions, setSelectedInterventions] = useState(['policy-01', 'resource-01', 'engage-01']);
  const [searchQuery, setSearchQuery] = useState('');
  const [bundleExpanded, setBundleExpanded] = useState(true);
  
  // Roles state
  const [roles, setRoles] = useState({
    champion: 'Dr. Sarah Chen',
    analyst: 'Mike Rodriguez'
  });
  const [editingRoles, setEditingRoles] = useState(false);
  
  // Advanced settings state
  const [raciMatrix, setRaciMatrix] = useState({
    champion: { responsible: true, accountable: true, consulted: false, informed: false },
    analyst: { responsible: true, accountable: false, consulted: true, informed: true },
    custodian: { responsible: false, accountable: false, consulted: true, informed: true },
    juror: { responsible: false, accountable: false, consulted: false, informed: true }
  });
  const [prsModule, setPrsModule] = useState('');
  const [dependencyType, setDependencyType] = useState('soft');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const filteredInterventions = availableInterventions.filter(intervention =>
    intervention.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    intervention.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addIntervention = (interventionId: string) => {
    if (!selectedInterventions.includes(interventionId)) {
      setSelectedInterventions([...selectedInterventions, interventionId]);
    }
  };

  const removeIntervention = (interventionId: string) => {
    setSelectedInterventions(selectedInterventions.filter(id => id !== interventionId));
  };

  const handleValidateCompliance = () => {
    toast({
      title: "Compliance Validation",
      description: "Bundle meets all policy requirements and governance standards.",
      duration: 3000,
    });
  };

  const updateRaciCell = (role: string, responsibility: string, value: boolean) => {
    setRaciMatrix(prev => ({
      ...prev,
      [role]: {
        ...prev[role as keyof typeof prev],
        [responsibility]: value
      }
    }));
  };

  return (
    <div className="min-h-screen p-6 flex items-start justify-center pt-12">
      {/* Single-column Glass Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-3/4 mx-auto p-6"
      >
        <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
          
          {/* Top Strip */}
          <div className="flex justify-between items-center mb-4 p-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="font-semibold">Bundle Summary: {nInterventions} interventions</span>
            </div>
            
            <div className="text-center">
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                Due in {weeksLeft} weeks
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Roles:</span>
              <span className="font-medium">{roles.champion}, {roles.analyst}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditingRoles(!editingRoles)}
                className="text-primary hover:bg-primary/10"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          <CardContent className="space-y-6">
            
            {/* Core Inputs */}
            <div className="space-y-4">
              
              {/* Intervention Picker */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Intervention Picker</Label>
                
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search interventions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50 border-white/20"
                    />
                  </div>
                </div>

                {searchQuery && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border border-white/20 rounded-lg bg-background/30 max-h-48 overflow-y-auto"
                  >
                    {filteredInterventions.map((intervention) => (
                      <div 
                        key={intervention.id}
                        className="flex items-center justify-between p-3 hover:bg-background/50 border-b border-white/10 last:border-b-0"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{intervention.name}</div>
                          <div className="text-xs text-muted-foreground">{intervention.category}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {intervention.impact}
                          </Badge>
                          <Button 
                            size="sm" 
                            className="ml-2 bg-accent hover:bg-accent/80"
                            onClick={() => addIntervention(intervention.id)}
                            disabled={selectedInterventions.includes(intervention.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add to Bundle
                          </Button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Bundle Card Preview */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Bundle Preview</Label>
                
                <Collapsible open={bundleExpanded} onOpenChange={setBundleExpanded}>
                  <CollapsibleTrigger asChild>
                    <Card className="border border-white/20 p-3 rounded-lg cursor-pointer hover:bg-background/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="default">{selectedInterventions.length}</Badge>
                          <span className="font-medium">Selected Interventions</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${bundleExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </Card>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2 mt-2"
                    >
                      {selectedInterventions.map((interventionId) => {
                        const intervention = availableInterventions.find(i => i.id === interventionId);
                        if (!intervention) return null;
                        
                        return (
                          <div 
                            key={interventionId}
                            className="flex items-center justify-between p-3 bg-background/20 rounded-lg border border-white/10 hover:shadow-xl transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                              <div>
                                <div className="font-medium text-sm">{intervention.name}</div>
                                <div className="text-xs text-muted-foreground">{intervention.category}</div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeIntervention(interventionId)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </motion.div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            {/* Smart Roles Panel */}
            <div className="bg-white/20 p-3 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Smart Roles
                </Label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar-1.jpg" />
                    <AvatarFallback>CH</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Champion</div>
                    {editingRoles ? (
                      <Select value={roles.champion} onValueChange={(value) => setRoles(prev => ({...prev, champion: value}))}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-xs text-muted-foreground">{roles.champion}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar-2.jpg" />
                    <AvatarFallback>AN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Analyst</div>
                    {editingRoles ? (
                      <Select value={roles.analyst} onValueChange={(value) => setRoles(prev => ({...prev, analyst: value}))}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-xs text-muted-foreground">{roles.analyst}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Action */}
            <div className="flex gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-primary text-white py-2 px-6 rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                <Send className="mr-2 h-4 w-4" />
                Publish Bundle
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg" 
                onClick={handleValidateCompliance}
                className="py-2 px-4 rounded-xl"
              >
                <Shield className="mr-2 h-4 w-4" />
                Validate Compliance
              </Button>
            </div>

            {/* Advanced Settings Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advanced-settings" className="border-white/10">
                <AccordionTrigger className="flex justify-between items-center p-3 cursor-pointer hover:no-underline text-base">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Advanced Settings
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  
                  {/* Full RACI Matrix Editor */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">RACI Matrix Editor</Label>
                    <div className="grid grid-cols-5 gap-2 text-xs">
                      <div className="font-medium">Role</div>
                      <div className="font-medium text-center">Responsible</div>
                      <div className="font-medium text-center">Accountable</div>
                      <div className="font-medium text-center">Consulted</div>
                      <div className="font-medium text-center">Informed</div>
                      
                      {Object.entries(raciMatrix).map(([role, responsibilities]) => (
                        <React.Fragment key={role}>
                          <div className="font-medium capitalize py-2">{role}</div>
                          {Object.entries(responsibilities).map(([responsibility, value]) => (
                            <div key={responsibility} className="flex justify-center py-2">
                              <Switch
                                checked={value}
                                onCheckedChange={(checked) => updateRaciCell(role, responsibility, checked)}
                              />
                            </div>
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* PRS Module Loader */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">PRS Module Loader</Label>
                    <Select value={prsModule} onValueChange={setPrsModule}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select PRS module..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="healthcare-std">Healthcare Standards v2.1</SelectItem>
                        <SelectItem value="education-ref">Education Reform Framework</SelectItem>
                        <SelectItem value="transport-opt">Transport Optimization Module</SelectItem>
                        <SelectItem value="custom">Custom Configuration</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {prsModule && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2"
                      >
                        <Label className="text-xs text-muted-foreground">YAML Preview</Label>
                        <Textarea 
                          className="mt-1 text-xs font-mono bg-background/50 border-white/20" 
                          rows={4}
                          readOnly
                          value={`module: ${prsModule}\nversion: 2.1\nrequirements:\n  - compliance_check: true\n  - stakeholder_approval: required`}
                        />
                      </motion.div>
                    )}
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Dependency Rules */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Dependency Rules</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={dependencyType === 'hard'}
                          onCheckedChange={(checked) => setDependencyType(checked ? 'hard' : 'soft')}
                        />
                        <Label className="text-sm">Hard dependencies (blocking)</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={dependencyType === 'soft'}
                          onCheckedChange={(checked) => setDependencyType(checked ? 'soft' : 'hard')}
                        />
                        <Label className="text-sm">Soft dependencies (advisory)</Label>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Calendar Pickers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Custom Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Custom End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RgsActZone;