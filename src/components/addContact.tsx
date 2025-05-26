import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Building2, Tags, UserIcon, Users } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

import { useDialog } from '@/contexts/DialogContext';
import { getCurrentUserId, insertContact } from '@/lib/supabase/supabase';
import { useNavigate } from 'react-router-dom';
import default_woman from '@/assets/default_woman.svg';
import default_man from '@/assets/default_man.svg';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Surname is required'),
  gender: z.enum(['male', 'female'], {
    required_error: 'Gender is required',
  }),
  email: z.string().email('Invalid email'),
  contactNumber: z.string().optional(),
});

export default function AddContactDialog() {
  const { openDialogName, closeDialog } = useDialog();
  const navigate = useNavigate();

  // Open dialog only if context name matches 'addContact'
  const open = openDialogName === 'addContact';

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      surname: '',
      gender: 'male',
      email: '',
      contactNumber: '',
    },
  });

  const onSubmit = async data => {
    const avatarUrl = data.gender === 'male' ? default_man : default_woman;

    const newContact = {
      id: uuidv4(),
      user_id: await getCurrentUserId(),
      name: `${data.firstName} ${data.surname}`,
      email: data.email,
      gender: data.gender,
      avatar_url: avatarUrl,
      company_id: null,
      created_at: new Date().toISOString(),
      contact_number: data.contactNumber || null,
      town: null,
      country: null,
      birthday: null,
      link_name: null,
      link_url: null,
    };

    const saved = await insertContact(newContact);

    if (saved) {
      form.reset();
      closeDialog();
      navigate(`/contacts/${saved.id}`);
    } else {
      console.error('Failed to create contact');
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) closeDialog();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            {/* Personal Info */}
            <div>
              <div className="text-sm text-muted-foreground font-medium mb-2">
                Personal Information
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Surname</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Contact Info */}
            <div>
              <div className="text-sm text-muted-foreground font-medium mb-2">
                Contact Information
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Profile Details */}
            <div>
              <div className="text-sm text-muted-foreground font-medium mb-2">
                Profile Details
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-xl p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Gender
                    </span>
                  </div>
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Disabled placeholders */}
                <div className="border rounded-xl p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Group
                    </span>
                  </div>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="coming soon" />
                    </SelectTrigger>
                  </Select>
                </div>

                <div className="border rounded-xl p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Tags className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Tags
                    </span>
                  </div>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="coming soon" />
                    </SelectTrigger>
                  </Select>
                </div>

                <div className="border rounded-xl p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Company
                    </span>
                  </div>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="coming soon" />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  form.reset();
                  closeDialog();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? 'Submitting...'
                  : 'Create Contact'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
