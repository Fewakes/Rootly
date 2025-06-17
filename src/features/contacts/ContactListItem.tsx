// src/components/ContactListItem.tsx
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
// Separator is NOT used here for row separation, as border-b is used
import { Briefcase, Users, Tag } from 'lucide-react';
import type { TagColor } from '@/types/types';
import { TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import type { ContactWithDetails } from '@/logic/useAllContacts';

// Helper functions for styling tags
const getTagBgClass = (color: string | null) =>
  TAG_BG_CLASSES[color as TagColor] || 'bg-gray-100';
const getTagTextClass = (color: string | null) =>
  TAG_TEXT_CLASSES[color as TagColor] || 'text-gray-800';

export const ContactListItem = ({
  contact,
}: {
  contact: ContactWithDetails;
}) => {
  return (
    <div className="group flex items-center gap-4 p-4 transition-colors hover:bg-muted/50 border-b last:border-b-0">
      {/* Left Section: Avatar & Contact Info (Name, Email) */}
      <div className="flex items-center gap-4 flex-shrink-0 w-1/3">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={contact.avatar_url || ''} alt={contact.name} />
          <AvatarFallback>
            {contact.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <Link
            to={`/contacts/${contact.id}`}
            className="font-bold text-foreground text-base leading-tight truncate hover:underline"
            title={contact.name}
          >
            {contact.name}
          </Link>
          <p
            className="text-xs text-muted-foreground leading-tight truncate"
            title={contact.email}
          >
            {contact.email}
          </p>
        </div>
      </div>

      {/* Middle Section: Affiliations (Company, Group, Tags) with clear labels */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 text-sm items-center">
        {/* Company Affiliation */}
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          {contact.company ? (
            <div className="flex items-center gap-1.5 font-medium text-foreground truncate">
              <img
                src={contact.company.company_logo || ''}
                alt={contact.company.name}
                className="h-4 w-4 object-contain"
              />
              <span title={contact.company.name}>{contact.company.name}</span>
            </div>
          ) : (
            <span className="italic text-muted-foreground">No company</span>
          )}
        </div>

        {/* Group Affiliation */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          {contact.groups?.[0]?.name ? (
            <span
              className="font-medium text-foreground truncate"
              title={contact.groups[0].name}
            >
              {contact.groups[0].name}
            </span>
          ) : (
            <span className="italic text-muted-foreground">No group</span>
          )}
        </div>

        {/* Tags Affiliation */}
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground self-start pt-0.5" />
          <div className="flex flex-wrap gap-1">
            {contact.tags.length > 0 ? (
              contact.tags.slice(0, 3).map(t => (
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
          </div>
        </div>
      </div>

      {/* Right Section: Creation Date */}
      <div className="flex items-center justify-end flex-shrink-0">
        <div className="hidden lg:flex flex-col items-end text-right w-28">
          <span className="text-xs text-muted-foreground">Added</span>
          <span className="text-sm font-medium text-foreground">
            {format(new Date(contact.created_at), 'd MMM, yyyy')}
          </span>
        </div>
      </div>
    </div>
  );
};
