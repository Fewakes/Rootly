// src/components/contact/ContactInformationCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/contexts/DialogContext';
import {
  Calendar,
  Globe,
  Mail,
  MapPin,
  Phone,
  Pencil,
  Building2,
  ExternalLink,
} from 'lucide-react';

// A more detailed type for the contact object used in this component
type Contact = {
  id: string;
  email?: string | null;
  contact_number?: string | null;
  town?: string | null;
  country?: string | null;
  birthday?: string | null;
  link_url?: string | null;
  link_name?: string | null;
  contact_companies: {
    id: string;
    name: string;
    company_logo?: string | null;
  }[];
};

/**
 * Displays a card with detailed contact information (email, phone, location, etc.).
 */
export function ContactInformationCard({ contact }: { contact: Contact }) {
  const { openDialog } = useDialog();

  const location =
    contact.town || contact.country
      ? `${contact.town || ''}${contact.town && contact.country ? ', ' : ''}${contact.country || ''}`
      : 'Not provided';

  const birthday = contact.birthday
    ? new Date(contact.birthday).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not provided';

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-xl">Contact Information</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary h-8 w-8"
          onClick={() =>
            openDialog('editContactInfo', { type: 'editContact', contact })
          }
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit Contact Information</span>
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div>
            <span className="text-xs uppercase text-muted-foreground block">
              Email
            </span>
            <span className="font-medium truncate">
              {contact.email || 'Not provided'}
            </span>
          </div>
        </div>
        {/* Phone */}
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div>
            <span className="text-xs uppercase text-muted-foreground block">
              Phone
            </span>
            <span className="font-medium">
              {contact.contact_number || 'Not provided'}
            </span>
          </div>
        </div>
        {/* Location */}
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div>
            <span className="text-xs uppercase text-muted-foreground block">
              Location
            </span>
            <span className="font-medium">{location}</span>
          </div>
        </div>
        {/* Birthday */}
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div>
            <span className="text-xs uppercase text-muted-foreground block">
              Birthday
            </span>
            <span className="font-medium">{birthday}</span>
          </div>
        </div>
        {/* Social Link */}
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div>
            <span className="text-xs uppercase text-muted-foreground block">
              Social Link
            </span>
            {contact.link_url ? (
              <a
                href={contact.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-blue-500 font-medium flex items-center gap-1"
              >
                {contact.link_name || 'Social Profile'}{' '}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="font-medium">Not added</span>
            )}
          </div>
        </div>
        {/* Company */}
        <div className="flex items-center gap-3">
          <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div>
            <span className="text-xs uppercase text-muted-foreground block">
              Company
            </span>
            {contact.contact_companies?.length > 0 ? (
              <div className="flex items-center gap-2 font-medium">
                {contact.contact_companies[0].company_logo && (
                  <img
                    src={contact.contact_companies[0].company_logo}
                    alt={contact.contact_companies[0].name}
                    className="h-5 w-5 object-contain rounded-sm"
                  />
                )}
                <span>{contact.contact_companies[0].name}</span>
              </div>
            ) : (
              <span className="font-medium">No company added</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
