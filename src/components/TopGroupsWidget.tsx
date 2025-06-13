// import { Link } from 'react-router-dom';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { ArrowRight, Users } from 'lucide-react';

// type PopularGroup = {
//   id: string;
//   name: string;
//   count: number;
// };

// type TopGroupsWidgetProps = {
//   popularGroups: PopularGroup[];
// };

// export const TopGroupsWidget = ({ popularGroups }: TopGroupsWidgetProps) => {
//   return (
//     <Card>
//       <CardHeader className="pb-3">
//         <CardTitle className="text-lg flex items-center gap-2">
//           <Users className="h-5 w-5 text-muted-foreground" /> Top Groups
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {popularGroups.length > 0 ? (
//           <div className="flex flex-wrap gap-2">
//             {popularGroups.map(group => (
//               <Badge
//                 key={group.id}
//                 variant="secondary"
//                 className="px-3 py-1 text-sm shadow-sm"
//               >
//                 {group.name} ({group.count})
//               </Badge>
//             ))}
//           </div>
//         ) : (
//           <div className="text-muted-foreground italic text-sm py-4 text-center">
//             No popular groups yet.
//           </div>
//         )}
//       </CardContent>
//       <CardFooter className="flex justify-end border-t px-6 ">
//         <Button variant="link" size="sm" className="p-0 text-sm" asChild>
//           <Link to="/groups">
//             View All Groups <ArrowRight className="h-4 w-4 ml-1" />
//           </Link>
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };
