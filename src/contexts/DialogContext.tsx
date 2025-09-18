import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Contact } from '@/types/types';

type GroupPayload = {
  type: 'group';
  id: string;
  name: string;
  description?: string;
};

type CompanyPayload = {
  type: 'company';
  id: string;
  name: string;
  description?: string;
  company_logo?: string;
};

type TagPayload = {
  type: 'tag';
  id: string;
  name: string;
  description?: string;
  color: string;
};

type SuccessCallback = () => void | Promise<void>;

type AddContactPayload = {
  type: 'addContact';
  onActionSuccess?: SuccessCallback;
};

type EditContactPayload = {
  type: 'editContact' | 'editProfile' | 'editContactInfo';
  contact: Contact;
  onActionSuccess?: SuccessCallback;
};

export type DialogPayload =
  | GroupPayload
  | CompanyPayload
  | TagPayload
  | AddContactPayload
  | EditContactPayload
  | null;

export type DialogName =
  | 'editGroup'
  | 'editCompany'
  | 'editTag'
  | 'addContact'
  | 'editProfile'
  | 'editContactInfo'
  | 'addGroup'
  | 'addCompany'
  | 'addTag';

export type DialogContextType = {
  openDialogName: DialogName | null;
  dialogPayload: DialogPayload;
  openDialog: (name: DialogName, payload?: DialogPayload) => void;
  closeDialog: () => void;

  onActionSuccess?: SuccessCallback;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [openDialogName, setOpenDialogName] = useState<DialogName | null>(null);
  const [dialogPayload, setDialogPayload] = useState<DialogPayload>(null);

  const openDialog = (name: DialogName, payload: DialogPayload = null) => {
    setOpenDialogName(name);
    setDialogPayload(payload);
  };

  const closeDialog = () => {
    setOpenDialogName(null);
    setDialogPayload(null);
  };

  const onActionSuccess = () => {
    if (
      dialogPayload &&
      'onActionSuccess' in dialogPayload &&
      typeof dialogPayload.onActionSuccess === 'function'
    ) {
      dialogPayload.onActionSuccess();
    }
  };

  return (
    <DialogContext.Provider
      value={{
        openDialogName,
        dialogPayload,
        openDialog,
        closeDialog,
        onActionSuccess,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogContextType {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
