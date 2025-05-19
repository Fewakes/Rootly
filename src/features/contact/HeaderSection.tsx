import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function HeaderSection({ contact }: { contact: any }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={contact.avatar} alt={contact.name} />
        <AvatarFallback>{contact.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-semibold">{contact.name}</h2>
        <div className="flex gap-2 mt-1 flex-wrap">
          {contact.tags.map((tag: string) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
