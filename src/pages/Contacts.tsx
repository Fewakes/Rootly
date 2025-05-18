import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FaApple } from 'react-icons/fa';
import { LuFacebook } from 'react-icons/lu';

export default function Contacts() {
  const contacts = [
    {
      id: 1,
      name: 'Alice Becker',
      email: 'alice@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      company: {
        name: 'Apple',
        logo: <FaApple />,
      },
      group: 'Design Team',
      tags: ['UX', 'Lead'],
    },
    {
      id: 2,
      name: 'Thomas Smith',
      email: 'bob@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
      company: {
        name: 'Meta',
        logo: <LuFacebook />,
      },
      group: 'Engineering',
      tags: ['React', 'Fullstack'],
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-muted text-muted-foreground">
          <tr className="border-b border-border">
            <th className="px-4 py-3">Person</th>
            <th className="px-4 py-3">Company Name</th>
            <th className="px-4 py-3">Groups</th>
            <th className="px-4 py-3">Tags</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact.id} className="border-b border-border">
              {/* Person */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">
                      {contact.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {contact.email}
                    </div>
                  </div>
                </div>
              </td>

              {/* Company */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {contact.company.logo}
                  <span className="text-foreground">
                    {contact.company.name}
                  </span>
                </div>
              </td>

              {/* Group */}
              <td className="px-4 py-3">
                <Badge variant="outline">{contact.group}</Badge>
              </td>

              {/* Tags */}
              <td className="px-4 py-3">
                <div className="flex gap-2 flex-wrap">
                  {contact.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
