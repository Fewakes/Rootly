import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Globe,
  Mail,
  MapPin,
  Phone,
  Pencil,
  Building2,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TAG_BG_CLASSES, TAG_TEXT_CLASSES } from '@/lib/utils';
import default_woman from '@/assets/default_woman.svg';
import default_man from '@/assets/default_man.svg';
import { useContactDetail } from '@/logic/useContactDetails';
import { useDeleteContact } from '@/logic/useDeleteContact';
import { Link, useNavigate } from 'react-router-dom';

export default function Contact() {
  const { contact, loading, error } = useContactDetail();
  const { deleteContact } = useDeleteContact();
  const navigate = useNavigate();

  const deleteHandler = async () => {
    const confirmed = confirm(
      `Are you sure you want to delete ${contact.name}?`,
    );
    if (confirmed) {
      await deleteContact(contact.id);
      navigate('/contacts');
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))]">
        Loading contact details...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))] text-red-500">
        Error: {error.message}
      </div>
    );
  if (!contact)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))]">
        Contact not found.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 md:p-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Contact Header & Information Sections */}
        <div className="md:col-span-2 space-y-6">
          {/* Section 1: Contact Header (Avatar, Name, Tags, Groups) - REVERTED STYLING */}
          <Card className="p-6 shadow-md">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {' '}
              {/* Changed items-center to items-start for consistent top alignment */}
              {/* Avatar retains its fixed size */}
              <div className="flex-shrink-0">
                <Avatar className="h-28 w-28">
                  <AvatarImage
                    src={
                      contact.avatar_url ||
                      (contact.gender === 'female'
                        ? default_woman
                        : default_man)
                    }
                    alt={contact.name}
                  />
                  <AvatarFallback className="text-5xl">
                    {contact.name ? contact.name[0] : '?'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                {/* Name and its Edit Button aligned to right */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground truncate">
                    {contact.name}
                  </h1>
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary h-8 w-8 flex-shrink-0"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">
                        Edit Name, Tags, and Groups
                      </span>{' '}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary h-8 w-8 flex-shrink-0"
                      onClick={deleteHandler}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">
                        Edit Name, Tags, and Groups
                      </span>{' '}
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Tags:
                  </h3>
                  {contact.contact_tags && contact.contact_tags.length > 0 ? (
                    contact.contact_tags.map(tag => (
                      <Badge
                        key={tag.id}
                        className={`${TAG_BG_CLASSES[tag.color]} ${TAG_TEXT_CLASSES[tag.color]} border-none shadow-sm text-xs`}
                      >
                        {tag.name}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      No tags
                    </Badge>
                  )}
                </div>

                {/* Group */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {' '}
                  {/* Added mt-2 for small separation */}
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Group:
                  </h3>
                  {contact.contact_groups &&
                  contact.contact_groups.length > 0 ? (
                    <span className="text-sm">
                      {contact.contact_groups[0].name}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No group assigned
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Contact Information */}
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-xl">Contact Information</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit Contact Information</span>
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <span className="text-xs uppercase text-muted-foreground block">
                    Email
                  </span>
                  <span className="font-medium truncate">
                    {contact.email || 'Not provided'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <span className="text-xs uppercase text-muted-foreground block">
                    Phone
                  </span>
                  <span className="font-medium">
                    {contact.contact_number || 'Not provided'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <span className="text-xs uppercase text-muted-foreground block">
                    Location
                  </span>
                  <span className="font-medium">
                    {contact.town || contact.country
                      ? `${contact.town || ''}${contact.town && contact.country ? ', ' : ''}${contact.country || ''}`
                      : 'Not provided'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <span className="text-xs uppercase text-muted-foreground block">
                    Birthday
                  </span>
                  <span className="font-medium">
                    {contact.birthday
                      ? new Date(contact.birthday).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Not provided'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <span className="text-xs uppercase text-muted-foreground block">
                    Social Link
                  </span>
                  {contact.link_url ? (
                    <a
                      href={contact.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-500 font-medium flex items-center gap-1"
                    >
                      {contact.link_name || 'Social Profile'}{' '}
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  ) : (
                    <span className="font-medium">Not added</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <span className="text-xs uppercase text-muted-foreground block">
                    Company
                  </span>
                  {contact.contact_companies &&
                  contact.contact_companies.length > 0 ? (
                    <div className="flex items-center gap-2 font-medium">
                      {contact.contact_companies[0].company_logo && (
                        <img
                          src={contact.contact_companies[0].company_logo}
                          alt={contact.contact_companies[0].name}
                          className="h-5 w-5 object-contain rounded-sm"
                        />
                      )}
                      <span>{contact.contact_companies[0].name}</span>
                    </div>
                  ) : (
                    <span className="font-medium">No company added</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Tabs for Notes, Tasks, Professional */}
        <div className="md:col-span-1 space-y-6">
          <Tabs defaultValue="notes" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="mt-4 flex-1">
              <Card className="h-full">
                <CardContent className="p-4 text-muted-foreground text-sm space-y-3 h-full overflow-auto custom-scrollbar">
                  <p className="border-l-2 pl-3 py-1 border-border italic">
                    "Discussed project X scope expansion. Client seemed very
                    engaged and requested a detailed proposal by end of week."
                  </p>
                  <p className="border-l-2 pl-3 py-1 border-border italic">
                    "Initial client meeting. Covered basic needs and established
                    next steps."
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-primary"
                  >
                    Add Note
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="mt-4 flex-1">
              <Card className="h-full">
                <CardContent className="p-4 text-muted-foreground text-sm space-y-3 h-full overflow-auto custom-scrollbar">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary rounded"
                      />
                      <span>Draft project proposal for Q3</span>
                    </label>
                    <Badge variant="destructive" className="text-xs">
                      Due: Jun 20
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between opacity-80">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked
                        className="form-checkbox h-4 w-4 text-primary rounded"
                        disabled
                      />
                      <span className="line-through">
                        Schedule intro call (completed)
                      </span>
                    </label>
                    <Badge variant="secondary" className="text-xs">
                      Completed
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-primary"
                  >
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="mt-4 flex-1">
              <Card className="h-full">
                <CardContent className="p-4 text-muted-foreground text-sm space-y-3 h-full overflow-auto custom-scrollbar">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Job Title
                    </h4>
                    <p>Senior Software Engineer</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Department
                    </h4>
                    <p>Product Development</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Key Skills
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        React.js
                      </Badge>
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        Node.js
                      </Badge>
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        AWS
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-primary"
                  >
                    Edit Professional Info
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* Custom scrollbar style for content areas that might scroll */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.4);
        }
      `}</style>
    </div>
  );
}
