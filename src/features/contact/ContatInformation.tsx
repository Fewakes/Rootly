import { Separator } from '@/components/ui/separator';
import { Calendar, Globe, Mail, MapPin, Phone, Users } from 'lucide-react';

export default function ContactInformation({ contact }: { contact: any }) {
  return (
    <aside className="w-full md:w-80 h-fit border rounded-xl p-6 shadow-sm space-y-6 bg-background">
      {/* Socials */}
      <div>
        <h4 className="text-xs uppercase text-muted-foreground mb-2">Social</h4>
        {contact.link_url ? (
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
        ) : (
          <span className="text-sm text-muted-foreground">
            No social link added
          </span>
        )}
        <Separator className="my-4" />
      </div>

      {/* Birthday */}
      <div>
        <h4 className="text-xs uppercase text-muted-foreground mb-1">
          Birthday
        </h4>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>
            {contact.birthday
              ? new Date(contact.birthday).toLocaleDateString()
              : 'Birthday unknown'}
          </span>
        </div>
        <Separator className="my-4" />
      </div>

      {/* Location */}
      <div>
        <h4 className="text-xs uppercase text-muted-foreground mb-1">
          Location
        </h4>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>
            {contact.town || contact.country
              ? `${contact.town || ''}${contact.town && contact.country ? ', ' : ''}${contact.country || ''}`
              : 'Location not provided'}
          </span>
        </div>
        <Separator className="my-4" />
      </div>

      {/* Email */}
      <div>
        <h4 className="text-xs uppercase text-muted-foreground mb-1">Email</h4>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span>{contact.email || 'Email not provided'}</span>
        </div>
        <Separator className="my-4" />
      </div>

      {/* Phone */}
      <div>
        <h4 className="text-xs uppercase text-muted-foreground mb-1">Phone</h4>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{contact.contact_number || 'Phone number not provided'}</span>
        </div>
        <Separator className="my-4" />
      </div>

      {/* Company */}
      <div>
        <h4 className="text-xs uppercase text-muted-foreground mb-1">
          Company
        </h4>
        {contact.company ? (
          <div className="flex items-center gap-2 text-sm">
            {contact.company.logo_url && (
              <img
                src={contact.company.logo_url}
                alt={contact.company.name}
                className="h-5 w-5"
              />
            )}
            <span>{contact.company.name || 'Company name missing'}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            No company added
          </span>
        )}
        <Separator className="my-4" />
      </div>

      {/* Group */}
      <div>
        <h4 className="text-xs uppercase text-muted-foreground mb-1">Group</h4>
        {contact.contact_groups && contact.contact_groups.length > 0 ? (
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{contact.contact_groups[0].name}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            No group assigned
          </span>
        )}
      </div>
    </aside>
  );
}
