import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDialog } from '@/contexts/DialogContext';
import { toast } from 'sonner';
import { Building } from 'lucide-react';

import { useCompany } from '@/logic/useCompany';
import { useEntityContacts } from '@/logic/useEntityContacts';
import { useCompanyNotes, useCompanyTasks } from '@/logic/useEntityNotesTasks';
import {
  companyNotesService,
  companyTasksService,
} from '@/services/entityNotesTasks';
import { useUserAuthProfile } from '@/logic/useUserAuthProfile';
import { getCurrentUserId } from '@/services/users';
import { useDeleteCompany } from '@/logic/useDeleteCompany';

import { EntityHeader } from '@/features/entities/EntityHeader';
import { AssignedContactsManager } from '@/features/entities/AssignedContactsManager';
import { AtAGlance } from '@/features/entities/AtAGlance';
import { ActivityFeed } from '@/features/entities/ActivityFeed';
import EntityDetailsSkeleton from '@/features/entities/EntityDetailsSkeleton';
import type { AssignEntity } from '@/types/types';

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { user } = useUserAuthProfile();
  const { openDialog, openDialogName } = useDialog();
  const prevOpenDialogName = useRef(openDialogName);

  const entity = useMemo(
    () => (id ? ({ id, type: 'company' } as const) : null),
    [id],
  );

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
  const { deleteCompany, isLoading: isDeleting } = useDeleteCompany();

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

  useEffect(() => {
    const fetchUser = async () => {
      setUserId(await getCurrentUserId());
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (
      prevOpenDialogName.current === 'editCompany' &&
      openDialogName === null
    ) {
      refetchCompany();
    }
    prevOpenDialogName.current = openDialogName;
  }, [openDialogName, refetchCompany]);

  const handleDelete = async () => {
    if (!company) return;
    const success = await deleteCompany(company.id, {
      companyName: company.name,
    });
    if (success) {
      navigate('/companies');
    }
  };

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
        onDelete={handleDelete}
        isDeleting={isDeleting}
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
            entityName={company.name}
            entityType="company"
            userId={userId!}
            user={user}
            notes={notes}
            tasks={tasks}
            isLoading={isLoadingNotes || isLoadingTasks}
            refetchNotes={refetchNotes}
            refetchTasks={refetchTasks}
            notesService={companyNotesService}
            tasksService={companyTasksService}
          />
        </div>
      </div>
    </div>
  );
}
