// useExpandedTags.ts
import { useState } from 'react';

export const useExpandedTags = () => {
  const [expandedTags, setExpandedTags] = useState<number[]>([]);

  const toggleTags = (id: number) => {
    setExpandedTags(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  return { expandedTags, toggleTags };
};
