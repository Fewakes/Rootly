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

export interface PopularTag {
  id: string;
  name: string;
  color: string;
  count: number;
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

export type Group = {
  id: string;
  name: string;
  created_at: string;
  contact_count?: number;
};

export type NewCompanyData = {
  id: string;
  created_at: string;
  company_logo: string;
  name: string;
  user_id: string;
};

// export type NewContact = {
//   id: string;
//   user_id: string;
//   name: string;
//   email: string;
//   gender: string;
//   avatar_url: string;
//   company_id: string | null;
//   created_at: string;
//   contact_number: string | null;
//   town: string | null;
//   country: string | null;
//   birthday: string | null;
//   link_name: string | null;
//   link_url: string | null;
// };

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

export type Company = {
  id: string;
  name: string;
  company_logo?: string;
  created_at: string;
  user_count: number;
  contact_count?: number;
};

type DialogPayload = Record<string, any> | null;

export type DialogContextType = {
  openDialogName: string | null;
  dialogPayload: DialogPayload;
  openDialog: (name: string, payload?: DialogPayload) => void;
  closeDialog: () => void;
};
