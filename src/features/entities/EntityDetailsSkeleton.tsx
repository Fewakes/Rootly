import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';

export default function EntityDetailsSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>At a Glance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <Skeleton className="h-8 w-full" />
            </CardHeader>
            <CardContent className="h-full">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
