import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowRight,
  Users,
  Briefcase,
  Tags,
  Star,
  Loader2,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import type { Contact } from '@/types/types';
import { useToggleContactFavourite } from '@/logic/useToggleContactFavourite';

type FavouriteContactsProps = {
  favouriteContacts: Contact[];
};

const FavouriteContacts = ({ favouriteContacts }: FavouriteContactsProps) => {
  const [contacts, setContacts] = useState(favouriteContacts);
  const [currentPage, setCurrentPage] = useState(1);
  const CONTACTS_PER_PAGE = 4;

  useEffect(() => {
    setContacts(favouriteContacts);
  }, [favouriteContacts]);

  const { toggleFavourite, isToggling } = useToggleContactFavourite();

  const totalPages = Math.ceil(contacts.length / CONTACTS_PER_PAGE);
  const indexOfLastContact = currentPage * CONTACTS_PER_PAGE;
  const indexOfFirstContact = indexOfLastContact - CONTACTS_PER_PAGE;
  const currentContacts = contacts.slice(
    indexOfFirstContact,
    indexOfLastContact,
  );

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleToggle = async (contactId: string, currentStatus: boolean) => {
    setContacts(prev =>
      prev.map(c =>
        c.id === contactId ? { ...c, favourite: !currentStatus } : c,
      ),
    );

    const { success } = await toggleFavourite(contactId, currentStatus);

    if (!success) {
      setContacts(prev =>
        prev.map(c =>
          c.id === contactId ? { ...c, favourite: currentStatus } : c,
        ),
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Favourite Contacts
        </CardTitle>
      </CardHeader>

      <CardContent
        className={cn(
          'min-h-[320px] ',

          contacts.length === 0 && 'flex flex-col items-center justify-center',
        )}
      >
        {contacts.length > 0 ? (
          <div className="space-y-3">
            {currentContacts.map(contact => {
              const company =
                contact.contact_companies?.length > 0
                  ? contact.contact_companies[0]
                  : null;
              const group =
                contact.contact_groups?.length > 0
                  ? contact.contact_groups[0]
                  : null;
              const tags = contact.contact_tags || [];

              return (
                <div
                  key={contact.id}
                  className="flex items-center justify-between gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Link
                    to={`/contacts/${contact.id}`}
                    className="flex items-center gap-3 flex-grow min-w-0 p-0.5 -m-0.5 rounded-lg"
                  >
                    <img
                      src={contact.avatar_url}
                      alt={`${contact.name}`}
                      className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col flex-grow truncate">
                      <span className="font-semibold text-foreground truncate">
                        {contact.name}
                      </span>
                      {contact.email && (
                        <span className="text-sm text-muted-foreground truncate">
                          {contact.email}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="flex items-center flex-shrink-0 ml-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full w-9 h-9"
                      onClick={() =>
                        handleToggle(contact.id, contact.favourite ?? false)
                      }
                      disabled={isToggling(contact.id)}
                      aria-label={
                        contact.favourite
                          ? 'Remove from favourites'
                          : 'Add to favourites'
                      }
                    >
                      {isToggling(contact.id) ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Star
                          className={cn(
                            'h-5 w-5 transition-colors',
                            contact.favourite
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-400 hover:text-gray-600',
                          )}
                        />
                      )}
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-sm">
                          Show Details
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-popover text-popover-foreground shadow-md rounded-lg border p-4 max-w-xs">
                        <div className="flex flex-col space-y-3">
                          <h4 className="font-semibold text-base text-foreground">
                            Contact Details
                          </h4>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span
                              className={cn(
                                'truncate',
                                !company && 'italic text-muted-foreground',
                              )}
                              title={company?.name || 'No company'}
                            >
                              {company?.name || 'No company'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span
                              className={cn(
                                'truncate',
                                !group && 'italic text-muted-foreground',
                              )}
                              title={group?.name || 'No group'}
                            >
                              {group?.name || 'No group'}
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Tags className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div className="flex flex-wrap items-center gap-1">
                              {tags.length > 0 ? (
                                tags.map(tag => (
                                  <Badge
                                    key={tag.id}
                                    className={cn(
                                      'font-normal text-xs px-2 py-0.5',
                                      tag.color &&
                                        TAG_BG_CLASSES[tag.color] &&
                                        TAG_TEXT_CLASSES[tag.color]
                                        ? [
                                            TAG_BG_CLASSES[tag.color],
                                            TAG_TEXT_CLASSES[tag.color],
                                          ]
                                        : ['bg-gray-100', 'text-gray-600'],
                                    )}
                                  >
                                    {tag.name}
                                  </Badge>
                                ))
                              ) : (
                                <span className="italic text-sm text-muted-foreground">
                                  No Tags
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center">
            <Star className="h-10 w-10 text-muted-foreground mb-2 mx-auto" />
            <p className="font-medium">No Favourite Contacts</p>
            <p className="text-sm text-muted-foreground">
              Click the star on a contact to add them here.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end border-t px-6">
        {contacts.length > CONTACTS_PER_PAGE ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        ) : (
          <div />
        )}
        <Button
          variant="link"
          size="sm"
          className="p-0 text-sm text-primary"
          asChild
        >
          <Link to="/contacts">
            View All Contacts <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FavouriteContacts;
