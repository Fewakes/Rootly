import { TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import type { Contact, TagColor } from '@/types/types';
import { Link } from 'react-router-dom';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';

interface RecentContactsListItemProps {
  contact: Contact;
}

export default function RecentContactsListItem({
  contact,
}: RecentContactsListItemProps) {
  // Defensive fallback for tags
  const tags = Array.isArray(contact.contact_tags) ? contact.contact_tags : [];

  return (
    <Link
      to={`/contacts/${contact.id}`}
      className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50 cursor-pointer"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={contact.avatar_url} alt={contact.name} />
        <AvatarFallback>{contact.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-semibold">{contact.name}</span>
        <div className="flex gap-1 flex-wrap text-xs text-muted-foreground">
          {tags.length > 0 ? (
            tags.map(t => (
              <Badge
                key={t.id}
                variant="outline"
                className={`
    ${TAG_BG_CLASSES[t.color as TagColor]} 
    ${TAG_TEXT_CLASSES[t.color as TagColor]} 
    outline-none ring-0 focus:outline-none focus:ring-0 
    border-none shadow-none
  `}
              >
                {t.name}
              </Badge>
            ))
          ) : (
            <span className="italic">No tags</span>
          )}
        </div>
      </div>
    </Link>
  );
}
