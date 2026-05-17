export function calcPriority(
  daysOpen: number,
  status: string,
  warrantyApprovedAt: string | null,
) {
  if (status === "Resolvido" || status === "Fechado") return "FINISHED";
  if (!warrantyApprovedAt) return "ERROR_DATE_NOT_FOUND";
  if (daysOpen >= 31) return "CRITICAL";
  if (daysOpen >= 21) return "HIGH_PRIORITY";
  if (daysOpen >= 11) return "MODERATE";
  if (daysOpen >= 1) return "LOW_PRIORITY";
  return "ON_TIME";
}