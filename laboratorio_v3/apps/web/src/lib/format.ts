export function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    notation: "compact",
    maximumFractionDigits: 1,
    style: "currency",
    currency: "ARS"
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-AR").format(value);
}

export function formatPercent(value: number): string {
  return `${value > 0 ? "+" : ""}${new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 1
  }).format(value)}%`;
}
