import { contacts } from '@/features/contacts/contacts';
import { useState } from 'react';

import ContactRow from '@/components/ContactRow';

export default function Contacts() {
  const [expandedTags, setExpandedTags] = useState<number[]>([]);

  const toggleTags = (id: number) => {
    setExpandedTags(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-fixed text-sm text-left border-collapse">
        <thead className="bg-muted text-muted-foreground">
          <tr className="border-b border-border rounded">
            <th className="px-4 py-3">Person</th>
            <th className="px-4 py-3">Company Name</th>
            <th className="px-4 py-3">Groups</th>
            <th className="px-4 py-3">Tags</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => {
            const showAll = expandedTags.includes(contact.id);
            return (
              <ContactRow
                key={contact.id}
                contact={contact}
                showAll={showAll}
                toggleTags={toggleTags}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
