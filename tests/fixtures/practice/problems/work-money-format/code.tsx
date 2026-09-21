export function formatMoney(value: number | null | undefined) {
  if (value === null || value === undefined) return "--";
  return `¥${(value / 100).toFixed(2)}`;
}
