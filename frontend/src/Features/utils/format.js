export function formatCurrency(value) {
  if (typeof value !== "number") value = Number(value) || 0;
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
  }).format(value);
}
