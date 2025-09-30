import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  Users,
  Tag as TagIcon,
  Loader2,
  UserPlus,
  X,
} from 'lucide-react';

import SkeletonList from '@/features/entities/SkeletonList';
import type { AssignedContactDetails, TagColor } from '@/types/types';
import { cn, TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';

type AssignedContactsPanelProps = {
  assigned: AssignedContactDetails[];
  eligible: AssignedContactDetails[];
  loading: boolean;
  onAddContact: (contactId: string) => Promise<void>;
  onRemoveContact: (contactId: string) => Promise<void>;
};

export function AssignedContactsPanel({
  assigned,
  eligible,
  loading,
  onAddContact,
  onRemoveContact,
}: AssignedContactsPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableSearch, setAvailableSearch] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [addingContactIds, setAddingContactIds] = useState<Record<string, boolean>>({});
  const [removingContactIds, setRemovingContactIds] = useState<Record<string, boolean>>({});

  const filteredAssigned = useMemo(() => {
    if (!searchTerm.trim()) return assigned;
    const term = searchTerm.toLowerCase();
    return assigned.filter(contact =>
      [contact.name, contact.email, contact.company?.name, contact.group?.name]
        .filter(Boolean)
        .some(value => value?.toLowerCase().includes(term)),
    );
  }, [assigned, searchTerm]);

  const filteredEligible = useMemo(() => {
    if (!availableSearch.trim()) return eligible;
    const term = availableSearch.toLowerCase();
    return eligible.filter(contact =>
      [contact.name, contact.email, contact.company?.name, contact.group?.name]
        .filter(Boolean)
        .some(value => value?.toLowerCase().includes(term)),
    );
  }, [eligible, availableSearch]);

  const handleAddContact = async (contactId: string) => {
    setAddingContactIds(prev => ({ ...prev, [contactId]: true }));
    try {
      await onAddContact(contactId);
    } finally {
      setAddingContactIds(prev => {
        const { [contactId]: _removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleRemoveContact = async (contactId: string) => {
    setRemovingContactIds(prev => ({ ...prev, [contactId]: true }));
    try {
      await onRemoveContact(contactId);
    } finally {
      setRemovingContactIds(prev => {
        const { [contactId]: _removed, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              Assigned contacts
            </CardTitle>
            <CardDescription>
              Review who is already linked to this entity and invite more teammates when needed.
            </CardDescription>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" /> Add contacts
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Add contacts</SheetTitle>
                <SheetDescription>
                  Search the available list and add people to this entity.
                </SheetDescription>
              </SheetHeader>
              <div className="px-4">
                <Input
                  placeholder="Search available contacts..."
                  value={availableSearch}
                  onChange={event => setAvailableSearch(event.target.value)}
                  className="mb-4"
                />
              </div>
              <ScrollArea className="px-4 pb-6">
                <div className="space-y-3">
                  {loading ? (
                    <SkeletonList />
                  ) : filteredEligible.length > 0 ? (
                    filteredEligible.map(contact => {
                      const isAdding = !!addingContactIds[contact.id];
                      return (
                        <div
                          key={contact.id}
                          className="flex items-start gap-3 rounded-lg border p-3"
                        >
                          <Avatar className="h-9 w-9 border">
                            <AvatarImage
                              src={contact.avatar_url || ''}
                              alt={contact.name}
                            />
                            <AvatarFallback>
                              {contact.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground">
                              {contact.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {contact.email || 'No email available'}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <Building className="h-3.5 w-3.5" />
                                {contact.company?.name || 'No company'}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {contact.group?.name || 'No group'}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAddContact(contact.id)}
                            disabled={isAdding}
                          >
                            {isAdding ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Add'
                            )}
                          </Button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                      Everyone is already assigned.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
        <Input
          placeholder="Search assigned contacts..."
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <SkeletonList />
        ) : filteredAssigned.length > 0 ? (
          filteredAssigned.map(contact => {
            const isRemoving = !!removingContactIds[contact.id];
            return (
              <div
                key={contact.id}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={contact.avatar_url || ''} alt={contact.name} />
                  <AvatarFallback>{contact.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {contact.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {contact.email || 'No email available'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleRemoveContact(contact.id)}
                      disabled={isRemoving}
                    >
                      {isRemoving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Building className="h-3.5 w-3.5" />
                      {contact.company?.name || 'No company'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {contact.group?.name || 'No group'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {contact.tags.length > 0 ? (
                      contact.tags.slice(0, 3).map(tag => {
                        const hasColor =
                          tag.color &&
                          Object.prototype.hasOwnProperty.call(
                            TAG_BG_CLASSES,
                            tag.color,
                          );
                        const colorKey = hasColor
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
                                : 'bg-muted text-muted-foreground',
                            )}
                          >
                            {tag.name}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <TagIcon className="h-3.5 w-3.5" /> No tags
                      </span>
                    )}
                    {contact.tags.length > 3 ? (
                      <Badge variant="outline" className="text-xs font-medium">
                        +{contact.tags.length - 3} more
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            No contacts assigned yet. Use “Add contacts” to get started.
          </div>
        )}
        {!loading && filteredAssigned.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            Showing {filteredAssigned.length} of {assigned.length} contacts.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
