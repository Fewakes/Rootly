import { useCallback } from 'react';
import { useAssignContact } from '@/contexts/AssignContactContext';

export function useSafeAssignContactDialog() {
  const { openDialog, closeDialog } = useAssignContact();

  const safeAssignDialog = useCallback(
    (entity: { type: string; [key: string]: any }) => {
      closeDialog(); // optional if it's modal-style
      setTimeout(() => openDialog(entity), 100);
    },
    [openDialog, closeDialog],
  );

  return { safeAssignDialog };
}
