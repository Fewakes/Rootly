'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDialog } from '@/contexts/DialogContext';

import {
  UserPlus,
  Search,
  ChevronsUpDown,
  X,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  useAllContacts,
  type ContactWithDetails,
} from '@/logic/useAllContacts';

import { ContactListItem } from '@/features/contacts/ContactListItem';
import { useAllCompanies } from '@/logic/useAllCompanies';
import { useAllGroups } from '@/logic/useAllGroups';
import { useAllTags } from '@/logic/useAllTags';
import { ContactCard } from '@/features/contacts/ContactCard';

const CardSkeleton = () => (
  <div className="h-[170px] bg-muted rounded-xl animate-pulse" />
);

function FilterPopover({ options, value, onSelect, title }: any) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((opt: any) => opt.id === value)?.name;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-auto h-9 flex-grow sm:flex-grow-0"
        >
          <span className="truncate">
            {selectedLabel || `Filter by ${title}`}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No {title.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onSelect(null);
                  setOpen(false);
                }}
              >
                All {title}s
              </CommandItem>
              {options.map((opt: any) => (
                <CommandItem
                  key={opt.id}
                  value={opt.name}
                  onSelect={() => {
                    onSelect(opt.id);
                    setOpen(false);
                  }}
                >
                  {opt.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function FilterBadge({ title, value, onClear }: any) {
  return (
    <Badge variant="secondary" className="flex items-center gap-1 pr-1">
      <span className="font-normal text-muted-foreground">{title}:</span>
      <span>{value}</span>
      <button
        onClick={onClear}
        className="rounded-full hover:bg-muted-foreground/20 p-0.5"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

export default function Contacts() {
  const { openDialog } = useDialog();

  const { contacts, loading: cLoading } = useAllContacts();
  const { groups, loading: gLoading } = useAllGroups();
  const { tags, loading: tLoading } = useAllTags();
  const { companies, loading: coLoading } = useAllCompanies();
  const isLoading = cLoading || gLoading || tLoading || coLoading;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isCardView, setIsCardView] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [visibleCards, setVisibleCards] = useState(12);

  const filteredContacts = useMemo(() => {
    if (!Array.isArray(contacts)) return [];
    return contacts
      .filter(
        c =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .filter(c => !selectedGroup || c.groups.some(g => g.id === selectedGroup))
      .filter(c => !selectedTag || c.tags.some(t => t.id === selectedTag))
      .filter(c => !selectedCompany || c.company?.id === selectedCompany);
  }, [contacts, searchTerm, selectedGroup, selectedTag, selectedCompany]);

  useEffect(() => {
    setCurrentPage(1);
    setVisibleCards(12);
  }, [searchTerm, selectedGroup, selectedTag, selectedCompany, isCardView]);

  const paginatedCards = useMemo(() => {
    return filteredContacts.slice(0, visibleCards);
  }, [filteredContacts, visibleCards]);

  const paginatedTableData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredContacts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredContacts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const groupName = groups.find(g => g.id === selectedGroup)?.name;
  const tagName = tags.find(t => t.id === selectedTag)?.name;
  const companyName = companies.find(c => c.id === selectedCompany)?.name;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (filteredContacts.length === 0) {
      return (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          <p className="font-semibold">No contacts found.</p>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      );
    }

    if (isCardView) {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedCards.map((contact: ContactWithDetails) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
          {visibleCards < filteredContacts.length && (
            <div className="flex justify-center mt-6">
              <Button
                size="lg"
                variant="outline"
                onClick={() => setVisibleCards(prev => prev + 12)}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      );
    } else {
      return (
        <div className="border rounded-lg overflow-hidden bg-card">
          <div className="flex items-center gap-4 p-4 bg-secondary text-secondary-foreground font-semibold text-sm">
            <div className="flex-shrink-0 w-1/3">Name</div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-x-4">
              <div>Company</div>
              <div>Group</div>
              <div>Tags</div>
            </div>
            <div className="hidden lg:flex justify-end w-28 flex-shrink-0">
              Added
            </div>
          </div>

          <div className="divide-y divide-border">
            {paginatedTableData.map((contact: ContactWithDetails) => (
              <ContactListItem key={contact.id} contact={contact} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page
                </span>
                <Select
                  value={`${itemsPerPage}`}
                  onValueChange={value => {
                    setItemsPerPage(Number(value));
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
                    onClick={() =>
                      setCurrentPage(prev => Math.max(prev - 1, 1))
                    }
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
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">Contacts</h1>
        <div className="flex gap-3">
          <Button
            size="lg"
            onClick={() => openDialog('addContact')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="w-5 h-5 mr-2" /> Add New Contact
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsCardView(prev => !prev)}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            {isCardView ? (
              <List className="w-5 h-5" />
            ) : (
              <LayoutGrid className="w-5 h-5" />
            )}
            <span className="ml-2">
              {isCardView ? 'Table View' : 'Card View'}
            </span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-2 border rounded-lg bg-card">
        <div className="relative flex-grow min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search contacts by name..."
            className="pl-10 h-9"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <FilterPopover
          options={groups}
          value={selectedGroup}
          onSelect={setSelectedGroup}
          title="Group"
        />
        <FilterPopover
          options={tags}
          value={selectedTag}
          onSelect={setSelectedTag}
          title="Tag"
        />
        <FilterPopover
          options={companies}
          value={selectedCompany}
          onSelect={setSelectedCompany}
          title="Company"
        />
        <div className="flex flex-wrap items-center gap-1">
          {groupName && (
            <FilterBadge
              title="Group"
              value={groupName}
              onClear={() => setSelectedGroup(null)}
            />
          )}
          {tagName && (
            <FilterBadge
              title="Tag"
              value={tagName}
              onClear={() => setSelectedTag(null)}
            />
          )}
          {companyName && (
            <FilterBadge
              title="Company"
              value={companyName}
              onClear={() => setSelectedCompany(null)}
            />
          )}
        </div>
      </div>

      {renderContent()}
    </div>
  );
}
