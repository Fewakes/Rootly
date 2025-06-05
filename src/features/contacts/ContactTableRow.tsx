import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import type { Contact } from '@/types/types';
import { Link } from 'react-router-dom';

interface ContactRowProps {
  contact: Contact;
}

export default function ContactTableRow({ contact }: ContactRowProps) {
  return (
    <TableRow>
      {/* Person */}
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={contact.avatar_url || undefined}
              alt={contact.name}
            />
            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <Link to={`/contacts/${contact.id}`}>
              <div className="font-medium text-foreground">{contact.name}</div>
            </Link>
            <div className="text-xs text-muted-foreground">{contact.email}</div>
          </div>
        </div>
      </TableCell>

      {/* Companies */}
      <TableCell className="px-4 py-3">
        {contact.contact_companies && contact.contact_companies.length > 0 ? (
          <div className="flex flex-wrap gap-3 items-center">
            {contact.contact_companies.map((company, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {company.company_logo && (
                  <img
                    src={company.company_logo}
                    alt={company.name}
                    className="h-5 w-5"
                  />
                )}
                <span className="text-foreground text-sm">{company.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground italic">No company</span>
        )}
      </TableCell>

      {/* Groups */}
      <TableCell className="px-4 py-3">
        {contact.contact_groups.length > 0 ? (
          contact.contact_groups.map((g, idx) => (
            <Badge key={idx} variant="outline">
              {g.name}
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground italic">No groups</span>
        )}
      </TableCell>

      {/* Tags */}
      <TableCell className="px-4 py-3">
        {contact.contact_tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {contact.contact_tags.map((t, idx) => (
              <Badge
                key={idx}
                className={`
                  ${TAG_BG_CLASSES[t.color]} 
                  ${TAG_TEXT_CLASSES[t.color]} 
                  outline-none ring-0 focus:outline-none focus:ring-0 
                  border-none shadow-none
                `}
              >
                {t.name}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground italic">No tags</span>
        )}
      </TableCell>
    </TableRow>
  );
}
