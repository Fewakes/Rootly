import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect } from 'react';

import { useDialog } from '@/contexts/DialogContext';
import { insertTag, updateTag } from '@/services/tags';
import { getCurrentUserId } from '@/services/users';
import { TAG_COLORS } from '@/lib/utils';

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

  const payload = dialogPayload as Partial<{
    id: string;
    name: string;
    color: string;
    created_at: string;
  }> | null;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagName: '',
      color: 'red',
    },
  });

  // Prefill form when editing
  useEffect(() => {
    if (open && payload) {
      form.reset({
        tagName: payload.name ?? '',
        color: payload.color ?? 'red',
      });
    }
    if (!open) {
      form.reset();
    }
  }, [open, payload, form]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const isEditing = !!payload?.id;

    const tag = {
      id: isEditing ? payload.id! : uuidv4(),
      user_id: await getCurrentUserId(),
      name: data.tagName,
      color: data.color,
      created_at: isEditing ? payload.created_at! : new Date().toISOString(),
      logo: null,
    };

    const saved = isEditing ? await updateTag(tag) : await insertTag(tag);

    if (saved) {
      toast.success(
        isEditing ? 'Tag updated successfully' : 'Tag created successfully',
        {
          action: {
            label: 'View Tags',
            onClick: () => navigate('/tags'),
          },
        },
      );
      form.reset();
      closeDialog();
    } else {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} tag`);
    }
  };

  return { open, form, TAG_COLORS, handleSubmit, closeDialog };
}
