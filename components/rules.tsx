import { CircleCheckBig, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

interface RuleProps {
  children: React.ReactNode;
  valid: boolean;
}

export function Rule({ valid, children }: RuleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs transition-colors",
        valid ? "text-primary" : ""
      )}
    >
      {valid ? (
        <CircleCheckBig className="h-4 w-4 shrink-0" />
      ) : (
        <CircleX className="h-4 w-4 shrink-0" />
      )}

      <span>{children}</span>
    </div>
  );
}
