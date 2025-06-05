import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@radix-ui/react-dialog';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useState, useEffect } from 'react';
import { FiTrash2, FiUserPlus } from 'react-icons/fi';
import { DialogHeader, Button, Input } from './ui';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';

// Types
type Contact = {
  id: string;
  name: string;
  avatar_url?: string;
  hasGroup?: boolean;
  hasCompany?: boolean;
};

type AssignContactDialogProps = {
  entityType: 'group' | 'tag' | 'company';
  entityId: string | null; // null means closed
  entityName: string;
  isOpen: boolean;
  onClose: () => void;
  fetchEntityData: (
    entityType: string,
    entityId: string,
  ) => Promise<{
    assignedContacts: Contact[];
    availableContacts: Contact[];
  }>;
  assignContact: (
    entityType: string,
    entityId: string,
    contactId: string,
  ) => Promise<void>;
  removeContact: (
    entityType: string,
    entityId: string,
    contactId: string,
  ) => Promise<void>;
};

export function AssignContactDialog({
  entityType,
  entityId,
  entityName,
  isOpen,
  onClose,
  fetchEntityData,
  assignContact,
  removeContact,
}: AssignContactDialogProps) {
  const [assignedContacts, setAssignedContacts] = useState<Contact[]>([]);
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch contacts when dialog opens or entity changes
  useEffect(() => {
    if (entityId && isOpen) {
      setLoading(true);
      fetchEntityData(entityType, entityId)
        .then(({ assignedContacts, availableContacts }) => {
          setAssignedContacts(assignedContacts);
          setAvailableContacts(availableContacts);
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load contacts');
          setLoading(false);
        });
    }
  }, [entityId, entityType, isOpen, fetchEntityData]);

  // Assign contact handler
  const handleAssign = async (contactId: string) => {
    if (!entityId) return;
    setAssigningId(contactId);
    try {
      await assignContact(entityType, entityId, contactId);
      toast.success(`Contact added to ${entityName}`);
      // Refresh lists
      const { assignedContacts, availableContacts } = await fetchEntityData(
        entityType,
        entityId,
      );
      setAssignedContacts(assignedContacts);
      setAvailableContacts(availableContacts);
    } catch {
      toast.error('Failed to assign contact');
    } finally {
      setAssigningId(null);
    }
  };

  // Remove contact handler
  const handleRemove = async (contactId: string) => {
    if (!entityId) return;
    if (!confirm(`Remove this contact from ${entityName}?`)) return;
    setRemovingId(contactId);
    try {
      await removeContact(entityType, entityId, contactId);
      toast.success(`Contact removed from ${entityName}`);
      // Refresh lists
      const { assignedContacts, availableContacts } = await fetchEntityData(
        entityType,
        entityId,
      );
      setAssignedContacts(assignedContacts);
      setAvailableContacts(availableContacts);
    } catch {
      toast.error('Failed to remove contact');
    } finally {
      setRemovingId(null);
    }
  };

  // Filter available contacts by search term
  const filteredAvailableContacts = availableContacts.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-2xl w-full p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Manage Contacts for{' '}
            {entityType.charAt(0).toUpperCase() + entityType.slice(1)}:{' '}
            {entityName}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Assigned contacts */}
            <section>
              <h3 className="mb-2 text-lg font-medium">Assigned Contacts</h3>
              {assignedContacts.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No contacts assigned yet.
                </p>
              ) : (
                <ScrollArea className="max-h-48 border rounded-md p-2 bg-white">
                  <ul className="space-y-2">
                    {assignedContacts.map(contact => (
                      <li
                        key={contact.id}
                        className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            {contact.avatar_url ? (
                              <AvatarImage
                                src={contact.avatar_url}
                                alt={contact.name}
                              />
                            ) : (
                              <AvatarFallback>{contact.name[0]}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{contact.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(contact.id)}
                          disabled={removingId === contact.id}
                          aria-label={`Remove ${contact.name} from ${entityName}`}
                        >
                          <FiTrash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </section>

            {/* Assign contacts */}
            <section>
              <h3 className="mb-2 text-lg font-medium">Add Contacts</h3>
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="mb-3"
              />
              {filteredAvailableContacts.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No contacts available to add.
                </p>
              ) : (
                <ScrollArea className="max-h-48 border rounded-md p-2 bg-white">
                  <ul className="space-y-2">
                    {filteredAvailableContacts.map(contact => (
                      <li
                        key={contact.id}
                        className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            {contact.avatar_url ? (
                              <AvatarImage
                                src={contact.avatar_url}
                                alt={contact.name}
                              />
                            ) : (
                              <AvatarFallback>{contact.name[0]}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{contact.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAssign(contact.id)}
                          disabled={assigningId === contact.id}
                          aria-label={`Add ${contact.name} to ${entityName}`}
                        >
                          <FiUserPlus className="w-4 h-4 text-green-600" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </section>

            <div className="flex justify-end gap-3 pt-3">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
