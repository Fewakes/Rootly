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

export const ASSIGN_ENTITY_TYPES = ['group', 'company', 'tag'] as const;
export type AssignEntityType = (typeof ASSIGN_ENTITY_TYPES)[number];

export type Company = {
  id: string;
  name: string;
  company_logo?: string | null;
  description?: string | null;
  created_at: string;
  user_count?: number;
};

export type Group = {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
};

export type Tag = {
  id: string;
  name: string;
  color: TagColor;
  description?: string | null;
  created_at: string;
};

export type Contact = {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  contact_number?: string | null;
  town?: string | null;
  country?: string | null;
  birthday?: string | null;
  favourite?: boolean;
  link_name?: string | null;
  link_url?: string | null;
  gender?: string | null;
  created_at: string;
};

export type NewContact = {
  id?: string;
  user_id: string;
  name: string;
  email: string | null;
  avatar_url?: string | null;
  contact_number?: string | null;
  town?: string | null;
  country?: string | null;
  birthday?: string | null;
  link_name?: string | null;
  link_url?: string | null;
  gender?: string | null;
  favourite?: boolean;
  created_at?: string;
};

export type Note = {
  id: string;
  content: string;
  author?: string;
  created_at: string;
};

export type Task = {
  id: string;
  title: string;
  due_date: string | null;
  completed: boolean;
  created_at: string;
};

export type ProfessionalInfo = {
  id: string;
  job_title: string | null;
  department: string | null;
  skills: string[] | null;
};

export type UserProfile = {
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
};

export type ContactWithDetails = Contact & {
  contact_groups: Group[];
  contact_tags: Tag[];
  contact_companies: Company[];
};

export type ContactWithAvatar = Pick<Contact, 'id' | 'name' | 'avatar_url'>;

export type CompanyWithContacts = Company & {
  contact_count: number;
  contact_avatars: ContactWithAvatar[];
};

export type ContactListContact = {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  favourite?: boolean;
  created_at: string;
  company: { id: string; name: string; company_logo?: string | null } | null;
  groups: { id: string; name: string }[];
  tags: { id: string; name: string; color: string | null }[];
};

export type PopularCompany = Company & {
  count: number;
};

export type PopularGroup = Group & {
  count: number;
};

export type PopularTag = Tag & {
  count: number;
};

export type AssignEntity = {
  id: string;
  name: string;
  type: AssignEntityType;
  logo?: string | null;
};

export type GroupWithContacts = Group & {
  contact_count: number;
  contact_avatars: ContactWithAvatar[];
};

export type TagWithContacts = Tag & {
  contact_count: number;
  contact_avatars: ContactWithAvatar[];
};

export type AssignedContactDetails = ContactWithAvatar & {
  email: string | null;
  company: { id: string; name: string; company_logo?: string | null } | null;
  group: { id: string; name: string } | null;
  tags: { id: string; name: string; color: string | null }[];
};

export type TagWithRank = Tag & {
  rank?: number;
  totalTags?: number;
};

export type CompanyWithRank = Company & {
  rank?: number;
  totalCompanies?: number;
};

export type GroupWithRank = Group & {
  rank?: number;
  totalGroups?: number;
};

export type UpdateContactInfoPayload = {
  email?: string;
  contactNumber?: string;
  location?: string;
  country?: string;
  birthday?: string;
  linkName?: string;
  socialLink?: string;
  companyId?: string;
};

export type UpdateContactProfilePayload = {
  firstName: string;
  surname?: string;
  groupId?: string;
  tagIds?: string[];
  avatarUrl?: string | File;
  companyId?: string;
};

export type TagUpdatePayload = {
  name?: string;
  description?: string;
  color?: TagColor;
};

export type ChartData = {
  id: string;
  name: string;
  value: number;
  color: string;
  bgColorClass: string;
  textColorClass: string;
  contacts: Pick<Contact, 'id' | 'avatar_url'>[];
};

export type UnifiedTask = Omit<Task, 'due_date'> & {
  due_date: string | null;
  origin: 'contact' | 'group' | 'company' | 'tag';
  entity: {
    id: string | null;
    name: string;
  };
};

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

export type ActivityAction =
  | 'CONTACT_CREATED'
  | 'CONTACT_UPDATED'
  | 'CONTACT_DELETED'
  | 'CONTACT_FAVORITED'
  | 'CONTACT_UNFAVORITED'
  | 'NOTE_CREATED'
  | 'NOTE_REMOVED'
  | 'NOTE_EDITED'
  | 'TASK_CREATED'
  | 'TASK_COMPLETED'
  | 'TASK_EDITED'
  | 'TASK_REMOVED'
  | 'TASK_REOPENED'
  | 'GROUP_ASSIGNED'
  | 'GROUP_UNASSIGNED'
  | 'TAG_ASSIGNED'
  | 'TAG_UNASSIGNED'
  | 'COMPANY_ASSIGNED'
  | 'COMPANY_UNASSIGNED'
  | 'COMPANY_CREATED'
  | 'COMPANY_REMOVED'
  | 'COMPANY_EDITED'
  | 'GROUP_CREATED'
  | 'GROUP_REMOVED'
  | 'GROUP_EDITED'
  | 'TAG_CREATED'
  | 'TAG_REMOVED'
  | 'TAG_EDITED'
  | 'COMPANY_NOTE_CREATED'
  | 'COMPANY_NOTE_EDITED'
  | 'COMPANY_NOTE_REMOVED'
  | 'COMPANY_TASK_CREATED'
  | 'COMPANY_TASK_EDITED'
  | 'COMPANY_TASK_REMOVED'
  | 'COMPANY_TASK_COMPLETED'
  | 'COMPANY_TASK_REOPENED'
  | 'GROUP_NOTE_CREATED'
  | 'GROUP_NOTE_EDITED'
  | 'GROUP_NOTE_REMOVED'
  | 'GROUP_TASK_CREATED'
  | 'GROUP_TASK_EDITED'
  | 'GROUP_TASK_REMOVED'
  | 'GROUP_TASK_COMPLETED'
  | 'GROUP_TASK_REOPENED'
  | 'TAG_NOTE_CREATED'
  | 'TAG_NOTE_EDITED'
  | 'TAG_NOTE_REMOVED'
  | 'TAG_TASK_CREATED'
  | 'TAG_TASK_EDITED'
  | 'TAG_TASK_REMOVED'
  | 'TAG_TASK_COMPLETED'
  | 'TAG_TASK_REOPENED';

export type LogActivityArgs = {
  userId?: string | null;
  action: ActivityAction;
  entityType: 'Contact' | 'Note' | 'Task' | 'Company' | 'Group' | 'Tag';
  entityId?: string;
  details?: Record<string, any>;
};

export type ActivityLogEntry = {
  id: string;
  user_id: string;
  action: ActivityAction;
  entity_type: LogActivityArgs['entityType'];
  entity_id?: string | null;
  details?: Record<string, any> | null;
  description: string;
  created_at: string;
};
