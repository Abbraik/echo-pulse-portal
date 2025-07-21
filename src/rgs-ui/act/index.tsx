import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { useFeatureFlags } from '@/hooks/use-feature-flags';
import { 
  Send, 
  Package, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  Shield,
  FileText,
  Target,
  Clock
} from 'lucide-react';

const interventions = [
  { id: 'policy-update', name: 'Policy Framework Update', impact: 'high', effort: 'medium', status: 'ready' },
  { id: 'resource-realloc', name: 'Resource Reallocation', impact: 'medium', effort: 'high', status: 'draft' },
  { id: 'stakeholder-engage', name: 'Stakeholder Engagement', impact: 'high', effort: 'low', status: 'ready' },
  { id: 'process-optimize', name: 'Process Optimization', impact: 'medium', effort: 'medium', status: 'review' },
];

const smartRoles = [
  { role: 'Champion', assigned: 'Dr. Sarah Chen', status: 'confirmed' },
  { role: 'Analyst', assigned: 'Mike Rodriguez', status: 'pending' },
  { role: 'Custodian', assigned: 'Lisa Park', status: 'confirmed' },
  { role: 'Juror', assigned: '4 members', status: 'partial' },
];

const RgsActZone: React.FC = () => {
  const { flags } = useFeatureFlags();
  const [selectedIntervention, setSelectedIntervention] = useState<string>('');
  const [bundleProgress] = useState(85);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-6"
    >
      {/* Bundle Summary Strip */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Bundle #2024-03</h2>
                <p className="text-sm text-muted-foreground">Healthcare System Reform</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
              Ready to Publish
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Bundle Completion</span>
              <span className="font-medium">{bundleProgress}%</span>
            </div>
            <Progress value={bundleProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">7</div>
              <div className="text-xs text-muted-foreground">Interventions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">5</div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">2</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">4</div>
              <div className="text-xs text-muted-foreground">Roles Assigned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intervention Picker */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Target className="h-5 w-5 text-primary" />
            Intervention Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedIntervention} onValueChange={setSelectedIntervention}>
            <SelectTrigger>
              <SelectValue placeholder="Select primary intervention" />
            </SelectTrigger>
            <SelectContent>
              {interventions.map((intervention) => (
                <SelectItem key={intervention.id} value={intervention.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{intervention.name}</span>
                    <div className="flex gap-1 ml-2">
                      <Badge 
                        variant={intervention.status === 'ready' ? 'default' : intervention.status === 'draft' ? 'secondary' : 'outline'} 
                        className="text-xs"
                      >
                        {intervention.status}
                      </Badge>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedIntervention && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3 pt-2"
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-primary/10">
                  <div className="text-sm font-medium">Impact</div>
                  <Badge variant="default" className="mt-1">High</Badge>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary/10">
                  <div className="text-sm font-medium">Effort</div>
                  <Badge variant="secondary" className="mt-1">Medium</Badge>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary/10">
                  <div className="text-sm font-medium">Timeline</div>
                  <div className="text-sm font-bold mt-1">6 weeks</div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Smart Roles Panel */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Users className="h-5 w-5 text-primary" />
            Smart Roles Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {smartRoles.map((role, index) => (
            <div key={role.role} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold">{role.role[0]}</span>
                </div>
                <div>
                  <div className="font-medium">{role.role}</div>
                  <div className="text-sm text-muted-foreground">{role.assigned}</div>
                </div>
              </div>
              <Badge 
                variant={role.status === 'confirmed' ? 'default' : role.status === 'pending' ? 'secondary' : 'outline'}
              >
                {role.status === 'confirmed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                {role.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                {role.status === 'partial' && <AlertCircle className="w-3 h-3 mr-1" />}
                {role.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Primary CTA */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Button size="lg" className="flex-1 h-12 text-lg font-semibold">
              <Send className="mr-2 h-5 w-5" />
              Publish Bundle
            </Button>
            <Button variant="ghost" size="lg" className="h-12">
              <Shield className="mr-2 h-4 w-4" />
              Validate Compliance
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Deploy intervention bundle to active sprint
          </p>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      {flags.newRgsAdvancedSettings && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced" className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10 px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Advanced Settings
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Load Policy Standard</label>
                  <Select defaultValue="">
                    <SelectTrigger>
                      <SelectValue placeholder="Select policy framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iso-31000">ISO 31000:2018</SelectItem>
                      <SelectItem value="coso-framework">COSO Framework</SelectItem>
                      <SelectItem value="nist-cybersecurity">NIST Cybersecurity</SelectItem>
                      <SelectItem value="custom">Custom Framework</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Full RACI Editor
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Bundle Dependencies
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </motion.div>
  );
};

export default RgsActZone;