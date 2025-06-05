import { createContext, useContext, useState, type ReactNode } from 'react';

// If you're importing types from your own file, update the type definition like this:
export type DialogPayload = Record<string, any> | null;

export type DialogContextType = {
  openDialogName: string | null;
  dialogPayload: DialogPayload;
  openDialog: (name: string, payload?: DialogPayload) => void;
  closeDialog: () => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [openDialogName, setOpenDialogName] = useState<string | null>(null);
  const [dialogPayload, setDialogPayload] = useState<DialogPayload>(null);

  const openDialog = (name: string, payload: DialogPayload = null) => {
    setOpenDialogName(name);
    setDialogPayload(payload);
  };

  const closeDialog = () => {
    setOpenDialogName(null);
    setDialogPayload(null);
  };

  return (
    <DialogContext.Provider
      value={{ openDialogName, dialogPayload, openDialog, closeDialog }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
