import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Briefcase } from 'lucide-react';

export const CompanyListItem = ({
  company,
}: {
  company: CompanyWithContacts;
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/companies/${company.id}`);
  };

  return (
    <div
      className="group flex items-center gap-4 p-4 rounded-lg transition-colors hover:bg-muted/50 cursor-pointer"
      onClick={handleNavigate}
      role="link"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') handleNavigate();
      }}
    >
      {/* Left Section: Company Logo & Name */}
      <div className="flex items-center gap-4 w-1/3">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={company.company_logo || ''} alt={company.name} />
          <AvatarFallback className="bg-muted">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        <h3
          className="text-base font-bold text-foreground truncate"
          title={company.name}
        >
          {company.name}
        </h3>
      </div>

      {/* Middle Section: This is now an empty spacer that pushes content to the edges */}
      <div className="flex-grow"></div>

      {/* Right Section: Stats and Date (Actions Removed) */}
      <div className="flex items-center justify-end flex-shrink-0 gap-6">
        {/* Contact stats and avatars */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {company.contact_avatars.slice(0, 4).map(
              contact =>
                contact && (
                  <TooltipProvider key={contact.id} delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={`/contacts/${contact.id}`}
                          onClick={e => e.stopPropagation()}
                        >
                          <img
                            src={contact.avatar_url || ''}
                            alt="contact avatar"
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-background"
                          />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{contact.name || 'View Contact'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ),
            )}
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{company.contact_count}</span>
          </div>
        </div>

        {/* Separator and RowActionsMenu have been removed */}

        <div className="flex flex-col items-end text-right w-28">
          <span className="text-xs text-muted-foreground">Created</span>
          <span className="text-sm font-medium text-foreground">
            {format(new Date(company.created_at), 'd MMM, yyyy')}
          </span>
        </div>
      </div>
    </div>
  );
};
