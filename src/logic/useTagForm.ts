// src/hooks/useTagForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useEffect, useMemo } from 'react';
import { useDialog } from '@/contexts/DialogContext';
import { insertTag, updateTag } from '@/services/tags';
import { getCurrentUserId } from '@/services/users';
import { useLogActivity } from './useLogActivity';
import { TAG_COLORS } from '@/lib/utils';

const tagFormSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
  description: z.string().optional(),
  color: z.enum(TAG_COLORS as [string, ...string[]], {
    required_error: 'Tag color is required',
  }),
});

export type TagFormValues = z.infer<typeof tagFormSchema>;

export function useTagForm() {
  const { openDialogName, dialogPayload, closeDialog } = useDialog();
  const { logActivity, userId } = useLogActivity();

  const isEditing = useMemo(() => !!dialogPayload?.id, [dialogPayload]);
  const open = openDialogName === 'addTag' || openDialogName === 'editTag';

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: '',
      description: '',
      color: 'blue',
    },
  });

  useEffect(() => {
    // We only care about resetting the form when the dialog opens.
    if (open) {
      if (dialogPayload) {
        // EDIT MODE: A payload exists, so populate the form with its data.
        form.reset({
          name: dialogPayload.name || '',
          description: (dialogPayload as any).description || '',
          color: (dialogPayload as any).color || 'blue',
        });
      } else {
        // CREATE MODE: No payload, so reset the form to its empty/default state.
        form.reset({
          name: '',
          description: '',
          color: 'blue', // Or your preferred default color
        });
      }
    }
  }, [open, dialogPayload, form]); // Dependencies are correct

  const handleSubmit = async (data: TagFormValues) => {
    if (!userId) {
      toast.error('User not found. Please try again.');
      return;
    }

    try {
      if (isEditing) {
        const updatedTag = { ...dialogPayload, ...data };
        await updateTag(updatedTag.id, data);
        toast.success('Tag updated successfully');
        logActivity('TAG_EDITED', 'Tag', updatedTag.id, { tagName: data.name });
      } else {
        const newTag = {
          id: uuidv4(),
          user_id: userId,
          created_at: new Date().toISOString(),
          ...data,
        };
        await insertTag(newTag);
        toast.success('Tag created successfully');
        logActivity('TAG_CREATED', 'Tag', newTag.id, { tagName: newTag.name });
      }
      closeDialog();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} tag.`);
    }
  };

  return { open, form, handleSubmit, closeDialog, isEditing };
}
