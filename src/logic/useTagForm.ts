// src/hooks/useTagForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useEffect, useMemo } from 'react';
import { useDialog } from '@/contexts/DialogContext';
import { insertTag, updateTag } from '@/services/tags';
import { useLogActivity } from './useLogActivity';
import { TAG_COLORS } from '@/lib/utils';
import type { TagColor } from '@/types/types';

const tagColorOptions = TAG_COLORS as [TagColor, ...TagColor[]];

const tagFormSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
  description: z.string().optional(),
  color: z.enum(tagColorOptions, {
    required_error: 'Tag color is required',
  }),
});

export type TagFormValues = z.infer<typeof tagFormSchema>;

export function useTagForm() {
  const { openDialogName, dialogPayload, closeDialog } = useDialog();
  const { logActivity, userId } = useLogActivity();

  const tagPayload = useMemo(() => {
    if (dialogPayload && 'type' in dialogPayload && dialogPayload.type === 'tag') {
      return dialogPayload;
    }
    return null;
  }, [dialogPayload]);

  const isEditing = openDialogName === 'editTag' && !!tagPayload;
  const open = openDialogName === 'addTag' || openDialogName === 'editTag';

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: '',
      description: '',
      color: tagColorOptions[0],
    },
  });

  useEffect(() => {
    // We only care about resetting the form when the dialog opens.
    if (open) {
      if (tagPayload) {
        // EDIT MODE: A payload exists, so populate the form with its data.
        form.reset({
          name: tagPayload.name || '',
          description: tagPayload.description || '',
          color: tagPayload.color as TagColor,
        });
      } else {
        // CREATE MODE: No payload, so reset the form to its empty/default state.
        form.reset({
          name: '',
          description: '',
          color: tagColorOptions[0],
        });
      }
    }
  }, [open, tagPayload, form]); // Dependencies are correct

  const handleSubmit = async (data: TagFormValues) => {
    if (!userId) {
      toast.error('User not found. Please try again.');
      return;
    }

    try {
      if (isEditing && tagPayload) {
        await updateTag(tagPayload.id, data);
        toast.success('Tag updated successfully');
        logActivity('TAG_EDITED', 'Tag', tagPayload.id, {
          tagName: data.name,
        });
      } else {
        const newTag = {
          name: data.name,
          description: data.description,
          color: data.color,
        };
        const saved = await insertTag(newTag);
        toast.success('Tag created successfully');
        if (saved) {
          logActivity('TAG_CREATED', 'Tag', saved.id, {
            tagName: saved.name,
          });
        }
      }
      closeDialog();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} tag.`);
    }
  };

  return { open, form, handleSubmit, closeDialog, isEditing };
}
