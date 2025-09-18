import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { useDialog } from '@/contexts/DialogContext';
import { useDeleteContact } from '@/logic/useDeleteContact';
import { useToggleContactFavourite } from '@/logic/useToggleContactFavourite';

import { TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import { cn } from '@/lib/utils';
import default_woman from '@/assets/default_woman.svg';
import default_man from '@/assets/default_man.svg';
import {
  Pencil,
  Trash2,
  Building2,
  Users,
  Tag,
  Loader2,
  Star,
} from 'lucide-react';
import type { ContactWithDetails } from '@/types/types';

type ContactHeaderCardProps = {
  contact: ContactWithDetails;
  onFavouriteChange: (updatedContact: ContactWithDetails) => void;
  onActionSuccess?: () => void;
};

export function ContactHeaderCard({
  contact,
  onFavouriteChange,
  onActionSuccess,
}: ContactHeaderCardProps) {
  const { openDialog } = useDialog();
  const navigate = useNavigate();
  const [localContact, setLocalContact] = useState(contact);
  const { toggleFavourite, isToggling } = useToggleContactFavourite();
  const { deleteContact, loading: isDeleting } = useDeleteContact();

  useEffect(() => {
    setLocalContact(contact);
  }, [contact]);

  const handleToggleFavourite = async (e: MouseEvent) => {
    e.stopPropagation();
    setLocalContact(prev => ({ ...prev, favourite: !prev.favourite }));
    const { success } = await toggleFavourite(
      localContact.id,
      !!localContact.favourite,
    );
    if (success) {
      onFavouriteChange({
        ...localContact,
        favourite: !localContact.favourite,
      });
    } else {
      setLocalContact(contact);
    }
  };

  const handleDelete = async (e: MouseEvent) => {
    e.stopPropagation();
    const success = await deleteContact(localContact.id, {
      name: localContact.name,
    });
    if (success) {
      navigate('/contacts');
      onActionSuccess?.();
    }
  };

  const company = localContact.contact_companies?.[0];
  const group = localContact.contact_groups?.[0];

  return (
    <Card className="shadow-md h-full flex flex-col relative group">
      {/* Action Buttons (Edit, Favorite, Delete) */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleToggleFavourite}
          disabled={isToggling(localContact.id)}
        >
          {isToggling(localContact.id) ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Star
              className={cn(
                'h-5 w-5 transition-colors',
                localContact.favourite
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 hover:text-yellow-400',
              )}
            />
          )}
          <span className="sr-only">Toggle Favourite</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() =>
            openDialog('editProfile', { type: 'editContact', contact })
          }
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit Profile</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          <span className="sr-only">Delete Contact</span>
        </Button>
      </div>

      {/* Contact Details Section */}
      <CardContent className="p-6 flex flex-col items-center justify-center text-center flex-grow">
        <Avatar className="h-28 w-28 border-4 border-white shadow-lg mb-4">
          <AvatarImage
            src={
              localContact.avatar_url ||
              (localContact.gender === 'female' ? default_woman : default_man)
            }
            alt={localContact.name}
          />
          <AvatarFallback className="text-4xl">
            {localContact.name ? localContact.name.charAt(0) : '?'}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold text-gray-800">
          {localContact.name}
        </h1>
        <div className="mt-4 pt-4 border-t w-full space-y-3 text-left">
          {/* Company Information */}
          <div className="flex items-start gap-3">
            <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-semibold">
                COMPANY
              </p>
              {company ? (
                <p className="font-medium text-foreground">{company.name}</p>
              ) : (
                <p className="italic text-muted-foreground text-sm">
                  No company assigned
                </p>
              )}
            </div>
          </div>
          {/* Group Information */}
          <div className="flex items-start gap-3">
            <Users className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-semibold">
                GROUP
              </p>
              {group ? (
                <p className="font-medium text-foreground">{group.name}</p>
              ) : (
                <p className="italic text-muted-foreground text-sm">
                  No group assigned
                </p>
              )}
            </div>
          </div>
          {/* Tags Information */}
          <div className="flex items-start gap-3">
            <Tag className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-semibold">
                TAGS
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {localContact.contact_tags.length > 0 ? (
                  localContact.contact_tags.map(tag => (
                    <Badge
                      key={tag.id}
                      className={`${TAG_BG_CLASSES[tag.color] || 'bg-gray-200'} ${TAG_TEXT_CLASSES[tag.color] || 'text-gray-800'} border-none`}
                    >
                      {tag.name}
                    </Badge>
                  ))
                ) : (
                  <p className="italic text-muted-foreground text-sm">
                    No tags assigned
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
