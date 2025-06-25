import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Logic Hooks
import { useDialog } from '@/contexts/DialogContext';
import { useDeleteContact } from '@/logic/useDeleteContact';
import { useToggleContactFavourite } from '@/logic/useToggleContactFavourite';

// Utils & Assets
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
  Star,
  Loader2,
} from 'lucide-react';

// Type Definitions
export type Contact = {
  id: string;
  name: string;
  avatar_url?: string | null;
  gender?: string | null;
  favourite?: boolean;
  contact_tags: { id: string; name: string; color: string }[];
  contact_groups: { id: string; name: string }[];
  contact_companies: {
    id: string;
    name: string;
    company_logo?: string | null;
  }[];
};

type ContactHeaderCardProps = {
  contact: Contact;
  onFavouriteChange: (updatedContact: Contact) => void;
};

export function ContactHeaderCard({
  contact,
  onFavouriteChange,
}: ContactHeaderCardProps) {
  const { openDialog } = useDialog();
  const navigate = useNavigate();
  const [localContact, setLocalContact] = useState(contact);
  const { toggleFavourite, isToggling } = useToggleContactFavourite();
  const { deleteContact, loading: isDeleting } = useDeleteContact();

  useEffect(() => {
    setLocalContact(contact);
  }, [contact]);

  const handleToggleFavourite = async () => {
    const originalContact = localContact;
    const optimisticContact = {
      ...localContact,
      favourite: !localContact.favourite,
    };
    setLocalContact(optimisticContact);

    try {
      const { success } = await toggleFavourite(
        originalContact.id,
        !!originalContact.favourite,
      );
      if (success) {
        onFavouriteChange(optimisticContact);
      } else {
        setLocalContact(originalContact);
        toast.error('Failed to update favourite status.');
      }
    } catch (error) {
      setLocalContact(originalContact);
      toast.error('An error occurred while updating favourites.');
    }
  };

  const handleDelete = async () => {
    // THE FIX: Always use the 'localContact' state for actions within this component.
    const success = await deleteContact(localContact.id, {
      name: localContact.name,
    });

    if (success) {
      // The hook handles the success toast. We just navigate.
      navigate('/contacts');
    }
    // The hook also handles its own error toasts, so no 'catch' block is needed here.
  };

  const company = localContact.contact_companies?.[0];
  const group = localContact.contact_groups?.[0];

  return (
    <Card className="shadow-md h-full flex flex-col relative group">
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
        </Button>
      </div>

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
