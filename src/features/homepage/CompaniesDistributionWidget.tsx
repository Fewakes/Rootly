import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ArrowRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Data fetching service for companies
import { getAllCompaniesWithContacts } from '@/services/companies';

// Type definition for company data
type CompanyData = {
  id: string;
  name: string;
  company_logo: string;
  count: number;
  contacts: {
    id: string;
    avatar_url: string | null;
  }[];
};

// Constant for pagination size
const WIDGET_PAGE_SIZE = 4;

export const CompaniesDistributionWidget = () => {
  // State for data, loading, error, and pagination
  const [allCompanies, setAllCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCompaniesWithContacts();
        setAllCompanies(data);
      } catch (err) {
        setError('Failed to load company data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(allCompanies.length / WIDGET_PAGE_SIZE);
  const paginatedCompanies = allCompanies.slice(
    (currentPage - 1) * WIDGET_PAGE_SIZE,
    currentPage * WIDGET_PAGE_SIZE,
  );
  const maxCount = Math.max(...allCompanies.map(c => c.count), 0);

  // Renders main content based on loading/error/data state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-[280px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex h-[280px] items-center justify-center text-destructive">
          {error}
        </div>
      );
    }
    if (allCompanies.length === 0) {
      return (
        <div className="flex h-[280px] flex-col items-center justify-center text-center">
          <Briefcase className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="font-medium">No Companies Found</p>
          <p className="text-sm text-muted-foreground">
            Add companies to see them here.
          </p>
        </div>
      );
    }
    return (
      <ul className="space-y-5">
        {paginatedCompanies.map(company => (
          <li key={company.id}>
            <div className="flex justify-between items-center mb-2">
              {/* Company Logo and Name */}
              <div className="flex items-center gap-3">
                <img
                  src={company.company_logo}
                  alt={`${company.name} logo`}
                  className="h-9 w-9 object-cover rounded-md border"
                />
                <span
                  className="text-sm font-bold text-foreground truncate"
                  title={company.name}
                >
                  {company.name}
                </span>
              </div>

              {/* Avatar Stack and Total Count Badge */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  <TooltipProvider>
                    {company.contacts.slice(0, 3).map(contact => (
                      <Tooltip key={contact.id} delayDuration={100}>
                        <TooltipTrigger asChild>
                          <img
                            src={
                              contact.avatar_url ||
                              'https://placehold.co/100x100/F0F0F0/000000?text=NA'
                            }
                            onError={e => {
                              e.currentTarget.src =
                                'https://placehold.co/100x100/F0F0F0/000000?text=NA';
                            }}
                            alt="contact avatar"
                            className="h-7 w-7 rounded-full object-cover ring-2 ring-background"
                          />
                        </TooltipTrigger>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
                <Badge variant="secondary" className="font-semibold">
                  {company.count}
                </Badge>
              </div>
            </div>
            {/* Proportional Bar Chart */}
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/80"
                style={{
                  width: `${maxCount > 0 ? (company.count / maxCount) * 100 : 0}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card>
      {/* Card Header Section */}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            Companies Distribution
          </CardTitle>
        </div>
        <CardDescription>
          How your contacts are distributed across all companies.
        </CardDescription>
      </CardHeader>

      {/* Card Content Section */}
      <CardContent className="min-h-[300px]">{renderContent()}</CardContent>

      {/* Card Footer Section */}
      <CardFooter className="flex justify-end border-t px-6">
        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {totalPages > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        {/* View All Companies Button */}
        <Button
          variant="link"
          size="sm"
          className="p-0 text-sm text-primary"
          asChild
        >
          <Link to="/companies">
            View All Companies <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
