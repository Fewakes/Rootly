import { TableRow } from '@/components/ui/table';
import RowActionsMenu from '@/components/RowActionMenu';
import { useDeleteCompany } from '@/logic/useDeleteCompany';
import { useCallback } from 'react';
import { useSafeAssignContactDialog } from '@/logic/useSafeAssignContactDialog';
import { useSafeDialog } from '@/logic/useSafeDialog';

export function CompaniesTableRow({ company }) {
  const { deleteCompany } = useDeleteCompany();
  const { safeOpenDialog } = useSafeDialog();
  const { safeAssignDialog } = useSafeAssignContactDialog();

  const deleteHandler = async () => {
    const confirmed = confirm(
      `Are you sure you want to delete ${company.name}?`,
    );
    if (confirmed) {
      await deleteCompany(company.id, { companyName: company.name });
    }
  };
  const editHandler = useCallback(() => {
    safeOpenDialog('addCompany', {
      type: 'company',
      id: company.id,
      name: company.name,
      company_logo: company.company_logo,
    });
  }, [company.id, company.name, company.company_logo, safeOpenDialog]);

  const addUserHandler = useCallback(() => {
    safeAssignDialog({
      type: 'company',
      id: company.id,
      name: company.name,
    });
  }, [company.id, company.name, safeAssignDialog]);

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
            onEdit={editHandler}
            onDelete={deleteHandler}
            onAddUser={addUserHandler}
          />
        </td>
      </TableRow>
    </>
  );
}
