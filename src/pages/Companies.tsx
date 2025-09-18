'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useDialog } from '@/contexts/DialogContext';
import { useAllCompanies } from '@/logic/useAllCompanies';
import { Briefcase, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { CompanyListItem } from '@/features/companies/CompanyListItem';

export default function Companies() {
  const { openDialog } = useDialog();
  const { companies, loading, error } = useAllCompanies();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredAndSortedCompanies = useMemo(() => {
    if (!Array.isArray(companies)) {
      return [];
    }
    let result = companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const [key, direction] = sortBy.split('-');
    result.sort((a, b) => {
      let valA = a[key as keyof typeof a];
      let valB = b[key as keyof typeof b];

      if (valA === undefined || valA === null) {
        return valB === undefined || valB === null
          ? 0
          : direction === 'asc'
            ? 1
            : -1;
      }
      if (valB === undefined || valB === null) {
        return direction === 'asc' ? -1 : 1;
      }

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [companies, searchTerm, sortBy]);

  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedCompanies.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, filteredAndSortedCompanies]);

  const totalPages = Math.ceil(
    filteredAndSortedCompanies.length / itemsPerPage,
  );

  const renderContent = () => {
    if (loading)
      return <p className="text-center py-10">Loading companies...</p>;
    if (error)
      return (
        <p className="text-center py-10 text-destructive">Error: {error}</p>
      );

    if (paginatedCompanies.length === 0)
      return (
        <p className="text-center py-10 text-muted-foreground">
          No companies found.
        </p>
      );

    return paginatedCompanies.map(company => (
      <CompanyListItem key={company.id} company={company} />
    ));
  };

  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">Companies</h1>
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => openDialog('addCompany')}
        >
          <Briefcase className="w-5 h-5 mr-2" /> Add New Company
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search companies by name..."
                className="pl-10"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="created_at-desc">Newest First</SelectItem>
                <SelectItem value="created_at-asc">Oldest First</SelectItem>
                <SelectItem value="contact_count-desc">
                  Most Contacts
                </SelectItem>
                <SelectItem value="contact_count-asc">
                  Fewest Contacts
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">{renderContent()}</div>
        </CardContent>

        {totalPages > 1 && (
          <CardFooter className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page
              </span>
              <Select
                value={`${itemsPerPage}`}
                onValueChange={value => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20].map(size => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage(prev => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
