import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDialog } from '@/contexts/DialogContext';
import { useDeleteContact } from '@/logic/useDeleteContact';
import { TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import default_woman from '@/assets/default_woman.svg';
import default_man from '@/assets/default_man.svg';
import { Pencil, Trash2 } from 'lucide-react';

// Assuming 'contact' prop type is defined elsewhere and imported
// For this example, let's define a basic version
type Contact = {
  id: string;
  name: string;
  avatar_url?: string | null;
  gender?: string | null;
  contact_tags: { id: string; name: string; color: string }[];
  contact_groups: { id: string; name: string }[];
};

export function ContactHeader({ contact }: { contact: Contact }) {
  const { openDialog } = useDialog();
  const { deleteContact, isDeleting } = useDeleteContact();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      await deleteContact(contact.id, { name: contact.name });

      navigate('/contacts');
    }
  };

  return (
    <Card className="p-6 shadow-md">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="flex-shrink-0">
          <Avatar className="h-28 w-28">
            <AvatarImage
              src={
                contact.avatar_url ||
                (contact.gender === 'female' ? default_woman : default_man)
              }
              alt={contact.name}
            />
            <AvatarFallback className="text-5xl">
              {contact.name ? contact.name[0] : '?'}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground truncate">
              {contact.name}
            </h1>
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary h-8 w-8"
                onClick={() =>
                  openDialog('editProfile', { type: 'editContact', contact })
                }
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive h-8 w-8"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Tags:
            </h3>
            {contact.contact_tags?.length > 0 ? (
              contact.contact_tags.map(tag => (
                <Badge
                  key={tag.id}
                  className={`${TAG_BG_CLASSES[tag.color]} ${TAG_TEXT_CLASSES[tag.color]} border-none shadow-sm text-xs`}
                >
                  {tag.name}
                </Badge>
              ))
            ) : (
              <Badge variant="secondary" className="text-xs">
                No tags
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Group:
            </h3>
            {contact.contact_groups?.length > 0 ? (
              <span className="text-sm">{contact.contact_groups[0].name}</span>
            ) : (
              <span className="text-sm text-muted-foreground">
                No group assigned
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
