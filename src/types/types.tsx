// --------------------
//  Contact Types
// --------------------

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

// For simplified avatar lists
export type ContactWithAvatar = Pick<Contact, 'id' | 'name' | 'avatar_url'>;

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

// --------------------
//  Tag Types
// --------------------

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
  id: string;
  name: string;
  color: string;
  created_at: string;
  contact_count: number;
}

export interface NewTag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  logo?: string | null;
}

export interface PopularTag {
  id: string;
  name: string;
  color: string;
  count: number;
}

// --------------------
//  Group Types
// --------------------

export type Group = {
  id: string;
  name: string;
  created_at: string;
  contact_count?: number;
};

export type NewGroup = {
  id: string;
  user_id: string;
  name: string;
  logo?: string | null;
  created_at: string;
};

// --------------------
//  Company Types
// --------------------

export type Company = {
  id: string;
  name: string;
  company_logo?: string;
  created_at: string;
  user_count: number;
  contact_count?: number;
};

export type NewCompanyData = {
  id: string;
  created_at: string;
  company_logo: string;
  name: string;
  user_id: string;
};

// --------------------
//  Join Table Types
// --------------------

export type ContactGroup = {
  contact_id: string;
  group_id: string;
};

export type ContactTag = {
  contact_id: string;
  tag_id: string;
};

export type ContactCompany = {
  contact_id: string;
  company_id: string;
};

// --------------------
// 📦 Entity Assignment Types
// --------------------

export type AssignEntityType = 'group' | 'company' | 'tag';

export const ASSIGN_ENTITY_TYPES = ['group', 'company', 'tag'] as const;

export type AssignEntity = {
  id: string;
  name: string;
  type: AssignEntityType;
};

// --------------------
//  Misc UI Types
// --------------------

// Used for rendering recent contacts, etc.
export interface RecentContactsProps {
  number: number;
}

// Global dialog context (used in modals)
type DialogPayload = Record<string, any> | null;

export type DialogContextType = {
  openDialogName: string | null;
  dialogPayload: DialogPayload;
  openDialog: (name: string, payload?: DialogPayload) => void;
  closeDialog: () => void;
};

//Context Types
// Define the type for the entity
export type EntityType = {
  id: string;
  type: 'group' | 'company' | 'tag';
  name: string;
} | null;

// Define the context value type
export interface AssignContactContextType {
  open: boolean;
  entity: EntityType;
  openDialog: (entity: Exclude<EntityType, null>) => void; // entity cannot be null when opening
  closeDialog: () => void;
}
