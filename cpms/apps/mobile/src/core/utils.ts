export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style:    "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day:    "2-digit",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function generateCode(prefix: string): string {
  const ts = Date.now().toString(36).toUpperCase();
  return `${prefix}-${ts}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Status color helpers
export function getStatusBadge(status: string): string {
  const map: Record<string, string> = {
    ACTIVE:              "badge-success",
    INACTIVE:            "badge-muted",
    BLACKLISTED:         "badge-danger",
    PLANNING:            "badge-info",
    ON_HOLD:             "badge-amber",
    COMPLETED:           "badge-muted",
    DRAFT:               "badge-muted",
    SUBMITTED:           "badge-info",
    APPROVED:            "badge-success",
    REJECTED:            "badge-danger",
    ORDERED:             "badge-purple",
    SENT:                "badge-cyan",
    ACKNOWLEDGED:        "badge-info",
    PARTIALLY_RECEIVED:  "badge-amber",
    RECEIVED:            "badge-success",
    CANCELLED:           "badge-danger",
    CONFIRMED:           "badge-success",
    LOW:                 "badge-info",
    NORMAL:              "badge-muted",
    HIGH:                "badge-amber",
    URGENT:              "badge-danger",
  };
  return map[status] ?? "badge-muted";
}

export function getStatusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
