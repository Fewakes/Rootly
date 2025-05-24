import { Separator } from '@/components/ui/separator';
import { Calendar, Globe, Mail, MapPin, Phone, Users } from 'lucide-react';

export default function SidebarInfo({ contact }: { contact: any }) {
  return (
    <aside className="w-full md:w-80 h-fit border rounded-xl p-6 shadow-sm space-y-6 bg-background">
      {/* Socials */}
      {contact.link_url && (
        <div>
          <h4 className="text-xs uppercase text-muted-foreground mb-2">
            Social
          </h4>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <a
              href={contact.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {contact.link_name || 'Social Profile'}
            </a>
          </div>
          <Separator className="my-4" />
        </div>
      )}

      {/* Birthday */}
      {contact.Birthday && (
        <div>
          <h4 className="text-xs uppercase text-muted-foreground mb-1">
            Birthday
          </h4>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{new Date(contact.Birthday).toLocaleDateString()}</span>
          </div>
          <Separator className="my-4" />
        </div>
      )}

      {/* Location */}
      {(contact.Town || contact.Country) && (
        <div>
          <h4 className="text-xs uppercase text-muted-foreground mb-1">
            Location
          </h4>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{`${contact.Town || ''}, ${contact.Country || ''}`}</span>
          </div>
          <Separator className="my-4" />
        </div>
      )}

      {/* Email */}
      {contact.email && (
        <div>
          <h4 className="text-xs uppercase text-muted-foreground mb-1">
            Email
          </h4>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{contact.email}</span>
          </div>
          <Separator className="my-4" />
        </div>
      )}

      {/* Phone */}
      {contact.contact_number && (
        <div>
          <h4 className="text-xs uppercase text-muted-foreground mb-1">
            Phone
          </h4>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{contact.contact_number}</span>
          </div>
          <Separator className="my-4" />
        </div>
      )}

      {/* Company */}
      {contact.company?.name && (
        <div>
          <h4 className="text-xs uppercase text-muted-foreground mb-1">
            Company
          </h4>
          <div className="flex items-center gap-2 text-sm">
            <img
              src={contact.company.logo_url}
              alt={contact.company.name}
              className="h-5 w-5"
            />
            <span>{contact.company.name}</span>
          </div>
          <Separator className="my-4" />
        </div>
      )}

      {/* Group */}
      {contact.contact_groups?.length > 0 && (
        <div>
          <h4 className="text-xs uppercase text-muted-foreground mb-1">
            Group
          </h4>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{contact.contact_groups[0].name}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
