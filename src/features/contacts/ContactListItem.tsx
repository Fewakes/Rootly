import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Star, Loader2 } from 'lucide-react';
import { cn, TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';

import type { ContactWithDetails } from '@/services/assignContactService';
import type { TagColor } from '@/types/types';
import { useToggleContactFavourite } from '@/logic/useToggleContactFavourite';

// Helpers for dynamic tag styling
const getTagBgClass = (color: string | null) =>
  TAG_BG_CLASSES[color as TagColor] || 'bg-gray-100';
const getTagTextClass = (color: string | null) =>
  TAG_TEXT_CLASSES[color as TagColor] || 'text-gray-800';

// Defines the props accepted by the component
type ContactListItemProps = {
  contact: ContactWithDetails;
  onFavouriteChange: (contact: ContactWithDetails) => void;
};

export const ContactListItem = ({
  contact,
  onFavouriteChange,
}: ContactListItemProps) => {
  // Manages the item's own state for optimistic updates.
  const [localContact, setLocalContact] = useState(contact);
  const { toggleFavourite, isToggling } = useToggleContactFavourite();

  // Syncs local state when the parent prop changes.
  useEffect(() => {
    setLocalContact(contact);
  }, [contact]);

  // Toggles favourite status and notifies the parent to re-sort the list.
  const handleToggle = async () => {
    const { id, favourite: currentStatus } = localContact;
    const updatedContactState = { ...localContact, favourite: !currentStatus };

    setLocalContact(updatedContactState);
    const { success } = await toggleFavourite(id, currentStatus);

    if (success) {
      onFavouriteChange(updatedContactState);
    } else {
      setLocalContact(contact); // Revert on failure
    }
  };

  const handleDelete = () => {
    // TODO: Implement delete logic
    console.log('Delete:', localContact.id);
  };

  return (
    <div className="group flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
      {/* Name and Avatar Section */}
      <div className="flex flex-shrink-0 items-center gap-4 w-1/3">
        <Avatar className="h-10 w-10 border">
          <AvatarImage
            src={localContact.avatar_url || ''}
            alt={localContact.name}
          />
          <AvatarFallback>
            {localContact.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0 flex-grow">
          <div className="flex items-center gap-2">
            <Link
              to={`/contacts/${localContact.id}`}
              className="font-bold text-foreground truncate hover:underline"
            >
              {localContact.name}
            </Link>
          </div>
          <span className="text-sm text-muted-foreground truncate">
            {localContact.email}
          </span>
        </div>
        {/* Favourite Star Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'rounded-full w-9 h-9 transition-opacity',
            localContact.favourite
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100',
          )}
          onClick={handleToggle}
          disabled={isToggling(localContact.id)}
          aria-label={
            localContact.favourite
              ? 'Remove from favourites'
              : 'Add to favourites'
          }
        >
          {isToggling(localContact.id) ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Star
              className={cn(
                'h-5 w-5',
                localContact.favourite
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-400',
              )}
            />
          )}
        </Button>
      </div>

      {/* Company, Group, and Tags Section */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-x-4 text-sm">
        <div className="truncate font-medium">
          {localContact.company?.name || (
            <span className="italic text-muted-foreground">No company</span>
          )}
        </div>
        <div className="truncate font-medium">
          {localContact.groups[0]?.name || (
            <span className="italic text-muted-foreground">No group</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {localContact.tags.slice(0, 2).map(t => (
            <Badge
              key={t.id}
              className={`text-[10px] font-normal px-1.5 py-0 border-none ${getTagBgClass(
                t.color,
              )} ${getTagTextClass(t.color)}`}
            >
              {t.name}
            </Badge>
          ))}
          {localContact.tags.length > 2 && (
            <span className="text-xs text-muted-foreground font-medium">
              +{localContact.tags.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Date Added Section */}
      <div className="hidden lg:flex justify-end items-center gap-1.5 w-28 flex-shrink-0">
        <span className="text-xs text-muted-foreground">
          {format(new Date(localContact.created_at), 'd MMM, yy')}
        </span>
      </div>

      {/* Delete Action Section */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="rounded-full w-9 h-9 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};
