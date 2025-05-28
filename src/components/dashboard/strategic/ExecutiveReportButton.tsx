
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ExecutiveReportTemplate from '../ExecutiveReportTemplate';

export const ExecutiveReportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        className="bg-blue-600 hover:bg-blue-700"
        onClick={() => setIsOpen(true)}
      >
        <FileText size={14} className="mr-2" />
        Executive Report
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none">
          <ExecutiveReportTemplate onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
