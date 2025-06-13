import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { supabase } from '@/lib/supabaseClient';
import { useDialog } from '@/contexts/DialogContext';
import { insertCompany, updateCompany } from '@/services/companies';
import { useLogActivity } from './useLogActivity';

const formSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  logo: z
    .instanceof(File)
    .optional()
    .refine(
      file => (file ? file.size <= 5_000_000 : true),
      'Max file size is 5MB',
    ),
});

type AddCompanyFormValues = z.infer<typeof formSchema>;

const DEFAULT_LOGO_URL = '/src/assets/company-default.png';

export function useAddCompanyForm() {
  const { openDialogName, closeDialog, dialogPayload } = useDialog();
  const open = openDialogName === 'addCompany';
  const isEditing = useMemo(() => !!dialogPayload?.id, [dialogPayload]);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { logActivity, userId } = useLogActivity(); // ✅ Using new hook

  const form = useForm<AddCompanyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { companyName: '', logo: undefined },
  });

  // Reset form and preview when dialog state changes
  useEffect(() => {
    if (open) {
      form.reset({
        companyName: dialogPayload?.name || '',
        logo: undefined,
      });
      const existingLogo = (dialogPayload as any)?.company_logo;
      setLogoPreview(existingLogo || null);
    } else {
      form.reset();
      setLogoPreview(null);
    }
  }, [open, dialogPayload, form]);

  const uploadLogo = async (file: File): Promise<string> => {
    const fileName = `${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage
      .from('logos')
      .upload(fileName, file);
    if (error) throw new Error('Logo upload failed');
    const { data } = supabase.storage.from('logos').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (values: AddCompanyFormValues) => {
    if (!userId) {
      toast.error('User not authenticated. Please try again.');
      return;
    }

    try {
      let logoUrl = logoPreview || DEFAULT_LOGO_URL;
      if (values.logo) {
        logoUrl = await uploadLogo(values.logo);
      }

      if (isEditing) {
        const success = await updateCompany(dialogPayload.id!, {
          name: values.companyName,
          company_logo: logoUrl,
        });

        if (success) {
          toast.success('Company updated successfully');
          logActivity('COMPANY_EDITED', 'Company', dialogPayload.id!, {
            companyName: values.companyName,
          });
          closeDialog();
        } else {
          toast.error('Failed to update company');
        }
      } else {
        const newCompany = {
          id: crypto.randomUUID(),
          name: values.companyName,
          company_logo: logoUrl,
          user_id: userId,
          created_at: new Date().toISOString(),
        };
        const success = await insertCompany(newCompany);

        if (success) {
          toast.success('Company added successfully');
          logActivity('COMPANY_CREATED', 'Company', newCompany.id, {
            companyName: newCompany.name,
          });
          closeDialog();
        } else {
          toast.error('Failed to add company');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred.');
    }
  };

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('logo', file, { shouldValidate: true });
      setLogoPreview(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  return {
    open,
    form,
    handleSubmit,
    closeDialog,
    logoPreview,
    onLogoChange,
    isEditing,
  };
}
