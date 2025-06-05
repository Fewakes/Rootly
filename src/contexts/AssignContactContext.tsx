import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

type EntityType = 'group' | 'tag' | 'company';

type AssignContactContextType = {
  isOpen: boolean;
  entityId: string | null;
  entityType: EntityType | null;
  entityName: string;
  openDialog: (id: string, type: EntityType, name: string) => void;
  closeDialog: () => void;
};

const AssignContactContext = createContext<
  AssignContactContextType | undefined
>(undefined);

export function AssignContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [entityId, setEntityId] = useState<string | null>(null);
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [entityName, setEntityName] = useState('');

  const openDialog = useCallback(
    (id: string, type: EntityType, name: string) => {
      setEntityId(id);
      setEntityType(type);
      setEntityName(name);
      setIsOpen(true);
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setEntityId(null);
    setEntityType(null);
    setEntityName('');
  }, []);

  return (
    <AssignContactContext.Provider
      value={{
        isOpen,
        entityId,
        entityType,
        entityName,
        openDialog,
        closeDialog,
      }}
    >
      {children}
    </AssignContactContext.Provider>
  );
}

export function useAssignContact() {
  const context = useContext(AssignContactContext);
  if (!context) {
    throw new Error(
      'useAssignContact must be used within an AssignContactProvider',
    );
  }
  return context;
}
