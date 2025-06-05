import { useCallback } from 'react';
import { useDialog } from '@/contexts/DialogContext';

export function useSafeDialog() {
  const { openDialog, closeDialog, openDialogName } = useDialog();

  const safeOpenDialog = useCallback(
    (dialogName: string, payload?: any) => {
      if (openDialogName) {
        closeDialog();
      }

      setTimeout(() => {
        openDialog(dialogName, payload);
      }, 100);
    },
    [openDialog, closeDialog, openDialogName],
  );

  return { safeOpenDialog };
}
