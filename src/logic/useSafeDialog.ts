import { useCallback } from 'react';
import { useDialog, type DialogPayload } from '@/contexts/DialogContext';

export function useSafeDialog() {
  const { openDialog, closeDialog, openDialogName } = useDialog();

  const safeOpenDialog = useCallback(
    (name: string, payload?: DialogPayload) => {
      if (openDialogName) {
        closeDialog();
      }

      setTimeout(() => {
        openDialog(name, payload ?? null);
      }, 100);
    },
    [openDialog, closeDialog, openDialogName],
  );

  return { safeOpenDialog };
}
