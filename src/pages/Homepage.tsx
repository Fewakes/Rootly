import { contacts } from '@/features/contacts/contacts';
import RecentContacts from '@/features/contacts/RecentContacts';
import GroupCount from '@/features/groups/GroupCount';
import PopularGroups from '@/features/groups/PopularGroups';
import PopularTags from '@/features/tags/PopularTags';
import TagsCount from '@/features/tags/TagsCount';
import { Calendar, Tag, Users } from 'lucide-react';

export default function Homepage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      <h1 className="text-4xl font-bold text-center md:text-left">Dashboard</h1>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          {
            icon: <Users className="w-8 h-8 text-blue-600" />,
            label: 'Total Contacts',
            value: contacts.length,
          },
          {
            icon: <Tag className="w-8 h-8  text-green-600" />,
            label: 'Total Tags',
            value: <TagsCount contacts={contacts} />,
          },
          {
            icon: <Calendar className="w-8 h-8 text-purple-600" />,
            label: 'Total Groups',
            value: <GroupCount contacts={contacts} />,
          },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-4 p-5 border rounded-lg shadow-sm bg-background"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground">
              {icon}
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                {label}
              </p>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div className="sm:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold border-b border-muted pb-3">
            Recent Contacts
          </h2>
          <RecentContacts contacts={contacts} number={5} />
        </div>

        <div className="space-y-10 sm:mt-17">
          <PopularTags contacts={contacts} tags={5} />
          <PopularGroups contacts={contacts} groups={5} />
        </div>
      </section>
    </div>
  );
}
