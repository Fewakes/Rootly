import { getAllTags } from '@/services/tags';

export async function getTagsCount(): Promise<number> {
  const tags = await getAllTags();
  return tags.length;
}
