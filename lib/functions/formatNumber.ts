export function formatNumber(value: number) {
  return new Intl.NumberFormat("cs-CZ").format(value);
}
