
import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BundleTag } from '../types/act-types';

interface TagSelectorProps {
  selectedTags: BundleTag[];
  onTagsChange: (tags: BundleTag[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagsChange }) => {
  const { t, isRTL } = useTranslation();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Some sample tags
  const availableTags: string[] = [
    'Water',
    'Energy',
    'Climate',
    'Infrastructure',
    'Education',
    'Health',
    'Economy',
    'Digital',
    'Innovation',
    'Governance',
    'Sustainability',
    'Social',
    'Short-Term',
    'Long-Term',
    'Medium-Term',
    'High-Priority',
  ];
  
  // Filter tags that aren't already selected
  const filteredTags = availableTags.filter(
    (tag) => !selectedTags.some(selectedTag => selectedTag.name === tag)
  );
  
  const handleSelect = (tagName: string) => {
    if (!selectedTags.some(tag => tag.name === tagName)) {
      const newTag: BundleTag = { 
        name: tagName, 
        type: 'category' as const
      };
      onTagsChange([...selectedTags, newTag]);
    }
    setInputValue('');
    setOpen(false);
  };
  
  const handleRemove = (tagToRemove: BundleTag) => {
    onTagsChange(selectedTags.filter((tag) => tag.name !== tagToRemove.name));
  };
  
  const handleCreateTag = () => {
    if (
      inputValue && 
      !selectedTags.some(tag => tag.name === inputValue) && 
      !availableTags.includes(inputValue)
    ) {
      const newTag: BundleTag = { 
        name: inputValue, 
        type: 'custom' as const
      };
      onTagsChange([...selectedTags, newTag]);
      setInputValue('');
      setOpen(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag, index) => (
          <Badge 
            key={`${tag.name}-${index}`} 
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 text-sm h-6 px-2 gap-1"
          >
            {tag.name}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(tag)}
              className="h-4 w-4 p-0 ml-1 hover:bg-white/10 rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              placeholder={t('addOrSelectTags')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (inputValue.trim()) {
                    handleCreateTag();
                  } else {
                    setOpen(true);
                  }
                }
              }}
              onClick={() => setOpen(true)}
              className="backdrop-blur-sm bg-white/5 border-white/20"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-black/50 backdrop-blur-xl border-white/20" align="start">
          <Command>
            <CommandList>
              <CommandInput 
                placeholder={t('searchTags')} 
                value={inputValue}
                onValueChange={setInputValue}
              />
              <CommandEmpty>
                {inputValue ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCreateTag}
                    className="w-full justify-start text-left px-2 py-1.5 h-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" /> 
                    {t('createTag')} "{inputValue}"
                  </Button>
                ) : (
                  <p className="py-2 px-4 text-sm text-gray-400">{t('noTagsFound')}</p>
                )}
              </CommandEmpty>
              {filteredTags.length > 0 && (
                <CommandGroup heading={t('suggestedTags')}>
                  {filteredTags
                    .filter(tag => tag.toLowerCase().includes(inputValue.toLowerCase()))
                    .map((tag) => (
                      <CommandItem 
                        key={tag}
                        value={tag}
                        onSelect={() => handleSelect(tag)}
                        className="cursor-pointer"
                      >
                        <Check 
                          className={`mr-2 h-4 w-4 ${
                            selectedTags.some(selectedTag => selectedTag.name === tag) ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                        {tag}
                      </CommandItem>
                    ))
                  }
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TagSelector;
