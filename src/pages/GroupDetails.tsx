import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDialog } from '@/contexts/DialogContext';
import { toast } from 'sonner';
import { differenceInCalendarDays } from 'date-fns';

import { useGroup } from '@/logic/useGroup';

import { useGroupNotes, useGroupTasks } from '@/logic/useEntityNotesTasks';
import {
  groupNotesService,
  groupTasksService,
} from '@/services/entityNotesTasks';
import { useUserAuthProfile } from '@/logic/useUserAuthProfile';
import { getCurrentUserId } from '@/services/users';

import { AssignedContactsPanel } from '@/features/entities/AssignedContactsPanel';
import { AtAGlance } from '@/features/entities/AtAGlance';
import { ActivityFeed } from '@/features/entities/ActivityFeed';
import EntityDetailsSkeleton from '@/features/entities/EntityDetailsSkeleton';

import { useDeleteGroup } from '@/logic/useDeleteGroup';
import { useEntityContacts } from '@/logic/useEntityContacts';
import { GroupProfileCard } from '@/features/groups/GroupProfileCard';
export default function GroupDetails() {
  const { id } = useParams<{ id: string }>();
  const [userId, setUserId] = useState<string | null>(null);
  const { user } = useUserAuthProfile();
  const { openDialog, openDialogName } = useDialog();
  const navigate = useNavigate();

  const {
    group,
    loading: isLoadingGroup,
    refetch: refetchGroup,
  } = useGroup(id);
  const entity = useMemo(
    () =>
      id && group
        ? ({ id, type: 'group' as const, name: group.name })
        : null,
    [id, group],
  );
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
  } = useGroupNotes(userId || '', id || '', group?.name ?? '');
  const {
    items: tasks,
    loading: isLoadingTasks,
    refetch: refetchTasks,
  } = useGroupTasks(userId || '', id || '', group?.name ?? '');

  const { openTaskCount, completedTaskCount, dueSoonCount, lastActivityDate } =
    useMemo(() => {
      const now = new Date();
      const openTasks = tasks.filter(task => !task.completed);
      const completedTasks = tasks.filter(task => task.completed);
      const dueSoon = openTasks.reduce((count, task) => {
        if (!task.due_date) return count;
        const dueDate = new Date(task.due_date);
        if (Number.isNaN(dueDate.getTime())) return count;
        const diff = differenceInCalendarDays(dueDate, now);
        return diff >= 0 && diff <= 7 ? count + 1 : count;
      }, 0);

      const timestamps: number[] = [];
      notes.forEach(note => {
        const value = new Date(note.created_at).getTime();
        if (!Number.isNaN(value)) {
          timestamps.push(value);
        }
      });
      tasks.forEach(task => {
        const value = new Date(task.created_at).getTime();
        if (!Number.isNaN(value)) {
          timestamps.push(value);
        }
      });

      const lastTimestamp = timestamps.length ? Math.max(...timestamps) : null;

      return {
        openTaskCount: openTasks.length,
        completedTaskCount: completedTasks.length,
        dueSoonCount: dueSoon,
        lastActivityDate: lastTimestamp ? new Date(lastTimestamp) : null,
      };
    }, [notes, tasks]);

  const isSummaryLoading =
    isLoadingContacts || isLoadingNotes || isLoadingTasks || isLoadingGroup;

  useEffect(() => {
    const fetchUser = async () => {
      setUserId(await getCurrentUserId());
    };
    fetchUser();
  }, []);

  const { deleteGroup, isLoading: isDeleting } = useDeleteGroup();

  const prevOpenDialogName = useRef(openDialogName);
  useEffect(() => {
    if (prevOpenDialogName.current === 'editGroup' && openDialogName === null) {
      toast.info('Refreshing group data...');
      refetchGroup();
    }
    prevOpenDialogName.current = openDialogName;
  }, [openDialogName, refetchGroup]);

  const handleDelete = async () => {
    if (!group) return;
    if (
      window.confirm(
        `Are you sure you want to delete the group "${group.name}"? This action cannot be undone.`,
      )
    ) {
      const success = await deleteGroup(group.id, {
        groupName: group.name,
      });
      if (success) {
        navigate('/groups');
      }
    }
  };

  const handleScrollToContacts = () => {
    if (typeof document === 'undefined') return;
    const section = document.getElementById('group-contacts');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isLoadingGroup) return <EntityDetailsSkeleton />;
  if (!group) return <div className="p-8 text-center">Group not found.</div>;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <GroupProfileCard
        group={group}
        assignedCount={assigned.length}
        eligibleCount={eligible.length}
        onEdit={() =>
          openDialog('editGroup', {
            type: 'group',
            id: group.id,
            name: group.name,
            description: group.description ?? undefined,
          })
        }
        onDelete={handleDelete}
        isDeleting={isDeleting}
        onScrollToContacts={handleScrollToContacts}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section id="group-contacts" className="xl:col-span-7">
          <AssignedContactsPanel
            assigned={assigned}
            eligible={eligible}
            loading={isLoadingContacts}
            onAddContact={addContact}
            onRemoveContact={removeContact}
          />
        </section>
        <div className="flex flex-col gap-6 xl:col-span-5">
          <ActivityFeed
            entityId={id!}
            userId={userId!}
            entityName={group.name}
            entityType="group"
            user={user}
            notes={notes}
            tasks={tasks}
            isLoading={isLoadingNotes || isLoadingTasks}
            refetchNotes={refetchNotes}
            refetchTasks={refetchTasks}
            notesService={groupNotesService}
            tasksService={groupTasksService}
          />
          <AtAGlance
            isLoading={isSummaryLoading}
            assignedCount={assigned.length}
            eligibleCount={eligible.length}
            openTaskCount={openTaskCount}
            dueSoonCount={dueSoonCount}
            completedTaskCount={completedTaskCount}
            notesCount={notes.length}
            lastActivityDate={lastActivityDate}
            tasks={tasks}
          />
        </div>
      </div>
    </div>
  );
}
