export function formatCurrency(value) {
  if (typeof value !== "number") value = Number(value) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
