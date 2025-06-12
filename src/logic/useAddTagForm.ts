import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect, useState, useMemo } from 'react';
import { useDialog } from '@/contexts/DialogContext';
import { insertTag, updateTag } from '@/services/tags';
import { getCurrentUserId } from '@/services/users';
import { TAG_COLORS } from '@/lib/utils';
import { useLogActivity } from './useLogActivity';

const formSchema = z.object({
  tagName: z.string().min(1, 'Tag name is required'),
  color: z.enum(TAG_COLORS as [string, ...string[]], {
    required_error: 'Tag color is required',
  }),
});

export function useAddTagForm() {
  const { openDialogName, dialogPayload, closeDialog } = useDialog();
  const navigate = useNavigate();

  const open = openDialogName === 'addTag';
  const isEditing = useMemo(() => !!dialogPayload?.id, [dialogPayload]);

  // Get userId and initialize the logger
  const [userId, setUserId] = useState<string | null>(null);
  const { logActivity } = useLogActivity(userId);

  // Fetch userId when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUser();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagName: '',
      color: 'red',
    },
  });

  // Prefill form when editing
  useEffect(() => {
    if (open && isEditing) {
      form.reset({
        tagName: dialogPayload.name ?? '',
        color: dialogPayload.color ?? 'red',
      });
    }
  }, [open, isEditing, dialogPayload, form]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!userId) {
      toast.error('User not found. Please try again.');
      return;
    }

    if (isEditing) {
      // Re-construct the full tag object for the update operation
      const updatedTag = {
        id: dialogPayload.id!,
        user_id: userId,
        name: data.tagName,
        color: data.color,
        created_at: (dialogPayload as any).created_at, // Keep original creation date
      };

      const success = await updateTag(updatedTag); // Pass the full object

      if (success) {
        toast.success('Tag updated successfully');
        logActivity('TAG_EDITED', 'Tag', dialogPayload.id!, {
          tagName: data.tagName,
        });
        closeDialog();
      } else {
        toast.error('Failed to update tag');
      }
    } else {
      const newTag = {
        id: uuidv4(),
        user_id: userId,
        name: data.tagName,
        color: data.color,
        created_at: new Date().toISOString(),
      };
      const success = await insertTag(newTag);

      if (success) {
        toast.success('Tag created successfully');
        logActivity('TAG_CREATED', 'Tag', newTag.id, {
          tagName: newTag.name,
        });
        closeDialog();
      } else {
        toast.error('Failed to create tag');
      }
    }
  };

  return { open, form, TAG_COLORS, handleSubmit, closeDialog, isEditing };
}
