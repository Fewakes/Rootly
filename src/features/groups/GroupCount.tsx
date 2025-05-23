import { getAllGroups } from '@/lib/supabase/supabase';
import { useEffect, useState } from 'react';

export default function GroupCount() {
  const [groupsCount, setGroupsCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchGroups() {
      const groups = await getAllGroups();
      setGroupsCount(groups.length);
    }

    fetchGroups();
  }, []);

  if (groupsCount === null) {
    return <div>Loading...</div>;
  }

  return <div>{groupsCount}</div>;
}
