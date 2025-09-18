import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Trash2, Star, Loader2, Briefcase, Users, Tag } from 'lucide-react';
import { cn, getInitials, TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import type { ContactListContact } from '@/types/types';
import { useToggleContactFavourite } from '@/logic/useToggleContactFavourite';
import { useDeleteContact } from '@/logic/useDeleteContact';
import type { TagColor } from '@/types/types';

const getTagBgClass = (color: string | null) =>
  TAG_BG_CLASSES[color as TagColor] || 'bg-gray-100';
const getTagTextClass = (color: string | null) =>
  TAG_TEXT_CLASSES[color as TagColor] || 'text-gray-800';

type ContactListItemProps = {
  contact: ContactListContact;
  onActionComplete: () => void;
};

export const ContactListItem = ({
  contact,
  onActionComplete,
}: ContactListItemProps) => {
  const [localContact, setLocalContact] = useState(contact);
  const { toggleFavourite, isToggling } = useToggleContactFavourite();
  const { deleteContact, loading: isDeleting } = useDeleteContact();

  useEffect(() => {
    setLocalContact(contact);
  }, [contact]);

  const handleToggleFavourite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalContact(prev => ({ ...prev, favourite: !prev.favourite }));
    const { success } = await toggleFavourite(
      localContact.id,
      !!localContact.favourite,
      localContact.name,
    );
    if (success) {
      onActionComplete();
    } else {
      setLocalContact(contact);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await deleteContact(localContact.id, {
      name: localContact.name,
    });
    if (success) {
      onActionComplete();
    }
  };

  return (
    <div className="group flex items-start gap-4 px-4 py-3 hover:bg-muted/50 transition-colors">
      <div className="flex flex-shrink-0 items-center gap-4 w-1/3 pt-1">
        <div className="relative">
          <Avatar className="h-10 w-10 border">
            <AvatarImage
              src={localContact.avatar_url || ''}
              alt={localContact.name}
            />
            <AvatarFallback>
              {localContact.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-2 -right-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavourite}
              disabled={isToggling(localContact.id)}
              aria-label={
                localContact.favourite
                  ? 'Remove from favourites'
                  : 'Add to favourites'
              }
              className={cn(
                'rounded-full w-7 h-7 transition-all',
                'group-hover:bg-muted/50 hover:bg-muted',
                localContact.favourite
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100',
              )}
            >
              {isToggling(localContact.id) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Star
                  className={cn(
                    'h-4 w-4 drop-shadow-sm',
                    localContact.favourite
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-400 hover:text-yellow-300',
                  )}
                />
              )}
            </Button>
          </div>
        </div>
        <div className="flex flex-col min-w-0 flex-grow">
          <Link
            to={`/contacts/${localContact.id}`}
            className="font-bold text-foreground truncate hover:underline"
          >
            {localContact.name}
          </Link>
          <span className="text-sm text-muted-foreground truncate">
            {localContact.email}
          </span>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-x-4 text-sm items-center pt-1">
        <div className="flex items-center gap-2 truncate">
          <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          {localContact.company ? (
            <div className="flex items-center gap-1.5 font-medium text-foreground truncate">
              {localContact.company.company_logo && (
                <img
                  src={localContact.company.company_logo}
                  alt={localContact.company.name}
                  className="h-4 w-4 object-contain"
                />
              )}
              <span title={localContact.company.name}>
                {localContact.company.name}
              </span>
            </div>
          ) : (
            <span className="italic text-muted-foreground">No company</span>
          )}
        </div>
        <div className="flex items-center gap-2 truncate">
          <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          {localContact.groups[0] ? (
            <div className="flex items-center gap-1.5 font-medium text-foreground truncate">
              <div className="h-5 w-5 rounded-sm border p-1 flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-[9px] flex-shrink-0">
                {getInitials(localContact.groups[0].name)}
              </div>
              <span title={localContact.groups[0].name}>
                {localContact.groups[0].name}
              </span>
            </div>
          ) : (
            <span className="italic text-muted-foreground">No group</span>
          )}
        </div>
        <div className="flex items-center flex-wrap gap-1">
          <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          {localContact.tags.length > 0 ? (
            <>
              <Badge
                key={localContact.tags[0].id}
                className={`text-[10px] font-normal px-1.5 py-0 border-none ${getTagBgClass(
                  localContact.tags[0].color,
                )} ${getTagTextClass(localContact.tags[0].color)}`}
              >
                {localContact.tags[0].name}
              </Badge>
              {localContact.tags.length > 1 && (
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-normal px-1.5 py-0 cursor-default"
                      >
                        +{localContact.tags.length - 1}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1 text-xs">
                        {localContact.tags.slice(1).map(t => (
                          <p key={t.id}>{t.name}</p>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </>
          ) : (
            <span className="italic text-muted-foreground">No tags</span>
          )}
        </div>
      </div>

      <div className="flex justify-end items-center gap-1.5 w-40 flex-shrink-0 pt-1">
        <span className="text-xs text-muted-foreground">
          {format(new Date(localContact.created_at), 'd MMM, yy')}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          title="Delete Contact"
          className="rounded-full w-9 h-9 opacity-0 group-hover:opacity-100 transition-opacity"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 text-red-500" />
          )}
        </Button>
      </div>
    </div>
  );
};
