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
import { ArrowRight, Users, Briefcase, Tags } from 'lucide-react';
import {
  Popover, // Changed from Tooltip to Popover
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'; // Assuming these imports are correct for your setup

import { cn, TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';

// Using the Contact type from your central types file to ensure consistency
import type { Contact } from '@/types/types';

type FavouriteContactsProps = {
  favouriteContacts: Contact[];
};

const FavouriteContacts = ({ favouriteContacts }: FavouriteContactsProps) => {
  return (
    <Card>
      {/* Card Header Section */}
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Favourite Contacts
        </CardTitle>
      </CardHeader>

      {/* Card Content Section */}
      <CardContent>
        {favouriteContacts.length > 0 ? (
          <div className="space-y-3">
            {favouriteContacts.map(contact => {
              const company =
                contact.companies.length > 0 ? contact.companies[0] : null;
              const group =
                contact.groups.length > 0 ? contact.groups[0] : null;
              const tags = contact.tags || [];

              return (
                <div
                  key={contact.id}
                  className="flex items-center justify-between gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Contact Info Link Section */}
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
                      {contact.email && ( // Display email if available
                        <span className="text-sm text-muted-foreground truncate">
                          {contact.email}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Show Details Popover Section (Clickable) */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm flex-shrink-0 ml-auto"
                        // Removed onClick={(e) => e.preventDefault()} to allow Popover to open
                      >
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
              );
            })}
          </div>
        ) : (
          <div className="text-muted-foreground italic text-center py-10">
            No favourite contacts to display.
          </div>
        )}
      </CardContent>

      {/* Card Footer Section */}
      <CardFooter className="flex justify-end border-t px-6 ">
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
