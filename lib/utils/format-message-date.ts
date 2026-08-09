export function getMessageDateKey(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

export function formatMessageDate(date: Date | string) {
  const messageDate = new Date(date);
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const messageParts = formatter.formatToParts(messageDate);
  const nowParts = formatter.formatToParts(now);

  const getPart = (
    parts: Intl.DateTimeFormatPart[],
    type: "year" | "month" | "day"
  ) => Number(parts.find((part) => part.type === type)?.value);

  const messageYear = getPart(messageParts, "year");
  const messageMonth = getPart(messageParts, "month");
  const messageDay = getPart(messageParts, "day");

  const nowYear = getPart(nowParts, "year");
  const nowMonth = getPart(nowParts, "month");
  const nowDay = getPart(nowParts, "day");

  const messageDateOnly = Date.UTC(messageYear, messageMonth - 1, messageDay);

  const todayDateOnly = Date.UTC(nowYear, nowMonth - 1, nowDay);

  const diffInDays = Math.floor(
    (todayDateOnly - messageDateOnly) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) {
    return "Today";
  }

  if (diffInDays === 1) {
    return "Yesterday";
  }

  if (messageYear === nowYear) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Tehran",
      day: "numeric",
      month: "short",
    }).format(messageDate);
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(messageDate);
}
