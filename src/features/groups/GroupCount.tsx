import { useEffect, useState } from 'react';
import { getGroupCount } from '@/logic/getGroupCount';

export default function GroupCount() {
  const [groupsCount, setGroupsCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      const count = await getGroupCount();
      setGroupsCount(count);
    }

    fetchCount();
  }, []);

  if (groupsCount === null) {
    return <div>Loading...</div>;
  }

  return <div>{groupsCount}</div>;
}
