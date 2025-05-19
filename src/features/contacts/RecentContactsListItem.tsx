import type { ContactsProps } from '@/types/types';

import { Link } from 'react-router-dom';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';

export default function RecentContactsListItem({ contact }: ContactsProps) {
  return (
    <Link
      to={`/contacts/${contact.id}`}
      className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50 cursor-pointer"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={contact.avatar} alt={contact.name} />
        <AvatarFallback>{contact.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-semibold">{contact.name}</span>
        <div className="flex gap-1 flex-wrap text-xs text-muted-foreground">
          {contact.tags.map(tag => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
