//New

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import EntityContactListItem from '@/features/entities/EntityContactListItem';
import EntityPaginationControls from '@/features/entities/EntityPaginationControls';
import SkeletonList from '@/features/entities/SkeletonList';
import EntityEmptyState from '@/features/entities/EntityEmptyState';
import type { ContactWithDetails } from '@/services/assignContactService';

const ITEMS_PER_PAGE = 8;

type AssignedContactsManagerProps = {
  assigned: ContactWithDetails[];
  eligible: ContactWithDetails[];
  loading: boolean;
  onAddContact: (contactId: string) => Promise<void>;
  onRemoveContact: (contactId: string) => Promise<void>;
};

export function AssignedContactsManager({
  assigned,
  eligible,
  loading,
  onAddContact,
  onRemoveContact,
}: AssignedContactsManagerProps) {
  const [assignedSearch, setAssignedSearch] = useState('');
  const [eligibleSearch, setEligibleSearch] = useState('');
  const [assignedPage, setAssignedPage] = useState(1);
  const [eligiblePage, setEligiblePage] = useState(1);

  const filterAndPaginate = (
    items: ContactWithDetails[],
    searchTerm: string,
    currentPage: number,
  ) => {
    const filtered = items.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const paginated = filtered.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    return { paginated, totalPages };
  };

  const { paginated: paginatedAssigned, totalPages: totalAssignedPages } =
    filterAndPaginate(assigned, assignedSearch, assignedPage);
  const { paginated: paginatedEligible, totalPages: totalEligiblePages } =
    filterAndPaginate(eligible, eligibleSearch, eligiblePage);

  return (
    <Card className="flex flex-col flex-1">
      <Tabs defaultValue="assigned" className="flex flex-col flex-1">
        <CardHeader>
          <TabsList className="grid grid-cols-2 w-full sm:w-[300px]">
            <TabsTrigger value="assigned">
              Assigned ({assigned.length})
            </TabsTrigger>
            <TabsTrigger value="available">
              Available ({eligible.length})
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <TabsContent
            value="assigned"
            className="flex-1 flex flex-col space-y-4"
          >
            <Input
              placeholder="Search assigned contacts..."
              value={assignedSearch}
              onChange={e => {
                setAssignedSearch(e.target.value);
                setAssignedPage(1);
              }}
            />
            <div className="space-y-2 flex-1 overflow-y-auto pr-2">
              {loading ? (
                <SkeletonList />
              ) : paginatedAssigned.length > 0 ? (
                paginatedAssigned.map(c => (
                  <EntityContactListItem
                    key={c.id}
                    contact={c}
                    type="remove"
                    onAction={() => onRemoveContact(c.id)}
                  />
                ))
              ) : (
                <EntityEmptyState message="No contacts assigned." />
              )}
            </div>
            <EntityPaginationControls
              currentPage={assignedPage}
              totalPages={totalAssignedPages}
              onPageChange={setAssignedPage}
            />
          </TabsContent>
          <TabsContent
            value="available"
            className="flex-1 flex flex-col space-y-4"
          >
            <Input
              placeholder="Search available contacts..."
              value={eligibleSearch}
              onChange={e => {
                setEligibleSearch(e.target.value);
                setEligiblePage(1);
              }}
            />
            <div className="space-y-2 flex-1 overflow-y-auto pr-2">
              {loading ? (
                <SkeletonList />
              ) : paginatedEligible.length > 0 ? (
                paginatedEligible.map(c => (
                  <EntityContactListItem
                    key={c.id}
                    contact={c}
                    type="add"
                    onAction={() => onAddContact(c.id)}
                  />
                ))
              ) : (
                <EntityEmptyState message="No contacts available to add." />
              )}
            </div>
            <EntityPaginationControls
              currentPage={eligiblePage}
              totalPages={totalEligiblePages}
              onPageChange={setEligiblePage}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
