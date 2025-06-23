import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Users, Star, Trash2, Loader2 } from 'lucide-react';
import type { GroupWithContacts } from '@/logic/useAllGroups';
import { cn, getInitials } from '@/lib/utils';
import { useState, useEffect } from 'react';

import { useDeleteGroup } from '@/logic/useDeleteGroup';
import { useToggleContactFavourite } from '@/logic/useToggleContactFavourite';

type GroupListItemProps = {
  group: GroupWithContacts;
  onActionComplete: () => void;
};

export const GroupListItem = ({
  group,
  onActionComplete,
}: GroupListItemProps) => {
  const navigate = useNavigate();
  const [localGroup, setLocalGroup] = useState(group);

  const { toggleFavourite, isToggling } = useToggleContactFavourite();
  const { deleteGroup, isLoading: isDeleting } = useDeleteGroup();

  useEffect(() => {
    setLocalGroup(group);
  }, [group]);

  const handleNavigate = () => {
    navigate(`/groups/${group.id}`);
  };

  const handleToggleFavourite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalGroup(prev => ({ ...prev, favourite: !prev.favourite }));
    const { success } = await toggleFavourite(
      localGroup.id,
      !!localGroup.favourite,
    );
    if (success) {
      onActionComplete();
    } else {
      setLocalGroup(group);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await deleteGroup(localGroup.id, { name: localGroup.name });
    if (success) {
      onActionComplete();
    }
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
      <div className="flex items-center gap-4 flex-shrink-0 w-1/3">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted border text-muted-foreground font-bold text-sm flex-shrink-0">
            {getInitials(group.name)}
          </div>
          <div className="absolute -top-2 -right-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavourite}
              disabled={isToggling(localGroup.id)}
              className={cn(
                'rounded-full w-7 h-7 transition-opacity bg-background group-hover:bg-muted',
                localGroup.favourite
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100',
              )}
            >
              {isToggling(localGroup.id) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Star
                  className={cn(
                    'h-4 w-4 drop-shadow-sm',
                    localGroup.favourite
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-400 hover:text-yellow-300',
                  )}
                />
              )}
              <span className="sr-only">Toggle Favourite</span>
            </Button>
          </div>
        </div>
        <h3
          className="text-base font-bold text-foreground truncate"
          title={group.name}
        >
          {group.name}
        </h3>
      </div>

      <div className="flex-grow"></div>

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

        <div className="flex items-center justify-end text-right w-28 gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Created</span>
            <span className="text-sm font-medium text-foreground">
              {format(new Date(group.created_at), 'd MMM, yy')}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            title="Delete Group"
            className="rounded-full w-9 h-9 opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-red-500" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
