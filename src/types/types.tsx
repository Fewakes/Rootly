// --------------------
//  Contact Types
// --------------------

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

export type EntityType = {
  id: string;
  type: 'group' | 'company' | 'tag';
  name: string;
} | null;

export interface AssignContactContextType {
  open: boolean;
  entity: EntityType;
  openDialog: (entity: Exclude<EntityType, null>) => void;
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

// src/types/types.ts

export type ActivityAction =
  // Contact
  | 'CONTACT_CREATED'
  | 'CONTACT_UPDATED'
  | 'CONTACT_DELETED'
  // Contact Notes
  | 'NOTE_CREATED'
  | 'NOTE_REMOVED'
  | 'NOTE_EDITED'
  // Contact Tasks
  | 'TASK_CREATED'
  | 'TASK_COMPLETED'
  | 'TASK_EDITED'
  | 'TASK_REMOVED'
  | 'TASK_REOPENED'
  // Assignments
  | 'GROUP_ASSIGNED'
  | 'GROUP_UNASSIGNED'
  | 'TAG_ASSIGNED'
  | 'TAG_UNASSIGNED'
  | 'COMPANY_ASSIGNED'
  | 'COMPANY_UNASSIGNED'
  // Company
  | 'COMPANY_CREATED'
  | 'COMPANY_REMOVED'
  | 'COMPANY_EDITED'
  // Group
  | 'GROUP_CREATED'
  | 'GROUP_REMOVED'
  | 'GROUP_EDITED'
  // Tag
  | 'TAG_CREATED'
  | 'TAG_REMOVED'
  | 'TAG_EDITED'
  // --- NEW: Company Notes & Tasks ---
  | 'COMPANY_NOTE_CREATED'
  | 'COMPANY_NOTE_EDITED'
  | 'COMPANY_NOTE_REMOVED'
  | 'COMPANY_TASK_CREATED'
  | 'COMPANY_TASK_EDITED'
  | 'COMPANY_TASK_REMOVED'
  | 'COMPANY_TASK_COMPLETED'
  | 'COMPANY_TASK_REOPENED'
  // --- NEW: Group Notes & Tasks ---
  | 'GROUP_NOTE_CREATED'
  | 'GROUP_NOTE_EDITED'
  | 'GROUP_NOTE_REMOVED'
  | 'GROUP_TASK_CREATED'
  | 'GROUP_TASK_EDITED'
  | 'GROUP_TASK_REMOVED'
  | 'GROUP_TASK_COMPLETED'
  | 'GROUP_TASK_REOPENED'
  // --- NEW: Tag Notes & Tasks ---
  | 'TAG_NOTE_CREATED'
  | 'TAG_NOTE_EDITED'
  | 'TAG_NOTE_REMOVED'
  | 'TAG_TASK_CREATED'
  | 'TAG_TASK_EDITED'
  | 'TAG_TASK_REMOVED'
  | 'TAG_TASK_COMPLETED'
  | 'TAG_TASK_REOPENED';

// Your other types like LogActivityArgs can remain here
export type LogActivityArgs = {
  userId?: string | null;
  action: ActivityAction;
  entityType: 'Contact' | 'Note' | 'Task' | 'Company' | 'Group' | 'Tag';
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
