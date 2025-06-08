// useAddCompanyForm.ts (or inside the file where you have this hook)

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';

import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useDialog } from '@/contexts/DialogContext';
import { insertCompany } from '@/services/companies';
import { getCurrentUserId } from '@/services/users';

const formSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  logo: z.instanceof(File).optional(),
});

type AddCompanyFormValues = z.infer<typeof formSchema>;

const DEFAULT_LOGO_URL = '/src/assets/company-default.png';

export function useAddCompanyForm() {
  const { openDialogName, closeDialog, dialogPayload } = useDialog();
  const open = openDialogName === 'addCompany';

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<AddCompanyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { companyName: '', logo: undefined },
  });

  // Reset form & preview on dialog open or payload change
  useEffect(() => {
    if (open) {
      const nameFromPayload = dialogPayload?.name || '';
      form.reset({ companyName: nameFromPayload, logo: undefined });

      if (dialogPayload?.company_logo) {
        setLogoPreview(dialogPayload.company_logo);
      } else {
        setLogoPreview(null);
      }
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
    try {
      let logoUrl = DEFAULT_LOGO_URL;

      if (values.logo) {
        logoUrl = await uploadLogo(values.logo);
      } else if (logoPreview) {
        // Use existing preview URL (editing scenario)
        logoUrl = logoPreview;
      }

      const userId = await getCurrentUserId();
      if (!userId) {
        toast.error('User not authenticated');
        return;
      }

      const result = await insertCompany({
        id: crypto.randomUUID(),
        name: values.companyName,
        company_logo: logoUrl,
        user_id: userId,
        created_at: new Date().toISOString(),
      });

      if (result) {
        toast.success('Company added successfully');
        form.reset();
        setLogoPreview(null);
        closeDialog();
      } else {
        toast.error('Failed to add company');
      }
    } catch (err: any) {
      toast.error(err.message || 'Unexpected error adding company');
    }
  };

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('logo', file);
      setLogoPreview(URL.createObjectURL(file));
    }
    // Clear input value to allow same file selection again if needed
    e.target.value = '';
  };

  return { open, form, handleSubmit, closeDialog, logoPreview, onLogoChange };
}
