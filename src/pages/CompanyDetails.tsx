import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDialog } from '@/contexts/DialogContext';
import { toast } from 'sonner';
import { Building } from 'lucide-react';

import { useCompanyNotes, useCompanyTasks } from '@/logic/useEntityNotesTasks';
import {
  companyNotesService,
  companyTasksService,
} from '@/services/entityNotesTasks';
import { useUserAuthProfile } from '@/logic/useUserAuthProfile';
import { getCurrentUserId } from '@/services/users';

import { EntityHeader } from '@/features/entities/EntityHeader';
import { AssignedContactsManager } from '@/features/entities/AssignedContactsManager';
import { AtAGlance } from '@/features/entities/AtAGlance';
import { ActivityFeed } from '@/features/entities/ActivityFeed';
import EntityDetailsSkeleton from '@/features/entities/EntityDetailsSkeleton';
import { useEntityContacts } from '@/logic/useEntityContacts';
import { useCompany } from '@/logic/useCompany';

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const [userId, setUserId] = useState<string | null>(null);
  const { user } = useUserAuthProfile();
  const { openDialog, openDialogName } = useDialog();

  const entity = useMemo(
    () => (id ? ({ id, type: 'company' } as const) : null),
    [id],
  );

  // Fetch all necessary data with page-level hooks
  const {
    company,
    loading: isLoadingCompany,
    refetch: refetchCompany,
  } = useCompany(id);
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
  } = useCompanyNotes(userId || '', id || '');
  const {
    items: tasks,
    loading: isLoadingTasks,
    refetch: refetchTasks,
  } = useCompanyTasks(userId || '', id || '');

  // Effect to get current user ID
  useEffect(() => {
    const fetchUser = async () => {
      setUserId(await getCurrentUserId());
    };
    fetchUser();
  }, []);

  // Effect to refetch data when an edit dialog closes
  const prevOpenDialogName = useRef(openDialogName);
  useEffect(() => {
    if (
      prevOpenDialogName.current === 'editCompany' &&
      openDialogName === null
    ) {
      toast.info('Refreshing company data...');
      refetchCompany();
    }
    prevOpenDialogName.current = openDialogName;
  }, [openDialogName, refetchCompany]);

  if (isLoadingCompany) return <EntityDetailsSkeleton />;
  if (!company)
    return <div className="p-8 text-center">Company not found.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <EntityHeader
        type="Company"
        name={company.name}
        description={company.description}
        imageUrl={company.company_logo}
        icon={<Building />}
        onEdit={() =>
          openDialog('editCompany', { type: 'company', ...company })
        }
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
            rankLabel="Company Rank"
            rank={company.rank}
            total={company.total_companies}
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
            notesService={companyNotesService}
            tasksService={companyTasksService}
            entityType="company"
          />
        </div>
      </div>
    </div>
  );
}
