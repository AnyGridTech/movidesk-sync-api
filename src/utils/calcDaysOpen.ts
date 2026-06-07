export function calcDaysOpen(warrantyApprovedAt: string | null): number {
  if (!warrantyApprovedAt) return 0;
  const approved = new Date(warrantyApprovedAt);
  const today = new Date();
  const diff = today.getTime() - approved.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}