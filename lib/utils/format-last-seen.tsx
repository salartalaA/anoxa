export function formatLastSeen(date: Date | string | number): string {
  const lastSeen = new Date(date);
  const now = new Date();

  if (Number.isNaN(lastSeen.getTime())) {
    return "";
  }

  const diffMs = now.getTime() - lastSeen.getTime();

  if (diffMs < 0) {
    return "just now";
  }

  const hours = diffMs / (1000 * 60 * 60);
  const days = Math.floor(hours / 24);

  if (hours < 48) {
    const time = lastSeen.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (hours >= 24) {
      return `yesterday at ${time}`;
    }

    return time;
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  if (days < 14) {
    return "a week ago";
  }

  if (days < 21) {
    return "2 weeks ago";
  }

  return "a long time ago";
}
