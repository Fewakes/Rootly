import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Users } from 'lucide-react';
import type { GroupWithContacts } from '@/logic/useAllGroups';
import { getInitials } from '@/lib/utils';

type GroupListItemProps = {
  group: GroupWithContacts;
};

export const GroupListItem = ({ group }: GroupListItemProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/groups/${group.id}`);
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
      {/* --- Group Info Section --- */}
      <div className="flex items-center gap-4 flex-shrink-0 w-1/3">
        {/* The ONLY change is here: The generic icon is replaced with the generated initials logo. */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted border text-muted-foreground font-bold text-sm flex-shrink-0">
          {getInitials(group.name)}
        </div>
        <h3
          className="text-base font-bold text-foreground truncate"
          title={group.name}
        >
          {group.name}
        </h3>
      </div>

      <div className="flex-grow"></div>

      {/* --- Contacts & Date Section --- */}
      <div className="flex items-center justify-end flex-shrink-0 gap-6">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {group.contact_avatars.slice(0, 4).map(
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
            <span className="text-foreground">{group.contact_count}</span>
          </div>
        </div>

        <div className="flex flex-col items-end text-right w-28">
          <span className="text-xs text-muted-foreground">Created</span>
          <span className="text-sm font-medium text-foreground">
            {format(new Date(group.created_at), 'd MMM, yy')}
          </span>
        </div>
      </div>
    </div>
  );
};
