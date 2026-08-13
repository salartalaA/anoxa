// "use client";

// import { Ellipsis, FileText, MessageSquare } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// const posts = [
//   {
//     id: 1,
//     reporter: "John Carter",
//     initials: "JC",
//     avatarClass: "bg-rose-500/20 text-rose-300",
//     content: "Click here for free stuff!!!",
//     reason: "Spam",
//     status: "Under Review",
//     statusClass: "bg-primary/10 text-primary ring-primary/30",
//     created: "Aug 10, 2025 · 8:00 AM",
//   },
//   {
//     id: 2,
//     reporter: "Ethan Wright",
//     initials: "EW",
//     avatarClass: "bg-orange-500/20 text-orange-300",
//     content: "Tabs > spaces. Fight me.",
//     reason: "Inflammatory Content",
//     status: "resolved",
//     statusClass: "bg-success/10 text-success ring-success/30",
//     created: "Aug 7, 2025 · 5:30 AM",
//   },
//   {
//     id: 3,
//     reporter: "Sophia Lee",
//     initials: "SL",
//     avatarClass: "bg-cyan-500/20 text-cyan-300",
//     content: "First half-marathon in the books 🏅",
//     reason: "Misinformation",
//     status: "rejected",
//     statusClass: "bg-muted text-muted-foreground ring-border",
//     created: "Aug 3, 2025 · 11:30 AM",
//   },
// ];

// export default function PostsReportsTable() {
//   return (
//     <div className="overflow-x-auto">
//       <div className="relative w-full overflow-auto">
//         <table className="w-full caption-bottom text-sm">
//           <thead className="[&_tr]:border-b">
//             <tr className="border-b transition-colors hover:bg-transparent data-[state=selected]:bg-muted">
//               <th className="h-10 px-2 pl-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&_>[role=checkbox]]:translate-y-[2px]">
//                 Reporter
//               </th>

//               <th className="h-10 min-w-[240px] px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&_>[role=checkbox]]:translate-y-[2px]">
//                 Reported Content
//               </th>
//               {/*
//               <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&_>[role=checkbox]]:translate-y-[2px]">
//                 Type
//               </th> */}

//               <th className="hidden h-10 px-2 text-left align-middle font-medium text-muted-foreground md:table-cell [&:has([role=checkbox])]:pr-0 [&_>[role=checkbox]]:translate-y-[2px]">
//                 Reason
//               </th>

//               <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&_>[role=checkbox]]:translate-y-[2px]">
//                 Status
//               </th>

//               <th className="hidden h-10 px-2 text-left align-middle font-medium text-muted-foreground lg:table-cell [&:has([role=checkbox])]:pr-0 [&_>[role=checkbox]]:translate-y-[2px]">
//                 Created
//               </th>

//               <th className="h-10 w-12 px-2 pr-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&_>[role=checkbox]]:translate-y-[2px]">
//                 Actions
//               </th>
//             </tr>
//           </thead>

//           <tbody className="[&_tr:last-child]:border-0">
//             {posts.map((post) => (
//               <tr
//                 className="group border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
//                 key={post.id}
//               >
//                 <td className="p-2 pl-4 align-middle [&:has([role=checkbox])]:pr-0 [&_>[role=checkbox]]:translate-y-[2px]">
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-semibold text-[10px] tracking-wide ring-1 ring-border ${post.avatarClass}`}
//                     >
//                       {post.initials}
//                     </div>

//                     <span className="text-foreground text-sm">
//                       {post.reporter}
//                     </span>
//                   </div>
//                 </td>

//                 <td className="max-w-[280px] p-2 align-middle [&:has([role=checkbox])]:pr-0 [&_>[role=checkbox]]:translate-y-[2px]">
//                   <p className="truncate text-foreground text-sm">
//                     {post.content}
//                   </p>
//                 </td>

//                 {/* <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&_>[role=checkbox]]:translate-y-[2px]">
//                   <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
//                     <FileText className="h-3.5 w-3.5" />
//                     <span className="capitalize">{post.type}</span>
//                   </span>
//                 </td> */}

//                 <td className="hidden p-2 align-middle text-muted-foreground text-sm md:table-cell [&:has([role=checkbox])]:pr-0 [&_>[role=checkbox]]:translate-y-[2px]">
//                   {post.reason}
//                 </td>

//                 <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&_>[role=checkbox]]:translate-y-[2px]">
//                   <span
//                     className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-[11px] uppercase tracking-wide ring-1 ring-inset ${post.statusClass}`}
//                   >
//                     {post.status}
//                   </span>
//                 </td>

//                 <td className="hidden p-2 align-middle text-muted-foreground lg:table-cell [&:has([role=checkbox])]:pr-0 [&_>[role=checkbox]]:translate-y-[2px]">
//                   {post.created}
//                 </td>

//                 <td className="p-2 pr-4 text-right align-middle [&:has([role=checkbox])]:pr-0 [&_>[role=checkbox]]:translate-y-[2px]">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger
//                       render={
//                         <Button
//                           className="h-8 w-8 opacity-60 group-hover:opacity-100"
//                           size="icon"
//                           variant="ghost"
//                         />
//                       }
//                     >
//                       <Ellipsis className="h-4 w-4" />
//                     </DropdownMenuTrigger>

//                     <DropdownMenuContent align="end" className="w-44">
//                       <DropdownMenuLabel>Actions</DropdownMenuLabel>

//                       <DropdownMenuItem>
//                         <FileText className="mr-2 h-4 w-4" />
//                         View
//                       </DropdownMenuItem>

//                       <DropdownMenuSeparator />

//                       <DropdownMenuItem>
//                         <MessageSquare className="mr-2 h-4 w-4" />
//                         Review
//                       </DropdownMenuItem>

//                       <DropdownMenuItem className="text-red-400 focus:text-red-300">
//                         Delete
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";

import { Ellipsis, Eye, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const comments = [
  {
    id: 1,
    comment: "This view is absolutely insane. Where was this photo taken?",
    reporter: "Liam Patel",
    initials: "LP",
    avatarClass: "bg-blue-500/20 text-blue-300",
    reason: "Harassment",
    status: "rejected",
    statusClass: "bg-muted text-muted-foreground ring-border",
    createdAt: "Aug 11, 2025 · 2:40 AM",
  },
  {
    id: 2,
    comment:
      "Okay but this might actually be the best pasta recipe I've seen here 😂",
    reporter: "John Carter",
    initials: "JC",
    avatarClass: "bg-rose-500/20 text-rose-300",
    reason: "Spam",
    status: "under review",
    statusClass: "bg-primary/10 text-primary ring-primary/30",
    createdAt: "Aug 10, 2025 · 8:00 AM",
  },
  {
    id: 3,
    comment:
      "You really expect people to believe this? That doesn't even make sense.",
    reporter: "Noah Kim",
    initials: "NK",
    avatarClass: "bg-violet-500/20 text-violet-300",
    reason: "Misinformation",
    status: "under review",
    statusClass: "bg-primary/10 text-primary ring-primary/30",
    createdAt: "Aug 10, 2025 · 7:50 AM",
  },
  {
    id: 4,
    comment:
      "Tabs are obviously better. Anyone who says otherwise is just wrong.",
    reporter: "Ethan Wright",
    initials: "EW",
    avatarClass: "bg-orange-500/20 text-orange-300",
    reason: "Inflammatory Content",
    status: "resolved",
    statusClass: "bg-success/10 text-success ring-success/30",
    createdAt: "Aug 7, 2025 · 5:30 AM",
  },
  {
    id: 5,
    comment:
      "Congrats! 1:52 is seriously impressive. How long have you been training?",
    reporter: "Sophia Lee",
    initials: "SL",
    avatarClass: "bg-cyan-500/20 text-cyan-300",
    reason: "Misinformation",
    status: "rejected",
    statusClass: "bg-muted text-muted-foreground ring-border",
    createdAt: "Aug 3, 2025 · 11:30 AM",
  },
  {
    id: 6,
    comment:
      "Nobody asked for your opinion. Maybe learn what you're talking about first.",
    reporter: "Isabella Nguyen",
    initials: "IN",
    avatarClass: "bg-rose-500/20 text-rose-300",
    reason: "Rude Behavior",
    status: "pending",
    statusClass: "bg-warning/10 text-warning ring-warning/30",
    createdAt: "Aug 7, 2025 · 2:15 AM",
  },
  {
    id: 7,
    comment:
      "This trail looks incredible. Adding it to my list for the next trip!",
    reporter: "Liam Patel",
    initials: "LP",
    avatarClass: "bg-blue-500/20 text-blue-300",
    reason: "Minor Issue",
    status: "rejected",
    statusClass: "bg-muted text-muted-foreground ring-border",
    createdAt: "Aug 9, 2025 · 1:00 PM",
  },
];

export default function CommentsReportsTable() {
  return (
    <div className="overflow-x-auto">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Reporter</TableHead>

              <TableHead className="min-w-[280px]">Reported Post</TableHead>

              <TableHead className="hidden md:table-cell">Reason</TableHead>

              <TableHead>Status</TableHead>

              <TableHead className="hidden lg:table-cell">Created</TableHead>

              <TableHead className="w-12 pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {comments.map((comment) => (
              <TableRow className="group" key={comment.id}>
                {/* Reporter */}
                <TableCell className="pl-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-semibold text-[10px] tracking-wide ring-1 ring-border ${comment.avatarClass}`}
                    >
                      {comment.initials}
                    </div>

                    <span className="text-foreground text-sm">
                      {comment.reporter}
                    </span>
                  </div>
                </TableCell>

                {/* Reported Comment */}
                <TableCell className="max-w-[320px]">
                  <p className="truncate text-foreground text-sm">
                    {comment.comment}
                  </p>
                </TableCell>

                {/* Reason */}
                <TableCell className="hidden text-muted-foreground text-sm md:table-cell">
                  {comment.reason}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-[11px] uppercase tracking-wide ring-1 ring-inset ${comment.statusClass}`}
                  >
                    {comment.status}
                  </span>
                </TableCell>

                {/* Created */}
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {comment.createdAt}
                </TableCell>

                {/* Actions */}
                <TableCell className="pr-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          className="h-8 w-8 opacity-60 group-hover:opacity-100"
                          size="icon"
                          variant="ghost"
                        />
                      }
                    >
                      <Ellipsis className="h-4 w-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem>Review</DropdownMenuItem>

                        <DropdownMenuItem className="text-red-400 focus:text-red-300">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
