export function formatMoney(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (absValue >= 1_000_000_000) {
    return `${sign}$${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 }).format(absValue / 1_000_000_000)} MM`;
  }
  if (absValue >= 1_000_000) {
    return `${sign}$${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 }).format(absValue / 1_000_000)} M`;
  }
  return `${sign}$${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(absValue)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-AR").format(value);
}

export function formatPercent(value: number): string {
  return `${value > 0 ? "+" : ""}${new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 1
  }).format(value)}%`;
}
