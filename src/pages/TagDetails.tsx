import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDialog } from '@/contexts/DialogContext';
import { toast } from 'sonner';
import { Tag as TagIcon } from 'lucide-react';

import useTag from '@/logic/useTag';

import { useTagNotes, useTagTasks } from '@/logic/useEntityNotesTasks';
import { tagNotesService, tagTasksService } from '@/services/entityNotesTasks';
import { useUserAuthProfile } from '@/logic/useUserAuthProfile';
import { getCurrentUserId } from '@/services/users';

import { EntityHeader } from '@/features/entities/EntityHeader';
import { AssignedContactsManager } from '@/features/entities/AssignedContactsManager';
import { AtAGlance } from '@/features/entities/AtAGlance';
import { ActivityFeed } from '@/features/entities/ActivityFeed';
import EntityDetailsSkeleton from '@/features/entities/EntityDetailsSkeleton';
import { TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import { useEntityContacts } from '@/logic/useEntityContacts';

export default function TagDetails() {
  const { id } = useParams<{ id: string }>();
  const [userId, setUserId] = useState<string | null>(null);
  const { user } = useUserAuthProfile();
  const { openDialog, openDialogName } = useDialog();

  const entity = useMemo(
    () => (id ? ({ id, type: 'tag' } as const) : null),
    [id],
  );

  const { tag, loading: isLoadingTag, refetch: refetchTag } = useTag(id);
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
  } = useTagNotes(userId || '', id || '');
  const {
    items: tasks,
    loading: isLoadingTasks,
    refetch: refetchTasks,
  } = useTagTasks(userId || '', id || '');

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

  if (isLoadingTag) return <EntityDetailsSkeleton />;
  if (!tag) return <div className="p-8 text-center">Tag not found.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <EntityHeader
        type="Tag"
        name={tag.name}
        description={tag.description}
        icon={<TagIcon style={{ color: TAG_TEXT_CLASSES[tag.color] || '' }} />}
        onEdit={() => openDialog('editTag', { type: 'tag', ...tag })}
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
            rankLabel="Tag Rank"
            rank={tag.rank}
            total={tag.total_tags}
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
            notesService={tagNotesService}
            tasksService={tagTasksService}
            entityType="tag"
          />
        </div>
      </div>
    </div>
  );
}
