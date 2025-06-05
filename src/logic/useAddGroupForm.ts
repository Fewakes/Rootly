import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useDialog } from '@/contexts/DialogContext';
import { insertGroup, updateGroup } from '@/services/groups'; // add updateGroup
import { getCurrentUserId } from '@/services/users';

const formSchema = z.object({
  groupName: z.string().min(1, 'Group name is required'),
});

export function useAddGroupForm() {
  const { openDialogName, dialogPayload, closeDialog } = useDialog();
  const navigate = useNavigate();

  const open = openDialogName === 'addGroup';
  const isEditing = useMemo(() => !!dialogPayload?.id, [dialogPayload]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: '',
    },
  });

  // Prefill form when dialog opens for editing
  useEffect(() => {
    if (open) {
      form.reset(
        dialogPayload
          ? { groupName: dialogPayload.name } // prefill for edit
          : { groupName: '' }, // blank for create
      );
    }
  }, [open, dialogPayload, form]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (isEditing) {
      const updated = await updateGroup(dialogPayload.id, {
        name: data.groupName,
      });

      if (updated) {
        toast.success('Group updated successfully');
        closeDialog();
      } else {
        toast.error('Failed to update group');
      }
    } else {
      const newGroup = {
        id: uuidv4(),
        user_id: await getCurrentUserId(),
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
