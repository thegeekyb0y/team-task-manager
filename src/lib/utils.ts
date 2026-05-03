export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function isOverdue(date: Date | string | null | undefined, status?: string) {
  if (!date || status === "DONE") {
    return false;
  }

  return new Date(date).getTime() < Date.now();
}
