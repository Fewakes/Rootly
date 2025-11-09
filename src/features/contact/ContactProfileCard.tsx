import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useDialog } from '@/contexts/DialogContext';
import { useDeleteContact } from '@/logic/useDeleteContact';
import { useToggleContactFavourite } from '@/logic/useToggleContactFavourite';

import { TAG_BG_CLASSES, TAG_TEXT_CLASSES, cn } from '@/lib/utils';
import defaultWoman from '@/assets/default_woman.svg';
import defaultMan from '@/assets/default_man.svg';
import {
  CalendarDays,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Star,
  Tag,
  Trash2,
} from 'lucide-react';
import type { ContactWithDetails } from '@/types/types';

type ContactProfileCardProps = {
  contact: ContactWithDetails;
  onFavouriteChange: (updatedContact: ContactWithDetails) => void;
  onActionSuccess?: () => void;
};

export function ContactProfileCard({
  contact,
  onFavouriteChange,
  onActionSuccess,
}: ContactProfileCardProps) {
  const { openDialog } = useDialog();
  const { toggleFavourite, isToggling } = useToggleContactFavourite();
  const { deleteContact, loading: isDeleting } = useDeleteContact();
  const navigate = useNavigate();

  const [localContact, setLocalContact] = useState(contact);

  useEffect(() => {
    setLocalContact(contact);
  }, [contact]);

  const company = localContact.contact_companies?.[0];
  const group = localContact.contact_groups?.[0];

  const createdLabel = useMemo(() => {
    if (!localContact.created_at) return 'Not available';
    const parsed = new Date(localContact.created_at);
    if (Number.isNaN(parsed.getTime())) return 'Not available';
    return format(parsed, 'MMMM d, yyyy');
  }, [localContact.created_at]);

  const initials = useMemo(() => {
    if (!localContact.name) return 'C';
    const tokens = localContact.name.split(' ');
    return tokens
      .slice(0, 2)
      .map(token => token.charAt(0).toUpperCase())
      .join('')
      .padEnd(2, 'C');
  }, [localContact.name]);

  const handleToggleFavourite = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setLocalContact(prev => ({ ...prev, favourite: !prev.favourite }));

    const { success } = await toggleFavourite(
      localContact.id,
      !!localContact.favourite,
      localContact.name,
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

  const handleDelete = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const success = await deleteContact(localContact.id, {
      name: localContact.name,
    });

    if (success) {
      navigate('/contacts');
      onActionSuccess?.();
    }
  };

  const primaryEmail = localContact.email;
  const primaryPhone = localContact.contact_number;
  const location = [localContact.town, localContact.country]
    .filter(Boolean)
    .join(', ');
  const webLink = localContact.link_url || localContact.link_name || undefined;

  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-1 items-start gap-4">
            <Avatar className="h-16 w-16 border shadow-sm">
              <AvatarImage
                src={
                  localContact.avatar_url ||
                  (localContact.gender === 'female' ? defaultWoman : defaultMan)
                }
                alt={localContact.name}
              />
              <AvatarFallback className="text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-2xl font-semibold text-foreground">
                  {localContact.name}
                </CardTitle>
                {localContact.favourite ? (
                  <Badge variant="secondary" className="text-xs font-medium">
                    Favourite
                  </Badge>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Mail className="mt-0.5 h-4 w-4" />
                  <span className="break-all">
                    {primaryEmail || <span className="italic">No email listed</span>}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Phone className="mt-0.5 h-4 w-4" />
                  <span>
                    {primaryPhone || <span className="italic">No phone on file</span>}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4" />
                  <span>
                    {location || <span className="italic">Location not provided</span>}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Globe className="mt-0.5 h-4 w-4" />
                  <span>
                    {webLink ? (
                      <a
                        href={webLink.startsWith('http') ? webLink : `https://${webLink}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        {webLink}
                      </a>
                    ) : (
                      <span className="italic">No link added</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-none items-center gap-2">
            <Button
              size="sm"
              onClick={() =>
                openDialog('editProfile', {
                  type: 'editContact',
                  contact,
                  onActionSuccess,
                })
              }
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleToggleFavourite}
              disabled={isToggling(localContact.id)}
              className={cn(
                'flex items-center gap-2',
                localContact.favourite && 'border-yellow-400 bg-yellow-50 text-yellow-700',
              )}
            >
              {isToggling(localContact.id) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Star
                  className={cn(
                    'h-4 w-4',
                    localContact.favourite ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground',
                  )}
                />
              )}
              {localContact.favourite ? 'Remove Favourite' : 'Add Favourite'}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3 rounded-lg border bg-background p-4 shadow-sm">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={company?.company_logo || ''} alt={company?.name} />
              <AvatarFallback>
                {company?.name ? company.name.charAt(0).toUpperCase() : 'C'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Company
              </p>
              <p className="text-sm font-semibold text-foreground">
                {company?.name || 'Not assigned'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border bg-background p-4 shadow-sm">
            <Avatar className="h-10 w-10 border">
              <AvatarFallback>
                {group?.name ? group.name.charAt(0).toUpperCase() : 'G'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Group
              </p>
              <p className="text-sm font-semibold text-foreground">
                {group?.name || 'Not assigned'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border bg-background p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Tag className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tags
              </p>
              {localContact.contact_tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {localContact.contact_tags.slice(0, 3).map(tag => (
                    <Badge
                      key={tag.id}
                      className={cn(
                        'flex items-center gap-1 border-none px-2 py-0 text-xs font-medium capitalize',
                        tag.color && TAG_BG_CLASSES[tag.color]
                          ? TAG_BG_CLASSES[tag.color]
                          : 'bg-primary/10',
                        tag.color && TAG_TEXT_CLASSES[tag.color]
                          ? TAG_TEXT_CLASSES[tag.color]
                          : 'text-primary',
                      )}
                    >
                      <Tag className="h-3 w-3" />
                      {tag.name}
                    </Badge>
                  ))}
                  {localContact.contact_tags.length > 3 ? (
                    <Badge variant="outline" className="text-xs font-medium">
                      +{localContact.contact_tags.length - 3}
                    </Badge>
                  ) : null}
                </div>
              ) : (
                <Badge variant="outline" className="text-xs font-medium text-muted-foreground">
                  No tags yet
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border bg-background p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Created
              </p>
              <p className="text-sm font-semibold text-foreground">{createdLabel}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
