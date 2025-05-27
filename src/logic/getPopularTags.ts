import { getPopularTags as fetchTagsFromService } from '@/services/tags';
import type { PopularTag } from '@/types/types';

export async function getPopularTags(limit: number = 5): Promise<PopularTag[]> {
  return await fetchTagsFromService(limit);
}
