export type Company = {
  name: string;
  logo: string;
};

export interface Contact {
  id: number;
  name: string;
  email: string;
  avatar: string;
  company: Company;
  group: string[];
  tags: string[];
  createdAt: string;
}

export interface ContactsProps {
  contacts: Contact[];
}
