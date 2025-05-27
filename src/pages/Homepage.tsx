import QuickStats from '@/components/QuickStats';
import ContactsCount from '@/features/contacts/ContactsCount';
import RecentContacts from '@/features/contacts/RecentContacts';
import GroupCount from '@/features/groups/GroupCount';
import PopularGroups from '@/features/groups/PopularGroups';
import PopularTags from '@/features/tags/PopularTags';
import TagsCount from '@/features/tags/TagsCount';
import { Users, Tag, Calendar } from 'lucide-react';

export default function Homepage() {
  return (
    <main className="max-w-7xl mx-auto p-6 space-y-12">
      <h1 className="text-4xl font-bold text-center md:text-left">Dashboard</h1>

      {/* Quick Stats */}
      <section
        aria-labelledby="stats-heading"
        className="grid grid-cols-1 sm:grid-cols-3 gap-8"
      >
        <h2 id="stats-heading" className="sr-only">
          Quick Stats
        </h2>
        {[
          {
            icon: <Users className="w-8 h-8 text-blue-600" />,
            label: 'Total Contacts',
            value: <ContactsCount />,
          },
          {
            icon: <Tag className="w-8 h-8  text-green-600" />,
            label: 'Total Tags',
            value: <TagsCount />,
          },
          {
            icon: <Calendar className="w-8 h-8 text-purple-600" />,
            label: 'Total Groups',
            value: <GroupCount />,
          },
        ].map(({ icon, label, value }) => (
          <QuickStats key={label} icon={icon} label={label} value={value} />
        ))}
      </section>

      {/* Featured */}
      <section
        aria-labelledby="featured-heading"
        className="grid grid-cols-1 sm:grid-cols-3 gap-10"
      >
        <h2 id="featured-heading" className="sr-only">
          Featured Sections
        </h2>
        <div className="sm:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold border-b border-muted pb-3">
            Recent Contacts
          </h2>
          <RecentContacts number={5} />
        </div>

        <div className="flex flex-col justify-between mt-16">
          <PopularTags />
          <PopularGroups />
        </div>
      </section>
    </main>
  );
}
