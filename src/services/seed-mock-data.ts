import { supabase } from '@/lib/supabaseClient';
import { getCurrentUserId } from '@/services/users';

export async function seedMockData() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('You must be logged in to load demo data.');
    }

    await supabase
      .from('contacts')
      .delete()
      .eq('user_id', userId)
      .eq('is_demo', true);
    await supabase
      .from('tags')
      .delete()
      .eq('user_id', userId)
      .eq('is_demo', true);
    await supabase
      .from('groups')
      .delete()
      .eq('user_id', userId)
      .eq('is_demo', true);
    await supabase
      .from('companies')
      .delete()
      .eq('user_id', userId)
      .eq('is_demo', true);

    const newIds = {
      contacts: Array.from({ length: 5 }, () => crypto.randomUUID()),
      tags: Array.from({ length: 5 }, () => crypto.randomUUID()),
      groups: Array.from({ length: 5 }, () => crypto.randomUUID()),
      companies: Array.from({ length: 5 }, () => crypto.randomUUID()),
    };

    const contacts = [
      {
        id: newIds.contacts[0],
        user_id: userId,
        name: 'Olivia Chen',
        email: 'olivia.chen@example.com',
        avatar_url: 'https://picsum.photos/seed/olivia/200',
        gender: 'female',
        favourite: true,
        is_demo: true,
      },
      {
        id: newIds.contacts[1],
        user_id: userId,
        name: 'Benjamin Carter',
        email: 'ben.carter@example.com',
        avatar_url: 'https://picsum.photos/seed/benjamin/200',
        gender: 'male',
        favourite: false,
        is_demo: true,
      },
      {
        id: newIds.contacts[2],
        user_id: userId,
        name: 'Sophia Rodriguez',
        email: 'sophia.r@example.com',
        avatar_url: 'https://picsum.photos/seed/sophia/200',
        gender: 'female',
        favourite: true,
        is_demo: true,
      },
      {
        id: newIds.contacts[3],
        user_id: userId,
        name: 'Liam Goldberg',
        email: 'liam.goldberg@example.com',
        avatar_url: 'https://picsum.photos/seed/liam/200',
        gender: 'male',
        favourite: false,
        is_demo: true,
      },
      {
        id: newIds.contacts[4],
        user_id: userId,
        name: 'Ava Nguyen',
        email: 'ava.nguyen@example.com',
        avatar_url: 'https://picsum.photos/seed/ava/200',
        gender: 'female',
        favourite: true,
        is_demo: true,
      },
    ];

    const tags = [
      {
        id: newIds.tags[0],
        user_id: userId,
        name: 'Frontend',
        color: '#61DAFB',
        is_demo: true,
      },
      {
        id: newIds.tags[1],
        user_id: userId,
        name: 'Backend',
        color: '#777BB4',
        is_demo: true,
      },
      {
        id: newIds.tags[2],
        user_id: userId,
        name: 'DevOps',
        color: '#F05032',
        is_demo: true,
      },
      {
        id: newIds.tags[3],
        user_id: userId,
        name: 'UI/UX Design',
        color: '#F24E1E',
        is_demo: true,
      },
      {
        id: newIds.tags[4],
        user_id: userId,
        name: 'Project Manager',
        color: '#FFCB2B',
        is_demo: true,
      },
    ];

    const groups = [
      {
        id: newIds.groups[0],
        user_id: userId,
        name: 'React Developers Meetup',
        is_demo: true,
      },
      {
        id: newIds.groups[1],
        user_id: userId,
        name: 'Node.js Core Contributors',
        is_demo: true,
      },
      {
        id: newIds.groups[2],
        user_id: userId,
        name: 'Freelance Web Devs',
        is_demo: true,
      },
      {
        id: newIds.groups[3],
        user_id: userId,
        name: 'Tech Conference Attendees 2025',
        is_demo: true,
      },
      {
        id: newIds.groups[4],
        user_id: userId,
        name: 'Internal Engineering Team',
        is_demo: true,
      },
    ];

    const companies = [
      {
        id: newIds.companies[0],
        user_id: userId,
        name: 'Vercel',
        company_logo: 'https://placehold.co/200x200/000000/FFFFFF?text=Vercel',
        is_demo: true,
      },
      {
        id: newIds.companies[1],
        user_id: userId,
        name: 'Netlify',
        company_logo: 'https://placehold.co/200x200/00C7B7/FFFFFF?text=Netlify',
        is_demo: true,
      },
      {
        id: newIds.companies[2],
        user_id: userId,
        name: 'GitHub',
        company_logo: 'https://placehold.co/200x200/181717/FFFFFF?text=GitHub',
        is_demo: true,
      },
      {
        id: newIds.companies[3],
        user_id: userId,
        name: 'DigitalOcean',
        company_logo: 'https://placehold.co/200x200/0080FF/FFFFFF?text=DO',
        is_demo: true,
      },
      {
        id: newIds.companies[4],
        user_id: userId,
        name: 'Figma',
        company_logo: 'https://placehold.co/200x200/F24E1E/FFFFFF?text=Figma',
        is_demo: true,
      },
    ];

    const contactCompanies = [
      { contact_id: newIds.contacts[0], company_id: newIds.companies[0] },
      { contact_id: newIds.contacts[1], company_id: newIds.companies[1] },
      { contact_id: newIds.contacts[2], company_id: newIds.companies[4] },
      { contact_id: newIds.contacts[3], company_id: newIds.companies[3] },
      { contact_id: newIds.contacts[4], company_id: newIds.companies[2] },
    ];

    const contactTags = [
      { contact_id: newIds.contacts[0], tag_id: newIds.tags[0] },
      { contact_id: newIds.contacts[1], tag_id: newIds.tags[1] },
      { contact_id: newIds.contacts[2], tag_id: newIds.tags[3] },
      { contact_id: newIds.contacts[3], tag_id: newIds.tags[2] },
      { contact_id: newIds.contacts[4], tag_id: newIds.tags[4] },
    ];

    const contactGroups = [
      { contact_id: newIds.contacts[0], group_id: newIds.groups[0] },
      { contact_id: newIds.contacts[1], group_id: newIds.groups[1] },
      { contact_id: newIds.contacts[2], group_id: newIds.groups[2] },
      { contact_id: newIds.contacts[3], group_id: newIds.groups[3] },
      { contact_id: newIds.contacts[4], group_id: newIds.groups[4] },
    ];

    await Promise.all([
      supabase.from('contacts').insert(contacts),
      supabase.from('tags').insert(tags),
      supabase.from('groups').insert(groups),
      supabase.from('companies').insert(companies),
    ]);

    await Promise.all([
      supabase.from('contact_companies').insert(contactCompanies),
      supabase.from('contact_tags').insert(contactTags),
      supabase.from('contact_groups').insert(contactGroups),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error seeding mock data:', error);
    return { success: false, error: (error as Error).message };
  }
}
