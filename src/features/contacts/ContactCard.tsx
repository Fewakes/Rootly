import { useCallback } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, Tag, Trash2 } from 'lucide-react';
import type { TagColor } from '@/types/types';
import { TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import type { ContactWithDetails } from '@/logic/useAllContacts';

const getTagBgClass = (color: string | null) =>
  TAG_BG_CLASSES[color as TagColor] || 'bg-gray-100';
const getTagTextClass = (color: string | null) =>
  TAG_TEXT_CLASSES[color as TagColor] || 'text-gray-800';

export const ContactCard = ({ contact }: { contact: ContactWithDetails }) => {
  const handleDelete = useCallback(() => {
    // TODO: Implement remove contact logic
    console.log(`Deleting contact: ${contact.name} (ID: ${contact.id})`);
    confirm(`Are you sure you want to delete ${contact.name}?`); // Use a custom modal in production
  }, [contact.id, contact.name]);

  return (
    <div className="flex flex-col p-4 border rounded-lg bg-card shadow-sm transition-shadow hover:shadow-md group">
      {' '}
      {/* Top Section: Avatar, Name, Email, and Actions */}
      <div className="flex items-center gap-4 pb-3 border-b border-border/70 mb-3">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src={contact.avatar_url || ''} alt={contact.name} />
          <AvatarFallback>
            {contact.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-grow min-w-0">
          <Link
            to={`/contacts/${contact.id}`}
            className="font-bold text-foreground text-lg leading-tight truncate hover:underline"
            title={contact.name}
          >
            {contact.name}
          </Link>
          <p
            className="text-sm text-muted-foreground leading-tight truncate"
            title={contact.email}
          >
            {contact.email}
          </p>
        </div>

        <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            title="Delete Contact"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
      {/* Middle Section: Affiliations (Company, Group, Tags) */}
      <div className="space-y-2 text-sm">
        {/* Company Affiliation */}
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          {contact.company ? (
            <div className="flex items-center gap-1.5 font-medium text-foreground truncate">
              {contact.company.company_logo && (
                <img
                  src={contact.company.company_logo}
                  alt={contact.company.name}
                  className="h-4 w-4 object-contain"
                />
              )}
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
        <div className="flex items-start gap-2">
          {' '}
          <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />{' '}
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
            {contact.tags.length > 3 && (
              <span className="text-xs text-muted-foreground font-medium ml-1">
                +{contact.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="pt-3 mt-3 border-t border-border/70 flex justify-between items-center text-sm">
        <span className="text-xs text-muted-foreground">Added</span>
        <span className="font-medium text-foreground">
          {format(new Date(contact.created_at), 'd MMM, yyyy')}
        </span>
      </div>
    </div>
  );
};
