import {
  Activity,
  CircleDot,
  FileImage,
  Flag,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import type { JSX } from "react";

interface OverviewItem {
  amount: number;
  icon: JSX.Element;
  id: string;
  title: string;
}

export default function Overview() {
  const overviewItems: OverviewItem[] = [
    {
      id: "1",
      amount: 7,
      title: "Total Users",
      icon: <Users size={16} />,
    },
    {
      id: "2",
      amount: 7,
      title: "Active Users",
      icon: <Activity size={16} />,
    },
    {
      id: "3",
      amount: 1,
      title: "Total Posts",
      icon: <FileImage size={16} />,
    },
    {
      id: "4",
      amount: 0,
      title: "Pending Reports",
      icon: <Flag size={16} />,
    },
    {
      id: "5",
      amount: 0,
      title: "Verified Users",
      icon: <Shield size={16} />,
    },
    {
      id: "6",
      amount: 0,
      title: "Suspended Users",
      icon: <CircleDot size={16} />,
    },
    {
      id: "7",
      amount: 0,
      title: "Banned Users",
      icon: <Users size={16} />,
    },
    {
      id: "8",
      amount: 0,
      title: "Total Comments",
      icon: <MessageSquare size={16} />,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {overviewItems.map((item) => (
        <div
          className="relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
          key={item.id}
        >
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="font-medium text-muted-foreground text-sm tracking-tight">
              {item.title}
            </h3>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {item.icon}
            </div>
          </div>

          <div className="p-6 pt-0">
            <div className="font-bold text-2xl tracking-tight">
              {item.amount}
            </div>
          </div>

          <div className="absolute right-0 bottom-0 left-0 h-1 bg-linear-to-r from-primary/20 via-primary to-primary/20" />
        </div>
      ))}
    </div>
  );
}
