import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDialog } from '@/contexts/DialogContext';
import { differenceInCalendarDays } from 'date-fns';

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

import { AssignedContactsPanel } from '@/features/entities/AssignedContactsPanel';
import { AtAGlance } from '@/features/entities/AtAGlance';
import { ActivityFeed } from '@/features/entities/ActivityFeed';
import EntityDetailsSkeleton from '@/features/entities/EntityDetailsSkeleton';
import { CompanyProfileCard } from '@/features/companies/CompanyProfileCard';

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { user } = useUserAuthProfile();
  const { openDialog, openDialogName } = useDialog();
  const prevOpenDialogName = useRef(openDialogName);

  const {
    company,
    loading: isLoadingCompany,
    refetch: refetchCompany,
  } = useCompany(id);
  const entity = useMemo(
    () =>
      id && company
        ? ({ id, type: 'company' as const, name: company.name })
        : null,
    [id, company],
  );
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
  } = useCompanyNotes(userId || '', id || '', company?.name ?? '');
  const {
    items: tasks,
    loading: isLoadingTasks,
    refetch: refetchTasks,
  } = useCompanyTasks(userId || '', id || '', company?.name ?? '');

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
    isLoadingContacts || isLoadingNotes || isLoadingTasks || isLoadingCompany;

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

  const handleScrollToContacts = () => {
    if (typeof document === 'undefined') return;
    const section = document.getElementById('company-contacts');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isLoadingCompany) return <EntityDetailsSkeleton />;
  if (!company)
    return <div className="p-8 text-center">Company not found.</div>;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <CompanyProfileCard
        company={company}
        assignedCount={assigned.length}
        eligibleCount={eligible.length}
        onEdit={() =>
          openDialog('editCompany', {
            type: 'company',
            id: company.id,
            name: company.name,
            description: company.description ?? undefined,
            company_logo: company.company_logo ?? undefined,
          })
        }
        onDelete={handleDelete}
        isDeleting={isDeleting}
        onScrollToContacts={handleScrollToContacts}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section id="company-contacts" className="xl:col-span-7">
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
