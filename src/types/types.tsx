export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  contact_number?: string | null;
  town?: string | null;
  country?: string | null;
  birthday?: string | null;
  link_name?: string | null;
  link_url?: string | null;
  gender?: string | null;
  created_at: string;

  contact_groups: Group[];
  contact_tags: Tag[];
  contact_companies: Company[];
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

export interface NewContact {
  id: string;
  user_id: string;
  name: string;
  email: string;
  gender: string;
  avatar_url: string;
  created_at: string;
  contact_number: string | null;
  town: string | null;
  country: string | null;
  birthday: string | null;
  link_name: string | null;
  link_url: string | null;
}
export interface NewTag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  logo?: string | null;
}

export type NewGroup = {
  id: string;
  user_id: string;
  name: string;
  logo?: string | null;
  created_at: string;
};

export type Tag = {
  id: string;
  name: string;
  color: string;
  created_at: string;
  contact_count: number;
};

export interface Group {
  id: string;
  name: string;
  created_at: string;
  contact_count: number;
}

export type Company = {
  id: string;
  name: string;
  company_logo: string | null;
  created_at: string;
  contact_count?: number;
};
