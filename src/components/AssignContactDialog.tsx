import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import { useAssignContact } from '@/contexts/AssignContactContext';
import {
  getAssignedContacts,
  getEligibleContacts,
  addContactToEntity,
  removeContactFromEntity,
} from '@/services/assignContactService';
import type { ContactWithAvatar, AssignEntity } from '@/types/types';

export function AssignContactDialog() {
  const { open, entity, closeDialog } = useAssignContact();

  const [assigned, setAssigned] = useState<ContactWithAvatar[]>([]);
  const [eligible, setEligible] = useState<ContactWithAvatar[]>([]);

  useEffect(() => {
    if (!entity) return;

    const loadContacts = async () => {
      const assignedData = await getAssignedContacts(entity);
      const eligibleData = await getEligibleContacts(entity);
      setAssigned(assignedData.flat());
      setEligible(eligibleData.flat());
    };

    loadContacts();
  }, [entity]);

  const handleAdd = async (contactId: string) => {
    if (!entity) return;
    await addContactToEntity(entity, contactId);
    toast.success('Contact added successfully');
    await refreshContacts(entity);
  };

  const handleRemove = async (contactId: string) => {
    if (!entity) return;
    await removeContactFromEntity(entity, contactId);
    toast.success('Contact removed successfully');
    await refreshContacts(entity);
  };

  const refreshContacts = async (entity: AssignEntity) => {
    const [assignedData, eligibleData] = await Promise.all([
      getAssignedContacts(entity),
      getEligibleContacts(entity),
    ]);
    setAssigned(assignedData.flat());
    setEligible(eligibleData.flat());
  };

  const displayType = entity?.type
    ? entity.type.charAt(0).toUpperCase() + entity.type.slice(1)
    : '';

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="max-w-xl bg-background/95 backdrop-blur-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {entity ? (
              <>
                Assign Contacts to{' '}
                <span className="font-bold">{entity.name}</span>{' '}
                <span className="capitalize">{entity.type}</span>
              </>
            ) : (
              <>Loading...</>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-8">
          {/* Assigned Contacts Section */}
          <section className="p-4 border rounded-lg bg-muted/30">
            <h4 className="font-medium mb-3 text-primary">
              Contacts Currently Assigned to This {displayType}
            </h4>

            {assigned.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No contacts have been assigned yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {assigned.map(contact => (
                  <div
                    key={contact.id}
                    className="flex items-center gap-2 rounded-full border px-3 py-1 bg-muted"
                  >
                    <img
                      src={contact.avatar_url || ''}
                      alt={contact.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm font-medium">{contact.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-1 text-muted-foreground hover:text-destructive hover:bg-muted/60"
                      onClick={() => handleRemove(contact.id)}
                      aria-label={`Remove ${contact.name}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <hr className="border-muted-foreground/50" />

          {/* Eligible Contacts Section */}
          <section className="p-4 border rounded-lg bg-muted/30">
            <h4 className="font-medium mb-2 text-primary">
              Contacts Available to Add to This {displayType}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Below are contacts eligible to be added. Click &quot;Add&quot; to
              assign them.
            </p>

            {eligible.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No eligible contacts available to add.
              </p>
            ) : (
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {eligible.map(contact => (
                  <li
                    key={contact.id}
                    className="flex justify-between items-center border rounded-md p-2 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={contact.avatar_url || ''}
                        alt={contact.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-medium">{contact.name}</span>
                    </div>
                    <Button onClick={() => handleAdd(contact.id)} size="sm">
                      Add
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
