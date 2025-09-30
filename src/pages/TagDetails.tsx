import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDialog } from '@/contexts/DialogContext';
import { toast } from 'sonner';
import { differenceInCalendarDays } from 'date-fns';

import useTag from '@/logic/useTag';

import { useTagNotes, useTagTasks } from '@/logic/useEntityNotesTasks';
import { tagNotesService, tagTasksService } from '@/services/entityNotesTasks';
import { useUserAuthProfile } from '@/logic/useUserAuthProfile';
import { getCurrentUserId } from '@/services/users';

import { AssignedContactsPanel } from '@/features/entities/AssignedContactsPanel';
import { AtAGlance } from '@/features/entities/AtAGlance';
import { ActivityFeed } from '@/features/entities/ActivityFeed';
import EntityDetailsSkeleton from '@/features/entities/EntityDetailsSkeleton';
import { useDeleteTag } from '@/logic/useDeleteTag';
import { useEntityContacts } from '@/logic/useEntityContacts';
import { TagProfileCard } from '@/features/tags/TagProfileCard';

export default function TagDetails() {
  const { id } = useParams<{ id: string }>();
  const [userId, setUserId] = useState<string | null>(null);
  const { user } = useUserAuthProfile();
  const { openDialog, openDialogName } = useDialog();
  const navigate = useNavigate();

  const { tag, loading: isLoadingTag, refetch: refetchTag } = useTag(id);
  const entity = useMemo(
    () =>
      id && tag
        ? {
            id,
            type: 'tag' as const,
            name: tag.name,
          }
        : null,
    [id, tag],
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
  } = useTagNotes(userId || '', id || '', tag?.name ?? '');
  const {
    items: tasks,
    loading: isLoadingTasks,
    refetch: refetchTasks,
  } = useTagTasks(userId || '', id || '', tag?.name ?? '');

  const { removeTag, isLoading: isDeleting } = useDeleteTag();

  useEffect(() => {
    const fetchUser = async () => {
      setUserId(await getCurrentUserId());
    };
    fetchUser();
  }, []);

  const prevOpenDialogName = useRef(openDialogName);
  useEffect(() => {
    if (prevOpenDialogName.current === 'editTag' && openDialogName === null) {
      toast.info('Refreshing tag data...');
      refetchTag();
    }
    prevOpenDialogName.current = openDialogName;
  }, [openDialogName, refetchTag]);

  const handleDelete = async () => {
    if (!tag) return;
    if (
      window.confirm(
        `Are you sure you want to delete the tag "${tag.name}"? This action cannot be undone.`,
      )
    ) {
      const success = await removeTag(tag.id, {
        tagName: tag.name,
      });
      if (success) {
        navigate('/tags');
      }
    }
  };

  const handleScrollToContacts = useCallback(() => {
    if (typeof document === 'undefined') return;
    const section = document.getElementById('tag-contacts');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

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
    isLoadingContacts || isLoadingNotes || isLoadingTasks || isLoadingTag;

  if (isLoadingTag) return <EntityDetailsSkeleton />;
  if (!tag) return <div className="p-8 text-center">Tag not found.</div>;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <TagProfileCard
        tag={tag}
        assignedCount={assigned.length}
        eligibleCount={eligible.length}
        onEdit={() =>
          openDialog('editTag', {
            type: 'tag',
            id: tag.id,
            name: tag.name,
            color: tag.color,
            description: tag.description ?? undefined,
          })
        }
        onDelete={handleDelete}
        isDeleting={isDeleting}
        onScrollToContacts={handleScrollToContacts}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section id="tag-contacts" className="xl:col-span-7">
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
            entityName={tag.name}
            entityType="tag"
            userId={userId!}
            user={user}
            notes={notes}
            tasks={tasks}
            isLoading={isLoadingNotes || isLoadingTasks}
            refetchNotes={refetchNotes}
            refetchTasks={refetchTasks}
            notesService={tagNotesService}
            tasksService={tagTasksService}
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
