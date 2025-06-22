import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil } from 'lucide-react';
import type { ReactNode } from 'react';

type EntityHeaderProps = {
  type: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  icon: ReactNode;
  onEdit: () => void;
};

export function EntityHeader({
  type,
  name,
  description,
  imageUrl,
  icon,
  onEdit,
}: EntityHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          {imageUrl && (
            <Avatar className="h-16 w-16 border">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback>{icon}</AvatarFallback>
            </Avatar>
          )}

          <div>
            <Badge variant="outline">{type}</Badge>
            <h1 className="text-3xl font-bold break-words mt-1">{name}</h1>
            {description && (
              <p className="text-muted-foreground text-sm max-w-prose mt-2">
                {description}
              </p>
            )}
          </div>
        </div>
        <Button variant="outline" onClick={onEdit} className="shrink-0">
          <Pencil className="h-4 w-4 mr-2" />
          Edit Details
        </Button>
      </CardContent>
    </Card>
  );
}
