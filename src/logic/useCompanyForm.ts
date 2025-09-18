import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useMemo } from 'react';
import type { ChangeEvent } from 'react';
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

  const companyPayload = useMemo(() => {
    if (dialogPayload && 'type' in dialogPayload && dialogPayload.type === 'company') {
      return dialogPayload;
    }
    return null;
  }, [dialogPayload]);

  const isEditing = openDialogName === 'editCompany' && !!companyPayload;
  const open =
    openDialogName === 'addCompany' || openDialogName === 'editCompany';

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),

    defaultValues: { name: '', description: '', logoFile: undefined },
  });

  useEffect(() => {
    if (open) {
      if (companyPayload) {
        form.reset({
          name: companyPayload.name || '',
          description: companyPayload.description || '',
          logoFile: undefined,
        });
        setLogoPreview(companyPayload.company_logo || null);
      } else {
        form.reset({
          name: '',
          description: '',
          logoFile: undefined,
        });
        setLogoPreview(null);
      }
    }
  }, [open, companyPayload, form]);

  const handleLogoChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (value: File | undefined) => void,
  ) => {
    const file = e.target.files?.[0];
    onChange(file);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
    form.trigger('logoFile');
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

      if (isEditing && companyPayload) {
        await updateCompany(companyPayload.id, companyData);
        toast.success('Company updated successfully');
        logActivity('COMPANY_EDITED', 'Company', companyPayload.id, {
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
