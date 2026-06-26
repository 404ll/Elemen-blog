export function formatMoney(value) {
  if (value === null || value === undefined || value === "") return "--";
  return `¥${(Number(value) / 100).toFixed(2)}`;
}
