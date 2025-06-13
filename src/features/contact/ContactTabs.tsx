import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Contact } from '@/types/types';
import { NotesSection } from './NotesSection';

import { TasksSection } from './TaskSection';

export function ContactTabs({ contact }: { contact: Contact }) {
  const { id: contactId, name: contactName } = contact;
  return (
    <Tabs defaultValue="notes" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>
      <TabsContent value="notes" className="mt-4 flex-1">
        <NotesSection contactId={contactId} contactName={contactName} />
      </TabsContent>
      <TabsContent value="tasks" className="mt-4 flex-1">
        <TasksSection contactId={contactId} contactName={contactName} />
      </TabsContent>
    </Tabs>
  );
}
