import { cn } from '@/lib/utils';

export default function EntityEmptyState({
  message,
  isCompact = false,
}: {
  message: string;
  isCompact?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-full text-center',
        isCompact ? 'py-8' : 'py-10',
      )}
    >
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
