// "use client";

// import { TrendingUp } from "lucide-react";
// import {
//   Area,
//   AreaChart,
//   CartesianGrid,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import type { PlatformActivity } from "@/actions/admin/dashboard";

// export default function OverviewChart({
//   platformActivity,
// }: {
//   platformActivity: PlatformActivity[];
// }) {
//   const chartData = [
//     { day: "Wed", users: 17, posts: 30, comments: 49 },
//     { day: "Thu", users: 14, posts: 22, comments: 22 },
//     { day: "Fri", users: 16, posts: 15, comments: 62 },
//     { day: "Sat", users: 18, posts: 36, comments: 57 },
//     { day: "Sun", users: 21, posts: 35, comments: 20 },
//     { day: "Mon", users: 24, posts: 36, comments: 54 },
//     { day: "Tue", users: 11, posts: 27, comments: 54 },
//   ];

//   return (
//     <div className="w-2/3 rounded-lg border bg-card text-card-foreground shadow-sm">
//       <div className="flex flex-col space-y-1.5 p-6">
//         <h3 className="flex items-center gap-2 font-semibold text-2xl leading-none tracking-tight">
//           <TrendingUp className="text-primary" size={20} />
//           Platform Activity
//         </h3>
//         <p className="text-muted-foreground text-sm">
//           Daily activity over the last 7 days
//         </p>
//       </div>

//       <div className="mx-5 mb-4">
//         <div className="h-[320px] w-full">
//           <ResponsiveContainer height="100%" width="100%">
//             <AreaChart
//               data={chartData}
//               margin={{
//                 top: 5,
//                 right: 10,
//                 left: -15,
//                 bottom: 0,
//               }}
//             >
//               <defs>
//                 <linearGradient id="colorUsers" x1="0" x2="0" y1="0" y2="1">
//                   <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
//                 </linearGradient>

//                 <linearGradient id="colorPosts" x1="0" x2="0" y1="0" y2="1">
//                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
//                 </linearGradient>

//                 <linearGradient id="colorComments" x1="0" x2="0" y1="0" y2="1">
//                   <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
//                 </linearGradient>
//               </defs>

//               <CartesianGrid className="stroke-muted" strokeDasharray="3 3" />

//               <XAxis
//                 axisLine={false}
//                 dataKey="day"
//                 tick={{
//                   fontSize: 11,
//                 }}
//                 tickLine={false}
//               />

//               <YAxis
//                 axisLine={false}
//                 tick={{
//                   fontSize: 11,
//                 }}
//                 tickLine={false}
//               />

//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "hsl(var(--card))",
//                   border: "1px solid hsl(var(--border))",
//                   borderRadius: "8px",
//                   fontSize: "12px",
//                 }}
//               />

//               <Area
//                 dataKey="users"
//                 fill="url(#colorUsers)"
//                 name="New Users"
//                 stroke="#8b5cf6"
//                 strokeWidth={1.5}
//                 type="monotone"
//               />

//               <Area
//                 dataKey="posts"
//                 fill="url(#colorPosts)"
//                 name="Posts"
//                 stroke="#3b82f6"
//                 strokeWidth={1.5}
//                 type="monotone"
//               />

//               <Area
//                 dataKey="comments"
//                 fill="url(#colorComments)"
//                 name="Comments"
//                 stroke="#22c55e"
//                 strokeWidth={1.5}
//                 type="monotone"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PlatformActivity } from "@/actions/admin/dashboard";

export default function OverviewChart({
  platformActivity,
}: {
  platformActivity: PlatformActivity[];
}) {
  return (
    <div className="w-2/3 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="flex items-center gap-2 font-semibold text-2xl leading-none tracking-tight">
          <TrendingUp className="text-primary" size={20} />
          Platform Activity
        </h3>

        <p className="text-muted-foreground text-sm">
          Daily activity over the last 7 days
        </p>
      </div>

      <div className="mx-5 mb-4">
        <div className="h-[320px] w-full">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart
              data={platformActivity}
              margin={{
                top: 5,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />

                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="colorPosts" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />

                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="colorComments" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />

                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid className="stroke-muted" strokeDasharray="3 3" />

              <XAxis
                axisLine={false}
                dataKey="date"
                tick={{
                  fontSize: 11,
                }}
                tickLine={false}
              />

              <YAxis
                axisLine={false}
                tick={{
                  fontSize: 11,
                }}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />

              <Area
                dataKey="users"
                fill="url(#colorUsers)"
                name="New Users"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                type="monotone"
              />

              <Area
                dataKey="posts"
                fill="url(#colorPosts)"
                name="Posts"
                stroke="#3b82f6"
                strokeWidth={1.5}
                type="monotone"
              />

              <Area
                dataKey="comments"
                fill="url(#colorComments)"
                name="Comments"
                stroke="#22c55e"
                strokeWidth={1.5}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
