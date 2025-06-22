// --------------------
//  Contact Types
// --------------------

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
  description: string;
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
//  Entity Assignment Types
// --------------------

export type AssignEntityType = 'group' | 'company' | 'tag';

export const ASSIGN_ENTITY_TYPES = ['group', 'company', 'tag'] as const;

export type AssignEntity = {
  id: string;
  name: string;
  type: AssignEntityType;
  logo?: company_logo;
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

export type PopularGroup = {
  group_id: string;
  groups: {
    id: string;
    name: string;
  };
};

export interface PopularCompany {
  id: string;
  name: string;
  count: number;
  company_logo?: string | null; // Added
}

export type Note = {
  id: string;
  content: string;
  created_at: string;
};

export type Task = {
  id: string;
  title: string;
  due_date: string | null;
  completed: boolean;
};

export type ProfessionalInfo = {
  id: string;
  job_title: string | null;
  department: string | null;
  skills: string[] | null;
};

export type ActivityAction =
  | 'CONTACT_CREATED'
  | 'CONTACT_UPDATED'
  | 'CONTACT_DELETED'
  | 'NOTE_CREATED'
  | 'NOTE_REMOVED'
  | 'NOTE_EDITED'
  | 'TASK_CREATED'
  | 'TASK_COMPLETED'
  | 'TASK_EDITED'
  | 'TASK_REMOVED'
  | 'TASK_REOPENED'
  | 'GROUP_ASSIGNED'
  | 'GROUP_CREATED'
  | 'GROUP_REMOVED'
  | 'GROUP_EDITED'
  | 'TAG_ASSIGNED'
  | 'TAG_CREATED'
  | 'TAG_REMOVED'
  | 'TAG_EDITED'
  | 'COMPANY_ASSIGNED'
  | 'COMPANY_CREATED'
  | 'COMPANY_REMOVED'
  | 'COMPANY_EDITED'
  | 'GROUP_UNASSIGNED'
  | 'TAG_UNASSIGNED'
  | 'COMPANY_UNASSIGNED';
export type LogActivityArgs = {
  userId: string;
  action: ActivityAction;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
};

// --- DATA TYPES ---
type Group = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  rank?: number;
  totalGroups?: number;
};
type Note = { id: string; content: string; author: string; created_at: string };
type Task = {
  id: string;
  title: string;
  completed: boolean;
  due_date?: string;
};
type ContactDetails = {
  company: { name: string } | null;
  tags: { name: string }[];
};

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  contact_number?: string | null;
  town?: string | null;
  country?: string | null;
  birthday?: string | null;
  favourite?: boolean;
  link_name?: string | null;
  link_url?: string | null;
  gender?: string | null;
  created_at: string;
  contact_groups: Group[];
  contact_tags: Tag[];
  contact_companies: Company[];
}
