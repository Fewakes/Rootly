import TagsTable from '@/features/tags/TagsTable';

export default function Tags() {
  const tags = [
    {
      id: '1',
      name: 'Marketing',
      color: '#f87171', // example red-400 hex color
      created_at: '2023-05-01T10:00:00Z',
      user_count: 7,
    },
    {
      id: '2',
      name: 'Aws',
      color: '#f33211', // example red-400 hex color
      created_at: '2024-05-01T10:00:00Z',
      user_count: 1,
    },
    {
      id: '3',
      name: 'Dpd',
      color: '#f9321', // example red-400 hex color
      created_at: '2022-11-01T10:00:00Z',
      user_count: 2,
    },
    {
      id: '4',
      name: 'Hola',
      color: '#d37911', // example red-400 hex color
      created_at: '2023-05-01T10:00:00Z',
      user_count: 3,
    },
    // more tags...
  ];

  const handleEdit = (id: string) => {
    console.log('Edit tag with id:', id);
    // open your edit dialog/modal here
  };

  return (
    <div className="w-full p-6 space-y-8">
      <h1 className="text-4xl font-bold">Tags</h1>
      <TagsTable tags={tags} onEdit={handleEdit} />
    </div>
  );
}
