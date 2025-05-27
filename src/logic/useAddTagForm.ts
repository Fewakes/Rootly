import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useDialog } from '@/contexts/DialogContext';
import { insertTag } from '@/services/tags';
import { getCurrentUserId } from '@/services/users';
import { TAG_COLORS } from '@/lib/utils';

const formSchema = z.object({
  tagName: z.string().min(1, 'Tag name is required'),
  color: z.enum(TAG_COLORS as [string, ...string[]], {
    required_error: 'Tag color is required',
  }),
});

export function useAddTagForm() {
  const { openDialogName, closeDialog } = useDialog();
  const navigate = useNavigate();
  const open = openDialogName === 'addTag';

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagName: '',
      color: 'red',
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const newTag = {
      id: uuidv4(),
      user_id: await getCurrentUserId(),
      name: data.tagName,
      color: data.color,
      created_at: new Date().toISOString(),
      logo: null,
    };

    const saved = await insertTag(newTag);

    if (saved) {
      toast.success('Tag created successfully', {
        action: {
          label: 'View Tags',
          onClick: () => navigate('/tags'),
        },
      });
      form.reset();
      closeDialog();
    } else {
      toast.error('Failed to create tag');
    }
  };

  return { open, form, TAG_COLORS, handleSubmit, closeDialog };
}
