// import { Link } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { ArrowRight, Tag as TagIcon, Tags } from 'lucide-react';

// // Define the shape of the data this component expects
// type PopularTag = {
//   id: string;
//   name: string;
//   color: string | null;
//   count: number;
// };

// type TopTagsWidgetProps = {
//   popularTags: PopularTag[];
//   // Assuming you have these helper functions for custom colors
//   getTagBgClass: (color: string) => string;
// };

// export const TopTagsWidget = ({
//   popularTags,
//   getTagBgClass,
// }: TopTagsWidgetProps) => {
//   // Find the max count to create a relative bar chart
//   const maxCount = Math.max(...popularTags.map(tag => tag.count), 0);

//   return (
//     <Card>
//       <CardHeader className="pb-3">
//         <CardTitle className="text-lg flex items-center gap-2">
//           <TagIcon className="h-5 w-5 text-muted-foreground" /> Top Tags
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {popularTags.length > 0 ? (
//           <ul className="space-y-4">
//             {popularTags.map(tag => (
//               <li key={tag.id}>
//                 <div className="flex justify-between items-center mb-1">
//                   <span className="text-sm font-medium text-foreground">
//                     {tag.name}
//                   </span>
//                   <span className="text-sm font-semibold text-foreground">
//                     {tag.count}
//                   </span>
//                 </div>
//                 <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
//                   <div
//                     className={`h-full rounded-full ${getTagBgClass(tag.color || 'gray')}`}
//                     style={{
//                       width: `${maxCount > 0 ? (tag.count / maxCount) * 100 : 0}%`,
//                     }}
//                   />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <div className="flex flex-col items-center justify-center text-center text-sm py-8">
//             <Tags className="h-8 w-8 text-muted-foreground mb-2" />
//             <p className="font-semibold text-foreground">No Popular Tags</p>
//             <p className="text-muted-foreground text-xs">
//               Assign tags to contacts to see them here.
//             </p>
//           </div>
//         )}
//       </CardContent>
//       <CardFooter className="flex justify-end border-t px-6 py-2">
//         <Button variant="link" size="sm" className="p-0 text-sm" asChild>
//           <Link to="/tags">
//             View All Tags <ArrowRight className="h-4 w-4 ml-1" />
//           </Link>
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };
