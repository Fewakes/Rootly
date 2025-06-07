import type { AssignContactContextType, EntityType } from '@/types/types';
import { createContext, useContext, useState, type ReactNode } from 'react';

const AssignContactContext = createContext<AssignContactContextType | null>(
  null,
);

interface AssignContactProviderProps {
  children: ReactNode;
}

export function AssignContactProvider({
  children,
}: AssignContactProviderProps) {
  const [open, setOpen] = useState(false);
  const [entity, setEntity] = useState<EntityType>(null);

  const openDialog = (entity: Exclude<EntityType, null>) => {
    setEntity(entity);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setEntity(null);
  };

  return (
    <AssignContactContext.Provider
      value={{ open, entity, openDialog, closeDialog }}
    >
      {children}
    </AssignContactContext.Provider>
  );
}

// Custom hook that throws error if used outside provider
export const useAssignContact = (): AssignContactContextType => {
  const context = useContext(AssignContactContext);
  if (!context) {
    throw new Error(
      'useAssignContact must be used within an AssignContactProvider',
    );
  }
  return context;
};
