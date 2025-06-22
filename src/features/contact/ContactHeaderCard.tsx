// src/features/contact/ContactHeaderCard.tsx

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
  Star,
  Loader2,
} from 'lucide-react';

// TYPE DEFINITIONS
type Tag = { id: string; name: string; color: string };
type Group = { id: string; name: string };
type Company = { id: string; name: string; company_logo?: string | null };
export type Contact = {
  id: string;
  name: string;
  avatar_url?: string | null;
  gender?: string | null;
  favourite?: boolean;
  contact_tags: Tag[];
  contact_groups: Group[];
  contact_companies: Company[];
};

// COMPONENT PROPS
type ContactHeaderCardProps = {
  contact: Contact;
  onFavouriteChange: (updatedContact: Contact) => void;
};

export function ContactHeaderCard({
  contact,
  onFavouriteChange,
}: ContactHeaderCardProps) {
  const { openDialog } = useDialog();
  const { deleteContact, isDeleting } = useDeleteContact();
  const [localContact, setLocalContact] = useState(contact);
  const { toggleFavourite, isToggling } = useToggleContactFavourite();

  useEffect(() => {
    setLocalContact(contact);
  }, [contact]);

  const handleDelete = async () => {
    if (
      window.confirm(`Are you sure you want to delete ${localContact.name}?`)
    ) {
      await deleteContact(localContact.id, { name: localContact.name });
    }
  };

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
      toast.error('An error occurred. Please try again.');
    }
  };

  const company = localContact.contact_companies?.[0];
  const group = localContact.contact_groups?.[0];

  return (
    <Card className="shadow-md h-full flex flex-col relative group">
      {/* FIX: Action icons now have group-hover effect and Delete button is restored */}
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
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete Contact</span>
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

        {/* FIX: Layout reverted to the centered design you preferred */}
        <div className="mt-3 space-y-2 text-sm text-gray-600 w-full flex flex-col items-center">
          <div className="flex items-center gap-2 font-semibold">
            <Building2
              className={`h-4 w-4 flex-shrink-0 ${company ? 'text-gray-600' : 'text-gray-400'}`}
            />
            {company ? (
              <span>{company.name}</span>
            ) : (
              <span className="text-sm italic text-gray-400 font-normal">
                No company assigned
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Group:{' '}
            <span className="font-medium">
              {group ? (
                group.name
              ) : (
                <span className="italic text-gray-400 font-normal">
                  No group
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 border-t pt-4 w-full">
          {localContact.contact_tags.length > 0 ? (
            localContact.contact_tags.map(tag => (
              <Badge
                key={tag.id}
                className={`${TAG_BG_CLASSES[tag.color] || 'bg-gray-200'} ${TAG_TEXT_CLASSES[tag.color] || 'text-gray-800'} border-none shadow-sm`}
              >
                {tag.name}
              </Badge>
            ))
          ) : (
            <Badge variant="secondary" className="font-normal italic">
              No tags assigned
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
