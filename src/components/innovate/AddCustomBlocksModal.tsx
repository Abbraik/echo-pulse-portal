
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, GripVertical, Sun, Moon, Globe, Image, BarChart3, Code, Type, Widget } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface CustomBlock {
  id: string;
  title: string;
  type: 'text' | 'image' | 'chart' | 'widget' | 'html';
  content: string;
}

interface AddCustomBlocksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveBlocks: (blocks: CustomBlock[]) => void;
}

const blockTypeOptions = [
  { value: 'text', label: 'Text', labelAr: 'نص', icon: Type },
  { value: 'image', label: 'Image', labelAr: 'صورة', icon: Image },
  { value: 'chart', label: 'Data Chart', labelAr: 'مخطط البيانات', icon: BarChart3 },
  { value: 'widget', label: 'Widget', labelAr: 'ودجت', icon: Widget },
  { value: 'html', label: 'Custom HTML/Markdown', labelAr: 'HTML/Markdown مخصص', icon: Code },
];

export const AddCustomBlocksModal: React.FC<AddCustomBlocksModalProps> = ({
  open,
  onOpenChange,
  onSaveBlocks
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t, language, setLanguage, isRTL } = useTranslation();
  const [blocks, setBlocks] = useState<CustomBlock[]>([]);
  const [currentBlock, setCurrentBlock] = useState<Partial<CustomBlock>>({
    title: '',
    type: 'text',
    content: ''
  });
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const validateBlock = () => {
    const newErrors: { title?: string; content?: string } = {};
    
    if (!currentBlock.title?.trim()) {
      newErrors.title = isRTL ? 'العنوان مطلوب' : 'Title is required';
    }
    
    if (!currentBlock.content?.trim()) {
      newErrors.content = isRTL ? 'المحتوى مطلوب' : 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addBlock = () => {
    if (validateBlock()) {
      const newBlock: CustomBlock = {
        id: `block-${Date.now()}`,
        title: currentBlock.title!,
        type: currentBlock.type as CustomBlock['type'],
        content: currentBlock.content!
      };
      
      setBlocks([...blocks, newBlock]);
      setCurrentBlock({ title: '', type: 'text', content: '' });
      setErrors({});
    }
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    setBlocks(newBlocks);
  };

  const handleSave = () => {
    onSaveBlocks(blocks);
    onOpenChange(false);
    setBlocks([]);
    setCurrentBlock({ title: '', type: 'text', content: '' });
  };

  const handleCancel = () => {
    onOpenChange(false);
    setBlocks([]);
    setCurrentBlock({ title: '', type: 'text', content: '' });
    setErrors({});
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCancel}
        />

        {/* Modal */}
        <motion.div
          className={cn(
            "relative w-full max-w-lg max-h-[90vh] overflow-hidden",
            "bg-white/30 dark:bg-white/10 backdrop-blur-[20px]",
            "border border-white/20 rounded-2xl shadow-2xl",
            "focus-within:border-teal-400/50 focus-within:shadow-teal-500/20",
            isRTL ? 'font-arabic text-right' : 'text-left'
          )}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <div>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                  {isRTL ? 'أضف كتلك المخصصة' : 'Add Your Custom Blocks'}
                </h2>
                <p className="text-sm text-gray-300 mt-1">
                  {isRTL ? 'اسحب واسقط أو اكتب لبناء نظرة عامة مثالية على النظام.' : 'Drag, drop, or type to build your ideal system overview.'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Block Creator */}
            <div className="space-y-4 p-4 bg-white/10 rounded-xl border border-white/10">
              <h3 className="font-semibold text-white">
                {isRTL ? 'إنشاء كتلة جديدة' : 'Create New Block'}
              </h3>
              
              {/* Block Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  {isRTL ? 'عنوان الكتلة' : 'Block Title'}
                </label>
                <Input
                  value={currentBlock.title || ''}
                  onChange={(e) => {
                    setCurrentBlock({ ...currentBlock, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: undefined });
                  }}
                  placeholder={isRTL ? 'عنوان الكتلة...' : 'Block title...'}
                  className={cn(
                    "bg-white/5 border-white/20 text-white placeholder:text-white/40",
                    "focus:border-teal-400 focus:ring-teal-400/20",
                    errors.title && "border-red-400"
                  )}
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? "title-error" : undefined}
                />
                {errors.title && (
                  <p id="title-error" className="text-sm text-red-400" role="alert">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Block Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  {isRTL ? 'نوع الكتلة' : 'Block Type'}
                </label>
                <Select
                  value={currentBlock.type}
                  onValueChange={(value) => setCurrentBlock({ ...currentBlock, type: value as CustomBlock['type'] })}
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-teal-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/90 backdrop-blur-lg border-white/20">
                    {blockTypeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value} className="text-white hover:bg-white/10">
                          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                            <Icon size={16} />
                            <span>{isRTL ? option.labelAr : option.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Content Editor */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  {isRTL ? 'المحتوى' : 'Content'}
                </label>
                <Textarea
                  value={currentBlock.content || ''}
                  onChange={(e) => {
                    setCurrentBlock({ ...currentBlock, content: e.target.value });
                    if (errors.content) setErrors({ ...errors, content: undefined });
                  }}
                  placeholder={isRTL ? 'أدخل المحتوى هنا...' : 'Enter content here...'}
                  className={cn(
                    "bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-[100px]",
                    "focus:border-teal-400 focus:ring-teal-400/20",
                    errors.content && "border-red-400"
                  )}
                  aria-invalid={!!errors.content}
                  aria-describedby={errors.content ? "content-error" : undefined}
                />
                {errors.content && (
                  <p id="content-error" className="text-sm text-red-400" role="alert">
                    {errors.content}
                  </p>
                )}
              </div>

              {/* Add Block Button */}
              <Button
                onClick={addBlock}
                className="w-full h-10 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold"
              >
                <Plus size={16} className={cn("mr-2", isRTL && "mr-0 ml-2")} />
                {isRTL ? 'إضافة كتلة' : 'Add Block'}
              </Button>
            </div>

            {/* Blocks List */}
            {blocks.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-white">
                  {isRTL ? 'الكتل المضافة' : 'Added Blocks'}
                </h3>
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/10"
                  >
                    <GripVertical size={16} className="text-gray-400 cursor-grab" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{block.title}</h4>
                      <p className="text-sm text-gray-300 capitalize">{block.type}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBlock(block.id)}
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <div className={cn("flex items-center justify-between mb-4", isRTL && "flex-row-reverse")}>
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-white/10"
                aria-label={isRTL ? 'تبديل المظهر' : 'Toggle theme'}
              >
                {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </Button>

              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="rounded-full hover:bg-white/10"
                aria-label={isRTL ? 'تبديل اللغة' : 'Toggle language'}
              >
                <Globe size={16} />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className={cn("flex gap-3", isRTL && "flex-row-reverse")}>
              <Button
                onClick={handleSave}
                disabled={blocks.length === 0}
                className="flex-1 h-12 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold disabled:opacity-50"
              >
                {isRTL ? 'حفظ التخطيط' : 'Save Layout'}
              </Button>
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
