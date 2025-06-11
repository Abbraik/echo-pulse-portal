
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MfaChallenge } from '@/components/auth/MfaChallenge';

interface IndicatorModalProps {
  indicator: {
    id: string;
    name: string;
    sector: string;
    value: number;
    target: number;
    weight: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const IndicatorModal: React.FC<IndicatorModalProps> = ({
  indicator,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  const [showMfa, setShowMfa] = useState(false);
  const [mfaAction, setMfaAction] = useState<'edit' | 'delete' | null>(null);

  if (!indicator) return null;

  const performance = (indicator.value / indicator.target) * 100;
  const status = performance >= 90 ? 'excellent' : performance >= 75 ? 'good' : 'needs-attention';

  const handleEdit = () => {
    setMfaAction('edit');
    setShowMfa(true);
  };

  const handleDelete = () => {
    setMfaAction('delete');
    setShowMfa(true);
  };

  const handleMfaSuccess = () => {
    setShowMfa(false);
    if (mfaAction === 'edit') {
      onEdit(indicator.id);
    } else if (mfaAction === 'delete') {
      onDelete(indicator.id);
    }
    setMfaAction(null);
    onClose();
  };

  const handleMfaBack = () => {
    setShowMfa(false);
    setMfaAction(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content" role="dialog" aria-labelledby="modal-title">
        {showMfa ? (
          <MfaChallenge
            email="user@example.com"
            onSuccess={handleMfaSuccess}
            onBack={handleMfaBack}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle id="modal-title" className="text-white text-xl font-bold">
                {indicator.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="indicator-stat">
                  <label className="text-sm text-slate-300">Current Value</label>
                  <p className="text-2xl font-bold text-white">{indicator.value}</p>
                </div>
                <div className="indicator-stat">
                  <label className="text-sm text-slate-300">Target</label>
                  <p className="text-2xl font-bold text-white">{indicator.target}</p>
                </div>
                <div className="indicator-stat">
                  <label className="text-sm text-slate-300">Performance</label>
                  <p className={`text-2xl font-bold ${
                    status === 'excellent' ? 'text-teal-400' :
                    status === 'good' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {Math.round(performance)}%
                  </p>
                </div>
                <div className="indicator-stat">
                  <label className="text-sm text-slate-300">Weight</label>
                  <p className="text-2xl font-bold text-white">{indicator.weight}</p>
                </div>
              </div>

              <div className="indicator-stat">
                <label className="text-sm text-slate-300">Sector</label>
                <p className="text-lg text-white">{indicator.sector}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleEdit}
                  className="glass-button flex-1"
                  aria-label={`Edit ${indicator.name}`}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  onClick={handleDelete}
                  variant="destructive"
                  className="glass-button-danger flex-1"
                  aria-label={`Delete ${indicator.name}`}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
