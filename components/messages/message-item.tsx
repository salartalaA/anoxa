// import { Check, CheckCheck } from "lucide-react";
// import { useEffect, useRef } from "react";
// import type { Message } from "@/app/generated/prisma/client";
// import { socket } from "@/lib/socket";
// import { cn } from "@/lib/utils";

// export default function MessageItem({
//   message,
//   currentUserId,
//   otherUserFullName,
// }: {
//   message: Message;
//   currentUserId: string;
//   otherUserFullName: string;
// }) {
//   const messageRef = useRef<HTMLDivElement | null>(null);

//   const hasReportedSeenRef = useRef(false);

//   const isMine = message.senderId === currentUserId;

//   useEffect(() => {
//     const element = messageRef.current;

//     if (!element) {
//       return;
//     }

//     if (isMine) {
//       return;
//     }

//     if (message.seenAt) {
//       return;
//     }

//     if (hasReportedSeenRef.current) {
//       return;
//     }

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (!entry.isIntersecting) {
//           return;
//         }

//         if (hasReportedSeenRef.current) {
//           return;
//         }

//         hasReportedSeenRef.current = true;

//         socket.emit("message-seen", {
//           messageId: message.id,
//         });

//         observer.disconnect();
//       },
//       {
//         threshold: 0.8,
//       }
//     );

//     observer.observe(element);

//     return () => {
//       observer.disconnect();
//     };
//   }, [message.id, message.seenAt, isMine]);

//   const time = new Date(message.createdAt).toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   });

//   return (
//     <div
//       className={cn(
//         "mt-2.5 flex animate-message-in items-end gap-2.5",
//         isMine ? "justify-end" : "justify-start"
//       )}
//       ref={messageRef}
//     >
//       {!isMine && (
//         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-semibold text-foreground text-xs">
//           {otherUserFullName.charAt(0)}
//         </div>
//       )}

//       <div
//         className={cn(
//           "relative rounded-2xl px-4 py-2.5 text-sm shadow-sm",
//           isMine && "pr-9",
//           isMine
//             ? "rounded-br-md bg-primary text-secondary-foreground"
//             : "rounded-bl-md bg-secondary text-secondary-foreground"
//         )}
//       >
//         <span className="wrap-break-words whitespace-pre-wrap">
//           {message.text}
//         </span>
//         {isMine && (
//           <span
//             className={cn(
//               "absolute right-2 bottom-1.5 flex items-center",
//               message.seenAt ? "text-accent" : "text-foreground"
//             )}
//           >
//             {message.seenAt ? (
//               <CheckCheck className="size-4" strokeWidth={2.5} />
//             ) : (
//               <Check className="size-4" strokeWidth={2.5} />
//             )}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }

import { Check, CheckCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Message } from "@/app/generated/prisma/client";
import { socket } from "@/lib/socket";
import { cn } from "@/lib/utils";

export default function MessageItem({
  message,
  currentUserId,
  otherUserFullName,
}: {
  message: Message;
  currentUserId: string;
  otherUserFullName: string;
}) {
  const messageRef = useRef<HTMLDivElement | null>(null);

  const hasReportedSeenRef = useRef(false);

  const isMine = message.senderId === currentUserId;

  useEffect(() => {
    const element = messageRef.current;

    if (!element) {
      return;
    }

    if (isMine) {
      return;
    }

    if (message.seenAt) {
      return;
    }

    if (hasReportedSeenRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        if (hasReportedSeenRef.current) {
          return;
        }

        hasReportedSeenRef.current = true;

        socket.emit("message-seen", {
          messageId: message.id,
        });

        observer.disconnect();
      },
      {
        threshold: 0.8,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [message.id, message.seenAt, isMine]);

  const time = new Date(message.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div
      className={cn(
        "mt-2.5 flex animate-message-in items-end gap-2.5",
        isMine ? "justify-end" : "justify-start"
      )}
      ref={messageRef}
    >
      {!isMine && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-semibold text-foreground text-xs">
          {otherUserFullName.charAt(0)}
        </div>
      )}

      <div className={cn("flex max-w-[70%] flex-col", isMine && "items-end")}>
        <div
          className={cn(
            "relative rounded-2xl px-4 py-2.5 text-sm shadow-sm",
            isMine && "pr-9",
            isMine
              ? "rounded-br-md bg-primary text-secondary-foreground"
              : "rounded-bl-md bg-secondary text-secondary-foreground"
          )}
        >
          <span className="wrap-break-words whitespace-pre-wrap">
            {message.text}
          </span>

          {isMine && (
            <span
              className={cn(
                "absolute right-2 bottom-1.5 flex items-center",
                message.seenAt ? "text-accent" : "text-foreground"
              )}
            >
              {message.seenAt ? (
                <CheckCheck className="size-4" strokeWidth={2.5} />
              ) : (
                <Check className="size-4" strokeWidth={2.5} />
              )}
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-1.5 px-1">
          <span className="text-muted-foreground text-xs">{time}</span>
        </div>
      </div>
    </div>
  );
}
