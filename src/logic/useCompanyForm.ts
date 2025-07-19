import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import { useDialog } from '@/contexts/DialogContext';
import { insertCompany, updateCompany, uploadLogo } from '@/services/companies';
import { useLogActivity } from './useLogActivity';

const companyFormSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  description: z.string().optional(),
  logoFile: z
    .instanceof(File)
    .optional()
    .refine(file => !file || file.size <= 5_000_000, 'Max file size is 5MB'),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

export function useCompanyForm() {
  const { openDialogName, dialogPayload, closeDialog } = useDialog();
  const { logActivity, userId } = useLogActivity();

  const isEditing = useMemo(() => !!dialogPayload?.id, [dialogPayload]);
  const open =
    openDialogName === 'addCompany' || openDialogName === 'editCompany';

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),

    defaultValues: { name: '', description: '', logoFile: undefined },
  });

  useEffect(() => {
    if (open) {
      if (dialogPayload) {
        form.reset({
          name: dialogPayload.name || '',
          description: (dialogPayload as any)?.description || '',
          logoFile: undefined,
        });
        setLogoPreview((dialogPayload as any)?.company_logo || null);
      } else {
        form.reset({
          name: '',
          description: '',
          logoFile: undefined,
        });
        setLogoPreview(null);
      }
    }
  }, [open, dialogPayload, form]);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('logoFile', file, { shouldValidate: true });
      setLogoPreview(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const handleSubmit = async (data: CompanyFormValues) => {
    if (!userId) {
      toast.error('User not authenticated. Please try again.');
      return;
    }

    try {
      let logoUrl = logoPreview;
      if (data.logoFile) {
        logoUrl = await uploadLogo(data.logoFile);
      }

      const companyData = {
        name: data.name,
        description: data.description,
        company_logo: logoUrl,
      };

      if (isEditing) {
        if (!dialogPayload?.id)
          throw new Error('Company ID not found for editing.');
        await updateCompany(dialogPayload.id, companyData);
        toast.success('Company updated successfully');
        logActivity('COMPANY_EDITED', 'Company', dialogPayload.id, {
          companyName: data.name,
        });
      } else {
        const newCompany = {
          id: uuidv4(),
          user_id: userId,
          created_at: new Date().toISOString(),
          ...companyData,
        };
        await insertCompany(newCompany as any);
        toast.success('Company created successfully');
        logActivity('COMPANY_CREATED', 'Company', newCompany.id, {
          companyName: newCompany.name,
        });
      }
      closeDialog();
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred.');
    }
  };

  return {
    open,
    form,
    handleSubmit,
    closeDialog,
    isEditing,
    logoPreview,
    handleLogoChange,
  };
}
