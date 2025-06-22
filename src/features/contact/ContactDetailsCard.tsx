import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDialog } from '@/contexts/DialogContext';
import {
  Mail,
  MapPin,
  Pencil,
  Phone,
  Calendar as CalendarIcon,
  Globe,
} from 'lucide-react';

type Contact = {
  id: string;
  email?: string | null;
  contact_number?: string | null;
  town?: string | null;
  country?: string | null;
  birthday?: string | null;
  link_url?: string | null;
  link_name?: string | null;
};

export function ContactDetailsCard({ contact }: { contact: Contact }) {
  const { openDialog } = useDialog();

  const InfoItem = ({ icon: Icon, label, value }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-4 py-3">
        <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <p className="font-medium text-gray-800 break-words">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-md h-full relative group">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() =>
          openDialog('editContactInfo', { type: 'editContact', contact })
        }
      >
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Edit Details</span>
      </Button>

      <CardContent className="p-6 space-y-6">
        {/* --- Contact Section --- */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">
            Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InfoItem icon={Mail} label="Email" value={contact.email} />
            <InfoItem
              icon={Phone}
              label="Phone"
              value={contact.contact_number}
            />
          </div>
        </div>

        {/* --- Details Section --- */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">
            Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InfoItem
              icon={MapPin}
              label="Location"
              value={[contact.town, contact.country].filter(Boolean).join(', ')}
            />
            <InfoItem
              icon={CalendarIcon}
              label="Birthday"
              value={
                contact.birthday
                  ? new Date(contact.birthday).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                    })
                  : null
              }
            />
            <InfoItem
              icon={Globe}
              label="Social Link"
              value={contact.link_name}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
