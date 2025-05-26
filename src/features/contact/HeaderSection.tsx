import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import default_woman from '@/assets/default_woman.svg';
import default_man from '@/assets/default_man.svg';

export default function HeaderSection({ contact }: { contact: any }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={contact.avatar_url} alt={contact.name} />
        <AvatarFallback>{contact.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-semibold">{contact.name}</h2>
        <div className="flex gap-2 mt-1 flex-wrap">
          {contact.contact_tags.map((tag: any) => (
            <Badge
              key={tag.id}
              className={`
                ${TAG_BG_CLASSES[tag.color]} 
                ${TAG_TEXT_CLASSES[tag.color]} 
                outline-none ring-0 focus:outline-none focus:ring-0 
                border-none shadow-none
              `}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
