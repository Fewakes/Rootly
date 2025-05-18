import { Separator } from '@/components/ui/separator';
import { Calendar, Globe, Mail, MapPin, Phone, Users } from 'lucide-react';

export default function SidebarInfo({ contact }: { contact: any }) {
  return (
    <aside className="w-full md:w-80 h-fit border rounded-xl p-6 shadow-sm space-y-6 bg-background">
      <div>
        <h4 className="text-xs uppercase text-muted-foreground mb-2">
          Socials
        </h4>
        <div className="space-y-2 text-sm text-foreground">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <a href="https://linkedin.com" className="hover:underline">
              LinkedIn
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <a href="https://twitter.com" className="hover:underline">
              Twitter
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <a href="https://github.com" className="hover:underline">
              GitHub
            </a>
          </div>
        </div>
        <Separator className="my-4" />
      </div>
      <div>
        <h4 className="text-xs uppercase text-muted-foreground mb-1">
          Birthday
        </h4>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>Jan 10, 1990</span>
        </div>
        <Separator className="my-4" />
      </div>
      <div>
        <h4 className="text-xs uppercase text-muted-foreground mb-1">
          Location
        </h4>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>London, UK</span>
        </div>
        <Separator className="my-4" />
      </div>
      <div>
        <h4 className="text-xs uppercase text-muted-foreground mb-1">Email</h4>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span>{contact.email}</span>
        </div>
        <Separator className="my-4" />
      </div>
      <div>
        <h4 className="text-xs uppercase text-muted-foreground mb-1">Phone</h4>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>+44 1234 567890</span>
        </div>
        <Separator className="my-4" />
      </div>
      <div>
        <h4 className="text-xs uppercase text-muted-foreground mb-1">
          Company
        </h4>
        <div className="flex items-center gap-2 text-sm">
          <img
            src={contact.company.logo}
            alt={contact.company.name}
            className="h-5 w-5"
          />
          <span>{contact.company.name}</span>
        </div>
        <Separator className="my-4" />
      </div>
      <div>
        <h4 className="text-xs uppercase text-muted-foreground mb-1">Group</h4>
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{contact.group}</span>
        </div>
      </div>
    </aside>
  );
}
