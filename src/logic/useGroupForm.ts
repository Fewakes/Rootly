import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useEffect, useMemo } from 'react';

import { useDialog } from '@/contexts/DialogContext';
import { insertGroup, updateGroup } from '@/services/groups';
import { useLogActivity } from './useLogActivity';

// ✅ FIX #1: Standardized schema names to `name` and `description`.
const groupFormSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  description: z.string().optional(),
});

export type GroupFormValues = z.infer<typeof groupFormSchema>;

export function useGroupForm() {
  const { openDialogName, dialogPayload, closeDialog } = useDialog();
  const { logActivity, userId } = useLogActivity();

  const isEditing = useMemo(() => !!dialogPayload?.id, [dialogPayload]);
  const open = openDialogName === 'addGroup' || openDialogName === 'editGroup';

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    // ✅ FIX #2: Default values match the new schema.
    defaultValues: { name: '', description: '' },
  });

  // ✅ FIX #3: The useEffect now correctly handles both CREATE and EDIT modes.
  useEffect(() => {
    if (open) {
      if (dialogPayload) {
        // EDIT MODE: Populate form with existing data.
        form.reset({
          name: dialogPayload.name || '',
          description: (dialogPayload as any)?.description || '',
        });
      } else {
        // CREATE MODE: Reset the form to a blank slate.
        form.reset({
          name: '',
          description: '',
        });
      }
    }
  }, [open, dialogPayload, form]);

  const handleSubmit = async (data: GroupFormValues) => {
    if (!userId) {
      toast.error('User information not available. Please try again.');
      return;
    }

    try {
      if (isEditing) {
        if (!dialogPayload?.id)
          throw new Error('Group ID not found for editing.');

        // ✅ FIX #4: Data passed to `updateGroup` uses the corrected field names.
        await updateGroup(dialogPayload.id, {
          name: data.name,
          description: data.description,
        });

        toast.success('Group updated successfully');
        logActivity('GROUP_EDITED', 'Group', dialogPayload.id, {
          groupName: data.name,
        });
      } else {
        const newGroup = {
          id: uuidv4(),
          user_id: userId,
          created_at: new Date().toISOString(),
          name: data.name,
          description: data.description,
        };
        await insertGroup(newGroup as any);
        toast.success('Group created successfully');
        logActivity('GROUP_CREATED', 'Group', newGroup.id, {
          groupName: newGroup.name,
        });
      }
      closeDialog();
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred.');
    }
  };

  return { open, form, handleSubmit, closeDialog, isEditing };
}
