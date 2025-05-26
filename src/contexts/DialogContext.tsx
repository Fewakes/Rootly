import { createContext, ReactNode, useContext, useState } from 'react';

type DialogContextType = {
  openDialogName: string | null;
  openDialog: (name: string) => void;
  closeDialog: () => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [openDialogName, setOpenDialogName] = useState<string | null>(null);

  const openDialog = (name: string) => setOpenDialogName(name);
  const closeDialog = () => setOpenDialogName(null);

  return (
    <DialogContext.Provider value={{ openDialogName, openDialog, closeDialog }}>
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
