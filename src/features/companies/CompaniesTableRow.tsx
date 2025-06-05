import { useState } from 'react';
import { TableRow } from '@/components/ui/table';
import RowActionsMenu from '@/components/RowActionMenu';
import { useDeleteCompany } from '@/logic/useDeleteCompany';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { useContacts } from '@/logic/useContacts';
import { AssignContactDialog } from '@/components/AssignContactDialog';

export function CompaniesTableRow({ company }) {
  const { contacts: allContacts } = useContacts();
  const { deleteCompany } = useDeleteCompany();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm(
      `Are you sure you want to delete ${company.name}?`,
    );
    if (confirmed) {
      await deleteCompany(company.id);
    }
  };

  const handleAddUser = () => {
    setIsDialogOpen(true);
  };

  const handleAddContact = async (contactId: string, companyId: string) => {
    // Check if user already has a company
    const { data, error } = await supabase
      .from('contact_companies')
      .select('*')
      .eq('contact_id', contactId);

    if (error) {
      toast.error(`Error checking company assignment: ${error.message}`);
      return false;
    }

    if (data.length >= 1) {
      toast.error('This contact is already assigned to a company.');
      return false;
    }

    const { error: insertError } = await supabase
      .from('contact_companies')
      .insert({ contact_id: contactId, company_id: companyId });

    if (insertError) {
      toast.error(`Failed to assign contact: ${insertError.message}`);
      return false;
    }

    toast.success('Contact assigned to company!');
    return true;
  };

  return (
    <>
      <TableRow key={company.id} className="hover:bg-gray-50 transition-colors">
        <td className="px-5 py-3">
          {company.company_logo ? (
            <img
              src={company.company_logo}
              alt={`${company.name} logo`}
              className="h-8 w-8 object-cover rounded-md"
            />
          ) : (
            <div className="h-8 w-8 bg-gray-200 rounded-md" />
          )}
        </td>
        <td className="px-5 py-3 text-sm font-medium text-gray-800">
          {company.name}
        </td>
        <td className="px-5 py-3 text-sm text-gray-500">
          {new Date(company.created_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </td>
        <td className="px-5 py-3 text-sm text-gray-500">
          {company.contact_count}
        </td>
        <td className="px-5 py-3 text-right">
          <RowActionsMenu
            id={company.id}
            name={company.name}
            onEdit={null}
            onDelete={handleDelete}
            onAddUser={handleAddUser}
          />
        </td>
      </TableRow>

      <AssignContactDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        entityId={company.id}
        entityType="company"
        allContacts={allContacts}
        addContact={handleAddContact}
        company={company}
      />
    </>
  );
}
