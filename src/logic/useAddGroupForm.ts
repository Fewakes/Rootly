import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useDialog } from '@/contexts/DialogContext';
import { insertGroup, updateGroup } from '@/services/groups';
import { getCurrentUserId } from '@/services/users';
import { useLogActivity } from './useLogActivity';

const formSchema = z.object({
  groupName: z.string().min(1, 'Group name is required'),
});

export function useAddGroupForm() {
  const { openDialogName, dialogPayload, closeDialog } = useDialog();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);
  const { logActivity } = useLogActivity(userId);

  useEffect(() => {
    const fetchUser = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUser();
  }, []);

  const open = openDialogName === 'addGroup';
  const isEditing = useMemo(() => !!dialogPayload?.id, [dialogPayload]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        dialogPayload ? { groupName: dialogPayload.name } : { groupName: '' },
      );
    }
  }, [open, dialogPayload, form]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!userId) {
      toast.error('User information not available. Please try again.');
      return;
    }

    if (isEditing) {
      const updated = await updateGroup(dialogPayload.id, {
        name: data.groupName,
      });

      if (updated) {
        toast.success('Group updated successfully');

        logActivity('GROUP_EDITED', 'Group', dialogPayload.id, {
          groupName: data.groupName,
        });

        closeDialog();
      } else {
        toast.error('Failed to update group');
      }
    } else {
      const newGroup = {
        id: uuidv4(),
        user_id: userId,
        name: data.groupName,
        created_at: new Date().toISOString(),
        logo: null,
      };

      const saved = await insertGroup(newGroup);

      if (saved) {
        toast.success('Group created successfully', {
          action: {
            label: 'View Groups',
            onClick: () => navigate('/groups'),
          },
        });

        logActivity('GROUP_CREATED', 'Group', newGroup.id, {
          groupName: newGroup.name,
        });

        form.reset();
        closeDialog();
      } else {
        toast.error('Failed to create group');
      }
    }
  };

  return {
    open,
    form,
    handleSubmit,
    closeDialog,
    isEditing,
  };
}
