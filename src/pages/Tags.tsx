'use client';

import { Button } from '@/components/ui/button';
import { useDialog } from '@/contexts/DialogContext';
import TagsTable from '@/features/tags/TagsTable';
import { useAllTags } from '@/logic/useAllTags';

export default function Tags() {
  const { openDialog } = useDialog();
  const { tags, loading, error } = useAllTags();

  //add loading !

  const handleEdit = (id: string) => {
    console.log('Edit tag with id:', id);
  };

  return (
    <div className="w-full p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Tags</h1>
        <Button
          className="bg-primaryBlue text-white hover:bg-primaryBlue/90"
          onClick={() => openDialog('addTag')}
        >
          + Create New
        </Button>
      </div>

      <TagsTable tags={tags} onEdit={handleEdit} />
    </div>
  );
}
