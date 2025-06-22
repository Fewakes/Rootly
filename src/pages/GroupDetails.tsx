import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDialog } from '@/contexts/DialogContext';
import { toast } from 'sonner';
import { Users } from 'lucide-react';

import { useGroup } from '@/logic/useGroup';

import { useGroupNotes, useGroupTasks } from '@/logic/useEntityNotesTasks';
import {
  groupNotesService,
  groupTasksService,
} from '@/services/entityNotesTasks';
import { useUserAuthProfile } from '@/logic/useUserAuthProfile';
import { getCurrentUserId } from '@/services/users';

import { EntityHeader } from '@/features/entities/EntityHeader';
import { AssignedContactsManager } from '@/features/entities/AssignedContactsManager';
import { AtAGlance } from '@/features/entities/AtAGlance';
import { ActivityFeed } from '@/features/entities/ActivityFeed';
import EntityDetailsSkeleton from '@/features/entities/EntityDetailsSkeleton';
import { useEntityContacts } from '@/logic/useEntityContacts';

export default function GroupDetails() {
  const { id } = useParams<{ id: string }>();
  const [userId, setUserId] = useState<string | null>(null);
  const { user } = useUserAuthProfile();
  const { openDialog, openDialogName } = useDialog();

  const entity = useMemo(
    () => (id ? ({ id, type: 'group' } as const) : null),
    [id],
  );

  const {
    group,
    loading: isLoadingGroup,
    refetch: refetchGroup,
  } = useGroup(id);
  const {
    assigned,
    eligible,
    loading: isLoadingContacts,
    addContact,
    removeContact,
  } = useEntityContacts(entity);
  const {
    items: notes,
    loading: isLoadingNotes,
    refetch: refetchNotes,
  } = useGroupNotes(userId || '', id || '');
  const {
    items: tasks,
    loading: isLoadingTasks,
    refetch: refetchTasks,
  } = useGroupTasks(userId || '', id || '');

  useEffect(() => {
    const fetchUser = async () => {
      setUserId(await getCurrentUserId());
    };
    fetchUser();
  }, []);

  const prevOpenDialogName = useRef(openDialogName);
  useEffect(() => {
    if (prevOpenDialogName.current === 'editGroup' && openDialogName === null) {
      toast.info('Refreshing group data...');
      refetchGroup();
    }
    prevOpenDialogName.current = openDialogName;
  }, [openDialogName, refetchGroup]);

  if (isLoadingGroup) return <EntityDetailsSkeleton />;
  if (!group) return <div className="p-8 text-center">Group not found.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <EntityHeader
        type="Group"
        name={group.name}
        description={group.description}
        icon={<Users />}
        onEdit={() => openDialog('editGroup', { type: 'group', ...group })}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 xl:col-span-8">
          <AssignedContactsManager
            assigned={assigned}
            eligible={eligible}
            loading={isLoadingContacts}
            onAddContact={addContact}
            onRemoveContact={removeContact}
          />
        </div>
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          <AtAGlance
            rankLabel="Group Rank"
            rank={group.rank}
            total={group.total_groups}
            tasks={tasks}
          />
          <ActivityFeed
            entityId={id!}
            userId={userId!}
            user={user}
            notes={notes}
            tasks={tasks}
            isLoadingNotes={isLoadingNotes}
            isLoadingTasks={isLoadingTasks}
            refetchNotes={refetchNotes}
            refetchTasks={refetchTasks}
            notesService={groupNotesService}
            tasksService={groupTasksService}
            entityType="group"
          />
        </div>
      </div>
    </div>
  );
}
