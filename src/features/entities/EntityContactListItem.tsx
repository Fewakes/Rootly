import { cn, TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import type { ContactWithDetails } from '@/services/assignContactService';
import type { TagColor } from '@/types/types';

import {
  MoreHorizontal,
  Building,
  Users,
  TagIcon,
  X,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function EntityContactListItem({
  contact,
  type,
  onAction,
}: {
  contact: ContactWithDetails;
  type: 'add' | 'remove';
  onAction: () => void;
}) {
  return (
    <div className="border rounded-lg p-2 flex items-center gap-3 bg-card transition-colors">
      <Avatar className="h-9 w-9 border">
        <AvatarImage src={contact.avatar_url || ''} alt={contact.name} />
        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-grow min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">
          {contact.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {contact.email}
        </p>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-4">
            <h4 className="font-medium leading-none text-sm">
              Contact Details
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2.5">
                {contact.company ? (
                  <Avatar className="h-5 w-5 text-xs">
                    <AvatarImage
                      src={contact.company.company_logo || ''}
                      alt={contact.company.name}
                    />
                    <AvatarFallback>
                      {contact.company.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Building className="h-4 w-4 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    'truncate',
                    !contact.company && 'italic text-muted-foreground',
                  )}
                >
                  {contact.company?.name || 'No Company'}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span
                  className={cn(
                    'truncate',
                    !contact.group && 'italic text-muted-foreground',
                  )}
                >
                  {contact.group?.name || 'No Group'}
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <TagIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex flex-wrap items-center gap-1">
                  {contact.tags.length > 0 ? (
                    contact.tags.map(tag => {
                      const colorKey =
                        tag.color &&
                        Object.prototype.hasOwnProperty.call(
                          TAG_BG_CLASSES,
                          tag.color,
                        )
                          ? (tag.color as TagColor)
                          : null;
                      return (
                        <Badge
                          key={tag.id}
                          className={cn(
                            'font-normal',
                            colorKey
                              ? [
                                  TAG_BG_CLASSES[colorKey],
                                  TAG_TEXT_CLASSES[colorKey],
                                ]
                              : 'bg-muted text-muted-foreground hover:bg-muted',
                          )}
                        >
                          {tag.name}
                        </Badge>
                      );
                    })
                  ) : (
                    <span className="italic text-sm text-muted-foreground">
                      No Tags
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        className="p-1 h-auto w-auto shrink-0"
        onClick={onAction}
      >
        {type === 'remove' ? (
          <X className="w-4 h-4 text-destructive" />
        ) : (
          <PlusCircle className="w-4 w-4 text-primary" />
        )}
      </Button>
    </div>
  );
}
