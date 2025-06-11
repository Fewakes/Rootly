'use client';

import { Button } from '@/components/ui/button';
import { useDialog } from '@/contexts/DialogContext';
import TagsTable from '@/features/tags/TagsTable';

import { useAllTags } from '@/logic/useAllTags';
import { UserPlus } from 'lucide-react';

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
          className="bg-primaryBlue text-white px-6 py-3 text-base font-semibold transition duration-150 transform hover:scale-[1.02] active:scale-[0.98] shadow hover:shadow-md hover:bg-primaryBlue"
          onClick={() => openDialog('addTag')}
        >
          <UserPlus className="w-5 h-5 mr-2" /> Add New Tag
        </Button>
      </div>

      <TagsTable tags={tags} onEdit={handleEdit} />
    </div>
  );
}
