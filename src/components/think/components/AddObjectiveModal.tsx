
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import { Plus } from 'lucide-react';

export interface Objective {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  pillar: 'population' | 'resources' | 'goods' | 'social';
  impact: number;  // 1-10 scale
}

interface AddObjectiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (objective: Omit<Objective, 'id'>) => void;
}

const AddObjectiveModal: React.FC<AddObjectiveModalProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [pillar, setPillar] = useState<'population' | 'resources' | 'goods' | 'social'>('population');
  const [impact, setImpact] = useState<number>(5);
  
  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      title,
      description,
      priority,
      pillar,
      impact
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setPillar('population');
    setImpact(5);
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-navy-800 border border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="mr-2" size={18} />
            {t('addNewObjective')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('objectiveTitle')}</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('enterObjectiveTitle')}
              className="bg-navy-900"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('objectiveDescription')}</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('enterObjectiveDescription')}
              className="bg-navy-900 min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('targetPillar')}</label>
              <Select value={pillar} onValueChange={(value: any) => setPillar(value)}>
                <SelectTrigger className="bg-navy-900">
                  <SelectValue placeholder={t('selectPillar')} />
                </SelectTrigger>
                <SelectContent className="bg-navy-800">
                  <SelectItem value="population">{t('population')}</SelectItem>
                  <SelectItem value="resources">{t('resources')}</SelectItem>
                  <SelectItem value="goods">{t('goods')}</SelectItem>
                  <SelectItem value="social">{t('social')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('priority')}</label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger className="bg-navy-900">
                  <SelectValue placeholder={t('selectPriority')} />
                </SelectTrigger>
                <SelectContent className="bg-navy-800">
                  <SelectItem value="high">{t('highPriority')}</SelectItem>
                  <SelectItem value="medium">{t('mediumPriority')}</SelectItem>
                  <SelectItem value="low">{t('lowPriority')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">{t('estimatedImpact')}</label>
              <span>{impact}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={impact}
              onChange={(e) => setImpact(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!title.trim()}
            className="bg-gradient-to-r from-teal-500 to-blue-600"
          >
            {t('addObjective')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddObjectiveModal;
