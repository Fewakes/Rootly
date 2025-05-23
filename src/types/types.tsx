export type Company = {
  name: string;
  logo_url: string | null;
};

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  company: {
    name: string;
    logo_url: string | null;
  } | null;
  contact_groups: { id: string; name: string }[];
  contact_tags: { id: string; name: string; color: string }[];
}

export interface RecentContactsProps {
  number: number;
}
export interface RecentContactsProps {
  number: number;
}

export type TagColor =
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose';

export interface Tag {
  id?: string;
  name: string;
  color: TagColor;
  created_at?: string;
}

export interface Group {
  name: string;
  created_at: string; // or Date
}

export interface PopularTag {
  id: string;
  name: string;
  color: string;
  count: number;
}
