import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, Tag, Trash2, Loader2, Star } from 'lucide-react';
import type { TagColor } from '@/types/types';
import { cn, TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import type { ContactWithDetails } from '@/services/assignContactService';
import { useToggleContactFavourite } from '@/logic/useToggleContactFavourite';

// Helpers for dynamic tag styling
const getTagBgClass = (color: string | null) =>
  TAG_BG_CLASSES[color as TagColor] || 'bg-gray-100';
const getTagTextClass = (color: string | null) =>
  TAG_TEXT_CLASSES[color as TagColor] || 'text-gray-800';

// Defines the props accepted by the ContactCard component
type ContactCardProps = {
  contact: ContactWithDetails;
  onFavouriteChange: (contact: ContactWithDetails) => void;
};

export const ContactCard = ({
  contact,
  onFavouriteChange,
}: ContactCardProps) => {
  // Manages the card's own state, enabling optimistic updates.
  const [localContact, setLocalContact] = useState(contact);

  // Syncs local state when the contact prop from the parent changes.
  useEffect(() => {
    setLocalContact(contact);
  }, [contact]);

  // Custom hook for handling the favourite toggle API call and loading state.
  const { toggleFavourite, isToggling } = useToggleContactFavourite();

  // Memoized handler for the delete action.
  const handleDelete = useCallback(() => {
    // TODO: Implement remove contact logic
    console.log(
      `Deleting contact: ${localContact.name} (ID: ${localContact.id})`,
    );
    confirm(`Are you sure you want to delete ${localContact.name}?`);
  }, [localContact.id, localContact.name]);

  // Toggles favourite status with optimistic UI and notifies the parent to re-sort the list.
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

  return (
    <div className="flex flex-col p-4 border rounded-lg bg-card shadow-sm transition-shadow hover:shadow-md group">
      {/* Card Header: Avatar, Name, and Actions */}
      <div className="flex items-center gap-4 pb-3 border-b border-border/70 mb-3">
        <Avatar className="h-12 w-12 border">
          <AvatarImage
            src={localContact.avatar_url || ''}
            alt={localContact.name}
          />
          <AvatarFallback>
            {localContact.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-grow min-w-0">
          <Link
            to={`/contacts/${localContact.id}`}
            className="font-bold text-foreground text-lg leading-tight truncate hover:underline"
            title={localContact.name}
          >
            {localContact.name}
          </Link>
          <p
            className="text-sm text-muted-foreground leading-tight truncate"
            title={localContact.email}
          >
            {localContact.email}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            title="Delete Contact"
            className="rounded-full w-9 h-9 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
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
                  'h-5 w-5 transition-colors',
                  localContact.favourite
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-400 hover:text-gray-600',
                )}
              />
            )}
          </Button>
        </div>
      </div>

      {/* Card Body: Company, Group, and Tag affiliations */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
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
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          {localContact.groups?.[0]?.name ? (
            <span
              className="font-medium text-foreground truncate"
              title={localContact.groups[0].name}
            >
              {localContact.groups[0].name}
            </span>
          ) : (
            <span className="italic text-muted-foreground">No group</span>
          )}
        </div>
        <div className="flex items-start gap-2">
          <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex flex-wrap gap-1">
            {localContact.tags.length > 0 ? (
              localContact.tags.slice(0, 3).map(t => (
                <Badge
                  key={t.id}
                  className={`text-[10px] font-normal px-1.5 py-0 border-none ${getTagBgClass(t.color)} ${getTagTextClass(t.color)}`}
                >
                  {t.name}
                </Badge>
              ))
            ) : (
              <span className="italic text-muted-foreground">No tags</span>
            )}
            {localContact.tags.length > 3 && (
              <span className="text-xs text-muted-foreground font-medium ml-1">
                +{localContact.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Date added information */}
      <div className="pt-3 mt-3 border-t border-border/70 flex justify-between items-center text-sm">
        <span className="text-xs text-muted-foreground">Added</span>
        <span className="font-medium text-foreground">
          {format(new Date(localContact.created_at), 'd MMM, yyyy')}
        </span>
      </div>
    </div>
  );
};
