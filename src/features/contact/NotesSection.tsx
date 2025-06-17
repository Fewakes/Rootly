import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Plus, Pencil, Save, Trash2, X } from 'lucide-react';
import {
  useContactNotes,
  useAddNoteForm,
  useUpdateNoteForm,
  useDeleteNote,
} from '@/logic/useContactNotes';

export function NotesSection({
  contactId,
  contactName,
}: {
  contactId: string;
  contactName: string;
}) {
  const { notes, loading, refetch } = useContactNotes(contactId);
  const { form: addNoteForm, onSubmit: onAddNoteSubmit } = useAddNoteForm(
    contactId,
    contactName,
    async () => await refetch(),
  );
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const { form: updateNoteForm, onSubmit: onUpdateNoteSubmit } =
    useUpdateNoteForm(editingNoteId, contactName, async () => {
      setEditingNoteId(null);
      await refetch();
    });

  const { deleteNote: deleteNoteMutation, isDeleting } = useDeleteNote(
    contactName,
    async () => await refetch(),
  );

  const handleEditClick = (note: { id: string; content: string }) => {
    setEditingNoteId(note.id);
    updateNoteForm.reset({ content: note.content });
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4 text-sm space-y-4 h-full overflow-auto custom-scrollbar">
        {loading && <p>Loading notes...</p>}
        {!loading && notes.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No notes yet.
          </p>
        )}
        {notes.map(note => (
          <div key={note.id} className="group">
            {editingNoteId === note.id ? (
              <Form {...updateNoteForm}>
                <form
                  onSubmit={updateNoteForm.handleSubmit(onUpdateNoteSubmit)}
                  className="flex items-start gap-2"
                >
                  <FormField
                    control={updateNoteForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <textarea
                            {...field}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-1">
                    <Button
                      type="submit"
                      size="icon"
                      variant="outline"
                      disabled={updateNoteForm.formState.isSubmitting}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingNoteId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="border-l-2 pl-3 py-1 border-border italic text-muted-foreground relative">
                "{note.content}"
                <span className="block text-xs text-right opacity-60 not-italic mt-1">
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => handleEditClick(note)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => deleteNoteMutation(note.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        <Form {...addNoteForm}>
          <form
            onSubmit={addNoteForm.handleSubmit(onAddNoteSubmit)}
            className="flex gap-2 pt-4 border-t"
          >
            <FormField
              control={addNoteForm.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <textarea
                      placeholder="Add a new note..."
                      {...field}
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              disabled={addNoteForm.formState.isSubmitting}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
