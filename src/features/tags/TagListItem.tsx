import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Users, Tag as TagIcon } from 'lucide-react';

import type { TagWithContacts, TagColor } from '@/types/types';
import { TAG_SOLID_COLORS } from '@/lib/utils';

const getSolidHexColor = (color: string | null): string => {
  return (
    (color && TAG_SOLID_COLORS[color as TagColor]) || TAG_SOLID_COLORS.gray
  );
};

export const TagListItem = ({ tag }: { tag: TagWithContacts }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/tags/${tag.id}`);
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
      <div className="flex items-center gap-3 w-1/3">
        <TagIcon
          className="h-5 w-5 flex-shrink-0"
          color={getSolidHexColor(tag.color)}
        />
        <h3
          className="text-base font-bold text-foreground truncate"
          title={tag.name}
        >
          {tag.name}
        </h3>
      </div>

      <div className="flex-grow"></div>

      <div className="flex items-center justify-end flex-shrink-0 gap-6">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {tag.contact_avatars.slice(0, 4).map(
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
            <span className="text-foreground">{tag.contact_count}</span>
          </div>
        </div>

        <div className="flex flex-col items-end text-right w-28">
          <span className="text-xs text-muted-foreground">Created</span>
          <span className="text-sm font-medium text-foreground">
            {format(new Date(tag.created_at), 'd MMM, yyyy')}
          </span>
        </div>
      </div>
    </div>
  );
};
