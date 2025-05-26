
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddCustomBlocksModal } from './AddCustomBlocksModal';
import { useTranslation } from '@/hooks/use-translation';

interface CustomBlock {
  id: string;
  title: string;
  type: 'text' | 'image' | 'chart' | 'widget' | 'html';
  content: string;
}

interface AddCustomBlocksButtonProps {
  onBlocksAdded?: (blocks: CustomBlock[]) => void;
  className?: string;
}

export const AddCustomBlocksButton: React.FC<AddCustomBlocksButtonProps> = ({
  onBlocksAdded,
  className
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isRTL } = useTranslation();

  const handleSaveBlocks = (blocks: CustomBlock[]) => {
    onBlocksAdded?.(blocks);
    console.log('Custom blocks saved:', blocks);
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className={`bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white ${className}`}
      >
        <Plus size={16} className={isRTL ? "ml-2" : "mr-2"} />
        {isRTL ? 'إضافة كتل مخصصة' : 'Add Custom Blocks'}
      </Button>

      <AddCustomBlocksModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSaveBlocks={handleSaveBlocks}
      />
    </>
  );
};
