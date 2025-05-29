import { useState } from 'react';
import { Check, ChevronDown, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils'; // utility for combining class names

const availableTags = ['VIP', 'Client', 'Supplier', 'Prospect'];

export function TagsSelector({ value = [], onChange }) {
  const [open, setOpen] = useState(false);

  const toggleTag = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter(t => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  return (
    <div className="border rounded-xl p-4 bg-muted/30">
      <div className="flex items-center gap-2 mb-2">
        <Tags className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Tags</span>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {value.length > 0 ? value.join(', ') : 'Select tags'}
            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2">
          {availableTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                'w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-muted',
                value.includes(tag) && 'bg-muted font-semibold',
              )}
            >
              {tag}
              {value.includes(tag) && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
