import {
  Users,
  Tag,
  ArrowRight,
  Activity,
  UserPlus, // For add contact
  BookOpen, // For groups/categories
  Briefcase,
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';

import type { TagColor } from '@/types/types';
import { useContactsCount } from '@/logic/useContactsCount';
import { useAllTags } from '@/logic/useAllTags';
import { useAllGroups } from '@/logic/useAllGroups';
import { useRecentContacts } from '@/logic/useRecentContacts';
import { usePopularTags } from '@/logic/getPopularTags'; // Note: your file might be named usePopularTags
import { usePopularGroups } from '@/logic/usePopularGroups';
import { usePopularCompanies } from '@/logic/getPopularCompanies';
import { useDialog } from '@/contexts/DialogContext';
import { Link } from 'react-router-dom';
import ActivityFeed from '@/components/ActivityFeed';

// --- Homepage Component ---
export default function Homepage() {
  const { openDialog } = useDialog();

  // --- Loading States for each hook ---
  const { contactsCount, loading: contactsLoading } = useContactsCount();
  const { tags, loading: tagsLoading } = useAllTags();
  const tagsCount = tags.length;
  const { groups, loading: groupsLoading } = useAllGroups();
  const groupsCount = groups.length;
  const { contacts: recentContacts = [], loading: recentContactsLoading } =
    useRecentContacts(3);
  const { popularTags, loading: popularTagsLoading } = usePopularTags(3);
  const { popularGroups, loading: popularGroupsLoading } = usePopularGroups(3);
  // CORRECTED: using popularCompanies
  const { popularCompanies, loading: companiesLoading } =
    usePopularCompanies(3);

  // --- Combined loading state ---
  const isLoading =
    contactsLoading ||
    tagsLoading ||
    groupsLoading ||
    recentContactsLoading ||
    popularTagsLoading ||
    popularGroupsLoading ||
    companiesLoading;

  // --- Mock Data for Latest Activity Log ---
  const mockRecentActivity = [
    {
      id: 'act1',
      description: 'Updated contact details for',
      contactName: 'Alice Johnson',
      timestamp: '5 min ago',
    },
    {
      id: 'act2',
      description: 'Added new note to',
      contactName: 'Bob Williams',
      timestamp: '30 min ago',
    },
    {
      id: 'act3',
      description: 'Created new group',
      contactName: 'Marketing Leads',
      timestamp: '1 hour ago',
    },
    {
      id: 'act4',
      description: 'Assigned tag "Follow-up" to',
      contactName: 'Charlie Brown',
      timestamp: '3 hours ago',
    },
    {
      id: 'act5',
      description: 'Logged call with',
      contactName: 'Diana Prince',
      timestamp: '1 day ago',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))]">
        <p className="text-lg text-muted-foreground">
          Loading your contact hub...
        </p>
      </div>
    );
  }

  // Helper for tag colors
  const getTagBgClass = (color: string) =>
    TAG_BG_CLASSES[color as TagColor] || 'bg-gray-100';
  const getTagTextClass = (color: string) =>
    TAG_TEXT_CLASSES[color as TagColor] || 'text-gray-800';

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Header & Main Call to Action */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-lg opacity-90">
            Manage your connections effortlessly.
          </p>
        </div>
        <Button
          className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 text-base font-semibold"
          onClick={() => openDialog('addContact')}
        >
          <UserPlus className="w-5 h-5 mr-2" /> Add New Contact
        </Button>
      </section>

      {/* Quick Stats Snapshot */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-muted-foreground text-center">
              Total Contacts
            </p>
            <p className="text-3xl font-bold text-foreground text-center">
              {contactsCount !== null ? contactsCount : '...'}
            </p>
          </div>
          <Users className="h-8 w-8 text-blue-400 opacity-60" />
        </Card>

        <Card className="p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-muted-foreground text-center">
              Unique Tags
            </p>
            <p className="text-3xl font-bold text-foreground text-center">
              {tagsCount}
            </p>
          </div>
          <Tag className="h-8 w-8 text-green-400 opacity-60" />
        </Card>

        <Card className="p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-muted-foreground text-center">
              Active Groups
            </p>
            <p className="text-3xl font-bold text-foreground text-center">
              {groupsCount}
            </p>
          </div>
          <BookOpen className="h-8 w-8 text-purple-400 opacity-60" />
        </Card>
      </section>

      <Separator />

      {/* Main Content: Activity & Insights */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left (Larger) Column: Recent Activity & Contacts */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Recent Activity &
                Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Recent Contacts Sub-section */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Recently Added Contacts
                  </h3>
                  {recentContacts.length > 0 ? (
                    <div className="space-y-3">
                      {recentContacts.map(contact => (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={contact.avatar_url}
                              alt={`${contact.name} `}
                              className="h-10 w-10 rounded-full object-cover ring-1 ring-offset-2 ring-blue-300"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground">
                                {contact.name}
                              </span>
                              <div className="flex gap-1 flex-wrap text-xs text-muted-foreground mt-1">
                                {contact.contact_tags &&
                                contact.contact_tags.length > 0 ? (
                                  contact.contact_tags.map(t => (
                                    <Badge
                                      key={t.id}
                                      variant="outline"
                                      className={`${getTagBgClass(t.color || '')} ${getTagTextClass(t.color || '')} border-none shadow-sm px-2 py-0.5`}
                                    >
                                      {t.name}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="italic">No tags</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Link to={`/contacts/${contact.id}`}>
                            <Button
                              variant="outline"
                              className="text-sm px-4 py-1.5"
                            >
                              View
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground italic">
                      No recent contacts to display.
                    </div>
                  )}
                  <Button variant="link" className="px-0 mt-4">
                    View All Contacts <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <Separator />

                {/* Activity Feed Sub-section */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid gap-8">
                      <ActivityFeed />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right (Smaller) Column: Insight Pods */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5 text-muted-foreground" /> Top Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              {popularTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className={`${getTagBgClass(tag.color || '')} ${getTagTextClass(tag.color || '')} border-none shadow-sm px-3 py-1`}
                    >
                      {tag.name} ({tag.count})
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground italic">
                  No popular tags.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" /> Top Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {popularGroups.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {popularGroups.map(group => (
                    <Badge
                      key={group.id}
                      variant="outline"
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground border-none shadow-sm"
                    >
                      {group.name} ({group.count})
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground italic">
                  No popular groups.
                </div>
              )}
            </CardContent>
          </Card>

          {/* New Card: Top Companies */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" /> Top
                Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {popularCompanies.length > 0 ? (
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {popularCompanies.map(company => (
                    <li
                      key={company.id}
                      className="flex justify-between items-center py-1 border-b last:border-b-0 border-dashed border-muted"
                    >
                      <img
                        src={company.company_logo}
                        alt={`${company.name} logo`}
                        className="h-8 w-8 object-cover rounded-md"
                      />
                      <span>{company.name}</span>
                      <Badge variant="secondary">
                        {company.count}{' '}
                        {company.count === 1 ? 'contact' : 'contacts'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted-foreground italic">
                  No top companies.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
