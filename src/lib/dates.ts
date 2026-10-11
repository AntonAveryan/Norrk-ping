export function formatDate(isoString: string, locale = 'en-SE'): string {
  const date = new Date(isoString);
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-SE', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateShort(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-SE', { day: 'numeric', month: 'short' });
}

export function relativeDate(isoString: string): string {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function formatEventDate(startIso: string, endIso?: string): string {
  const start = new Date(startIso);
  const dateStr = start.toLocaleDateString('en-SE', { weekday: 'short', day: 'numeric', month: 'short' });
  const startTime = formatTime(startIso);
  if (endIso) {
    const endTime = formatTime(endIso);
    return `${dateStr} · ${startTime}–${endTime}`;
  }
  return `${dateStr} · ${startTime}`;
}

export function isUpcoming(isoString: string): boolean {
  return new Date(isoString) > new Date();
}
