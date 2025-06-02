import { TableRow } from '@/components/ui/table';
import CompaniesRowAction from './CompaniesRowAction';
import type { Company } from '@/types/types';

interface CompaniesTableRowProps {
  company: Company;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddUser: (id: string) => void;
}

export function CompaniesTableRow({
  company,
  onEdit,
  onDelete,
  onAddUser,
}: CompaniesTableRowProps) {
  console.log(company);
  return (
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
        <CompaniesRowAction
          companyId={company.id}
          companyName={company.name}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddUser={onAddUser}
        />
      </td>
    </TableRow>
  );
}
