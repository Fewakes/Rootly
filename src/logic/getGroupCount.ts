import { getAllGroups } from '@/services/groups';

export async function getGroupCount(): Promise<number> {
  const groups = await getAllGroups();
  return groups.length;
}
