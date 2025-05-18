// components/ContactRow.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function ContactRow({ contact, showAll, toggleTags }) {
  const visibleTags = showAll ? contact.tags : contact.tags.slice(0, 2);
  const hiddenCount = contact.tags.length - 2;

  return (
    <tr className="border-b border-border">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <Link to={`/contacts/${contact.id}`}>
              <div className="font-medium text-foreground">{contact.name}</div>
            </Link>
            <div className="text-xs text-muted-foreground">{contact.email}</div>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={contact.company.logo}
            alt={contact.company.name}
            className="h-5 w-5"
          />
          <span className="text-foreground">{contact.company.name}</span>
        </div>
      </td>

      <td className="px-4 py-3">
        <Badge variant="outline">{contact.group}</Badge>
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-2 flex-wrap items-center">
          {visibleTags.map((tag, idx) => (
            <Badge key={idx} variant="secondary">
              {tag}
            </Badge>
          ))}
          {!showAll && hiddenCount > 0 && (
            <Badge
              onClick={() => toggleTags(contact.id)}
              className="bg-primaryBlue opacity-90 cursor-pointer hover:opacity-100"
            >
              +{hiddenCount}
            </Badge>
          )}
        </div>
      </td>
    </tr>
  );
}
