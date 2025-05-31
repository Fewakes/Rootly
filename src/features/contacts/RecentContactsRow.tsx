import { TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import type { Contact, TagColor } from '@/types/types';
import { Link } from 'react-router-dom';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Trash2 } from 'lucide-react';

import { toast } from 'sonner';
import { useDeleteContact } from '@/logic/useDeleteContact';

interface RecentContactsListItemProps {
  contact: Contact;
}

export default function RecentContactsRow({
  contact,
}: RecentContactsListItemProps) {
  const tags = Array.isArray(contact.contact_tags) ? contact.contact_tags : [];
  const { deleteContact, loading } = useDeleteContact();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    deleteContact(
      contact.id,
      () => toast.success('Contact deleted'),
      err => toast.error('Failed to delete contact'),
    );
  };

  return (
    <Link
      to={`/contacts/${contact.id}`}
      className="flex items-center justify-between gap-3 p-2 border rounded hover:bg-gray-50 cursor-pointer group"
    >
      <div className="flex items-center gap-3">
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
      </div>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-opacity"
        title="Delete Contact"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </Link>
  );
}
